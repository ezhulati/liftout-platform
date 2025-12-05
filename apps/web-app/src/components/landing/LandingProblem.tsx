'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function LandingProblem() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 bg-gray-50"
      aria-labelledby="problem-heading"
    >
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div
          className={`transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h2
            id="problem-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-6"
          >
            Hiring is built for individuals.
            <br />
            <span className="text-gray-400">Great work happens in teams.</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            When you find a better opportunity, you leave your team behind. When you hire someone great, they show up alone. Either way, you&apos;re starting from scratch.
          </p>
          <p className="text-gray-900 text-lg font-medium">
            Liftout is a marketplace where teams move together.
          </p>
        </div>
      </div>
    </section>
  );
}
