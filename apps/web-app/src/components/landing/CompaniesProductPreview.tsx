'use client';

import { UserGroupIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { DeviceFrame } from './DeviceFrame';
import { PreviewTeamCard, previewTeams } from './PreviewTeamCard';

/**
 * CompaniesProductPreview - For-companies page section showing team cards
 * Shows companies what they'll see when browsing verified teams
 */
export function CompaniesProductPreview() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 bg-bg overflow-hidden"
      aria-labelledby="companies-preview-heading"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header - Practical UI: left-aligned */}
        <div className={`mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-[#4C1D95] text-base font-semibold uppercase tracking-wider mb-4">
            What you&apos;ll find
          </p>
          <h2
            id="companies-preview-heading"
            className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight leading-tight mb-4"
          >
            Teams with proven track records
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed max-w-2xl">
            Browse verified teams with documented chemistry, skills, and achievements.
          </p>
        </div>

        {/* Device frame with cards - centered */}
        <div className={`max-w-2xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <DeviceFrame>
            {/* App-like header inside device */}
            <div className="bg-bg p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#4C1D95] flex items-center justify-center">
                  <UserGroupIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary text-sm">
                    Browse Teams
                  </h4>
                  <p className="text-text-tertiary text-xs">
                    156 verified teams
                  </p>
                </div>
              </div>
            </div>

            {/* Cards list */}
            <div className="p-4 space-y-3 bg-bg">
              {previewTeams.map((team, index) => (
                <div
                  key={team.name}
                  className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: isVisible ? `${(index + 3) * 100}ms` : '0ms' }}
                >
                  <PreviewTeamCard team={team} />
                </div>
              ))}
            </div>
          </DeviceFrame>
        </div>
      </div>
    </section>
  );
}
