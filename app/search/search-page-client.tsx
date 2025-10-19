'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { SearchBar } from '@/components/search/search-bar';
import { SearchFilters } from '@/components/search/search-filters';
import { Pagination } from '@/components/search/pagination';
import { AnimeGrid } from '@/components/anime/anime-grid';
import { SectionHeader } from '@/components/shared/section-header';
import { searchAnime } from '@/lib/api/jikan';
import { SearchFilters as SearchFiltersType } from '@/lib/types/anime';
import { PAGINATION } from '@/lib/constants';

interface SearchPageClientProps {
  searchParams: {
    q?: string;
    type?: string;
    status?: string;
    rating?: string;
    sort?: string;
    genres?: string;
    page?: string;
  };
}

export default function SearchPageClient({ searchParams }: SearchPageClientProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const scrollPositionRef = useRef<number>(0);
  const isInitialLoad = useRef(true);

  // Initialize state from URL parameters
  const [query, setQuery] = useState(searchParams.q || '');
  const [filters, setFilters] = useState<SearchFiltersType>({
    type: searchParams.type || '',
    status: searchParams.status || '',
    rating: searchParams.rating || '',
    sort: (searchParams.sort as 'asc' | 'desc') || 'desc',
    genres: searchParams.genres ? searchParams.genres.split(',').map(Number) : []
  });
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.page || '1'));

  // Save scroll position before search updates
  const saveScrollPosition = useCallback(() => {
    scrollPositionRef.current = window.scrollY;
  }, []);

  // Update URL when search parameters change
  const updateURL = useCallback((newQuery: string, newFilters: SearchFiltersType, newPage: number) => {
    const params = new URLSearchParams();
    
    if (newQuery) params.set('q', newQuery);
    if (newFilters.type) params.set('type', newFilters.type);
    if (newFilters.status) params.set('status', newFilters.status);
    if (newFilters.rating) params.set('rating', newFilters.rating);
    if (newFilters.sort && newFilters.sort !== 'desc') params.set('sort', newFilters.sort);
    if (newFilters.genres && newFilters.genres.length > 0) {
      params.set('genres', newFilters.genres.join(','));
    }
    if (newPage > 1) params.set('page', newPage.toString());

    const newURL = params.toString() ? `/search?${params.toString()}` : '/search';
    router.push(newURL);
  }, [router]);

  // Fetch search results
  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['search', query, filters, currentPage],
    queryFn: () => searchAnime({
      q: query,
      ...filters,
      page: currentPage,
      limit: PAGINATION.ITEMS_PER_PAGE
    }),
    enabled: !!query,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle search query change
  const handleSearch = useCallback((newQuery: string) => {
    saveScrollPosition();
    setQuery(newQuery);
    setCurrentPage(1);
    updateURL(newQuery, filters, 1);
  }, [filters, updateURL, saveScrollPosition]);

  // Handle filter change
  const handleFilterChange = useCallback((newFilters: SearchFiltersType) => {
    saveScrollPosition();
    setFilters(newFilters);
    setCurrentPage(1);
    updateURL(query, newFilters, 1);
  }, [query, updateURL, saveScrollPosition]);

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    updateURL(query, filters, newPage);
  }, [query, filters, updateURL]);

  // Note: Initial state is set from server-side searchParams, no need to sync with URL changes
  // as the component will re-mount when navigating to different search URLs

  // Preserve scroll position when search results update (but not on initial load or page changes)
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // Only preserve scroll for filter/query changes, not page changes
    if (currentPage === 1 && !isLoading && searchResults) {
      const timeoutId = setTimeout(() => {
        if (scrollPositionRef.current > 0) {
          window.scrollTo(0, scrollPositionRef.current);
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [searchResults, isLoading, currentPage]);

  const totalPages = searchResults?.pagination?.last_visible_page || 1;
  const hasResults = searchResults?.data && searchResults.data.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionHeader
        title="Search Anime"
        description="Find your next favorite anime from our extensive database"
        className="mb-4"
      />

      <div className="space-y-6">
        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          defaultValue={query}
          placeholder="Search for anime..."
        />

        {/* Filters */}
        <SearchFilters
          filters={filters}
          onFiltersChange={handleFilterChange}
        />

        {/* Results */}
        {!query ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Enter a search term to find anime
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">
              An error occurred while searching. Please try again.
            </p>
          </div>
        ) : (
          <>
            {/* Search Results Header */}
            {!isLoading && hasResults && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {searchResults.pagination?.items?.total || 0} results found for "{query}"
                </p>
              </div>
            )}

            {/* Anime Grid */}
            <AnimeGrid
              anime={searchResults?.data || []}
              isLoading={isLoading}
              emptyMessage={`No anime found for "${query}"`}
            />

            {/* Pagination */}
            {hasResults && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}