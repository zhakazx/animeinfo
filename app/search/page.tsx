import { Metadata } from 'next';
import { generateSearchMetadata } from '@/lib/utils/metadata';
import SearchPageClient from './search-page-client';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    status?: string;
    rating?: string;
    sort?: string;
    genres?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  return generateSearchMetadata(params.q);
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  return <SearchPageClient searchParams={params} />;
}