import { Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimeGrid } from './anime-grid';
import { SectionSkeleton } from '@/components/shared/loading-skeleton';
import { RecommendationEntry } from '@/lib/types/anime';

interface AnimeRecommendationsProps {
  recommendations: RecommendationEntry[];
  isLoading?: boolean;
}

export function AnimeRecommendations({ recommendations, isLoading = false }: AnimeRecommendationsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SectionSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  // Limit recommendations to 6 and convert to AnimeGrid format
  const recommendedAnime = recommendations.slice(0, 6).map(rec => ({
    mal_id: rec.mal_id,
    url: rec.url,
    title: rec.title,
    title_english: null,
    title_japanese: null,
    synopsis: null,
    score: null,
    scored_by: null,
    rank: null,
    popularity: null,
    members: null,
    favorites: null,
    episodes: null,
    status: '',
    airing: false,
    aired: { from: null, to: null },
    season: null,
    year: null,
    genres: [],
    studios: [],
    producers: [],
    images: rec.images,
    trailer: { youtube_id: null, url: null, embed_url: null },
    streaming: [],
    type: '',
    source: '',
    duration: null,
    rating: null,
    broadcast: null,
    external: []
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimeGrid
          anime={recommendedAnime}
          isLoading={isLoading}
          className="grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3"
        />
        
        {recommendations.length > 6 && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            Showing 6 of {recommendations.length} recommendations
          </p>
        )}
      </CardContent>
    </Card>
  );
}