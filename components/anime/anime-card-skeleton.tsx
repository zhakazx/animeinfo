import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AnimeCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 bg-card/50 backdrop-blur">
      <div className="relative aspect-[2/3] overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
      
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Title */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          
          {/* Metadata */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-8" />
          </div>
          
          {/* Episodes */}
          <Skeleton className="h-3 w-20" />
          
          {/* Genres */}
          <div className="flex gap-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}