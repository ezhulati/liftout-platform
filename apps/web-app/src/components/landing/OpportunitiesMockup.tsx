'use client';

import { BuildingOffice2Icon, MapPinIcon, UsersIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/solid';

// Sample opportunity data for the mockup (what teams see)
const mockOpportunities = [
  {
    company: 'Stripe',
    logo: 'S',
    logoColor: 'bg-purple-600',
    title: 'Platform Engineering Team',
    description: 'Lead our next-gen payments infrastructure',
    location: 'San Francisco, CA',
    teamSize: '4-6',
    compensation: '$800K-1.2M',
    skills: ['Go', 'Kubernetes', 'PostgreSQL'],
    posted: '2 days ago',
    urgent: true,
  },
  {
    company: 'Anthropic',
    logo: 'A',
    logoColor: 'bg-amber-600',
    title: 'ML Infrastructure Team',
    description: 'Scale training infrastructure for frontier models',
    location: 'San Francisco, CA',
    teamSize: '3-5',
    compensation: '$900K-1.4M',
    skills: ['Python', 'CUDA', 'Distributed Systems'],
    posted: '5 days ago',
    urgent: false,
  },
  {
    company: 'Figma',
    logo: 'F',
    logoColor: 'bg-rose-500',
    title: 'Core Product Team',
    description: 'Build multiplayer collaboration features',
    location: 'Remote US',
    teamSize: '4-5',
    compensation: '$700K-950K',
    skills: ['TypeScript', 'WebGL', 'Rust'],
    posted: '1 week ago',
    urgent: false,
  },
];

// Compact opportunity card for mobile
function OpportunityCardCompact({ opportunity }: { opportunity: typeof mockOpportunities[0] }) {
  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
      <div className="flex items-start gap-3">
        {/* Company logo */}
        <div className={`w-10 h-10 ${opportunity.logoColor} rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
          {opportunity.logo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900 text-sm truncate">{opportunity.company}</h4>
            {opportunity.urgent && (
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-medium rounded">
                Urgent
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 truncate">{opportunity.title}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <UsersIcon className="w-3 h-3" />
          {opportunity.teamSize}
        </span>
        <span className="flex items-center gap-1 truncate">
          <MapPinIcon className="w-3 h-3" />
          {opportunity.location}
        </span>
      </div>
    </div>
  );
}

// Full opportunity card for desktop
function OpportunityCardFull({ opportunity }: { opportunity: typeof mockOpportunities[0] }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-pointer">
      <div className="flex items-start gap-4">
        {/* Company logo */}
        <div className={`w-12 h-12 ${opportunity.logoColor} rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
          {opportunity.logo}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 text-base">{opportunity.company}</h4>
              {opportunity.urgent && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                  Urgent hire
                </span>
              )}
            </div>
            <span className="text-sm text-green-600 font-semibold whitespace-nowrap">
              {opportunity.compensation}
            </span>
          </div>

          <p className="text-sm text-gray-800 font-medium mt-0.5">{opportunity.title}</p>
          <p className="text-sm text-gray-500 mt-0.5">{opportunity.description}</p>

          <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <UsersIcon className="w-4 h-4" />
              {opportunity.teamSize} people
            </span>
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4" />
              {opportunity.location}
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4" />
              {opportunity.posted}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {opportunity.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OpportunitiesMockup() {
  return (
    <div className="relative">
      {/* Desktop mockup - shown on lg screens */}
      <div className="hidden lg:block">
        <div className="bg-gray-100 rounded-2xl p-1.5 shadow-2xl border border-gray-200">
          {/* Browser chrome */}
          <div className="bg-gray-200 rounded-t-xl px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-500 max-w-xs mx-auto text-center">
                liftout.com/opportunities
              </div>
            </div>
          </div>

          {/* App content */}
          <div className="bg-white rounded-b-xl overflow-hidden">
            {/* Search/filter bar */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-400">
                  Search by company, role, or skills...
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600">Filters</span>
                  <span className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm">Search</span>
                </div>
              </div>
            </div>

            {/* Results header */}
            <div className="px-6 py-3 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">43 opportunities</span> for teams
              </p>
              <span className="text-sm text-gray-500">Sort: Newest first</span>
            </div>

            {/* Opportunity cards */}
            <div className="px-6 pb-6 space-y-3">
              {mockOpportunities.map((opportunity) => (
                <OpportunityCardFull key={opportunity.company} opportunity={opportunity} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tablet mockup - shown on md screens */}
      <div className="hidden md:block lg:hidden">
        <div className="bg-gray-800 rounded-3xl p-2 shadow-2xl max-w-md mx-auto">
          {/* Tablet bezel */}
          <div className="bg-white rounded-2xl overflow-hidden">
            {/* Status bar */}
            <div className="bg-gray-100 px-4 py-1 flex justify-between items-center text-xs text-gray-500">
              <span>9:41</span>
              <span>liftout.com/opportunities</span>
              <span>100%</span>
            </div>

            {/* Search */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-400">
                Search opportunities...
              </div>
            </div>

            {/* Results */}
            <div className="px-4 py-2">
              <p className="text-xs text-gray-600 mb-3">
                <span className="font-semibold">43 opportunities</span> for teams
              </p>
              <div className="space-y-2">
                {mockOpportunities.map((opportunity) => (
                  <OpportunityCardCompact key={opportunity.company} opportunity={opportunity} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile mockup - shown on small screens */}
      <div className="block md:hidden">
        <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl max-w-[280px] mx-auto">
          {/* Phone notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-full z-10" />

          {/* Phone screen */}
          <div className="bg-white rounded-[2rem] overflow-hidden relative">
            {/* Status bar */}
            <div className="bg-gray-100 px-6 pt-8 pb-2 flex justify-between items-center text-xs text-gray-500">
              <span>9:41</span>
              <span className="font-medium">Liftout</span>
              <span>●●●</span>
            </div>

            {/* Content */}
            <div className="px-4 pb-6">
              {/* Search */}
              <div className="bg-gray-100 rounded-full px-4 py-2 text-xs text-gray-400 mb-4">
                Search opportunities...
              </div>

              {/* Results */}
              <p className="text-xs text-gray-600 mb-3">
                <span className="font-semibold">43 opportunities</span> for your team
              </p>

              <div className="space-y-2">
                {mockOpportunities.slice(0, 2).map((opportunity) => (
                  <OpportunityCardCompact key={opportunity.company} opportunity={opportunity} />
                ))}
              </div>
            </div>

            {/* Home indicator */}
            <div className="flex justify-center pb-2">
              <div className="w-24 h-1 bg-gray-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
