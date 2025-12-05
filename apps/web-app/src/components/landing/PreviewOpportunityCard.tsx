'use client';

import { MapPinIcon, UserGroupIcon, CurrencyDollarIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';

interface PreviewOpportunity {
  title: string;
  company: string;
  location: string;
  teamSize: string;
  compensation: string;
  industry: string;
  type: 'expansion' | 'capability' | 'market_entry' | 'acquisition';
}

interface PreviewOpportunityCardProps {
  opportunity: PreviewOpportunity;
  compact?: boolean;
}

const typeLabels: Record<string, string> = {
  expansion: 'Expansion',
  capability: 'Capability',
  market_entry: 'Market Entry',
  acquisition: 'Acquisition',
};

const typeColors: Record<string, string> = {
  expansion: 'bg-green-50 text-green-700',
  capability: 'bg-purple-50 text-[#4C1D95]',
  market_entry: 'bg-amber-50 text-amber-700',
  acquisition: 'bg-blue-50 text-blue-700',
};

/**
 * PreviewOpportunityCard - Simplified static opportunity card for landing pages
 * Mirrors the app's opportunity card design without interactivity
 */
export function PreviewOpportunityCard({ opportunity, compact = false }: PreviewOpportunityCardProps) {
  return (
    <div className={`bg-bg-surface border border-border rounded-xl ${compact ? 'p-3' : 'p-4'} hover:border-purple-200 transition-colors`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-text-primary ${compact ? 'text-sm' : 'text-base'} leading-tight mb-1`}>
            {opportunity.title}
          </h3>
          <div className={`flex items-center gap-1.5 text-text-secondary ${compact ? 'text-xs' : 'text-sm'}`}>
            <BuildingOffice2Icon className="w-3.5 h-3.5" />
            <span>{opportunity.company}</span>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded-full ${compact ? 'text-[10px]' : 'text-xs'} font-medium ${typeColors[opportunity.type]}`}>
          {typeLabels[opportunity.type]}
        </span>
      </div>

      {/* Meta grid */}
      <div className={`grid grid-cols-2 gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
        <div className="flex items-center gap-1.5 text-text-secondary">
          <MapPinIcon className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{opportunity.location}</span>
        </div>
        <div className="flex items-center gap-1.5 text-text-secondary">
          <UserGroupIcon className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{opportunity.teamSize} people</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2">
          <CurrencyDollarIcon className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
          <span className="font-medium text-green-700">{opportunity.compensation}</span>
        </div>
      </div>

      {/* Industry tag */}
      <div className="mt-2 pt-2 border-t border-border">
        <span className={`px-2 py-0.5 bg-gray-100 text-text-secondary rounded-full ${compact ? 'text-[10px]' : 'text-xs'}`}>
          {opportunity.industry}
        </span>
      </div>
    </div>
  );
}

// Export mock data for use in preview sections
// Using real opportunities from Liftouts.md
export const previewOpportunities: PreviewOpportunity[] = [
  {
    title: 'Quant Fund Expanding Data Science Ranks',
    company: 'Volt Analytics',
    location: 'New York, NY',
    teamSize: '4-6',
    compensation: '$400k-$800k',
    industry: 'Financial Services',
    type: 'expansion',
  },
  {
    title: 'Tech Law Firm Expanding IP Attorney Ranks',
    company: 'Alpha Legal',
    location: 'Palo Alto, CA',
    teamSize: '4-8',
    compensation: '$300k-$500k',
    industry: 'Legal',
    type: 'capability',
  },
  {
    title: 'Voice AI Startup Needs UX Architects',
    company: 'Cerulean Digital',
    location: 'Austin, TX',
    teamSize: '5-8',
    compensation: '$160k-$240k',
    industry: 'Technology',
    type: 'market_entry',
  },
];
