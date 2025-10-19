'use client';

import { useQuery } from '@tanstack/react-query';
import { HeroSection } from '@/components/home/hero-section';
import { AnimeSection } from '@/components/home/anime-section';
import { 
  getTopAnime, 
  getCurrentSeasonAnime, 
  getPopularAnime 
} from '@/lib/api/jikan';

export default function Home() {
  // Fetch featured anime for hero section (top 5 anime)
  const { data: featuredAnime, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-anime'],
    queryFn: () => getTopAnime({ limit: 5 }),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // Fetch trending anime (current season)
  const { data: trendingAnime, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending-anime'],
    queryFn: () => getCurrentSeasonAnime({ limit: 12 }),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // Fetch popular anime
  const { data: popularAnime, isLoading: popularLoading } = useQuery({
    queryKey: ['popular-anime'],
    queryFn: () => getPopularAnime({ limit: 12 }),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // Fetch top anime
  const { data: topAnime, isLoading: topLoading } = useQuery({
    queryKey: ['top-anime'],
    queryFn: () => getTopAnime({ limit: 12 }),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection 
        featuredAnime={featuredAnime?.data} 
        isLoading={featuredLoading} 
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Trending This Season */}
        <AnimeSection
          title="Trending This Season"
          description="The most popular anime currently airing"
          anime={trendingAnime?.data || []}
          isLoading={trendingLoading}
          href="/search?filter=current_season"
          linkText="View all trending"
          priority={true}
        />

        {/* Popular Anime */}
        <AnimeSection
          title="Popular Anime"
          description="Fan favorites and highly rated series"
          anime={popularAnime?.data || []}
          isLoading={popularLoading}
          href="/search?filter=popular"
          linkText="View all popular"
        />

        {/* Top Rated */}
        <AnimeSection
          title="Top Rated"
          description="The highest rated anime of all time"
          anime={topAnime?.data || []}
          isLoading={topLoading}
          href="/search?filter=top"
          linkText="View all top rated"
        />
      </main>
    </div>
  );
}
