'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  UsersIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

// Mock company data for team users to browse
const mockCompanies = [
  {
    id: '1',
    name: 'Apex Ventures',
    industry: 'Private Equity',
    location: 'New York, NY',
    size: '500-1000',
    description: 'Leading private equity firm focused on growth-stage technology investments. Looking for high-performing teams to expand our portfolio operations.',
    openOpportunities: 3,
    logo: null,
    verified: true,
  },
  {
    id: '2',
    name: 'MedTech Innovations',
    industry: 'Healthcare Technology',
    location: 'Boston, MA',
    size: '200-500',
    description: 'Pioneering AI-powered healthcare solutions. Seeking teams with expertise in machine learning and medical imaging to accelerate our R&D initiatives.',
    openOpportunities: 2,
    logo: null,
    verified: true,
  },
  {
    id: '3',
    name: 'Global Finance Partners',
    industry: 'Financial Services',
    location: 'Chicago, IL',
    size: '1000+',
    description: 'Full-service investment bank with a focus on M&A advisory. Looking for experienced deal teams to strengthen our market position.',
    openOpportunities: 5,
    logo: null,
    verified: true,
  },
  {
    id: '4',
    name: 'TechForward Inc.',
    industry: 'Enterprise Software',
    location: 'San Francisco, CA',
    size: '200-500',
    description: 'Enterprise SaaS company building next-generation productivity tools. Seeking product and engineering teams to drive platform expansion.',
    openOpportunities: 4,
    logo: null,
    verified: false,
  },
  {
    id: '5',
    name: 'Strategic Consulting Group',
    industry: 'Management Consulting',
    location: 'Washington, DC',
    size: '100-200',
    description: 'Boutique consulting firm serving Fortune 500 clients. Looking for strategy teams with deep industry expertise.',
    openOpportunities: 2,
    logo: null,
    verified: true,
  },
];

const industries = [
  'All Industries',
  'Financial Services',
  'Healthcare Technology',
  'Enterprise Software',
  'Management Consulting',
  'Private Equity',
  'Legal Services',
];

const locations = [
  'All Locations',
  'New York, NY',
  'San Francisco, CA',
  'Boston, MA',
  'Chicago, IL',
  'Washington, DC',
  'Remote',
];

export default function FindCompaniesPage() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [showFilters, setShowFilters] = useState(false);

  if (status === 'loading') {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="text-center py-12">
        <BuildingOfficeIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
        <h2 className="text-lg font-bold text-text-primary mb-2">Sign in required</h2>
        <p className="text-text-secondary">Please sign in to browse companies.</p>
      </div>
    );
  }

  // Filter companies based on search and filters
  const filteredCompanies = mockCompanies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All Industries' || company.industry === selectedIndustry;
    const matchesLocation = selectedLocation === 'All Locations' || company.location === selectedLocation;
    return matchesSearch && matchesIndustry && matchesLocation;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="text-2xl font-bold text-text-primary font-heading leading-tight">
          Find Companies
        </h1>
        <p className="text-base font-normal text-text-secondary mt-2 leading-relaxed max-w-2xl">
          Discover companies actively seeking high-performing teams like yours. Browse opportunities and find your next home.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-bg-surface rounded-lg border border-border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies..."
              className="w-full pl-10 pr-4 py-3 min-h-12 rounded-lg border border-border bg-bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex gap-3">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-4 py-3 min-h-12 rounded-lg border border-border bg-bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {industries.map((industry) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-3 min-h-12 rounded-lg border border-border bg-bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-4 py-3 min-h-12 rounded-lg border border-border bg-bg-surface text-text-primary hover:bg-bg-elevated transition-colors"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-text-secondary">
        Showing {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'}
      </div>

      {/* Company Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className="bg-bg-surface rounded-lg border border-border p-6 hover:border-purple-300 hover:shadow-md transition-all duration-fast"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Company Logo/Avatar */}
                <div className="w-14 h-14 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <BuildingOfficeIcon className="h-7 w-7 text-purple-500" />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Company Header */}
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-text-primary">{company.name}</h3>
                    {company.verified && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-light text-success-dark">
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Industry Tag */}
                  <span className="inline-block px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-medium mb-2">
                    {company.industry}
                  </span>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-3">
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4" />
                      {company.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <UsersIcon className="h-4 w-4" />
                      {company.size} employees
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-text-secondary text-sm line-clamp-2 mb-4">
                    {company.description}
                  </p>

                  {/* Open Opportunities */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-purple-600">
                      {company.openOpportunities} open {company.openOpportunities === 1 ? 'opportunity' : 'opportunities'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/app/company/${company.id}`}
                className="flex items-center gap-2 px-4 py-2 min-h-10 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors text-sm whitespace-nowrap"
              >
                View Company
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCompanies.length === 0 && (
        <div className="text-center py-12 bg-bg-surface rounded-lg border border-border">
          <BuildingOfficeIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-bold text-text-primary mb-2">No companies found</h3>
          <p className="text-text-secondary mb-4">
            Try adjusting your search or filters to find more companies.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedIndustry('All Industries');
              setSelectedLocation('All Locations');
            }}
            className="text-purple-500 hover:text-purple-600 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
