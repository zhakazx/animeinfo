import Image from 'next/image';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionSkeleton } from '@/components/shared/loading-skeleton';
import { JikanCharacter } from '@/lib/types/anime';

interface AnimeCharactersProps {
  characters: JikanCharacter[];
  isLoading?: boolean;
}

export function AnimeCharacters({ characters, isLoading = false }: AnimeCharactersProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Characters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SectionSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (!characters || characters.length === 0) {
    return null;
  }

  // Show only main characters (first 12)
  const mainCharacters = characters.slice(0, 12);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Characters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mainCharacters.map((item) => {
            const character = item.character;
            const voiceActors = item.voice_actors || [];
            const imageUrl = character.images?.jpg?.image_url;

            return (
              <div
                key={character.mal_id}
                className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                {/* Character Image */}
                <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden bg-muted">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={character.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Character Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">
                    {character.name}
                  </h4>
                  
                  {item.role && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {item.role}
                    </Badge>
                  )}

                  {/* Voice Actor (Japanese) */}
                  {voiceActors.length > 0 && (
                    <div className="mt-2">
                      {voiceActors
                        .filter(va => va.language === 'Japanese')
                        .slice(0, 1)
                        .map((va) => (
                          <p key={va.person.mal_id} className="text-xs text-muted-foreground line-clamp-1">
                            CV: {va.person.name}
                          </p>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {characters.length > 12 && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            Showing {mainCharacters.length} of {characters.length} characters
          </p>
        )}
      </CardContent>
    </Card>
  );
}