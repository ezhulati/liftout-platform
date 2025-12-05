'use client';

import { BuildingOffice2Icon, MapPinIcon, UserGroupIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Preview opportunity data
const previewOpportunities = [
  {
    title: 'Quant Fund Expanding Data Science Ranks',
    company: 'Volt Analytics',
    location: 'New York, NY',
    teamSize: '4-6 members',
    compensation: '$400k-$800k',
    timeline: 'Q1 2025',
    description: 'Physics PhDs and data scientists to uncover signals within noisy equities data.',
    requirements: ['Statistical Learning', 'HPC', 'Financial Engineering'],
    status: 'active',
    urgent: true,
  },
  {
    title: 'Tech Law Firm Expanding IP Attorney Ranks',
    company: 'Alpha Legal',
    location: 'Palo Alto, CA',
    teamSize: '4-8 members',
    compensation: '$300k-$500k',
    timeline: 'Immediate',
    description: 'Patent attorneys to counsel deep tech startups facing growth-phase litigation.',
    requirements: ['Prior Art', 'Patent Drafting', 'AI/ML Expertise'],
    status: 'active',
    urgent: false,
  },
  {
    title: 'Voice AI Startup Needs UX Architects',
    company: 'Cerulean Digital',
    location: 'Austin, TX',
    teamSize: '5-8 members',
    compensation: '$160k-$240k',
    timeline: 'Q2 2025',
    description: 'Design team to build next-generation conversational interfaces.',
    requirements: ['UX Research', 'Voice UI', 'Prototyping'],
    status: 'active',
    urgent: false,
  },
];

/**
 * TeamsProductPreview - For-teams page section showing opportunity cards
 * Clean light browser mockup matching the main landing page style
 */
export function TeamsProductPreview() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 bg-white overflow-hidden"
      aria-labelledby="teams-preview-heading"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header - Practical UI: left-aligned */}
        <div className={`max-w-2xl mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-[#4C1D95] text-base font-semibold uppercase tracking-wider mb-3">
            What you&apos;ll see
          </p>
          <h2
            id="teams-preview-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-4"
          >
            Opportunities built for teams
          </h2>
          <p className="text-gray-600 text-lg">
            Companies post roles specifically designed for intact teams—not individuals.
          </p>
        </div>

        {/* Browser mockup with light UI */}
        <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl border border-gray-200">
            {/* Browser chrome */}
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-3 border-b border-gray-200">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white rounded-md px-4 py-1.5 text-gray-500 text-sm flex items-center gap-2 border border-gray-200">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  liftout.com/app/opportunities
                </div>
              </div>
              <div className="w-16" />
            </div>

            {/* App content - light theme */}
            <div className="bg-gray-50 p-6">
              {/* App header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#4C1D95] flex items-center justify-center">
                    <BuildingOffice2Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base">
                      Team Opportunities
                    </h4>
                    <p className="text-gray-500 text-sm">
                      24 matching your profile
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1.5 bg-white rounded-lg text-gray-600 text-sm border border-gray-200">Filter</div>
                  <div className="px-3 py-1.5 bg-white rounded-lg text-gray-600 text-sm border border-gray-200">Sort</div>
                </div>
              </div>

              {/* Opportunity cards */}
              <div className="space-y-4">
                {previewOpportunities.map((opp, index) => (
                  <div
                    key={opp.title}
                    className={`bg-white rounded-xl p-5 border border-gray-200 hover:border-[#4C1D95]/50 hover:shadow-sm transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: isVisible ? `${(index + 3) * 100}ms` : '0ms' }}
                  >
                    {/* Header with title and badges */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center flex-wrap gap-2">
                        <h5 className="font-bold text-gray-900 text-base">{opp.title}</h5>
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                          {opp.status}
                        </span>
                        {opp.urgent && (
                          <span className="px-2 py-0.5 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                            Urgent
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Company + location + time */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                      <span className="text-gray-700">{opp.company}</span>
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        {opp.location}
                      </span>
                      <span>{opp.timeline}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-1">{opp.description}</p>

                    {/* Info grid */}
                    <div className="flex flex-wrap gap-4 text-sm mb-4">
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <CurrencyDollarIcon className="w-4 h-4" />
                        {opp.compensation}
                      </span>
                      <span className="text-gray-500 flex items-center gap-1">
                        <UserGroupIcon className="w-4 h-4" />
                        {opp.teamSize}
                      </span>
                    </div>

                    {/* Requirements badges */}
                    <div className="flex flex-wrap gap-2">
                      {opp.requirements.map((req) => (
                        <span key={req} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
