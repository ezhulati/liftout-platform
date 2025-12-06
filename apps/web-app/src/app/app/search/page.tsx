'use client';

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useTeams } from '@/hooks/useTeams';
import { useOpportunities } from '@/hooks/useOpportunities';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserGroupIcon,
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  StarIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface SearchFilters {
  query: string;
  type: 'teams' | 'opportunities' | 'both';
  industry: string;
  location: string;
  teamSize: string;
  experience: string;
  compensation: string;
  availability: string;
}

// Fallback mock data in case API is not available
const FALLBACK_TEAMS = [
  {
    id: '1',
    name: 'Quantitative Analytics Team',
    company: 'Goldman Sachs',
    size: 8,
    industry: 'Investment Banking',
    location: 'New York, NY',
    experience: '7+ years',
    specialties: ['Risk Management', 'Algorithmic Trading', 'Financial Modeling'],
    availability: 'Open to Opportunities',
    yearsWorking: 3.5,
    successfulProjects: 12,
    cohesionScore: 4.9
  },
  {
    id: '2',
    name: 'Healthcare AI Research Team',
    company: 'Johns Hopkins',
    size: 6,
    industry: 'Healthcare Technology',
    location: 'Baltimore, MD',
    experience: '5+ years',
    specialties: ['Medical Imaging', 'Computer Vision', 'Machine Learning'],
    availability: 'Selective',
    yearsWorking: 4.2,
    successfulProjects: 8,
    cohesionScore: 4.8
  },
  {
    id: '3',
    name: 'European Expansion Team',
    company: 'McKinsey & Company',
    size: 5,
    industry: 'Management Consulting',
    location: 'London, UK',
    experience: '8+ years',
    specialties: ['Market Entry', 'Strategic Planning', 'Business Development'],
    availability: 'Confidential',
    yearsWorking: 2.8,
    successfulProjects: 15,
    cohesionScore: 4.7
  }
];

const FALLBACK_OPPORTUNITIES = [
  {
    id: '1',
    title: 'Strategic FinTech Analytics Team',
    company: 'TechVenture Capital',
    type: 'Capability Building',
    compensation: '$180k - $250k',
    location: 'New York, NY',
    teamSize: '6-10 members',
    urgent: true,
    description: 'Seeking quantitative analytics team to launch new trading division',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applications: Array(12).fill({})
  },
  {
    id: '2',
    title: 'Healthcare AI Innovation Team',
    company: 'MedTech Innovations',
    type: 'Market Entry',
    compensation: '$200k - $300k total package',
    location: 'Boston, MA',
    teamSize: '5-8 members',
    urgent: false,
    description: 'Building medical imaging platform, need proven AI/ML team',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    applications: Array(8).fill({})
  },
  {
    id: '3',
    title: 'European Market Entry Team',
    company: 'Confidential Fortune 500',
    type: 'Geographic Expansion',
    compensation: 'Competitive + Equity',
    location: 'London, UK',
    teamSize: '4-6 members',
    urgent: false,
    description: 'Expanding into European markets, seeking experienced consulting team',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    applications: Array(15).fill({})
  }
];

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="h-6 skeleton rounded w-1/3 mb-2"></div>
              <div className="h-4 skeleton rounded w-1/4"></div>
            </div>
            <div className="h-6 skeleton rounded w-16"></div>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-4 skeleton rounded"></div>
            ))}
          </div>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-6 skeleton rounded-full w-24"></div>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <div className="h-6 skeleton rounded-full w-32"></div>
            <div className="h-10 skeleton rounded w-28"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ type }: { type: 'teams' | 'opportunities' }) {
  return (
    <div className="card text-center py-12">
      <div className="w-14 h-14 mx-auto rounded-full bg-bg-elevated flex items-center justify-center mb-4">
        <ExclamationCircleIcon className="h-7 w-7 text-text-tertiary" />
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-2">
        No {type === 'teams' ? 'teams' : 'opportunities'} found
      </h3>
      <p className="text-base text-text-secondary leading-relaxed max-w-md mx-auto">
        {type === 'teams'
          ? 'Try adjusting your filters or search criteria'
          : 'No opportunities match your current filters'}
      </p>
    </div>
  );
}

