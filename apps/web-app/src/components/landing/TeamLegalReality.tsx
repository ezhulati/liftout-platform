'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ScaleIcon } from '@heroicons/react/24/outline';

const facts = [
  'FTC proposed a federal ban on non-competes in 2024',
  'California, Minnesota, North Dakota, and Oklahoma already ban them',
  'Even where enforceable, team moves have well-established legal pathways',
];

export function TeamLegalReality() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 bg-bg"
      aria-labelledby="team-legal-heading"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="flex items-start gap-4 mb-8">
          <div
            className={`w-12 h-12 rounded-xl bg-[#4C1D95] flex items-center justify-center flex-shrink-0 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
          >
            <ScaleIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2
              id="team-legal-heading"
              className={`font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight leading-tight transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              Non-competes are dying. This is the future.
            </h2>
          </div>
        </div>

        <ul className="space-y-4 mb-10">
          {facts.map((fact, index) => (
            <li
              key={index}
              className={`font-body text-lg text-text-secondary leading-relaxed pl-4 border-l-2 border-[#4C1D95]/30 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              {fact}
            </li>
          ))}
        </ul>

        <p
          className={`font-body text-xl text-text-primary leading-relaxed font-medium transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          The artificial barriers are falling. The question isn&apos;t <em className="not-italic">if</em> team hiring becomes normal—it&apos;s <em className="not-italic">when</em>. And it&apos;s happening now.
        </p>
      </div>
    </section>
  );
}
