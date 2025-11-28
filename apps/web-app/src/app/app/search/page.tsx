'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  UserGroupIcon,
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  StarIcon
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

const mockTeams = [
  {
    id: 1,
    name: 'Quantitative Analytics Team',
    company: 'Goldman Sachs',
    size: 8,
    industry: 'Investment Banking',
    location: 'New York, NY',
    experience: '7+ years',
    specialties: ['Risk Management', 'Algorithmic Trading', 'Financial Modeling'],
    availability: 'Open to Opportunities',
    yearsWorking: 3.5,
    successfulLiftouts: 0,
    rating: 4.9
  },
  {
    id: 2,
    name: 'Healthcare AI Research Team',
    company: 'Johns Hopkins',
    size: 6,
    industry: 'Healthcare Technology',
    location: 'Baltimore, MD',
    experience: '5+ years',
    specialties: ['Medical Imaging', 'Computer Vision', 'Machine Learning'],
    availability: 'Selective',
    yearsWorking: 4.2,
    successfulLiftouts: 1,
    rating: 4.8
  },
  {
    id: 3,
    name: 'European Expansion Team',
    company: 'McKinsey & Company',
    size: 5,
    industry: 'Management Consulting',
    location: 'London, UK',
    experience: '8+ years',
    specialties: ['Market Entry', 'Strategic Planning', 'Business Development'],
    availability: 'Confidential',
    yearsWorking: 2.8,
    successfulLiftouts: 2,
    rating: 4.7
  }
];

