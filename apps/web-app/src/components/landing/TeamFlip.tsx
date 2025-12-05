'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { UserIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export function TeamFlip() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 bg-bg"
      aria-labelledby="team-flip-heading"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* The flip question - Practical UI: left-aligned */}
        <h2
          id="team-flip-heading"
          className={`font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          What if you could take the chemistry with you?
        </h2>

        {/* Comparison */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Solo resume */}
          <div
            className={`bg-bg-alt border border-border rounded-2xl p-8 lg:p-10 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-gray-500" />
              </div>
              <h3 className="font-heading text-xl font-bold text-text-tertiary">
                Solo resume
              </h3>
            </div>
            <ul className="space-y-4 text-text-tertiary text-lg">
              <li>One person</li>
              <li>Generic skills list</li>
              <li>Competing against everyone</li>
              <li>Start from scratch, again</li>
              <li>Hope you mesh with strangers</li>
            </ul>
          </div>

          {/* Team profile */}
          <div
            className={`bg-[#4C1D95]/5 border-2 border-[#4C1D95]/30 rounded-2xl p-8 lg:p-10 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#4C1D95] flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#4C1D95]">
                Team profile
              </h3>
            </div>
            <ul className="space-y-4 text-text-primary text-lg font-medium">
              <li>Complementary skills</li>
              <li>Shared accomplishments</li>
              <li>Proven collaboration</li>
              <li>Day-one productivity</li>
              <li>Trust already built</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
