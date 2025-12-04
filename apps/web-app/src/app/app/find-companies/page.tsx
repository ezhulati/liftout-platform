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

// Mock company data for team users to browse (IDs match API demo data)
const mockCompanies = [
  {
    id: 'company-demo-1',
    name: 'NextGen Financial',
    industry: 'Financial Services',
    location: 'New York, NY',
    size: '1000+',
    description: 'NextGen Financial is a leading financial services company at the forefront of innovation. We leverage cutting-edge technology and data analytics to provide superior investment solutions.',
    openOpportunities: 1,
    logo: null,
    verified: true,
  },
  {
    id: 'company-demo-2',
    name: 'MedTech Innovations',
    industry: 'Healthcare Technology',
    location: 'Boston, MA',
    size: '500-1000',
    description: 'Pioneering AI-powered healthcare solutions. Seeking teams with expertise in machine learning and medical imaging to accelerate our R&D initiatives.',
    openOpportunities: 1,
    logo: null,
    verified: true,
  },
  {
    id: 'company-demo-3',
    name: 'CloudScale Systems',
    industry: 'Technology',
    location: 'San Francisco, CA',
    size: '200-500',
    description: 'Fast-growing cloud infrastructure company backed by top-tier VCs. We build next-generation platform solutions that power modern applications at scale.',
    openOpportunities: 1,
    logo: null,
    verified: false,
  },
  {
    id: 'techcorp-demo',
    name: 'TechCorp Industries',
    industry: 'Technology',
    location: 'Seattle, WA',
    size: '1000+',
    description: 'Fortune 500 technology conglomerate focused on enterprise software solutions. We partner with leading companies worldwide to drive digital transformation.',
    openOpportunities: 2,
    logo: null,
    verified: true,
  },
  {
    id: 'healthstart-demo',
    name: 'HealthStart Inc',
    industry: 'Healthcare Technology',
    location: 'Austin, TX',
    size: '50-100',
    description: 'Emerging healthtech startup on a mission to democratize access to quality healthcare through innovative technology solutions.',
    openOpportunities: 1,
    logo: null,
    verified: true,
  },
];

const industries = [
  'All Industries',
  'Financial Services',
  'Healthcare Technology',
  'Technology',
];

const locations = [
  'All Locations',
  'New York, NY',
  'San Francisco, CA',
  'Boston, MA',
  'Seattle, WA',
  'Austin, TX',
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
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies..."
              className="input-field pl-10"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex gap-3">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="input-field"
            >
              {industries.map((industry) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="input-field"
            >
              {locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-outline min-h-12 min-w-12 flex items-center justify-center"
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
            className="card hover:shadow-md hover:border-purple-300 transition-all duration-base"
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
                    <h3 className="text-base font-bold text-text-primary">{company.name}</h3>
                    {company.verified && (
                      <span className="badge badge-success text-xs">Verified</span>
                    )}
                  </div>

                  {/* Industry Tag */}
                  <span className="badge badge-primary text-xs mb-2">
                    {company.industry}
                  </span>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-text-tertiary mb-3">
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
                  <p className="text-text-secondary text-sm line-clamp-2 mb-4 leading-relaxed">
                    {company.description}
                  </p>

                  {/* Open Opportunities */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-purple-600">
                      {company.openOpportunities} open {company.openOpportunities === 1 ? 'opportunity' : 'opportunities'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/app/company/${company.id}`}
                className="btn-primary min-h-12 whitespace-nowrap"
              >
                View Company
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCompanies.length === 0 && (
        <div className="card text-center py-12">
          <div className="w-14 h-14 mx-auto rounded-full bg-bg-elevated flex items-center justify-center mb-4">
            <BuildingOfficeIcon className="h-7 w-7 text-text-tertiary" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">No companies found</h3>
          <p className="text-base text-text-secondary mb-4 leading-relaxed max-w-md mx-auto">
            Try adjusting your search or filters to find more companies.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedIndustry('All Industries');
              setSelectedLocation('All Locations');
            }}
            className="text-purple-600 hover:text-purple-700 font-bold transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
