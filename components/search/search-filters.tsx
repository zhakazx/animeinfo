'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SearchFilters as SearchFiltersType } from '@/lib/types/anime';
import { 
  ANIME_TYPES, 
  ANIME_STATUS, 
  RATINGS, 
  ORDER_BY_OPTIONS,
  POPULAR_GENRES 
} from '@/lib/constants';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  className?: string;
}

export function SearchFilters({ filters, onFiltersChange, className = "" }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof SearchFiltersType, value: string | number[] | 'asc' | 'desc' | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      type: undefined,
      status: undefined,
      rating: undefined,
      order_by: 'score',
      sort: 'desc',
      genres: [],
      min_score: undefined,
      max_score: undefined,
      start_date: undefined,
      end_date: undefined,
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== '' && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  const removeGenre = (genreId: number) => {
    updateFilter('genres', filters.genres?.filter(id => id !== genreId) || []);
  };

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Search Filters</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={filters.type || 'all'} onValueChange={(value) => updateFilter('type', value === 'all' ? undefined : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {ANIME_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filters.status || 'all'} onValueChange={(value) => updateFilter('status', value === 'all' ? undefined : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {ANIME_STATUS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <Select value={filters.rating || 'all'} onValueChange={(value) => updateFilter('rating', value === 'all' ? undefined : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ratings</SelectItem>
                  {RATINGS.map((rating) => (
                    <SelectItem key={rating.value} value={rating.value}>
                      {rating.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort by</label>
                <Select value={filters.order_by || 'score'} onValueChange={(value) => updateFilter('order_by', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_BY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Order</label>
                <Select value={filters.sort || 'desc'} onValueChange={(value) => updateFilter('sort', value as 'asc' | 'desc')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Genres */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Genres</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {POPULAR_GENRES.map((genre) => {
                  const isSelected = filters.genres?.includes(genre.id) || false;
                  return (
                    <Button
                      key={genre.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const currentGenres = filters.genres || [];
                        if (isSelected) {
                          updateFilter('genres', currentGenres.filter(id => id !== genre.id));
                        } else {
                          updateFilter('genres', [...currentGenres, genre.id]);
                        }
                      }}
                      className="justify-start text-xs"
                    >
                      {genre.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={clearFilters}>
                Clear All
              </Button>
              <Button onClick={() => setIsOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Active Filters Display */}
      {(filters.genres && filters.genres.length > 0) && (
        <div className="flex flex-wrap gap-2 mt-4">
          {filters.genres.map((genreId) => {
            const genre = POPULAR_GENRES.find(g => g.id === genreId);
            return genre ? (
              <Badge key={genreId} variant="secondary" className="gap-1">
                {genre.name}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGenre(genreId)}
                  className="h-auto p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}