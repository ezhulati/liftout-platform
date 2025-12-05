'use client';

import { BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { DeviceFrame } from './DeviceFrame';
import { PreviewOpportunityCard, previewOpportunities } from './PreviewOpportunityCard';

/**
 * TeamsProductPreview - For-teams page section showing opportunity cards
 * Shows teams what they'll see when browsing opportunities
 */
export function TeamsProductPreview() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 bg-bg overflow-hidden"
      aria-labelledby="teams-preview-heading"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-[#4C1D95] text-base font-semibold uppercase tracking-wider mb-4">
            What you&apos;ll see
          </p>
          <h2
            id="teams-preview-heading"
            className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight leading-tight mb-4"
          >
            Opportunities built for teams
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
            Companies post roles specifically designed for intact teams—not individuals.
          </p>
        </div>

        {/* Device frame with cards - centered */}
        <div className={`max-w-2xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <DeviceFrame>
            {/* App-like header inside device */}
            <div className="bg-bg p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#4C1D95] flex items-center justify-center">
                  <BuildingOffice2Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary text-sm">
                    Team Opportunities
                  </h4>
                  <p className="text-text-tertiary text-xs">
                    24 matching your profile
                  </p>
                </div>
              </div>
            </div>

            {/* Cards list */}
            <div className="p-4 space-y-3 bg-bg">
              {previewOpportunities.map((opp, index) => (
                <div
                  key={opp.title}
                  className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: isVisible ? `${(index + 3) * 100}ms` : '0ms' }}
                >
                  <PreviewOpportunityCard opportunity={opp} />
                </div>
              ))}
            </div>
          </DeviceFrame>
        </div>
      </div>
    </section>
  );
}
