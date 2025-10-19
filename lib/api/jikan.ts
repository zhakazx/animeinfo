import {
  JikanAnimeResponse,
  JikanSingleAnimeResponse,
  JikanCharactersResponse,
  JikanStaffResponse,
  AnimeSearchParams,
  JikanRecommendationsResponse,
  JikanAnime,
  JikanCharacter,
  RecommendationEntry
} from '@/lib/types/anime';
import { JIKAN_BASE_URL, CACHE_DURATIONS } from '@/lib/constants';

class JikanAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'JikanAPIError';
  }
}

// Request queue for rate limiting
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private lastRequestTime = 0;
  private readonly minInterval = 334; // ~3 requests per second

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      if (timeSinceLastRequest < this.minInterval) {
        await new Promise(resolve => setTimeout(resolve, this.minInterval - timeSinceLastRequest));
      }
      
      const request = this.queue.shift();
      if (request) {
        this.lastRequestTime = Date.now();
        await request();
      }
    }
    
    this.processing = false;
  }
}

const requestQueue = new RequestQueue();

async function fetchJikan<T>(endpoint: string, revalidate?: number): Promise<T> {
  return requestQueue.add(async () => {
    try {
      const response = await fetch(`${JIKAN_BASE_URL}${endpoint}`, {
        next: { revalidate: revalidate || CACHE_DURATIONS.STATIC_CONTENT },
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AnimeInfo-App/1.0',
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited, wait and retry
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchJikan<T>(endpoint, revalidate);
        }
        throw new JikanAPIError(`Jikan API error: ${response.status} ${response.statusText}`, response.status);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof JikanAPIError) {
        throw error;
      }
      throw new JikanAPIError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
}

export async function searchAnime(params: AnimeSearchParams): Promise<JikanAnimeResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.q) searchParams.append('q', params.q);
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', Math.min(params.limit, 25).toString());
  if (params.genres && params.genres.length > 0) searchParams.append('genres', params.genres.join(','));
  if (params.year) searchParams.append('start_date', `${params.year}-01-01`);
  if (params.season) searchParams.append('season', params.season);
  if (params.type) searchParams.append('type', params.type);
  if (params.status) searchParams.append('status', params.status);
  if (params.rating) searchParams.append('rating', params.rating);
  if (params.order_by) searchParams.append('order_by', params.order_by);
  if (params.sort) searchParams.append('sort', params.sort);

  const endpoint = `/anime?${searchParams.toString()}`;
  return fetchJikan<JikanAnimeResponse>(endpoint, CACHE_DURATIONS.DYNAMIC_SEARCHES);
}

export async function getAnimeById(id: number): Promise<JikanAnime> {
  const response = await fetchJikan<JikanSingleAnimeResponse>(`/anime/${id}`, CACHE_DURATIONS.ANIME_DETAILS);
  return response.data;
}

export async function getAnimeCharacters(id: number): Promise<JikanCharacter[]> {
  const response = await fetchJikan<JikanCharactersResponse>(`/anime/${id}/characters`, CACHE_DURATIONS.ANIME_DETAILS);
  return response.data;
}

export async function getAnimeStaff(id: number): Promise<JikanStaffResponse> {
  return fetchJikan<JikanStaffResponse>(`/anime/${id}/staff`, CACHE_DURATIONS.ANIME_DETAILS);
}

export async function getTopAnime(params: { page?: number; limit?: number } = {}): Promise<JikanAnimeResponse> {
  const { page = 1, limit = 25 } = params;
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: Math.min(limit, 25).toString(),
  });
  
  return fetchJikan<JikanAnimeResponse>(`/top/anime?${searchParams.toString()}`, CACHE_DURATIONS.STATIC_CONTENT);
}

export async function getCurrentSeasonAnime(params: { page?: number; limit?: number } = {}): Promise<JikanAnimeResponse> {
  const { page = 1, limit = 25 } = params;
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: Math.min(limit, 25).toString(),
  });
  
  return fetchJikan<JikanAnimeResponse>(`/seasons/now?${searchParams.toString()}`, CACHE_DURATIONS.TRENDING_POPULAR);
}

export async function getPopularAnime(params: { page?: number; limit?: number } = {}): Promise<JikanAnimeResponse> {
  const { page = 1, limit = 25 } = params;
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: Math.min(limit, 25).toString(),
    order_by: 'popularity',
    sort: 'asc',
  });
  
  return fetchJikan<JikanAnimeResponse>(`/anime?${searchParams.toString()}`, CACHE_DURATIONS.TRENDING_POPULAR);
}

export async function getAnimeRecommendations(id: number): Promise<RecommendationEntry[]> {
  try {
    const response = await fetchJikan<JikanRecommendationsResponse>(`/anime/${id}/recommendations`, CACHE_DURATIONS.ANIME_DETAILS);
    
    // Transform recommendations to match anime format
    const animeData = response.data.slice(0, 12).map(rec => rec.entry);
    
    return animeData;
  } catch (error) {
    // If recommendations fail, return empty result
    return [];
  }
}

export async function getGenres(): Promise<{ data: Array<{ mal_id: number; name: string; count: number }> }> {
  return fetchJikan<{ data: Array<{ mal_id: number; name: string; count: number }> }>('/genres/anime', CACHE_DURATIONS.STATIC_CONTENT);
}

// Utility function to extract YouTube video ID from trailer URL
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Utility function to get streaming platform URLs
export function getStreamingUrl(animeName: string, platform: string): string {
  const encodedName = encodeURIComponent(animeName);
  
  switch (platform.toLowerCase()) {
    case 'crunchyroll':
      return `https://www.crunchyroll.com/search?q=${encodedName}`;
    case 'muse indonesia':
      return `https://www.youtube.com/c/MuseIndonesiaOfficial/search?query=${encodedName}`;
    case 'bilibili':
      return `https://www.bilibili.tv/en/search?keyword=${encodedName}`;
    case 'funimation':
      return `https://www.funimation.com/search/?q=${encodedName}`;
    case 'netflix':
      return `https://www.netflix.com/search?q=${encodedName}`;
    case 'hulu':
      return `https://www.hulu.com/search?q=${encodedName}`;
    case 'amazon prime video':
      return `https://www.amazon.com/s?k=${encodedName}&i=prime-instant-video`;
    default:
      return `https://www.google.com/search?q=${encodedName}+anime+watch+online`;
  }
}