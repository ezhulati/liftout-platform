'use client';

import { useState, useRef, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Combobox, Transition, Dialog } from '@headlessui/react';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  BriefcaseIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { useSearch, SearchResult } from '@/hooks/useSearch';
import { createSafeHtml } from '@/lib/sanitize';
import { useAuth } from '@/hooks/useAuth';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function getResultIcon(type: SearchResult['type']) {
  switch (type) {
    case 'opportunity':
      return BriefcaseIcon;
    case 'team':
      return UserGroupIcon;
    case 'company':
      return BuildingOfficeIcon;
    default:
      return BriefcaseIcon;
  }
}

function getResultUrl(result: SearchResult): string {
  switch (result.type) {
    case 'opportunity':
      return `/app/opportunities/${result.id}`;
    case 'team':
      return `/app/teams/${result.id}`;
    case 'company':
      return `/app/companies/${result.id}`;
    default:
      return '#';
  }
}

function getResultTypeLabel(type: SearchResult['type']): string {
  switch (type) {
    case 'opportunity':
      return 'Opportunity';
    case 'team':
      return 'Team';
    case 'company':
      return 'Company';
    default:
      return type;
  }
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const router = useRouter();
  const { isCompany } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const {
    query,
    searchResults,
    suggestions,
    popularSearches,
    isSearching,
    search,
    clearSearch,
    selectSuggestion,
    showSuggestions,
    setShowSuggestions,
    hasResults,
    isEmpty,
  } = useSearch({ minQueryLength: 2 });

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored).slice(0, 5));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save search to recent
  const saveRecentSearch = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Handle result selection
  const handleSelectResult = (result: SearchResult) => {
    saveRecentSearch(query);
    onClose();
    router.push(getResultUrl(result));
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: string) => {
    selectSuggestion(suggestion);
    saveRecentSearch(suggestion);
  };

  // Keyboard shortcut to open (handled in parent)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Combine all results into a flat list
  const allResults: SearchResult[] = searchResults
    ? [
        ...searchResults.opportunities,
        ...searchResults.teams,
        ...searchResults.companies,
      ].sort((a, b) => b.relevanceScore - a.relevanceScore)
    : [];

  return (
    <Transition.Root show={isOpen} as={Fragment} afterLeave={clearSearch}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-900/10 transition-all">
              <Combobox
                onChange={(result: SearchResult) => handleSelectResult(result)}
              >
                <div className="relative bg-white">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    ref={inputRef}
                    className="h-12 w-full border-0 bg-white pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-base"
                    placeholder={isCompany ? "Search teams..." : "Search opportunities..."}
                    value={query}
                    onChange={(e) => search(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                  />
                  {query && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-4 top-3.5 p-0.5 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Loading indicator */}
                {isSearching && (
                  <div className="border-t border-border px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-2 text-gray-600">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-navy border-t-transparent" />
                      Searching...
                    </div>
                  </div>
                )}

                {/* Search results */}
                {hasResults && !isSearching && (
                  <Combobox.Options
                    static
                    className="max-h-[60vh] scroll-py-2 overflow-y-auto border-t border-border"
                  >
                    {/* Results by type */}
                    {(searchResults?.opportunities?.length ?? 0) > 0 && (
                      <li>
                        <h2 className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-500">
                          Opportunities ({searchResults?.opportunities?.length})
                        </h2>
                        <ul className="text-base text-gray-600">
                          {searchResults?.opportunities?.map((result) => (
                            <ResultItem key={result.id} result={result} />
                          ))}
                        </ul>
                      </li>
                    )}

                    {(searchResults?.teams?.length ?? 0) > 0 && (
                      <li>
                        <h2 className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-500">
                          Teams ({searchResults?.teams?.length})
                        </h2>
                        <ul className="text-base text-gray-600">
                          {searchResults?.teams?.map((result) => (
                            <ResultItem key={result.id} result={result} />
                          ))}
                        </ul>
                      </li>
                    )}

                    {(searchResults?.companies?.length ?? 0) > 0 && (
                      <li>
                        <h2 className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-500">
                          Companies ({searchResults?.companies?.length})
                        </h2>
                        <ul className="text-base text-gray-600">
                          {searchResults?.companies?.map((result) => (
                            <ResultItem key={result.id} result={result} />
                          ))}
                        </ul>
                      </li>
                    )}
                  </Combobox.Options>
                )}

                {/* Empty state */}
                {isEmpty && !isSearching && (
                  <div className="border-t border-border px-6 py-14 text-center">
                    <MagnifyingGlassIcon
                      className="mx-auto h-6 w-6 text-gray-500"
                      aria-hidden="true"
                    />
                    <p className="mt-4 text-base text-gray-600">
                      No results found for &quot;{query}&quot;
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search terms
                    </p>
                  </div>
                )}

                {/* Suggestions and popular searches (when no query) */}
                {!query && !isSearching && (
                  <div className="border-t border-border">
                    {/* Recent searches */}
                    {recentSearches.length > 0 && (
                      <div className="px-4 py-3">
                        <h3 className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
                          <ClockIcon className="h-4 w-4" />
                          Recent Searches
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((recent) => (
                            <button
                              key={recent}
                              onClick={() => handleSelectSuggestion(recent)}
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-navy-100 hover:text-navy transition-colors"
                            >
                              {recent}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular searches */}
                    {popularSearches.length > 0 && (
                      <div className="px-4 py-3 border-t border-border">
                        <h3 className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
                          <ArrowTrendingUpIcon className="h-4 w-4" />
                          Popular Searches
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {popularSearches.map((popular) => (
                            <button
                              key={popular}
                              onClick={() => handleSelectSuggestion(popular)}
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-navy-100 hover:text-navy transition-colors"
                            >
                              {popular}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Suggestions dropdown (while typing) */}
                {showSuggestions && suggestions.length > 0 && query.length >= 2 && !hasResults && !isSearching && (
                  <div className="border-t border-border px-4 py-3">
                    <h3 className="text-xs font-semibold text-gray-500 mb-2">
                      Suggestions
                    </h3>
                    <ul className="space-y-1">
                      {suggestions.map((suggestion) => (
                        <li key={suggestion}>
                          <button
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            {suggestion}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Keyboard hint */}
                <div className="flex flex-wrap items-center bg-gray-100 px-4 py-2.5 text-xs text-gray-500 border-t border-border">
                  <span className="mr-4">
                    <kbd className="rounded border border-border bg-white px-1.5 py-0.5 font-mono">
                      ↵
                    </kbd>
                    {' '}to select
                  </span>
                  <span className="mr-4">
                    <kbd className="rounded border border-border bg-white px-1.5 py-0.5 font-mono">
                      ↑↓
                    </kbd>
                    {' '}to navigate
                  </span>
                  <span>
                    <kbd className="rounded border border-border bg-white px-1.5 py-0.5 font-mono">
                      esc
                    </kbd>
                    {' '}to close
                  </span>
                </div>
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

// Individual result item component
function ResultItem({ result }: { result: SearchResult }) {
  const Icon = getResultIcon(result.type);

  return (
    <Combobox.Option
      value={result}
      className={({ active }) =>
        classNames(
          'flex cursor-pointer select-none items-start px-4 py-3',
          active ? 'bg-navy-50' : ''
        )
      }
    >
      {({ active }) => (
        <>
          <div
            className={classNames(
              'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg',
              result.type === 'opportunity'
                ? 'bg-blue-100 text-blue-600'
                : result.type === 'team'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-purple-100 text-purple-600'
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p
                className={classNames(
                  'text-sm font-medium truncate',
                  active ? 'text-navy' : 'text-gray-900'
                )}
              >
                {result.title}
              </p>
              <span className="ml-2 text-xs text-gray-500">
                {getResultTypeLabel(result.type)}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-1 mt-0.5">
              {result.description}
            </p>
            {/* Show highlights if available */}
            {result.highlights && result.highlights.length > 0 && (
              <p
                className="text-xs text-gray-500 mt-1 line-clamp-1"
                dangerouslySetInnerHTML={createSafeHtml(result.highlights[0].snippet)}
              />
            )}
            {/* Metadata chips */}
            {result.metadata && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {typeof result.metadata.industry === 'string' && result.metadata.industry && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500">
                    {result.metadata.industry}
                  </span>
                )}
                {typeof result.metadata.location === 'string' && result.metadata.location && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500">
                    {result.metadata.location}
                  </span>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </Combobox.Option>
  );
}

// Search trigger button for the header
export function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg border border-border hover:border-navy-300 hover:text-navy transition-colors min-w-[200px]"
    >
      <MagnifyingGlassIcon className="h-4 w-4" />
      <span className="flex-1 text-left">Search...</span>
      <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-white px-1.5 py-0.5 text-xs text-gray-500">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  );
}
