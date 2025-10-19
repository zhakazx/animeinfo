import { Metadata } from 'next';
import { Anime } from '@/lib/types/anime';

/**
 * Generate metadata for anime detail pages
 */
export function generateAnimeMetadata(anime: Anime): Metadata {
  const title = `${anime.title} - AnimeInfo`;
  const description = anime.synopsis 
    ? `${anime.synopsis.slice(0, 160)}...`
    : `Watch ${anime.title} and discover more anime on AnimeInfo. Get detailed information, ratings, and streaming links.`;

  const keywords = [
    anime.title,
    'anime',
    'watch anime',
    'anime streaming',
    'anime information',
    ...(anime.genres?.map(genre => genre.name) || []),
    ...(anime.studios?.map(studio => studio.name) || [])
  ];

  return {
    title,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title,
      description,
      type: 'video.tv_show',
      images: anime.images?.jpg?.large_image_url ? [
        {
          url: anime.images.jpg.large_image_url,
          width: 800,
          height: 600,
          alt: `${anime.title} poster`
        }
      ] : [],
      siteName: 'AnimeInfo'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: anime.images?.jpg?.large_image_url ? [anime.images.jpg.large_image_url] : []
    }
  };
}

/**
 * Generate metadata for search pages
 */
export function generateSearchMetadata(query?: string): Metadata {
  const title = query 
    ? `Search results for "${query}" - AnimeInfo`
    : 'Search Anime - AnimeInfo';
  
  const description = query
    ? `Find anime related to "${query}". Discover new anime series and movies with detailed information and streaming links.`
    : 'Search through thousands of anime series and movies. Find your next favorite anime with our comprehensive database.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'AnimeInfo'
    },
    twitter: {
      card: 'summary',
      title,
      description
    }
  };
}

/**
 * Generate structured data (JSON-LD) for anime
 */
export function generateAnimeStructuredData(anime: Anime) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: anime.title,
    alternateName: anime.title_english || anime.title_japanese,
    description: anime.synopsis,
    image: anime.images?.jpg?.large_image_url,
    genre: anime.genres?.map(genre => genre.name),
    datePublished: anime.aired?.from,
    numberOfEpisodes: anime.episodes,
    aggregateRating: anime.score ? {
      '@type': 'AggregateRating',
      ratingValue: anime.score,
      ratingCount: anime.scored_by,
      bestRating: 10,
      worstRating: 1
    } : undefined,
    productionCompany: anime.studios?.map(studio => ({
      '@type': 'Organization',
      name: studio.name
    })),
    url: `https://myanimelist.net/anime/${anime.mal_id}`,
    sameAs: [
      `https://myanimelist.net/anime/${anime.mal_id}`,
      ...(anime.external?.map(link => link.url) || [])
    ]
  };
}

/**
 * Default metadata for the application
 */
export const defaultMetadata: Metadata = {
  title: 'AnimeInfo - Discover Your Next Favorite Anime',
  description: 'Explore thousands of anime series and movies. Get detailed information, ratings, reviews, and streaming links for your favorite anime.',
  keywords: 'anime, manga, watch anime, anime streaming, anime database, anime information, anime reviews, anime ratings',
  authors: [{ name: 'AnimeInfo Team' }],
  creator: 'AnimeInfo',
  publisher: 'AnimeInfo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://animeinfo.zhakazx.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://animeinfo.zhakazx.com',
    siteName: 'AnimeInfo',
    title: 'AnimeInfo - Discover Your Next Favorite Anime',
    description: 'Explore thousands of anime series and movies. Get detailed information, ratings, reviews, and streaming links for your favorite anime.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AnimeInfo - Anime Database'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnimeInfo - Discover Your Next Favorite Anime',
    description: 'Explore thousands of anime series and movies. Get detailed information, ratings, reviews, and streaming links for your favorite anime.',
    creator: '@animeinfo',
    images: ['/twitter-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  }
};