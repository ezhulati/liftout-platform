'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const stats = [
  { value: '46%', label: 'star performance decline after moving firms', source: 'Harvard' },
  { value: '75%', label: 'of employers admit to hiring the wrong person', source: 'SHRM' },
  { value: '$240K', label: 'average cost of a bad hire', source: 'SHRM' },
  { value: '12mo', label: 'for new hires to reach peak productivity', source: 'Gallup' },
];

export function CompanyProblem() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 bg-[#0f0f0f]"
      aria-labelledby="company-problem-heading"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <h2
          id="company-problem-heading"
          className={`font-heading text-2xl sm:text-3xl font-bold text-white/90 tracking-tight leading-tight mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          Even &ldquo;star&rdquo; hires underperform at new firms.
        </h2>

        <p
          className={`text-white/70 text-xl lg:text-2xl leading-relaxed mb-12 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          Harvard research found that when star performers move companies, their performance drops sharply—they depend on relationships and support systems that don&apos;t transfer. You&apos;re not hiring their talent. You&apos;re hiring them minus everything that made them great.
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${(index + 2) * 100}ms` }}
            >
              <div className="font-heading text-3xl lg:text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <p className="text-white/60 text-base leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
