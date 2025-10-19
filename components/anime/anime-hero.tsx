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
    <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
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
        <div className="container mx-auto px-4 pb-12">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            {/* Poster Image */}
            <div className="flex-shrink-0">
              {imageUrl && (
                <div className="relative w-48 h-72 rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={imageUrl}
                    alt={`${title} poster`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 192px, 192px"
                    priority
                  />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              {/* Status and Type */}
              <div className="flex items-center gap-2 flex-wrap">
                {anime.airing && (
                  <Badge variant="destructive" className="bg-red-500/90">
                    Currently Airing
                  </Badge>
                )}
                {anime.type && (
                  <Badge variant="secondary">
                    {anime.type}
                  </Badge>
                )}
                {anime.status && (
                  <Badge variant="outline">
                    {anime.status}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {title}
                </h1>
                {anime.title !== title && (
                  <p className="text-xl text-muted-foreground">
                    {anime.title}
                  </p>
                )}
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-6 text-sm flex-wrap">
                {anime.score && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{score}</span>
                    <span className="text-muted-foreground">
                      ({formatNumber(anime.scored_by || undefined)} users)
                    </span>
                  </div>
                )}
                
                {year && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{year}</span>
                  </div>
                )}
                
                {anime.episodes && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Tv className="h-4 w-4" />
                    <span>{anime.episodes} episodes</span>
                  </div>
                )}
                
                {duration && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{duration}</span>
                  </div>
                )}
              </div>

              {/* Synopsis */}
              {anime.synopsis && (
                <p className="text-lg text-muted-foreground line-clamp-3 max-w-3xl">
                  {anime.synopsis}
                </p>
              )}

              {/* Genres */}
              {anime.genres && anime.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <Badge key={genre.mal_id} variant="outline" className="bg-background/50">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {anime.trailer?.youtube_id && (
                  <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                    <Link href="#trailer">
                      <Play className="mr-2 h-5 w-5" />
                      Watch Trailer
                    </Link>
                  </Button>
                )}
                
                {anime.url && (
                  <Button size="lg" variant="outline" asChild className="bg-background/50 hover:bg-background/70">
                    <a href={anime.url} target="_blank" rel="noopener noreferrer">
                      View on MyAnimeList
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