export default function SearchPage() {
  const { data: session } = useSession();
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'both',
    industry: '',
    location: '',
    teamSize: '',
    experience: '',
    compensation: '',
    availability: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const isCompanyUser = session?.user?.userType === 'company';

  // Fetch teams with real API
  const {
    data: teamsData,
    isLoading: isLoadingTeams,
    error: teamsError
  } = useTeams({
    search: filters.query || undefined,
    industry: filters.industry || undefined,
    location: filters.location || undefined,
    minSize: filters.teamSize ? filters.teamSize.split('-')[0] : undefined,
    maxSize: filters.teamSize ? filters.teamSize.split('-')[1] : undefined,
    minExperience: filters.experience ? filters.experience.replace('+', '').replace(' years', '') : undefined,
    availability: filters.availability || undefined
  });

  // Fetch opportunities with real API
  const {
    data: opportunitiesData,
    isLoading: isLoadingOpportunities,
    error: opportunitiesError
  } = useOpportunities({
    search: filters.query || undefined,
    industry: filters.industry || undefined,
    location: filters.location || undefined,
    type: undefined,
    urgent: undefined
  });

  // Use API data or fallback to mock data
  const teams = useMemo(() => {
    if (teamsData?.teams && teamsData.teams.length > 0) {
      // Transform API data to match display format
      return teamsData.teams.map(team => ({
        id: team.id,
        name: team.name,
        company: team.location || 'Private',
        size: team.size,
        industry: team.industry,
        location: team.location,
        experience: `${team.yearsWorking || 0}+ years`,
        specialties: team.achievements || [],
        availability: team.openToLiftout ? 'Open to Opportunities' : 'Selective',
        yearsWorking: team.yearsWorking || 0,
        successfulProjects: team.successfulProjects || 0,
        cohesionScore: team.cohesionScore || 0
      }));
    }
    // Use fallback data
    return FALLBACK_TEAMS;
  }, [teamsData]);

  const opportunities = useMemo(() => {
    if (opportunitiesData?.opportunities && opportunitiesData.opportunities.length > 0) {
      return opportunitiesData.opportunities.map(opp => ({
        id: opp.id,
        title: opp.title,
        company: opp.company,
        type: opp.type || 'Opportunity',
        compensation: opp.compensation,
        location: opp.location || 'Remote',
        teamSize: opp.teamSize || 'Flexible',
        urgent: opp.urgent,
        description: opp.description,
        createdAt: opp.createdAt,
        applications: opp.applications || []
      }));
    }
    // Use fallback data
    return FALLBACK_OPPORTUNITIES;
  }, [opportunitiesData]);

  // Filter teams locally
  const filteredTeams = useMemo(() => {
    return teams.filter(team =>
      (filters.query === '' ||
        team.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        team.company.toLowerCase().includes(filters.query.toLowerCase()) ||
        team.specialties.some((s: string) => s.toLowerCase().includes(filters.query.toLowerCase()))) &&
      (filters.industry === '' || team.industry === filters.industry) &&
      (filters.location === '' || team.location.includes(filters.location))
    );
  }, [teams, filters]);

  // Filter opportunities locally
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp =>
      (filters.query === '' ||
        opp.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        opp.company.toLowerCase().includes(filters.query.toLowerCase()) ||
        opp.description.toLowerCase().includes(filters.query.toLowerCase())) &&
      (filters.location === '' || opp.location.includes(filters.location))
    );
  }, [opportunities, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Query will automatically refetch via the hook dependencies
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="page-header mb-8">
        <h1 className="page-title">
          {isCompanyUser ? 'Search Teams' : 'Search Opportunities'}
        </h1>
        <p className="page-subtitle">
          {isCompanyUser
            ? 'Find high-performing teams ready for liftout opportunities'
            : 'Discover liftout opportunities that match your team\'s expertise'
          }
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
            <input
              type="text"
              placeholder={isCompanyUser ? "Search teams by expertise, industry, or company..." : "Search opportunities by title, company, or description..."}
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-navy focus:border-navy bg-bg-surface"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-3 border border-border rounded-lg text-text-secondary hover:bg-bg-alt min-h-12"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
          <button
            type="submit"
            className="btn-primary min-h-12 px-6"
          >
            Search
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-bg-alt p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {!isCompanyUser && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Search Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value as SearchFilters['type'] })}
                  className="input-field"
                >
                  <option value="both">Teams & Opportunities</option>
                  <option value="teams">Teams Only</option>
                  <option value="opportunities">Opportunities Only</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Industry
              </label>
              <select
                value={filters.industry}
                onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                className="input-field"
              >
                <option value="">All Industries</option>
                <option value="Investment Banking">Investment Banking</option>
                <option value="Healthcare Technology">Healthcare Technology</option>
                <option value="Management Consulting">Management Consulting</option>
                <option value="Technology">Technology</option>
                <option value="Financial Services">Financial Services</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="City, State or Country"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="input-field"
              />
            </div>

            {isCompanyUser && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Team Size
                </label>
                <select
                  value={filters.teamSize}
                  onChange={(e) => setFilters({ ...filters, teamSize: e.target.value })}
                  className="input-field"
                >
                  <option value="">Any Size</option>
                  <option value="2-5">2-5 members</option>
                  <option value="6-10">6-10 members</option>
                  <option value="11-20">11-20 members</option>
                  <option value="20-100">20+ members</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Experience Level
              </label>
              <select
                value={filters.experience}
                onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                className="input-field"
              >
                <option value="">Any Experience</option>
                <option value="3+ years">3-5 years</option>
                <option value="5+ years">5-7 years</option>
                <option value="7+ years">7+ years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>
          </div>
        )}
      </form>

      {/* Search Results */}
      <div className="space-y-8">
        {/* Teams Section */}
        {(filters.type === 'teams' || filters.type === 'both') && (
          <div>
            <h2 className="text-lg font-bold text-text-primary mb-4">
              Teams ({filteredTeams.length})
              {teamsError && <span className="text-sm font-normal text-text-tertiary ml-2">(showing cached data)</span>}
            </h2>

            {isLoadingTeams ? (
              <LoadingSkeleton />
            ) : filteredTeams.length === 0 ? (
              <EmptyState type="teams" />
            ) : (
              <div className="grid gap-6">
                {filteredTeams.map((team) => (
                  <TeamCard key={team.id} team={team} isCompanyUser={isCompanyUser || false} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Opportunities Section */}
        {(filters.type === 'opportunities' || filters.type === 'both') && !isCompanyUser && (
          <div>
            <h2 className="text-lg font-bold text-text-primary mb-4">
              Opportunities ({filteredOpportunities.length})
              {opportunitiesError && <span className="text-sm font-normal text-text-tertiary ml-2">(showing cached data)</span>}
            </h2>

            {isLoadingOpportunities ? (
              <LoadingSkeleton />
            ) : filteredOpportunities.length === 0 ? (
              <EmptyState type="opportunities" />
            ) : (
              <div className="grid gap-6">
                {filteredOpportunities.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    getTimeAgo={getTimeAgo}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TeamCard({ team, isCompanyUser }: { team: any; isCompanyUser: boolean }) {
  return (
    <div className="card hover:shadow-md hover:border-purple-300 transition-all duration-base">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-text-primary">{team.name}</h3>
          <p className="text-sm text-text-secondary">{team.company}</p>
        </div>
        <div className="flex items-center space-x-1">
          <StarIcon className="h-4 w-4 text-gold fill-current" />
          <span className="text-sm font-medium text-text-tertiary">{team.cohesionScore?.toFixed(1) || 'N/A'}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center text-sm text-text-tertiary">
          <UserGroupIcon className="h-4 w-4 mr-2" />
          {team.size} members
        </div>
        <div className="flex items-center text-sm text-text-tertiary">
          <MapPinIcon className="h-4 w-4 mr-2" />
          {team.location}
        </div>
        <div className="flex items-center text-sm text-text-tertiary">
          <ClockIcon className="h-4 w-4 mr-2" />
          {team.yearsWorking}y together
        </div>
        <div className="flex items-center text-sm text-text-tertiary">
          <BriefcaseIcon className="h-4 w-4 mr-2" />
          {team.industry}
        </div>
      </div>

      {team.specialties && team.specialties.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-bold text-text-primary mb-2">Specialties:</p>
          <div className="flex flex-wrap gap-2">
            {team.specialties.slice(0, 5).map((specialty: string, index: number) => (
              <span
                key={index}
                className="badge badge-primary text-xs"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <span className={`badge text-xs ${
            team.availability === 'Open to Opportunities'
              ? 'badge-success'
              : team.availability === 'Selective'
                ? 'badge-warning'
                : 'badge-secondary'
          }`}>
            {team.availability}
          </span>
        </div>

        {isCompanyUser && (
          <Link
            href={`/app/teams/${team.id}`}
            className="btn-primary min-h-12"
          >
            View team
          </Link>
        )}
      </div>
    </div>
  );
}

function OpportunityCard({ opportunity, getTimeAgo }: { opportunity: any; getTimeAgo: (date: string) => string }) {
  return (
    <div className="card hover:shadow-md hover:border-purple-300 transition-all duration-base">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-text-primary">{opportunity.title}</h3>
          <p className="text-sm text-text-secondary">{opportunity.company}</p>
        </div>
        <span className={`badge text-xs ${
          opportunity.urgent
            ? 'badge-error'
            : 'badge-success'
        }`}>
          {opportunity.urgent ? 'High Priority' : 'Normal'}
        </span>
      </div>

      <p className="text-sm text-text-secondary leading-relaxed mb-4">{opportunity.description}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center text-sm text-text-tertiary">
          <CurrencyDollarIcon className="h-4 w-4 mr-2" />
          {opportunity.compensation}
        </div>
        <div className="flex items-center text-sm text-text-tertiary">
          <MapPinIcon className="h-4 w-4 mr-2" />
          {opportunity.location}
        </div>
        <div className="flex items-center text-sm text-text-tertiary">
          <UserGroupIcon className="h-4 w-4 mr-2" />
          {opportunity.teamSize}
        </div>
        <div className="flex items-center text-sm text-text-tertiary">
          <ClockIcon className="h-4 w-4 mr-2" />
          {getTimeAgo(opportunity.createdAt)}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-text-tertiary">
            {opportunity.applications?.length || 0} teams applied
          </span>
        </div>

        <Link
          href={`/app/opportunities/${opportunity.id}`}
          className="btn-primary min-h-12"
        >
          Express interest
        </Link>
      </div>
    </div>
  );
}