const mockOpportunities = [
  {
    id: 1,
    title: 'Strategic FinTech Analytics Team',
    company: 'TechVenture Capital',
    type: 'Capability Building',
    compensation: '$180k - $250k',
    location: 'New York, NY',
    teamSize: '6-10 members',
    urgency: 'High',
    description: 'Seeking quantitative analytics team to launch new trading division',
    posted: '2 days ago',
    applicants: 12
  },
  {
    id: 2,
    title: 'Healthcare AI Innovation Team',
    company: 'MedTech Innovations',
    type: 'Market Entry',
    compensation: '$200k - $300k total package',
    location: 'Boston, MA',
    teamSize: '5-8 members',
    urgency: 'Medium',
    description: 'Building medical imaging platform, need proven AI/ML team',
    posted: '5 days ago',
    applicants: 8
  },
  {
    id: 3,
    title: 'European Market Entry Team',
    company: 'Confidential Fortune 500',
    type: 'Geographic Expansion',
    compensation: 'Competitive + Equity',
    location: 'London, UK',
    teamSize: '4-6 members',
    urgency: 'Low',
    description: 'Expanding into European markets, seeking experienced consulting team',
    posted: '1 week ago',
    applicants: 15
  }
];

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching with filters:', filters);
  };

  const filteredTeams = mockTeams.filter(team => 
    (filters.query === '' || 
     team.name.toLowerCase().includes(filters.query.toLowerCase()) ||
     team.company.toLowerCase().includes(filters.query.toLowerCase()) ||
     team.specialties.some(s => s.toLowerCase().includes(filters.query.toLowerCase()))) &&
    (filters.industry === '' || team.industry === filters.industry) &&
    (filters.location === '' || team.location.includes(filters.location))
  );

  const filteredOpportunities = mockOpportunities.filter(opp =>
    (filters.query === '' ||
     opp.title.toLowerCase().includes(filters.query.toLowerCase()) ||
     opp.company.toLowerCase().includes(filters.query.toLowerCase()) ||
     opp.description.toLowerCase().includes(filters.query.toLowerCase())) &&
    (filters.location === '' || opp.location.includes(filters.location))
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">
          {isCompanyUser ? 'Search Teams' : 'Search Opportunities'}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
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
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-3 border border-border rounded-lg text-text-secondary hover:bg-bg-alt"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
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
                  onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
                  className="w-full border border-border rounded-md shadow-sm py-2 px-3"
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
                className="w-full border border-border rounded-md shadow-sm py-2 px-3"
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
                className="w-full border border-border rounded-md shadow-sm py-2 px-3"
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
                  className="w-full border border-border rounded-md shadow-sm py-2 px-3"
                >
                  <option value="">Any Size</option>
                  <option value="2-5">2-5 members</option>
                  <option value="6-10">6-10 members</option>
                  <option value="11-20">11-20 members</option>
                  <option value="20+">20+ members</option>
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
                className="w-full border border-border rounded-md shadow-sm py-2 px-3"
              >
                <option value="">Any Experience</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5-7 years">5-7 years</option>
                <option value="7+ years">7+ years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>
          </div>
        )}
      </form>

      {/* Search Results */}
      <div className="space-y-6">
        {(filters.type === 'teams' || filters.type === 'both') && (
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Teams ({filteredTeams.length})
            </h2>
            <div className="grid gap-6">
              {filteredTeams.map((team) => (
                <TeamCard key={team.id} team={team} isCompanyUser={isCompanyUser} />
              ))}
            </div>
          </div>
        )}

        {(filters.type === 'opportunities' || filters.type === 'both') && !isCompanyUser && (
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Opportunities ({filteredOpportunities.length})
            </h2>
            <div className="grid gap-6">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TeamCard({ team, isCompanyUser }: { team: any; isCompanyUser: boolean }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{team.name}</h3>
          <p className="text-text-secondary">{team.company}</p>
        </div>
        <div className="flex items-center space-x-1">
          <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-text-secondary">{team.rating}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center text-sm text-text-secondary">
          <UserGroupIcon className="h-4 w-4 mr-2" />
          {team.size} members
        </div>
        <div className="flex items-center text-sm text-text-secondary">
          <MapPinIcon className="h-4 w-4 mr-2" />
          {team.location}
        </div>
        <div className="flex items-center text-sm text-text-secondary">
          <ClockIcon className="h-4 w-4 mr-2" />
          {team.yearsWorking}y together
        </div>
        <div className="flex items-center text-sm text-text-secondary">
          <BriefcaseIcon className="h-4 w-4 mr-2" />
          {team.industry}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-text-secondary mb-2">Specialties:</p>
        <div className="flex flex-wrap gap-2">
          {team.specialties.map((specialty: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            team.availability === 'Open to Opportunities' 
              ? 'bg-success-light text-success-dark'
              : team.availability === 'Selective'
              ? 'bg-gold-100 text-yellow-800'
              : 'bg-bg-alt text-text-primary'
          }`}>
            {team.availability}
          </span>
        </div>
        
        {isCompanyUser && (
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
            Contact Team
          </button>
        )}
      </div>
    </div>
  );
}

function OpportunityCard({ opportunity }: { opportunity: any }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{opportunity.title}</h3>
          <p className="text-text-secondary">{opportunity.company}</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          opportunity.urgency === 'High' 
            ? 'bg-red-100 text-red-800'
            : opportunity.urgency === 'Medium'
            ? 'bg-gold-100 text-yellow-800'
            : 'bg-success-light text-success-dark'
        }`}>
          {opportunity.urgency} Priority
        </span>
      </div>

      <p className="text-text-secondary mb-4">{opportunity.description}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center text-sm text-text-secondary">
          <CurrencyDollarIcon className="h-4 w-4 mr-2" />
          {opportunity.compensation}
        </div>
        <div className="flex items-center text-sm text-text-secondary">
          <MapPinIcon className="h-4 w-4 mr-2" />
          {opportunity.location}
        </div>
        <div className="flex items-center text-sm text-text-secondary">
          <UserGroupIcon className="h-4 w-4 mr-2" />
          {opportunity.teamSize}
        </div>
        <div className="flex items-center text-sm text-text-secondary">
          <ClockIcon className="h-4 w-4 mr-2" />
          {opportunity.posted}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-text-secondary">
            {opportunity.applicants} teams applied
          </span>
        </div>
        
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
          Express Interest
        </button>
      </div>
    </div>
  );
}