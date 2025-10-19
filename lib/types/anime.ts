export interface JikanAnime {
  mal_id: number;
  url: string;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  synopsis: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired: {
    from: string | null;
    to: string | null;
  };
  season: string | null;
  year: number | null;
  genres: Array<{ mal_id: number; name: string; type: string; url: string }>;
  studios: Array<{ mal_id: number; name: string; type: string; url: string }>;
  producers: Array<{ mal_id: number; name: string; type: string; url: string }>;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
  };
  streaming: Array<{
    name: string;
    url: string;
  }>;
  type: string;
  source: string;
  duration: string | null;
  rating: string | null;
  broadcast: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  } | null;
  external?: Array<{
    name: string;
    url: string;
  }>;
}

export interface JikanAnimeResponse {
  data: JikanAnime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface JikanSingleAnimeResponse {
  data: JikanAnime;
}

export interface JikanCharacter {
  character: {
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
      };
      webp: {
        image_url: string;
      };
    };
    name: string;
  };
  role: string;
  voice_actors: Array<{
    person: {
      mal_id: number;
      url: string;
      images: {
        jpg: {
          image_url: string;
        };
      };
      name: string;
    };
    language: string;
  }>;
}

export interface JikanCharactersResponse {
  data: JikanCharacter[];
}

export interface JikanStaff {
  person: {
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
    name: string;
  };
  positions: string[];
}

export interface JikanStaffResponse {
  data: JikanStaff[];
}

export interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
      standard?: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
    channelTitle: string;
    publishedAt: string;
  };
  contentDetails: {
    duration: string;
  };
}

export interface YouTubeResponse {
  items: YouTubeVideo[];
}

export interface SearchFilters {
  genres?: number[];
  year?: number;
  season?: string;
  type?: string;
  status?: string;
  rating?: string;
  order_by?: string;
  sort?: 'asc' | 'desc';
  min_score?: number;
  max_score?: number;
  start_date?: string;
  end_date?: string;
}

export interface AnimeSearchParams extends SearchFilters {
  q?: string;
  page?: number;
  limit?: number;
}

// Export Anime as an alias for JikanAnime for compatibility
export type Anime = JikanAnime;

// Export JikanRecommendation interface
export interface JikanRecommendation {
  entry: {
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
      webp: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
    };
    title: string;
  };
  url: string;
  votes: number;
}

export interface JikanRecommendationsResponse {
  data: JikanRecommendation[];
}

export type RecommendationEntry = JikanRecommendation['entry'];

// Constants for pagination and filters
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 25,
  MAX_LIMIT: 25,
} as const;

export const ANIME_STATUSES = [
  'airing',
  'complete',
  'upcoming',
] as const;

export const ANIME_RATINGS = [
  'g',
  'pg',
  'pg13',
  'r17',
  'r',
  'rx',
] as const;

export const ANIME_TYPES = [
  'tv',
  'movie',
  'ova',
  'special',
  'ona',
  'music',
] as const;

export const ANIME_SEASONS = [
  'winter',
  'spring',
  'summer',
  'fall',
] as const;

export const ANIME_ORDER_BY = [
  'mal_id',
  'title',
  'type',
  'rating',
  'start_date',
  'end_date',
  'episodes',
  'score',
  'scored_by',
  'rank',
  'popularity',
  'members',
  'favorites',
] as const;