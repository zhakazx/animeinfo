import { Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimeGrid } from './anime-grid';
import { SectionSkeleton } from '@/components/shared/loading-skeleton';
import { JikanAnime } from '@/lib/types/anime';

interface AnimeRecommendationsProps {
  recommendations: JikanAnime[];
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
          anime={recommendations}
          isLoading={isLoading}
          className="grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3"
        />
        
        {recommendations.length > 0 && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            Showing {recommendations.length} recommendations
          </p>
        )}
      </CardContent>
    </Card>
  );
}