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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
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
            <Dialog.Panel className="mx-auto max-w-2xl transform overflow-hidden rounded-xl bg-bg-surface shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <Combobox
                onChange={(result: SearchResult) => handleSelectResult(result)}
              >
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-text-tertiary"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    ref={inputRef}
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-text-primary placeholder:text-text-tertiary focus:ring-0 sm:text-base"
                    placeholder="Search opportunities, teams, or companies..."
                    value={query}
                    onChange={(e) => search(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                  />
                  {query && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-4 top-3.5 p-0.5 text-text-tertiary hover:text-text-secondary"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Loading indicator */}
                {isSearching && (
                  <div className="border-t border-border px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-2 text-text-secondary">
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
                        <h2 className="bg-bg-alt px-4 py-2 text-xs font-semibold text-text-tertiary">
                          Opportunities ({searchResults?.opportunities?.length})
                        </h2>
                        <ul className="text-base text-text-secondary">
                          {searchResults?.opportunities?.map((result) => (
                            <ResultItem key={result.id} result={result} />
                          ))}
                        </ul>
                      </li>
                    )}

                    {(searchResults?.teams?.length ?? 0) > 0 && (
                      <li>
                        <h2 className="bg-bg-alt px-4 py-2 text-xs font-semibold text-text-tertiary">
                          Teams ({searchResults?.teams?.length})
                        </h2>
                        <ul className="text-base text-text-secondary">
                          {searchResults?.teams?.map((result) => (
                            <ResultItem key={result.id} result={result} />
                          ))}
                        </ul>
                      </li>
                    )}

                    {(searchResults?.companies?.length ?? 0) > 0 && (
                      <li>
                        <h2 className="bg-bg-alt px-4 py-2 text-xs font-semibold text-text-tertiary">
                          Companies ({searchResults?.companies?.length})
                        </h2>
                        <ul className="text-base text-text-secondary">
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
                      className="mx-auto h-6 w-6 text-text-tertiary"
                      aria-hidden="true"
                    />
                    <p className="mt-4 text-base text-text-secondary">
                      No results found for &quot;{query}&quot;
                    </p>
                    <p className="mt-1 text-sm text-text-tertiary">
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
                        <h3 className="flex items-center gap-2 text-xs font-semibold text-text-tertiary mb-2">
                          <ClockIcon className="h-4 w-4" />
                          Recent Searches
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((recent) => (
                            <button
                              key={recent}
                              onClick={() => handleSelectSuggestion(recent)}
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-bg-alt text-text-secondary hover:bg-navy-100 hover:text-navy transition-colors"
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
                        <h3 className="flex items-center gap-2 text-xs font-semibold text-text-tertiary mb-2">
                          <ArrowTrendingUpIcon className="h-4 w-4" />
                          Popular Searches
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {popularSearches.map((popular) => (
                            <button
                              key={popular}
                              onClick={() => handleSelectSuggestion(popular)}
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-bg-alt text-text-secondary hover:bg-navy-100 hover:text-navy transition-colors"
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
                    <h3 className="text-xs font-semibold text-text-tertiary mb-2">
                      Suggestions
                    </h3>
                    <ul className="space-y-1">
                      {suggestions.map((suggestion) => (
                        <li key={suggestion}>
                          <button
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-bg-alt transition-colors"
                          >
                            {suggestion}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Keyboard hint */}
                <div className="flex flex-wrap items-center bg-bg-alt px-4 py-2.5 text-xs text-text-tertiary border-t border-border">
                  <span className="mr-4">
                    <kbd className="rounded border border-border bg-bg-surface px-1.5 py-0.5 font-mono">
                      ↵
                    </kbd>
                    {' '}to select
                  </span>
                  <span className="mr-4">
                    <kbd className="rounded border border-border bg-bg-surface px-1.5 py-0.5 font-mono">
                      ↑↓
                    </kbd>
                    {' '}to navigate
                  </span>
                  <span>
                    <kbd className="rounded border border-border bg-bg-surface px-1.5 py-0.5 font-mono">
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
                  active ? 'text-navy' : 'text-text-primary'
                )}
              >
                {result.title}
              </p>
              <span className="ml-2 text-xs text-text-tertiary">
                {getResultTypeLabel(result.type)}
              </span>
            </div>
            <p className="text-sm text-text-secondary line-clamp-1 mt-0.5">
              {result.description}
            </p>
            {/* Show highlights if available */}
            {result.highlights.length > 0 && (
              <p
                className="text-xs text-text-tertiary mt-1 line-clamp-1"
                dangerouslySetInnerHTML={createSafeHtml(result.highlights[0].snippet)}
              />
            )}
            {/* Metadata chips */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {typeof result.metadata.industry === 'string' && result.metadata.industry && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-bg-alt text-text-tertiary">
                  {result.metadata.industry}
                </span>
              )}
              {typeof result.metadata.location === 'string' && result.metadata.location && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-bg-alt text-text-tertiary">
                  {result.metadata.location}
                </span>
              )}
            </div>
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
      className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary bg-bg-alt rounded-lg border border-border hover:border-navy-300 hover:text-navy transition-colors min-w-[200px]"
    >
      <MagnifyingGlassIcon className="h-4 w-4" />
      <span className="flex-1 text-left">Search...</span>
      <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-bg-surface px-1.5 py-0.5 text-xs text-text-tertiary">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  );
}
