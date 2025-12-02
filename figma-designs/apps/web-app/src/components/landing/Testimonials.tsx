'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const testimonials = [
  {
    quote: "We'd won awards but couldn't get budget for anything bold. Three weeks on Liftout, we found a startup that wanted us to lead their rebrand. Same team, ten times the creative freedom.",
    name: "Zoe Alban",
    title: "Brand Manager",
    company: "4-person creative team",
  },
  {
    quote: "Our whole backend was legacy code and management wouldn't modernize. We moved together to a Series B that let us rebuild their stack from scratch. Best decision we ever made.",
    name: "Russel Thornton",
    title: "UX Director",
    company: "6-person engineering team",
  },
  {
    quote: "Leadership kept overriding our roadmap. Now we run product for a company that actually ships what we build. Went from frustrated to energized overnight - and we didn't lose a single teammate.",
    name: "Mae Bradley",
    title: "Product Lead",
    company: "5-person product team",
  },
];

export function Testimonials() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 lg:py-32 bg-bg-elevated"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className={`max-w-2xl mb-16 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2
            id="testimonials-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4"
          >
            Trusted by forward-thinking companies
          </h2>
          <p className="text-text-secondary text-lg">
            See what leaders say about hiring intact teams.
          </p>
        </div>

        {/* Testimonials grid - consistent cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.name}
              className={`bg-bg-surface rounded-xl p-8 border border-border transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: isVisible ? `${(index + 1) * 100}ms` : '0ms' }}
            >
              {/* Quote - Practical UI: 18px body text */}
              <blockquote className="mb-6">
                <p className="text-text-secondary text-lg leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </blockquote>

              {/* Author */}
              <footer className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-navy/10">
                  <span className="font-semibold text-navy text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <cite className="font-semibold text-text-primary not-italic block">
                    {testimonial.name}
                  </cite>
                  <span className="text-text-tertiary text-base">
                    {testimonial.title}, {testimonial.company}
                  </span>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
