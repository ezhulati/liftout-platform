'use client';

import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ArrowRightIcon, SparklesIcon, ScaleIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

const recentExamples = [
  {
    company: 'Microsoft',
    target: 'Inflection AI',
    deal: '$650M',
    Icon: ComputerDesktopIcon,
  },
  {
    company: 'Google',
    target: 'Character.AI',
    deal: '$2.7B',
    Icon: SparklesIcon,
  },
  {
    company: 'Polsinelli',
    target: 'Holland & Knight',
    deal: '47 lawyers',
    Icon: ScaleIcon,
  },
];

export function LandingExplainer() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 bg-bg"
      aria-labelledby="explainer-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Definition */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-[#4C1D95] text-base font-semibold uppercase tracking-wider mb-4">
              That&apos;s why liftouts exist
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
            <p className="text-text-secondary text-lg leading-relaxed mb-8">
              It&apos;s been happening in law firms, investment banks, and consulting for decades. In 2024, it went mainstream in tech.
            </p>
            <Link
              href="/what-is-a-liftout"
              className="inline-flex items-center gap-2 text-[#4C1D95] font-semibold text-lg hover:underline underline-offset-4 group"
            >
              Read the full guide
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right - 2024 Examples */}
          <div className={`transition-all duration-700 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-text-tertiary text-base font-semibold uppercase tracking-wider mb-6">
              2024 Examples
            </p>
            <div className="space-y-4">
              {recentExamples.map((example, index) => (
                <div
                  key={example.company}
                  className={`bg-bg-surface rounded-xl p-5 border border-border flex items-center gap-4 transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                  style={{ transitionDelay: isVisible ? `${200 + index * 100}ms` : '0ms' }}
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <example.Icon className="w-6 h-6 text-[#4C1D95]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary text-lg">
                      {example.company} <span className="text-text-tertiary font-normal">&larr;</span> {example.target}
                    </p>
                  </div>
                  <div className="text-[#4C1D95] font-bold text-lg flex-shrink-0">
                    {example.deal}
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
