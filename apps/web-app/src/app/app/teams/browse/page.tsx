'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  MapPinIcon,
  StarIcon,
  BriefcaseIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

interface Team {
  id: string;
  name: string;
  description: string;
  size: number;
  industry: string;
  location: string;
  cohesionScore: number;
  yearsWorking: number;
  openToLiftout: boolean;
  postingStatus: string;
  skills: string[];
  isSaved?: boolean;
}

const industries = [
  'All Industries',
  'Technology',
  'Finance',
  'Healthcare',
  'Consulting',
  'Legal',
  'Marketing',
  'Other',
];

const teamSizes = [
  { label: 'Any Size', min: 0, max: 100 },
  { label: '2-5 people', min: 2, max: 5 },
  { label: '6-10 people', min: 6, max: 10 },
  { label: '11-20 people', min: 11, max: 20 },
  { label: '20+ people', min: 20, max: 100 },
];

export default function BrowseTeamsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All Industries');
  const [teamSize, setTeamSize] = useState(teamSizes[0]);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery<{ teams: Team[]; total: number }>({
    queryKey: ['browse-teams', search, industry, teamSize],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (industry !== 'All Industries') params.set('industry', industry);
      if (teamSize.min > 0) params.set('minSize', String(teamSize.min));
      if (teamSize.max < 100) params.set('maxSize', String(teamSize.max));
      params.set('status', 'posted'); // Only show posted teams

      const response = await fetch(`/api/teams?${params}`);
      if (!response.ok) return { teams: [], total: 0 };
      return response.json();
    },
  });

  const teams = data?.teams || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Browse Teams</h1>
        <p className="page-subtitle">Discover high-performing teams.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search teams by name, skills, or description..."
              className="input-field w-full pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-outline flex items-center ${showFilters ? 'bg-navy-50 text-navy' : ''}`}
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="card">
            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="input-field w-full"
                >
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Team Size
                </label>
                <select
                  value={teamSize.label}
                  onChange={(e) => setTeamSize(teamSizes.find((s) => s.label === e.target.value) || teamSizes[0])}
                  className="input-field w-full"
                >
                  {teamSizes.map((size) => (
                    <option key={size.label} value={size.label}>{size.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearch('');
                    setIndustry('All Industries');
                    setTeamSize(teamSizes[0]);
                  }}
                  className="btn-outline text-sm"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="px-6 py-4">
                <div className="h-6 bg-bg-elevated rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-bg-elevated rounded w-full mb-2"></div>
                <div className="h-4 bg-bg-elevated rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : teams.length === 0 ? (
        <div className="card text-center py-12">
          <UserGroupIcon className="h-12 w-12 mx-auto text-text-tertiary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No teams found</h3>
          <p className="text-text-secondary">
            Try adjusting your search or filters to find more teams
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-text-tertiary mb-4">{data?.total || teams.length} teams found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() => router.push(`/app/teams/${team.id}`)}
                className="card hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="px-6 py-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-navy to-navy-700 flex items-center justify-center">
                        <UserGroupIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary">{team.name}</h3>
                        <p className="text-sm text-text-secondary">{team.size} members</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Toggle save
                      }}
                      className="p-2 text-text-tertiary hover:text-navy rounded hover:bg-navy-50"
                    >
                      {team.isSaved ? (
                        <BookmarkIconSolid className="h-5 w-5 text-navy" />
                      ) : (
                        <BookmarkIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <p className="text-text-secondary text-sm line-clamp-2 mb-3">
                    {team.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {team.skills?.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-bg-alt text-text-secondary"
                      >
                        {skill}
                      </span>
                    ))}
                    {team.skills?.length > 3 && (
                      <span className="text-xs text-text-tertiary">+{team.skills.length - 3} more</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-text-tertiary pt-3 border-t border-border">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {team.location}
                      </span>
                      <span className="flex items-center">
                        <BriefcaseIcon className="h-4 w-4 mr-1" />
                        {team.industry}
                      </span>
                    </div>
                    <span className="flex items-center text-gold-600">
                      <StarIcon className="h-4 w-4 mr-1" />
                      {team.cohesionScore}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
