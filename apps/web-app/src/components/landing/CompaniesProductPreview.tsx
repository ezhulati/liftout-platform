'use client';

import { UserGroupIcon, MapPinIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Preview team data
const previewTeams = [
  {
    name: 'TechFlow Data Science',
    industry: 'Financial Services',
    location: 'San Francisco, CA',
    size: '4 members',
    yearsWorking: '3.5',
    cohesionScore: 94,
    description: 'Elite data science team specializing in fintech analytics and machine learning.',
    skills: ['Machine Learning', 'Python', 'Financial Modeling', 'SQL'],
    verified: true,
  },
  {
    name: 'HealthTech AI Research',
    industry: 'Healthcare',
    location: 'Boston, MA',
    size: '5 members',
    yearsWorking: '4',
    cohesionScore: 91,
    description: 'Medical imaging specialists with FDA compliance expertise.',
    skills: ['Medical Imaging', 'Deep Learning', 'FDA Compliance'],
    verified: true,
  },
  {
    name: 'Enterprise Platform Team',
    industry: 'Enterprise Software',
    location: 'Austin, TX',
    size: '6 members',
    yearsWorking: '5',
    cohesionScore: 97,
    description: 'Infrastructure team building scalable distributed systems.',
    skills: ['Kubernetes', 'Go', 'Distributed Systems'],
    verified: true,
  },
];

/**
 * CompaniesProductPreview - For-companies page section showing team cards
 * Clean light browser mockup matching the main landing page style
 */
export function CompaniesProductPreview() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 bg-white overflow-hidden"
      aria-labelledby="companies-preview-heading"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header - Practical UI: left-aligned */}
        <div className={`max-w-2xl mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-[#4C1D95] text-base font-semibold uppercase tracking-wider mb-3">
            What you&apos;ll find
          </p>
          <h2
            id="companies-preview-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-4"
          >
            Teams with proven track records
          </h2>
          <p className="text-gray-600 text-lg">
            Browse verified teams with documented chemistry, skills, and achievements.
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
                  Liftout
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
                    <UserGroupIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base">
                      Browse Teams
                    </h4>
                    <p className="text-gray-500 text-sm">
                      156 verified teams
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1.5 bg-white rounded-lg text-gray-600 text-sm border border-gray-200">Filter</div>
                  <div className="px-3 py-1.5 bg-white rounded-lg text-gray-600 text-sm border border-gray-200">Sort</div>
                </div>
              </div>

              {/* Team cards */}
              <div className="space-y-4">
                {previewTeams.map((team, index) => (
                  <div
                    key={team.name}
                    className={`bg-white rounded-xl p-5 border border-gray-200 hover:border-[#4C1D95]/50 hover:shadow-sm transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: isVisible ? `${(index + 3) * 100}ms` : '0ms' }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Team icon */}
                      <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <UserGroupIcon className="w-6 h-6 text-[#4C1D95]" />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Header with name and badges */}
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <h5 className="font-bold text-gray-900 text-base">{team.name}</h5>
                          {team.verified && (
                            <CheckBadgeIcon className="w-5 h-5 text-[#4C1D95]" />
                          )}
                          <span className="px-2 py-0.5 bg-purple-50 text-[#4C1D95] text-xs font-medium rounded-full">
                            {team.industry}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-3 line-clamp-1">{team.description}</p>

                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <MapPinIcon className="w-4 h-4" />
                            {team.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <UserGroupIcon className="w-4 h-4" />
                            {team.size}
                          </span>
                          <span className="text-amber-600 font-medium">★ {team.cohesionScore}% cohesion</span>
                          <span>{team.yearsWorking}y together</span>
                        </div>

                        {/* Skills badges */}
                        <div className="flex flex-wrap gap-2">
                          {team.skills.map((skill) => (
                            <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
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
