import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar, Tv } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JikanAnime } from '@/lib/types/anime';
import { formatScore, formatYear } from '@/lib/utils/format-date';

interface AnimeCardProps {
  anime: JikanAnime;
  priority?: boolean;
}

export function AnimeCard({ anime, priority = false }: AnimeCardProps) {
  const imageUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const title = anime.title_english || anime.title;
  const year = formatYear(anime.aired?.from);
  const score = formatScore(anime.score);

  return (
    <Link href={`/anime/${anime.mal_id}`} className="group block">
      <Card className="overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg border-0 bg-card/50 backdrop-blur">
        <div className="relative aspect-[2/3] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${title} cover image`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Tv className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Score Badge */}
          {anime.score && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-black/70 text-white border-0">
                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                {score}
              </Badge>
            </div>
          )}

          {/* Status Badge */}
          {anime.airing && (
            <div className="absolute top-2 left-2">
              <Badge variant="destructive" className="bg-red-500/90 text-white border-0">
                Airing
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-2 sm:p-3">
          <div className="space-y-1.5 sm:space-y-2">
            {/* Title */}
            <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight">
              {title}
            </h3>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{year}</span>
              </div>
              
              {anime.type && (
                <Badge variant="outline" className="text-xs px-1 py-0 flex-shrink-0">
                  {anime.type}
                </Badge>
              )}
            </div>

            {/* Episodes */}
            {anime.episodes && (
              <div className="text-xs text-muted-foreground truncate">
                {anime.episodes} episodes
              </div>
            )}

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 overflow-hidden">
                {anime.genres.slice(0, 1).map((genre) => (
                  <Badge
                    key={genre.mal_id}
                    variant="secondary"
                    className="text-xs px-1 py-0 truncate max-w-full"
                  >
                    {genre.name}
                  </Badge>
                ))}
                {anime.genres.length > 1 && (
                  <Badge variant="secondary" className="text-xs px-1 py-0 flex-shrink-0">
                    +{anime.genres.length - 1}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}