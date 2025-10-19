'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JikanAnime } from '@/lib/types/anime';
import { formatScore, formatYear } from '@/lib/utils/format-date';
import { HeroSkeleton } from '@/components/shared/loading-skeleton';

interface HeroSectionProps {
  featuredAnime?: JikanAnime[];
  isLoading?: boolean;
}

export function HeroSection({ featuredAnime, isLoading = false }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!featuredAnime || featuredAnime.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredAnime.length);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, [featuredAnime]);

  if (isLoading || !featuredAnime || featuredAnime.length === 0) {
    return <HeroSkeleton />;
  }

  const currentAnime = featuredAnime[currentIndex];
  const imageUrl = currentAnime.images?.jpg?.large_image_url || currentAnime.images?.jpg?.image_url;
  const title = currentAnime.title_english || currentAnime.title;
  const year = formatYear(currentAnime.aired?.from);
  const score = formatScore(currentAnime.score);

  return (
    <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
      {/* Background Image */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={`${title} background`}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl space-y-6">
            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm">
              {currentAnime.type && (
                <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                  {currentAnime.type}
                </Badge>
              )}
              
              {year && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{year}</span>
                </div>
              )}
              
              {currentAnime.score && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{score}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {title}
            </h1>

            {/* Synopsis */}
            {currentAnime.synopsis && (
              <p className="text-lg text-muted-foreground line-clamp-3 max-w-xl">
                {currentAnime.synopsis}
              </p>
            )}

            {/* Genres */}
            {currentAnime.genres && currentAnime.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentAnime.genres.slice(0, 4).map((genre) => (
                  <Badge key={genre.mal_id} variant="outline" className="bg-background/50">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                <Link href={`/anime/${currentAnime.mal_id}`}>
                  <Info className="mr-2 h-5 w-5" />
                  More Info
                </Link>
              </Button>
              
              {currentAnime.trailer?.youtube_id && (
                <Button size="lg" variant="outline" asChild className="bg-background/50 hover:bg-background/70">
                  <Link href={`/anime/${currentAnime.mal_id}#trailer`}>
                    <Play className="mr-2 h-5 w-5" />
                    Watch Trailer
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      {featuredAnime.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-2">
            {featuredAnime.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-primary w-8' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}