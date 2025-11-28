'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Testimonials curated to highlight features AND answer doubts
const testimonials = [
  {
    quote: "We were skeptical about hiring an entire team at once. But the analytics team we acquired had worked together for 4 years - they were productive from week one. No ramp-up, no awkward team-building exercises. Just results.",
    name: "Sarah Chen",
    title: "VP of Talent Acquisition",
    company: "Apex Financial",
    // Addresses doubt: "Can a team really integrate quickly?"
  },
  {
    quote: "The confidentiality was crucial for us. We explored opportunities for 3 months before finding the right fit, and our current employer never knew we were looking. The NDA protection gave us peace of mind.",
    name: "Jennifer Park",
    title: "Team Lead, Data Engineering",
    company: "Now at: TechVentures",
    // Addresses doubt: "Will my employer find out?"
  },
  {
    quote: "Lower risk than our last M&A, better cultural fit than individual hiring. The due diligence process showed us exactly what we were getting. We've now used Liftout three times.",
    name: "Michael Torres",
    title: "Director of Strategic Growth",
    company: "HealthTech Innovations",
    // Addresses doubt: "Is this less risky than alternatives?"
  },
];

export function Testimonials() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 lg:py-32 bg-bg-elevated scroll-mt-20"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header - left aligned */}
        <div className={`max-w-2xl mb-16 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-navy font-semibold text-base mb-3">
            What our customers say
          </p>
          <h2
            id="testimonials-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight"
          >
            Trusted by leaders at forward-thinking companies
          </h2>
        </div>

        {/* Testimonials grid - cards left-aligned */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.name}
              className={`bg-bg-surface rounded-lg p-8 border border-border transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: isVisible ? `${(index + 1) * 100}ms` : '0ms' }}
            >
              {/* Quote - left aligned, no quotation marks needed */}
              <blockquote className="mb-8">
                <p className="text-text-secondary leading-relaxed text-base">
                  {testimonial.quote}
                </p>
              </blockquote>

              {/* Author - left aligned */}
              <footer className="flex items-center gap-3">
                {/* Avatar - initials */}
                <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-semibold text-navy text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <cite className="font-semibold text-text-primary text-base not-italic block">
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
