'use client';

import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { AnimeHero } from '@/components/anime/anime-hero';
import { AnimeInfo } from '@/components/anime/anime-info';
import { AnimeTrailer } from '@/components/anime/anime-trailer';
import { AnimeCharacters } from '@/components/anime/anime-characters';
import { AnimeRecommendations } from '@/components/anime/anime-recommendations';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { 
  getAnimeById, 
  getAnimeCharacters, 
  getEnhancedAnimeRecommendations 
} from '@/lib/api/jikan';
import { Anime } from '@/lib/types/anime';

interface AnimePageClientProps {
  animeId: number;
  initialAnime?: Anime | null;
}

export default function AnimePageClient({ animeId, initialAnime }: AnimePageClientProps) {
  // Fetch anime details
  const { data: anime, isLoading: animeLoading, error: animeError } = useQuery({
    queryKey: ['anime', animeId],
    queryFn: () => getAnimeById(animeId),
    initialData: initialAnime,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // Fetch anime characters
  const { data: characters, isLoading: charactersLoading } = useQuery({
    queryKey: ['anime-characters', animeId],
    queryFn: () => getAnimeCharacters(animeId),
    enabled: !!anime,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // Fetch recommendations
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['anime-recommendations', animeId],
    queryFn: () => getEnhancedAnimeRecommendations(animeId),
    enabled: !!anime,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  if (animeError) {
    notFound();
  }

  if (animeLoading) {
    return (
      <div className="min-h-screen">
        <div className="h-96 bg-muted animate-pulse" />
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton count={5} />
        </div>
      </div>
    );
  }

  if (!anime) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <AnimeHero anime={anime} />

      {/* Main Content */}
      <div className="container mx-auto px-3 xs:px-4 py-4 xs:py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
          {/* Sidebar - Mobile First */}
          <div className="lg:col-span-1 lg:order-2">
            <AnimeInfo anime={anime} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 lg:order-1 space-y-4 xs:space-y-6 sm:space-y-8">
            {/* Trailer */}
            {anime.trailer?.youtube_id && (
              <section id="trailer">
                <AnimeTrailer 
                  youtubeId={anime.trailer.youtube_id}
                  title={anime.title_english || anime.title}
                />
              </section>
            )}

            {/* Characters */}
            <section>
              <AnimeCharacters 
                characters={characters || []}
                isLoading={charactersLoading}
              />
            </section>

            {/* Recommendations */}
            <section>
              <AnimeRecommendations 
                recommendations={recommendations || []}
                isLoading={recommendationsLoading}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}