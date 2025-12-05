'use client';

import { useState } from 'react';
import { UserGroupIcon, BuildingOffice2Icon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

type TabId = 'teams' | 'companies';

const tabs: { id: TabId; label: string; description: string; icon: React.ElementType }[] = [
  {
    id: 'teams',
    label: 'For Teams',
    description: 'Browse opportunities designed for intact teams—filter by industry, compensation, and team size.',
    icon: UserGroupIcon
  },
  {
    id: 'companies',
    label: 'For Companies',
    description: 'Discover verified teams with proven chemistry and complementary skills, ready to move together.',
    icon: BuildingOffice2Icon
  },
];

// Simplified preview data - embedded for dark theme styling
const previewOpportunities = [
  {
    title: 'Strategic FinTech Analytics Team',
    company: 'Goldman Sachs',
    location: 'New York, NY',
    teamSize: '3-5',
    compensation: '$180k-$250k',
    type: 'Expansion',
  },
  {
    title: 'Healthcare AI Research Team',
    company: 'MedTech Innovations',
    location: 'Boston, MA',
    teamSize: '4-6',
    compensation: '$200k-$300k',
    type: 'Capability',
  },
  {
    title: 'DevOps & Platform Team',
    company: 'Scale Labs',
    location: 'San Francisco, CA',
    teamSize: '3-5',
    compensation: '$170k-$230k',
    type: 'Expansion',
  },
];

const previewTeams = [
  {
    name: 'Apex Data Engineering',
    specialty: 'Data Infrastructure',
    location: 'Austin, TX',
    size: '4 members',
    status: 'Actively Looking',
  },
  {
    name: 'Nexus Product Team',
    specialty: 'B2B SaaS',
    location: 'Seattle, WA',
    size: '5 members',
    status: 'Open to Opportunities',
  },
  {
    name: 'Quantum ML Research',
    specialty: 'Machine Learning',
    location: 'Remote',
    size: '3 members',
    status: 'Actively Looking',
  },
];

/**
 * ProductPreview - Homepage section showing actual product UI
 * Centered layout with prominent tabs and clean dark-themed mockup
 */
export function ProductPreview() {
  const [activeTab, setActiveTab] = useState<TabId>('teams');
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 bg-white overflow-hidden"
      aria-labelledby="preview-heading"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header - Practical UI: left-aligned */}
        <div className={`max-w-2xl mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-[#4C1D95] text-base font-semibold uppercase tracking-wider mb-3">
            See it in action
          </p>
          <h2
            id="preview-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-4"
          >
            A glimpse inside the platform
          </h2>
          <p className="text-gray-600 text-lg">
            Real opportunities. Real teams. Real chemistry.
          </p>
        </div>

        {/* Tabs - Practical UI: left-aligned */}
        <div className={`mb-8 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div
            role="tablist"
            className="inline-flex bg-gray-100 rounded-xl p-1.5 gap-1"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2.5 px-6 py-3 rounded-lg min-h-12
                    font-semibold text-base transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-2
                    ${isActive
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab description - Practical UI: left-aligned */}
        <p className={`text-gray-600 max-w-xl mb-10 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {tabs.find(t => t.id === activeTab)?.description}
        </p>

        {/* Browser mockup with dark UI */}
        <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-[#1a1a1a] rounded-xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
            {/* Browser chrome */}
            <div className="bg-[#2a2a2a] px-4 py-3 flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-[#1a1a1a] rounded-md px-4 py-1.5 text-gray-400 text-sm flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  liftout.com/app/{activeTab === 'teams' ? 'opportunities' : 'teams'}
                </div>
              </div>
              <div className="w-16" /> {/* Spacer for symmetry */}
            </div>

            {/* App content - dark theme */}
            <div className="bg-[#111111] p-6">
              {/* App header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#4C1D95] flex items-center justify-center">
                    {activeTab === 'teams' ? (
                      <BuildingOffice2Icon className="w-5 h-5 text-white" />
                    ) : (
                      <UserGroupIcon className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-base">
                      {activeTab === 'teams' ? 'Opportunities' : 'Browse Teams'}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {activeTab === 'teams' ? '24 matching your profile' : '156 verified teams'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1.5 bg-[#1a1a1a] rounded-lg text-gray-400 text-sm">Filter</div>
                  <div className="px-3 py-1.5 bg-[#1a1a1a] rounded-lg text-gray-400 text-sm">Sort</div>
                </div>
              </div>

              {/* Cards grid */}
              <div className="space-y-4">
                {activeTab === 'teams' ? (
                  previewOpportunities.map((opp, index) => (
                    <div
                      key={opp.title}
                      className={`bg-[#1a1a1a] rounded-xl p-5 border border-[#2a2a2a] hover:border-[#4C1D95]/50 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                      style={{ transitionDelay: isVisible ? `${(index + 3) * 100}ms` : '0ms' }}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h5 className="font-semibold text-white text-base mb-1">{opp.title}</h5>
                          <p className="text-gray-400 text-sm flex items-center gap-1.5">
                            <BuildingOffice2Icon className="w-4 h-4" />
                            {opp.company}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 bg-[#4C1D95]/20 text-[#a78bfa] text-xs font-medium rounded-full whitespace-nowrap">
                          {opp.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-gray-400 flex items-center gap-1.5">
                          <MapPinIcon className="w-4 h-4" />
                          {opp.location}
                        </span>
                        <span className="text-gray-400 flex items-center gap-1.5">
                          <UserGroupIcon className="w-4 h-4" />
                          {opp.teamSize} people
                        </span>
                        <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                          <CurrencyDollarIcon className="w-4 h-4" />
                          {opp.compensation}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  previewTeams.map((team, index) => (
                    <div
                      key={team.name}
                      className={`bg-[#1a1a1a] rounded-xl p-5 border border-[#2a2a2a] hover:border-[#4C1D95]/50 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                      style={{ transitionDelay: isVisible ? `${(index + 3) * 100}ms` : '0ms' }}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h5 className="font-semibold text-white text-base mb-1">{team.name}</h5>
                          <p className="text-gray-400 text-sm">{team.specialty}</p>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                          team.status === 'Actively Looking'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {team.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <MapPinIcon className="w-4 h-4" />
                          {team.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <UserGroupIcon className="w-4 h-4" />
                          {team.size}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
