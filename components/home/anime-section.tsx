import { JikanAnime } from '@/lib/types/anime';
import { AnimeGrid } from '@/components/anime/anime-grid';
import { SectionHeader } from '@/components/shared/section-header';
import { SectionSkeleton } from '@/components/shared/loading-skeleton';

interface AnimeSectionProps {
  title: string;
  description?: string;
  anime: JikanAnime[];
  isLoading?: boolean;
  href?: string;
  linkText?: string;
  priority?: boolean;
  className?: string;
}

export function AnimeSection({
  title,
  description,
  anime,
  isLoading = false,
  href,
  linkText,
  priority = false,
  className = ''
}: AnimeSectionProps) {
  if (isLoading) {
    return (
      <section className={`space-y-6 ${className}`}>
        <SectionSkeleton />
      </section>
    );
  }

  return (
    <section className={`space-y-6 ${className}`}>
      <SectionHeader
        title={title}
        description={description}
        href={href}
        linkText={linkText}
      />
      
      <AnimeGrid
        anime={anime}
        isLoading={isLoading}
        priority={priority}
      />
    </section>
  );
}