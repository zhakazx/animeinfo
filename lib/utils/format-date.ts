/**
 * Utility functions for formatting dates, times, and numbers
 * Used throughout the anime application for consistent display
 */

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString?: string | null): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

/**
 * Format a date to show only the year
 */
export function formatYear(dateString?: string | null): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  } catch {
    return '';
  }
}

/**
 * Format anime score with proper decimal places
 */
export function formatScore(score?: number | null): string {
  if (!score) return '';
  return score.toFixed(2);
}

/**
 * Format duration string (e.g., "24 min per ep" -> "24 min")
 */
export function formatDuration(duration?: string | null): string {
  if (!duration) return '';
  
  // Extract just the time part from strings like "24 min per ep"
  const match = duration.match(/(\d+)\s*(min|hr|hour|sec)/i);
  if (match) {
    const [, number, unit] = match;
    return `${number} ${unit.toLowerCase()}`;
  }
  
  return duration;
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num?: number): string {
  if (!num) return '';
  return num.toLocaleString();
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString?: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  } catch {
    return dateString;
  }
}

/**
 * Format season and year combination
 */
export function formatSeason(season?: string, year?: number): string {
  if (!season || !year) return '';
  return `${season.charAt(0).toUpperCase() + season.slice(1)} ${year}`;
}

/**
 * Format anime status for display
 */
export function formatStatus(status?: string): string {
  if (!status) return '';
  
  const statusMap: Record<string, string> = {
    'currently_airing': 'Currently Airing',
    'finished_airing': 'Finished Airing',
    'not_yet_aired': 'Not Yet Aired'
  };
  
  return statusMap[status] || status;
}

/**
 * Format anime type for display
 */
export function formatType(type?: string): string {
  if (!type) return '';
  
  const typeMap: Record<string, string> = {
    'tv': 'TV',
    'ova': 'OVA',
    'movie': 'Movie',
    'special': 'Special',
    'ona': 'ONA',
    'music': 'Music'
  };
  
  return typeMap[type.toLowerCase()] || type;
}