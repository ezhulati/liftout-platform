'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const problems = [
  'Harvard research shows star performers decline 46% when they move alone—they leave behind the relationships that made them great.',
  'Companies spend fortunes on personality tests hoping people will gel. You already have chemistry.',
  'You endure a scary, isolating job search just to start over with strangers at "we\'re a family" companies.',
  'You\'ve spent years building trust—why throw it away when you could bring it with you?',
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
          Job searching alone means starting over.
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
