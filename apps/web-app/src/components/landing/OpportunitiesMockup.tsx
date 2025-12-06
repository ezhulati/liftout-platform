'use client';

import { BuildingOffice2Icon, MapPinIcon, UsersIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/solid';

// Sample opportunity data for the mockup (what teams see)
// Using fictional companies from target industries: Investment Banking, Law, Consulting, Healthcare, PE
const mockOpportunities = [
  {
    company: 'Meridian Partners',
    logo: 'M',
    logoColor: 'bg-slate-700',
    title: 'Healthcare M&A Team',
    description: 'Lead buy-side mandates in life sciences',
    location: 'New York, NY',
    teamSize: '4-6',
    compensation: '$2.5M-4M',
    skills: ['M&A', 'Healthcare', 'Due Diligence'],
    posted: '2 days ago',
    urgent: true,
  },
  {
    company: 'Ashford & Cole LLP',
    logo: 'AC',
    logoColor: 'bg-amber-700',
    title: 'Corporate Practice Group',
    description: 'Expand PE transaction capabilities',
    location: 'Chicago, IL',
    teamSize: '5-8',
    compensation: '$3M-5M',
    skills: ['Private Equity', 'Fund Formation', 'M&A'],
    posted: '5 days ago',
    urgent: false,
  },
  {
    company: 'Vertex Health Systems',
    logo: 'V',
    logoColor: 'bg-teal-600',
    title: 'Cardiology Department',
    description: 'Build interventional cardiology program',
    location: 'Boston, MA',
    teamSize: '6-10',
    compensation: '$4M-6M',
    skills: ['Interventional', 'Cath Lab', 'Clinical Leadership'],
    posted: '1 week ago',
    urgent: false,
  },
  {
    company: 'Quantum Capital',
    logo: 'QC',
    logoColor: 'bg-indigo-600',
    title: 'Quant Trading Team',
    description: 'Build systematic trading strategies',
    location: 'San Francisco, CA',
    teamSize: '3-5',
    compensation: '$5M-8M',
    skills: ['Python', 'ML', 'Quantitative'],
    posted: '3 days ago',
    urgent: true,
  },
  {
    company: 'Sterling Law Group',
    logo: 'SL',
    logoColor: 'bg-purple-700',
    title: 'IP Litigation Practice',
    description: 'Lead patent disputes for tech clients',
    location: 'Austin, TX',
    teamSize: '4-7',
    compensation: '$2M-3.5M',
    skills: ['IP Law', 'Litigation', 'Tech'],
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
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
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
                  <span className="px-3 py-2 bg-gray-300 text-gray-500 rounded-lg text-sm">Search</span>
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
              <span>Liftout</span>
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
        <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl max-w-[300px] mx-auto relative">
          {/* Phone notch - Dynamic Island style */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-gray-900 rounded-full z-10" />

          {/* Phone screen - proper iPhone 14 Pro aspect ratio (19.5:9) */}
          <div className="bg-white rounded-[2rem] overflow-hidden relative">
            {/* Status bar */}
            <div className="bg-gray-50 px-5 pt-10 pb-2 flex justify-between items-center text-[11px] text-gray-500">
              <span className="font-medium">9:41</span>
              <span className="font-semibold text-gray-700">Liftout</span>
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z"/></svg>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M2 17h20v2H2v-2zm1.15-4.05L4 11.47l.85 1.48 1.3-.75-.85-1.48H7v-1.5H5.3l.85-1.47L4.85 7 4 8.47 3.15 7l-1.3.75.85 1.47H1v1.5h1.7l-.85 1.48 1.3.75zm8.85-5.42l-1.3.75.85 1.47H10v1.5h1.55l-.85 1.47 1.3.75.85-1.47.85 1.47 1.3-.75-.85-1.47H16v-1.5h-1.85l.85-1.47-1.3-.75-.85 1.47-.85-1.47zM19 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                <div className="flex items-center">
                  <div className="w-6 h-2.5 border border-gray-400 rounded-sm flex items-center p-px">
                    <div className="w-4 h-full bg-gray-400 rounded-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* App header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Opportunities</h3>
            </div>

            {/* Search */}
            <div className="px-4 py-2">
              <div className="bg-gray-100 rounded-lg px-3 py-2 text-[11px] text-gray-400 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                Search opportunities...
              </div>
            </div>

            {/* Results */}
            <div className="px-4 py-2">
              <p className="text-[11px] text-gray-500 mb-2">
                <span className="font-semibold text-gray-700">43 opportunities</span> matching your team
              </p>

              <div className="space-y-2">
                {mockOpportunities.slice(0, 5).map((opportunity) => (
                  <OpportunityCardCompact key={opportunity.company} opportunity={opportunity} />
                ))}
              </div>
            </div>

            {/* Home indicator */}
            <div className="flex justify-center py-2">
              <div className="w-32 h-1 bg-gray-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
