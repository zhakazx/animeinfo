import { Metadata } from 'next';
import { getAnimeById } from '@/lib/api/jikan';
import { generateAnimeMetadata, generateAnimeStructuredData } from '@/lib/utils/metadata';
import AnimePageClient from './anime-page-client';

interface AnimePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: AnimePageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const anime = await getAnimeById(parseInt(resolvedParams.id));
    return generateAnimeMetadata(anime);
  } catch (error) {
    return {
      title: 'Anime Not Found - AnimeInfo',
      description: 'The requested anime could not be found. Explore other anime on AnimeInfo.'
    };
  }
}

export default async function AnimePage({ params }: AnimePageProps) {
  const resolvedParams = await params;
  let anime = null;
  let structuredData = null;

  try {
    anime = await getAnimeById(parseInt(resolvedParams.id));
    structuredData = generateAnimeStructuredData(anime);
  } catch (error) {
    // Handle error in client component
  }

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <AnimePageClient animeId={parseInt(resolvedParams.id)} initialAnime={anime} />
    </>
  );
}