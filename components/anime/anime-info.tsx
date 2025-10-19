import Link from 'next/link';
import { ExternalLink, Calendar, Clock, Star, Users, Tv, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { JikanAnime } from '@/lib/types/anime';
import { formatScore, formatDate, formatDuration, formatNumber } from '@/lib/utils/format-date';
import { STREAMING_PLATFORMS } from '@/lib/constants';

interface AnimeInfoProps {
  anime: JikanAnime;
}

export function AnimeInfo({ anime }: AnimeInfoProps) {
  const score = formatScore(anime.score);
  const duration = formatDuration(anime.duration);
  const startDate = formatDate(anime.aired?.from);
  const endDate = formatDate(anime.aired?.to);

  return (
    <div className="space-y-6">
      {/* Main Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tv className="h-5 w-5" />
            Anime Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Score */}
          {anime.score && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Score</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{score}</span>
                <span className="text-xs text-muted-foreground">
                  ({formatNumber(anime.scored_by || undefined)})
                </span>
              </div>
            </div>
          )}

          {/* Rank */}
          {anime.rank && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Rank</span>
              <span className="font-medium">#{anime.rank}</span>
            </div>
          )}

          {/* Popularity */}
          {anime.popularity && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Popularity</span>
              <span className="font-medium">#{anime.popularity}</span>
            </div>
          )}

          <Separator />

          {/* Type */}
          {anime.type && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Type</span>
              <Badge variant="secondary">{anime.type}</Badge>
            </div>
          )}

          {/* Status */}
          {anime.status && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <Badge variant={anime.airing ? "destructive" : "outline"}>
                {anime.status}
              </Badge>
            </div>
          )}

          {/* Episodes */}
          {anime.episodes && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Episodes</span>
              <span className="font-medium">{anime.episodes}</span>
            </div>
          )}

          {/* Duration */}
          {duration && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Duration</span>
              <span className="font-medium">{duration}</span>
            </div>
          )}

          <Separator />

          {/* Aired */}
          {startDate && (
            <div className="space-y-2">
              <span className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Aired
              </span>
              <div className="text-sm">
                {startDate}
                {endDate && endDate !== startDate && (
                  <span> to {endDate}</span>
                )}
                {anime.airing && !endDate && (
                  <span> to ?</span>
                )}
              </div>
            </div>
          )}

          {/* Season */}
          {anime.season && anime.year && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Season</span>
              <span className="font-medium capitalize">
                {anime.season} {anime.year}
              </span>
            </div>
          )}

          {/* Source */}
          {anime.source && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Source</span>
              <span className="font-medium">{anime.source}</span>
            </div>
          )}

          {/* Rating */}
          {anime.rating && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Rating</span>
              <Badge variant="outline">{anime.rating}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Studios */}
      {anime.studios && anime.studios.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Studios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {anime.studios.map((studio) => (
                <Badge key={studio.mal_id} variant="outline">
                  {studio.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Streaming Platforms */}
      <Card>
        <CardHeader>
          <CardTitle>Watch Now</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {STREAMING_PLATFORMS.map((platform) => (
            <Button
              key={platform.name}
              variant="outline"
              className="w-full justify-start"
              asChild
            >
              <a
                href={platform.searchUrl.replace('{query}', encodeURIComponent(anime.title))}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Search on {platform.name}
              </a>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* External Links */}
      <Card>
        <CardHeader>
          <CardTitle>External Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {anime.url && (
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href={anime.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                MyAnimeList
              </a>
            </Button>
          )}
          
          {anime.trailer?.youtube_id && (
            <Button variant="outline" className="w-full justify-start" asChild>
              <a
                href={`https://www.youtube.com/watch?v=${anime.trailer.youtube_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                YouTube Trailer
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}