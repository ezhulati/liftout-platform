'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { UserIcon, UserGroupIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export function LandingFlip() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 bg-bg"
      aria-labelledby="flip-heading"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* The flip question - Practical UI: left-aligned */}
        <h2
          id="flip-heading"
          className={`font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          What changes when you move together?
        </h2>
        <p className={`text-text-secondary text-xl max-w-2xl mb-16 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          The difference between starting over alone and arriving with momentum.
        </p>

        {/* Comparison */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Solo resume */}
          <div
            className={`bg-bg-elevated border border-border rounded-2xl p-8 lg:p-10 transition-all duration-700 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
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
              <li className="flex items-start gap-3">
                <XMarkIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>One person, competing against everyone</span>
              </li>
              <li className="flex items-start gap-3">
                <XMarkIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>Generic skills list, no proof of collaboration</span>
              </li>
              <li className="flex items-start gap-3">
                <XMarkIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>Hope you mesh with strangers</span>
              </li>
              <li className="flex items-start gap-3">
                <XMarkIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>Start from scratch building trust</span>
              </li>
              <li className="flex items-start gap-3">
                <XMarkIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>12 months to peak performance</span>
              </li>
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
              <li className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-[#4C1D95] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>Complementary skills, proven together</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-[#4C1D95] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>Shared accomplishments you can verify</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-[#4C1D95] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>Trust already built over years</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-[#4C1D95] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>Day-one productivity, not day-one awkwardness</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-[#4C1D95] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>Skip forming, storming, norming—start performing</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
