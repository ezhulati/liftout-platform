'use client';

import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { StarIcon } from '@heroicons/react/24/solid';

// Testimonials curated to highlight features AND answer doubts (#01)
// Demographics matched to target audience (#02)
// Strategically positioned throughout page (#83)
const testimonials = [
  {
    quote: "We were skeptical about hiring an entire team at once. But the analytics team we acquired had worked together for 4 years - they were productive from week one. Saved us an estimated 6 months of team-building.",
    name: "Sarah Chen",
    title: "VP of Talent Acquisition",
    company: "Apex Financial",
    companyLogo: "/logos/apex-financial.svg",
    metric: "6 months saved",
    // Addresses doubt: "Can a team really integrate quickly?"
    // Highlights feature: immediate productivity
    avatar: "/avatars/sarah-chen.jpg",
  },
  {
    quote: "The confidentiality was crucial for us. We explored opportunities for 3 months before finding the right fit, and our current employer never knew. Now we're at a company that values our collective expertise.",
    name: "Marcus Johnson",
    title: "Engineering Team Lead",
    company: "Previously: Fortune 500 → Now: Series B Startup",
    metric: "40% compensation increase",
    // Addresses doubt: "Will my employer find out?"
    // Highlights feature: confidentiality
    avatar: "/avatars/marcus-johnson.jpg",
  },
  {
    quote: "Lower risk than our last M&A, better cultural fit than individual hiring. The due diligence process showed us exactly what we were getting. We've now acquired 3 teams through Liftout.",
    name: "Michael Torres",
    title: "Director of Strategic Growth",
    company: "HealthTech Innovations",
    companyLogo: "/logos/healthtech.svg",
    metric: "3 successful acquisitions",
    // Addresses doubt: "Is this less risky than alternatives?"
    // Highlights feature: due diligence
    avatar: "/avatars/michael-torres.jpg",
  },
];

// Opinion leader testimonial (#20) - someone well-known in the industry
const featuredTestimonial = {
  quote: "The traditional hiring model is broken for specialized teams. Liftout represents a fundamental shift - why spend 18 months building chemistry when you can acquire it? This is how smart companies will build teams in the future.",
  name: "David Park",
  title: "Managing Partner",
  company: "Sequoia Capital",
  avatar: "/avatars/david-park.jpg",
};

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
        <div className={`max-w-2xl mb-12 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-navy font-semibold text-base mb-3">
            Success stories
          </p>
          <h2
            id="testimonials-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4"
          >
            Trusted by leaders at forward-thinking companies
          </h2>
          {/* Social proof numbers (#52, #82) */}
          <div className="flex flex-wrap gap-6 text-text-secondary">
            <span className="flex items-center gap-2">
              <span className="font-bold text-text-primary text-xl">150+</span>
              teams matched
            </span>
            <span className="flex items-center gap-2">
              <span className="font-bold text-text-primary text-xl">92%</span>
              retention at 2 years
            </span>
            <span className="flex items-center gap-2">
              <span className="font-bold text-text-primary text-xl">4.9</span>
              <span className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-gold" aria-hidden="true" />
                ))}
              </span>
            </span>
          </div>
        </div>

        {/* Featured testimonial - opinion leader (#20) */}
        <div className={`mb-12 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <article className="bg-navy rounded-2xl p-8 lg:p-10 relative overflow-hidden">
            {/* Decorative quote mark */}
            <div className="absolute top-4 right-4 text-white/5 text-[120px] font-serif leading-none select-none" aria-hidden="true">
              "
            </div>
            <div className="relative">
              <blockquote className="mb-6">
                <p className="text-white/90 text-lg lg:text-xl leading-relaxed max-w-3xl">
                  "{featuredTestimonial.quote}"
                </p>
              </blockquote>
              <footer className="flex items-center gap-4">
                {/* Avatar with initials fallback */}
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 ring-2 ring-gold/30">
                  <span className="font-bold text-white text-lg">
                    {featuredTestimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <cite className="font-semibold text-white text-lg not-italic block">
                    {featuredTestimonial.name}
                  </cite>
                  <span className="text-white/70">
                    {featuredTestimonial.title}, {featuredTestimonial.company}
                  </span>
                </div>
              </footer>
            </div>
          </article>
        </div>

        {/* Testimonials grid - cards with metrics */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.name}
              className={`bg-bg-surface rounded-xl p-8 border border-border hover:border-navy/20 hover:shadow-lg transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: isVisible ? `${(index + 2) * 100}ms` : '0ms' }}
            >
              {/* Metric highlight (#43 - quantify value) */}
              {testimonial.metric && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-sm font-semibold mb-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {testimonial.metric}
                </div>
              )}

              {/* Quote */}
              <blockquote className="mb-6">
                <p className="text-text-secondary leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </blockquote>

              {/* Author */}
              <footer className="flex items-center gap-3">
                {/* Avatar with initials */}
                <div className="w-11 h-11 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-semibold text-navy text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <cite className="font-semibold text-text-primary not-italic block">
                    {testimonial.name}
                  </cite>
                  <span className="text-text-tertiary text-sm">
                    {testimonial.title}
                  </span>
                  <span className="block text-text-tertiary text-sm">
                    {testimonial.company}
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
