export const JIKAN_BASE_URL = process.env.NEXT_PUBLIC_JIKAN_API_URL || '';
export const YOUTUBE_BASE_URL = process.env.NEXT_PUBLIC_YOUTUBE_API_URL || '';

// Rate limiting for Jikan API: 3 requests/second, 60 requests/minute
export const JIKAN_RATE_LIMIT = {
  REQUESTS_PER_SECOND: 3,
  REQUESTS_PER_MINUTE: 60,
};

// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  STATIC_CONTENT: 24 * 60 * 60, // 24 hours
  DYNAMIC_SEARCHES: 5 * 60, // 5 minutes
  TRENDING_POPULAR: 60 * 60, // 1 hour
  ANIME_DETAILS: 60 * 60, // 1 hour
};

// Anime types
export const ANIME_TYPES = [
  { value: 'tv', label: 'TV' },
  { value: 'movie', label: 'Movie' },
  { value: 'ova', label: 'OVA' },
  { value: 'special', label: 'Special' },
  { value: 'ona', label: 'ONA' },
  { value: 'music', label: 'Music' },
];

// Anime status
export const ANIME_STATUS = [
  { value: 'airing', label: 'Currently Airing' },
  { value: 'complete', label: 'Finished Airing' },
  { value: 'upcoming', label: 'Not Yet Aired' },
];

// Seasons
export const SEASONS = [
  { value: 'winter', label: 'Winter' },
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'fall', label: 'Fall' },
];

// Ratings
export const RATINGS = [
  { value: 'g', label: 'G - All Ages' },
  { value: 'pg', label: 'PG - Children' },
  { value: 'pg13', label: 'PG-13 - Teens 13 or older' },
  { value: 'r17', label: 'R - 17+ (violence & profanity)' },
  { value: 'r', label: 'R+ - Mild Nudity' },
  { value: 'rx', label: 'Rx - Hentai' },
];

// Order by options
export const ORDER_BY_OPTIONS = [
  { value: 'title', label: 'Title' },
  { value: 'start_date', label: 'Start Date' },
  { value: 'end_date', label: 'End Date' },
  { value: 'episodes', label: 'Episodes' },
  { value: 'score', label: 'Score' },
  { value: 'scored_by', label: 'Scored By' },
  { value: 'rank', label: 'Rank' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'members', label: 'Members' },
  { value: 'favorites', label: 'Favorites' },
];

// Streaming platforms
export const STREAMING_PLATFORMS = [
  { name: 'Crunchyroll', searchUrl: 'https://www.crunchyroll.com/search?q={query}' },
  { name: 'Muse Indonesia', searchUrl: 'https://www.youtube.com/@MuseIndonesia/search?query={query}' },
  { name: 'Bilibili', searchUrl: 'https://search.bilibili.com/all?keyword={query}' },
  { name: 'Funimation', searchUrl: 'https://www.funimation.com/search/?q={query}' },
  { name: 'Netflix', searchUrl: 'https://www.netflix.com/search?q={query}' },
  { name: 'Hulu', searchUrl: 'https://www.hulu.com/search?q={query}' },
  { name: 'Amazon Prime Video', searchUrl: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase={query}' },
];

// Default pagination
export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 25; // Jikan API limit

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  ITEMS_PER_PAGE: 25,
  MAX_ITEMS_PER_PAGE: 25,
} as const;

// Image sizes
export const IMAGE_SIZES = {
  CARD: { width: 300, height: 450 },
  BANNER: { width: 1920, height: 600 },
  THUMBNAIL: { width: 150, height: 225 },
};

// Current year for filters (static to prevent hydration mismatch)
export const CURRENT_YEAR = 2025;
export const MIN_YEAR = 1960;

// Popular genres (for quick filters)
export const POPULAR_GENRES = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 4, name: 'Comedy' },
  { id: 8, name: 'Drama' },
  { id: 10, name: 'Fantasy' },
  { id: 14, name: 'Horror' },
  { id: 22, name: 'Romance' },
  { id: 24, name: 'Sci-Fi' },
  { id: 36, name: 'Slice of Life' },
  { id: 37, name: 'Supernatural' },
];