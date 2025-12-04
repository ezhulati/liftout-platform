'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const problems = [
  'Companies spend fortunes on personality tests hoping people will gel.',
  'They pay referral bonuses to poach your colleagues one at a time.',
  'You endure a scary, isolating process just to land somewhere that says "we\'re a family."',
  'You\'ve spent years building trust and chemistry—then throw it away to start over.',
];

export function TeamProblem() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 bg-[#0f0f0f]"
      aria-labelledby="team-problem-heading"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h2
          id="team-problem-heading"
          className={`font-heading text-2xl sm:text-3xl font-bold text-white/90 tracking-tight leading-tight mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          The hiring process is broken.
        </h2>

        <ul className="space-y-8">
          {problems.map((problem, index) => (
            <li
              key={index}
              className={`text-white/70 text-xl lg:text-2xl leading-relaxed font-body transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${(index + 1) * 150}ms` }}
            >
              {problem}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
