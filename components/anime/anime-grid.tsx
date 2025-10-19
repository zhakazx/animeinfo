import { JikanAnime } from '@/lib/types/anime';
import { AnimeCard } from './anime-card';
import { AnimeCardSkeleton } from './anime-card-skeleton';

interface AnimeGridProps {
  anime: JikanAnime[];
  isLoading?: boolean;
  priority?: boolean;
  className?: string;
  emptyMessage?: string;
}

export function AnimeGrid({ anime, isLoading = false, priority = false, className = '', emptyMessage }: AnimeGridProps) {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 ${className}`}>
        {Array.from({ length: 12 }).map((_, index) => (
          <AnimeCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!anime || anime.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold mb-2">{emptyMessage || 'No anime found'}</h3>
        <p className="text-muted-foreground">Try adjusting your search criteria or browse our recommendations.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 ${className}`}>
      {anime.map((item, index) => (
        <AnimeCard
          key={item.mal_id}
          anime={item}
          priority={priority && index < 6} // Prioritize first 6 items for LCP
        />
      ))}
    </div>
  );
}