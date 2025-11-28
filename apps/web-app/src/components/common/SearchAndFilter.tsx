'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterGroup {
  label: string;
  key: string;
  options: FilterOption[];
  type: 'select' | 'multi-select' | 'range';
}

interface SearchAndFilterProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterGroups: FilterGroup[];
  activeFilters: Record<string, string | string[]>;
  onFilterChange: (filterKey: string, value: string | string[]) => void;
  onClearFilters: () => void;
  resultCount?: number;
  showAdvanced?: boolean;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function SearchAndFilter({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filterGroups,
  activeFilters,
  onFilterChange,
  onClearFilters,
  resultCount,
  showAdvanced = false
}: SearchAndFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = Object.values(activeFilters).filter(filter => {
    if (Array.isArray(filter)) {
      return filter.length > 0;
    }
    return filter && filter !== '';
  }).length;

  const clearFilter = (filterKey: string) => {
    onFilterChange(filterKey, Array.isArray(activeFilters[filterKey]) ? [] : '');
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Header */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-text-tertiary" />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field pl-10"
            placeholder={searchPlaceholder}
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={classNames(
              "inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium min-h-11 transition-colors",
              showFilters
                ? "border-navy-300 text-navy bg-navy-50"
                : "border-border text-text-secondary bg-bg-surface hover:bg-bg-alt"
            )}
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-navy rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center px-3 py-2 border border-border rounded-md text-sm font-medium text-text-secondary bg-bg-surface hover:bg-bg-alt min-h-11 transition-colors"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([filterKey, filterValue]) => {
            if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) {
              return null;
            }

            const filterGroup = filterGroups.find(group => group.key === filterKey);
            if (!filterGroup) return null;

            const getFilterValueLabel = (value: string | string[]) => {
              if (Array.isArray(value)) {
                return value.map(v => {
                  const option = filterGroup.options.find(opt => opt.value === v);
                  return option?.label || v;
                }).join(', ');
              }
              const option = filterGroup.options.find(opt => opt.value === value);
              return option?.label || value;
            };

            return (
              <span
                key={filterKey}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-navy-100 text-navy-800"
              >
                <span className="mr-1 text-navy-600">{filterGroup.label}:</span>
                {getFilterValueLabel(filterValue)}
                <button
                  onClick={() => clearFilter(filterKey)}
                  className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-navy-400 hover:bg-navy-200 hover:text-navy-600 touch-target"
                  aria-label={`Remove ${filterGroup.label} filter`}
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Results Count */}
      {resultCount !== undefined && (
        <div className="text-sm text-text-tertiary">
          {resultCount} result{resultCount !== 1 ? 's' : ''} found
        </div>
      )}

      {/* Filter Panel */}
      <Transition
        show={showFilters}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="bg-bg-surface border border-border rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filterGroups.map((group) => (
              <div key={group.key}>
                <label className="label-text mb-2">
                  {group.label}
                </label>

                {group.type === 'select' && (
                  <select
                    value={activeFilters[group.key] as string || ''}
                    onChange={(e) => onFilterChange(group.key, e.target.value)}
                    className="input-field"
                  >
                    <option value="">All {group.label}</option>
                    {group.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                        {option.count !== undefined && ` (${option.count})`}
                      </option>
                    ))}
                  </select>
                )}

                {group.type === 'multi-select' && (
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {group.options.map((option) => {
                      const isSelected = Array.isArray(activeFilters[group.key])
                        ? (activeFilters[group.key] as string[]).includes(option.value)
                        : false;

                      return (
                        <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const currentValues = Array.isArray(activeFilters[group.key])
                                ? activeFilters[group.key] as string[]
                                : [];

                              if (e.target.checked) {
                                onFilterChange(group.key, [...currentValues, option.value]);
                              } else {
                                onFilterChange(group.key, currentValues.filter(v => v !== option.value));
                              }
                            }}
                            className="rounded border-border text-navy focus:ring-navy w-5 h-5"
                          />
                          <span className="text-sm text-text-secondary">
                            {option.label}
                            {option.count !== undefined && (
                              <span className="text-text-tertiary"> ({option.count})</span>
                            )}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Transition>
    </div>
  );
}