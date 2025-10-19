'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AnimeTrailerProps {
  youtubeId: string;
  title: string;
}

export function AnimeTrailer({ youtubeId, title }: AnimeTrailerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Trailer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
          {!isPlaying ? (
            <>
              {/* Thumbnail */}
              <img
                src={thumbnailUrl}
                alt={`${title} trailer thumbnail`}
                className="w-full h-full object-cover"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors">
                <Button
                  size="lg"
                  onClick={() => setIsPlaying(true)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 p-0"
                >
                  <Play className="h-8 w-8 ml-1" fill="currentColor" />
                </Button>
              </div>
            </>
          ) : (
            /* YouTube Embed */
            <iframe
              src={embedUrl}
              title={`${title} trailer`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}