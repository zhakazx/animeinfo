import { YouTubeResponse } from '@/lib/types/anime';
import { YOUTUBE_BASE_URL } from '@/lib/constants';

class YouTubeAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'YouTubeAPIError';
  }
}

async function fetchYouTube<T>(endpoint: string): Promise<T> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    throw new YouTubeAPIError('YouTube API key not configured');
  }

  try {
    const url = `${YOUTUBE_BASE_URL}${endpoint}&key=${apiKey}`;
    const response = await fetch(url, {
      next: { revalidate: 24 * 60 * 60 }, // Cache for 24 hours
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new YouTubeAPIError('YouTube API quota exceeded or invalid key', response.status);
      }
      if (response.status === 404) {
        throw new YouTubeAPIError('Video not found', response.status);
      }
      throw new YouTubeAPIError(`YouTube API error: ${response.status} ${response.statusText}`, response.status);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof YouTubeAPIError) {
      throw error;
    }
    throw new YouTubeAPIError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getVideoDetails(videoId: string): Promise<YouTubeResponse> {
  if (!videoId) {
    throw new YouTubeAPIError('Video ID is required');
  }

  const endpoint = `/videos?id=${videoId}&part=snippet,contentDetails`;
  return fetchYouTube<YouTubeResponse>(endpoint);
}

export async function searchVideos(query: string, maxResults = 5): Promise<YouTubeResponse> {
  if (!query) {
    throw new YouTubeAPIError('Search query is required');
  }

  const endpoint = `/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
  return fetchYouTube<YouTubeResponse>(endpoint);
}

// Utility function to get YouTube embed URL
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;
}

// Utility function to get YouTube thumbnail URL
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'high'): string {
  return `https://img.youtube.com/vi/${videoId}/${quality === 'default' ? 'default' : quality === 'medium' ? 'mqdefault' : quality === 'high' ? 'hqdefault' : quality === 'standard' ? 'sddefault' : 'maxresdefault'}.jpg`;
}

// Utility function to parse YouTube duration (PT4M13S format)
export function parseYouTubeDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Utility function to validate YouTube video ID
export function isValidYouTubeVideoId(videoId: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
}