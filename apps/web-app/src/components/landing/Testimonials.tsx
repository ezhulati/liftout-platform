'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { StarIcon } from '@heroicons/react/24/solid';

const testimonials = [
  {
    quote: "The analytics team we acquired had worked together for 4 years. They were productive from week one - no ramp-up, no team-building exercises. Just results.",
    name: "Sarah Chen",
    title: "VP of Talent Acquisition",
    company: "Apex Financial",
    rating: 5,
    highlight: "productive from week one",
  },
  {
    quote: "Lower risk than our last M&A, with better cultural fit. The due diligence process gave us confidence that this team would integrate seamlessly.",
    name: "Michael Torres",
    title: "Director of Strategic Growth",
    company: "HealthTech Innovations",
    rating: 5,
    highlight: "better cultural fit",
  },
  {
    quote: "We explored opportunities for 3 months before finding the right fit. The confidentiality was crucial - our current employer never knew we were looking.",
    name: "Jennifer Park",
    title: "Team Lead, Data Engineering",
    company: "Former: Enterprise Corp",
    rating: 5,
    highlight: "confidentiality was crucial",
  },
];

export function Testimonials() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 bg-bg-elevated scroll-mt-20"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 lg:mb-20 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-gold-700 font-semibold tracking-wider uppercase text-xs mb-4">
            Success stories
          </p>
          <h2
            id="testimonials-heading"
            className="font-heading text-3xl sm:text-4xl lg:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-6"
          >
            Trusted by leaders at forward-thinking companies
          </h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.name}
              className={`group relative bg-bg-surface rounded-xl p-6 lg:p-8 border border-border hover:border-navy/30 transition-all duration-base ease-out-quart hover:shadow-lg ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: isVisible ? `${(index + 1) * 100}ms` : '0ms' }}
            >
              {/* Rating stars */}
              <div className="flex gap-1 mb-4" aria-label={`${testimonial.rating} out of 5 stars`}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-gold" aria-hidden="true" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mb-6">
                <p className="font-body text-text-secondary leading-relaxed text-base">
                  "{testimonial.quote}"
                </p>
              </blockquote>

              {/* Author */}
              <footer className="flex items-center gap-3">
                {/* Avatar placeholder - initials */}
                <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-semibold text-navy text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <cite className="font-semibold text-text-primary text-sm not-italic block">
                    {testimonial.name}
                  </cite>
                  <span className="text-text-tertiary text-xs block">
                    {testimonial.title}
                  </span>
                  <span className="text-text-tertiary text-xs">
                    {testimonial.company}
                  </span>
                </div>
              </footer>

              {/* Subtle hover accent */}
              <div
                className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-gold/0 via-gold/60 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-base rounded-full"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
