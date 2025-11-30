'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Simple debounce implementation
function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  }) as T & { cancel: () => void };

  debouncedFn.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debouncedFn;
}

export interface SearchResult {
  type: 'opportunity' | 'team' | 'company';
  id: string;
  title: string;
  description: string;
  relevanceScore: number;
  highlights: {
    field: string;
    snippet: string;
  }[];
  metadata: Record<string, unknown>;
}

export interface UnifiedSearchResult {
  query: string;
  total: number;
  opportunities: SearchResult[];
  teams: SearchResult[];
  companies: SearchResult[];
  suggestions: string[];
}

export interface SearchFilters {
  type?: 'opportunity' | 'team' | 'company' | 'all';
  industry?: string;
  location?: string;
  remotePolicy?: 'remote' | 'hybrid' | 'onsite';
  minCompensation?: number;
  maxCompensation?: number;
  teamSizeMin?: number;
  teamSizeMax?: number;
  skills?: string[];
}

interface UseSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  enabled?: boolean;
}

async function fetchSearch(
  query: string,
  filters: SearchFilters = {}
): Promise<UnifiedSearchResult> {
  const params = new URLSearchParams();
  params.set('q', query);

  if (filters.type) params.set('type', filters.type);
  if (filters.industry) params.set('industry', filters.industry);
  if (filters.location) params.set('location', filters.location);
  if (filters.remotePolicy) params.set('remotePolicy', filters.remotePolicy);
  if (filters.minCompensation) params.set('minCompensation', filters.minCompensation.toString());
  if (filters.maxCompensation) params.set('maxCompensation', filters.maxCompensation.toString());
  if (filters.teamSizeMin) params.set('teamSizeMin', filters.teamSizeMin.toString());
  if (filters.teamSizeMax) params.set('teamSizeMax', filters.teamSizeMax.toString());
  if (filters.skills?.length) params.set('skills', filters.skills.join(','));

  const response = await fetch(`/api/search?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Search failed');
  }

  const data = await response.json();
  return data.data;
}

async function fetchSuggestions(query: string): Promise<string[]> {
  if (!query || query.length < 2) {
    return [];
  }

  const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.data?.suggestions || [];
}

async function fetchPopularSearches(): Promise<string[]> {
  const response = await fetch('/api/search/popular');

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.data?.popular || [];
}

export function useSearch(options: UseSearchOptions = {}) {
  const {
    debounceMs = 300,
    minQueryLength = 2,
    enabled = true
  } = options;

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const queryClient = useQueryClient();

  // Debounced query update
  const debouncedSetQuery = useRef(
    debounce((q: string) => {
      setDebouncedQuery(q);
    }, debounceMs)
  ).current;

  // Update debounced query when query changes
  useEffect(() => {
    debouncedSetQuery(query);
    return () => debouncedSetQuery.cancel();
  }, [query, debouncedSetQuery]);

  // Main search query
  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
    refetch: refetchSearch
  } = useQuery({
    queryKey: ['search', debouncedQuery, filters],
    queryFn: () => fetchSearch(debouncedQuery, filters),
    enabled: enabled && debouncedQuery.length >= minQueryLength,
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Suggestions query
  const {
    data: suggestions = [],
    isLoading: isLoadingSuggestions
  } = useQuery({
    queryKey: ['search-suggestions', query],
    queryFn: () => fetchSuggestions(query),
    enabled: enabled && query.length >= 2 && showSuggestions,
    staleTime: 60000, // 1 minute
  });

  // Popular searches query
  const {
    data: popularSearches = []
  } = useQuery({
    queryKey: ['popular-searches'],
    queryFn: fetchPopularSearches,
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Search handler
  const search = useCallback((newQuery: string) => {
    setQuery(newQuery);
    if (newQuery.length >= minQueryLength) {
      setShowSuggestions(true);
    }
  }, [minQueryLength]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setShowSuggestions(false);
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Select a suggestion
  const selectSuggestion = useCallback((suggestion: string) => {
    setQuery(suggestion);
    setDebouncedQuery(suggestion);
    setShowSuggestions(false);
  }, []);

  // Prefetch a search result on hover
  const prefetchResult = useCallback((type: 'opportunity' | 'team' | 'company', id: string) => {
    const queryKey = type === 'opportunity'
      ? ['opportunity', id]
      : type === 'team'
        ? ['team', id]
        : ['company', id];

    queryClient.prefetchQuery({
      queryKey,
      queryFn: async () => {
        const response = await fetch(`/api/${type === 'opportunity' ? 'opportunities' : type + 's'}/${id}`);
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
      },
      staleTime: 60000,
    });
  }, [queryClient]);

  return {
    // State
    query,
    filters,
    showSuggestions,

    // Results
    searchResults,
    suggestions,
    popularSearches,

    // Loading states
    isSearching,
    isLoadingSuggestions,

    // Error state
    searchError,

    // Actions
    search,
    clearSearch,
    updateFilters,
    clearFilters,
    selectSuggestion,
    setShowSuggestions,
    prefetchResult,
    refetchSearch,

    // Computed
    hasResults: searchResults && searchResults.total > 0,
    isEmpty: debouncedQuery.length >= minQueryLength && searchResults?.total === 0,
  };
}

// Hook for search autocomplete only
export function useSearchAutocomplete(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ['search-suggestions', debouncedQuery],
    queryFn: () => fetchSuggestions(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 60000,
  });

  return { suggestions, isLoading };
}
