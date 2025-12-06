'use client';

import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ArrowRightIcon, ScaleIcon, BriefcaseIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

// 2025 examples with sources
// Crowell: https://www.law.com/americanlawyer/2025/08/06/crowell-hires-more-than-40-health-care-lawyers-from-reed-smith/
// Mayer Brown: https://www.edwardsgibson.com/partner-moves (Issue 89)
// Group laterals trend: https://www.legal.io/articles/5508483/Group-Lateral-Hires-The-Goldilocks-Solution-for-Law-Firm-Growth
const recentExamples = [
  {
    company: 'Crowell & Moring',
    target: 'Reed Smith',
    deal: '40+ lawyers',
    detail: 'Healthcare team incl. 16 partners',
    Icon: ScaleIcon,
  },
  {
    company: 'Mayer Brown',
    target: 'Dechert',
    deal: '3 partners',
    detail: 'Private capital team, London',
    Icon: BriefcaseIcon,
  },
  {
    company: 'Various Am Law 100',
    target: 'Competitors',
    deal: '30+ groups',
    detail: 'Group laterals up 14% in 2024',
    Icon: BuildingOfficeIcon,
  },
];

export function LandingExplainer() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 lg:py-32 bg-bg"
      aria-labelledby="explainer-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Definition */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-[#4C1D95] text-base font-semibold uppercase tracking-wider mb-4">
              The concept
            </p>
            <h2
              id="explainer-heading"
              className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-6"
            >
              What is a liftout?
            </h2>
            <p className="text-text-secondary text-xl leading-relaxed mb-6">
              A <strong className="text-text-primary">liftout</strong> is hiring an entire high-performing team from another company&mdash;not just individuals who used to work together, but the whole team with their trust, chemistry, and track record intact.
            </p>
            <p className="text-text-secondary text-lg leading-relaxed mb-4">
              It&apos;s been happening in law firms, investment banks, and consulting for decades. In 2024, it went mainstream in tech.
            </p>
            <p className="text-text-secondary text-lg leading-relaxed mb-8 italic border-l-2 border-[#4C1D95]/30 pl-4">
              Research shows stars who move alone see immediate performance decline. Teams who move together maintain their success.
            </p>
            <Link
              href="/what-is-a-liftout"
              className="inline-flex items-center gap-2 text-[#4C1D95] font-semibold text-lg hover:underline underline-offset-4 group"
            >
              Read the full guide
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right - 2025 Examples */}
          <div className={`transition-all duration-700 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-text-tertiary text-base font-semibold uppercase tracking-wider mb-6">
              2025 Examples
            </p>
            <div className="space-y-4">
              {recentExamples.map((example, index) => (
                <div
                  key={example.company}
                  className={`bg-bg-surface rounded-xl p-5 border border-border transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                  style={{ transitionDelay: isVisible ? `${200 + index * 100}ms` : '0ms' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <example.Icon className="w-5 h-5 text-[#4C1D95]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-primary">
                        {example.company} <span className="text-text-tertiary font-normal">&larr;</span> {example.target}
                      </p>
                      <p className="text-text-secondary text-sm">{example.detail}</p>
                    </div>
                    <div className="text-[#4C1D95] font-bold text-base flex-shrink-0">
                      {example.deal}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
