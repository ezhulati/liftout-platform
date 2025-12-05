'use client';

import { useState } from 'react';
import { UserGroupIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { DeviceFrame } from './DeviceFrame';
import { PreviewTeamCard, previewTeams } from './PreviewTeamCard';
import { PreviewOpportunityCard, previewOpportunities } from './PreviewOpportunityCard';

type TabId = 'teams' | 'companies';

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'teams', label: 'For Teams', icon: UserGroupIcon },
  { id: 'companies', label: 'For Companies', icon: BuildingOffice2Icon },
];

/**
 * ProductPreview - Homepage section showing actual product UI
 * Tabbed interface for teams (opportunities) and companies (team discovery)
 */
export function ProductPreview() {
  const [activeTab, setActiveTab] = useState<TabId>('teams');
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 lg:py-32 bg-bg-elevated overflow-hidden"
      aria-labelledby="preview-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Text content */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-[#4C1D95] text-base font-semibold uppercase tracking-wider mb-4">
              See it in action
            </p>
            <h2
              id="preview-heading"
              className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4"
            >
              A glimpse inside the platform
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-8">
              Real opportunities. Real teams. Real chemistry.
            </p>

            {/* Tabs */}
            <div className="mb-8">
              <div
                role="tablist"
                className="inline-flex bg-bg-surface rounded-lg p-1 gap-1 border border-border"
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
                        flex items-center gap-2 px-4 py-2.5 rounded-md min-h-10
                        font-medium text-sm transition-all duration-200
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-900 focus-visible:ring-offset-2
                        ${isActive
                          ? 'bg-[#4C1D95] text-white shadow-sm'
                          : 'text-text-tertiary hover:text-text-primary hover:bg-bg-elevated'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab content description */}
            <div className="space-y-4">
              {activeTab === 'teams' ? (
                <>
                  <h3 className="font-semibold text-text-primary text-lg">
                    Browse opportunities designed for teams
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    Companies post roles specifically for intact teams—not individuals.
                    Filter by industry, compensation, team size, and find the right fit together.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-text-primary text-lg">
                    Discover pre-built teams ready to move
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    Browse verified teams with documented chemistry, complementary skills,
                    and proven track records. Skip the team-building phase entirely.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Right - Device frame with cards */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <DeviceFrame>
              {/* App-like header inside device */}
              <div className="bg-bg p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#4C1D95] flex items-center justify-center">
                    {activeTab === 'teams' ? (
                      <BuildingOffice2Icon className="w-4 h-4 text-white" />
                    ) : (
                      <UserGroupIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary text-sm">
                      {activeTab === 'teams' ? 'Opportunities' : 'Browse Teams'}
                    </h4>
                    <p className="text-text-tertiary text-xs">
                      {activeTab === 'teams' ? '24 matching your profile' : '156 verified teams'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cards list */}
              <div className="p-4 space-y-3 bg-bg min-h-[320px] lg:min-h-[380px]">
                {activeTab === 'teams' ? (
                  previewOpportunities.map((opp, index) => (
                    <div
                      key={opp.title}
                      className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                      style={{ transitionDelay: isVisible ? `${(index + 3) * 100}ms` : '0ms' }}
                    >
                      <PreviewOpportunityCard opportunity={opp} compact />
                    </div>
                  ))
                ) : (
                  previewTeams.map((team, index) => (
                    <div
                      key={team.name}
                      className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                      style={{ transitionDelay: isVisible ? `${(index + 3) * 100}ms` : '0ms' }}
                    >
                      <PreviewTeamCard team={team} compact />
                    </div>
                  ))
                )}
              </div>
            </DeviceFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
