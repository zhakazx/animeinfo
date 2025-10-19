import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, Calendar, Clock, Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JikanAnime } from '@/lib/types/anime';
import { formatScore, formatYear, formatDuration, formatNumber } from '@/lib/utils/format-date';

interface AnimeHeroProps {
  anime: JikanAnime;
}

export function AnimeHero({ anime }: AnimeHeroProps) {
  const imageUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const title = anime.title_english || anime.title;
  const year = formatYear(anime.aired?.from);
  const score = formatScore(anime.score);
  const duration = formatDuration(anime.duration);

  return (
    <section className="relative h-[50vh] xs:h-[55vh] sm:h-[60vh] min-h-[400px] xs:min-h-[450px] sm:min-h-[500px] w-full overflow-hidden">
      {/* Background Image */}
      {imageUrl && (
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={`${title} background`}
            fill
            className="object-cover object-center scale-110 blur-sm"
            priority
            sizes="100vw"
          />
        </div>
      )}
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-end">
        <div className="container mx-auto px-3 xs:px-4 pb-6 xs:pb-8 sm:pb-12">
          <div className="flex flex-col md:flex-row gap-4 xs:gap-6 sm:gap-8 items-end">
            {/* Poster Image */}
            <div className="flex-shrink-0 self-center md:self-end">
              {imageUrl && (
                <div className="relative w-32 h-48 xs:w-40 xs:h-60 sm:w-48 sm:h-72 rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={imageUrl}
                    alt={`${title} poster`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 475px) 128px, (max-width: 640px) 160px, 192px"
                    priority
                  />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3 xs:space-y-4 text-center md:text-left">
              {/* Status and Type */}
              <div className="flex items-center justify-center md:justify-start gap-1.5 xs:gap-2 flex-wrap">
                {anime.airing && (
                  <Badge variant="destructive" className="bg-red-500/90 text-xs xs:text-sm">
                    Currently Airing
                  </Badge>
                )}
                {anime.type && (
                  <Badge variant="secondary" className="text-xs xs:text-sm">
                    {anime.type}
                  </Badge>
                )}
                {anime.status && (
                  <Badge variant="outline" className="text-xs xs:text-sm">
                    {anime.status}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <div className="space-y-1 xs:space-y-2">
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                  {title}
                </h1>
                {anime.title !== title && (
                  <p className="text-base xs:text-lg sm:text-xl text-muted-foreground">
                    {anime.title}
                  </p>
                )}
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-center md:justify-start gap-3 xs:gap-4 sm:gap-6 text-xs xs:text-sm flex-wrap">
                {anime.score && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 xs:h-4 xs:w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{score}</span>
                    <span className="text-muted-foreground hidden xs:inline">
                      ({formatNumber(anime.scored_by || undefined)} users)
                    </span>
                  </div>
                )}
                
                {year && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3 xs:h-4 xs:w-4" />
                    <span>{year}</span>
                  </div>
                )}
                
                {anime.episodes && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Tv className="h-3 w-3 xs:h-4 xs:w-4" />
                    <span className="hidden xs:inline">{anime.episodes} episodes</span>
                    <span className="xs:hidden">{anime.episodes} ep</span>
                  </div>
                )}
                
                {duration && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3 xs:h-4 xs:w-4" />
                    <span>{duration}</span>
                  </div>
                )}
              </div>

              {/* Synopsis */}
              {anime.synopsis && (
                <p className="text-sm xs:text-base sm:text-lg text-muted-foreground line-clamp-2 xs:line-clamp-3 max-w-3xl">
                  {anime.synopsis}
                </p>
              )}

              {/* Genres */}
              {anime.genres && anime.genres.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-1.5 xs:gap-2">
                  {anime.genres.slice(0, 4).map((genre) => (
                    <Badge key={genre.mal_id} variant="outline" className="bg-background/50 text-xs xs:text-sm">
                      {genre.name}
                    </Badge>
                  ))}
                  {anime.genres.length > 4 && (
                    <Badge variant="outline" className="bg-background/50 text-xs xs:text-sm">
                      +{anime.genres.length - 4}
                    </Badge>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 pt-2 xs:pt-4">
                {anime.trailer?.youtube_id && (
                  <Button size="sm" asChild className="bg-primary hover:bg-primary/90 xs:size-default">
                    <Link href="#trailer">
                      <Play className="mr-1.5 xs:mr-2 h-4 w-4 xs:h-5 xs:w-5" />
                      <span className="text-sm xs:text-base">Watch Trailer</span>
                    </Link>
                  </Button>
                )}
                
                {anime.url && (
                  <Button size="sm" variant="outline" asChild className="bg-background/50 hover:bg-background/70 xs:size-default">
                    <a href={anime.url} target="_blank" rel="noopener noreferrer">
                      <span className="text-sm xs:text-base">View on MyAnimeList</span>
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}