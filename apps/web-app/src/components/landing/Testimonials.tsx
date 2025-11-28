'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const testimonials = [
  {
    quote: "We were skeptical about hiring an entire team at once. But the analytics team we acquired had worked together for 4 years - they were productive from week one.",
    name: "Sarah Chen",
    title: "VP of Talent Acquisition",
    company: "Apex Financial",
  },
  {
    quote: "The confidentiality was crucial for us. We explored opportunities for 3 months before finding the right fit, and our current employer never knew.",
    name: "Marcus Johnson",
    title: "Engineering Team Lead",
    company: "Series B Startup",
  },
  {
    quote: "Lower risk than our last M&A, better cultural fit than individual hiring. The due diligence process showed us exactly what we were getting.",
    name: "Michael Torres",
    title: "Director of Strategic Growth",
    company: "HealthTech Innovations",
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
              {/* Quote */}
              <blockquote className="mb-6">
                <p className="text-text-secondary leading-relaxed">
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
                  <span className="text-text-tertiary text-sm">
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
