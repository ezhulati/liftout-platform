'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheckIcon, ArrowRightIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

// USPs with quantified benefits (#43, #89)
const usps = [
  { text: 'Skip the 6-month team-building phase', stat: '6 months saved' },
  { text: 'Verified track records with quantifiable performance', stat: '100% verified' },
  { text: 'Lower risk than M&A as a strategic alternative', stat: '92% retention' },
  { text: 'Competitive advantage by acquiring proven talent', stat: '150+ matched' },
];

export function CompanyHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-bg">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Subtle diagonal gradient - navy tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-50/40 via-transparent to-gold-50/10" />
        {/* Decorative shapes */}
        <div className="absolute top-20 right-[10%] w-96 h-96 rounded-full bg-navy/5 blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-80 h-80 rounded-full bg-gold/5 blur-3xl" />
      </div>

      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 pt-[120px] lg:pt-[160px] relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Copy */}
          <div className={`transition-all duration-700 ease-out-expo ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {/* Eyebrow */}
            <p className="text-navy font-semibold tracking-wider uppercase text-sm mb-4">
              For Companies
            </p>

            {/* Pain Point Headline (#06) */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-6">
              Tired of hiring individuals that{' '}
              <span className="text-navy">never gel?</span>
            </h1>

            {/* Solution - quantified (#43) */}
            <p className="font-body text-lg lg:text-xl text-text-secondary leading-relaxed mb-6 max-w-xl">
              Acquire proven, intact teams that hit the ground running. Zero team-building phase,
              verified track records, immediate productivity.
            </p>

            {/* Social proof inline (#52) */}
            <div className="flex items-center gap-4 mb-8 p-4 bg-bg-elevated rounded-lg border border-border">
              <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-navy" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-text-primary">Save 6+ months</p>
                <p className="text-text-secondary text-sm">vs. hiring and building a team from scratch</p>
              </div>
            </div>

            {/* USPs with stats */}
            <div className="space-y-3 mb-10">
              {usps.map((usp, index) => (
                <div
                  key={usp.text}
                  className={`flex items-center justify-between gap-4 p-3 rounded-lg bg-bg-surface border border-border transition-all duration-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                  style={{ transitionDelay: `${(index + 2) * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                      <CheckIcon className="w-3 h-3 text-success" aria-hidden="true" />
                    </div>
                    <span className="text-text-secondary text-sm leading-snug">{usp.text}</span>
                  </div>
                  <span className="text-navy font-semibold text-sm whitespace-nowrap">{usp.stat}</span>
                </div>
              ))}
            </div>

            {/* CTA - action-oriented (#04) */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/signup?type=company"
                className="btn-primary min-h-[52px] px-8 py-3 text-lg font-semibold inline-flex items-center justify-center gap-3 group"
              >
                Browse verified teams free
                <ArrowRightIcon className="w-5 h-5 transition-transform duration-fast ease-out-quart group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="#features"
                className="min-h-[52px] px-8 py-3 rounded-lg text-lg font-semibold inline-flex items-center justify-center gap-2 border-2 border-border text-text-primary bg-transparent hover:bg-bg-elevated hover:border-border-hover transition-all duration-fast ease-out-quart"
              >
                See how it works
              </Link>
            </div>
          </div>

          {/* Right - Hero Image with floating card */}
          <div className={`relative transition-all duration-700 ease-out-expo delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/company-hero.jpeg"
                alt="Hand placing a team piece into an organizational chart, representing strategic team acquisition"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
            </div>

            {/* Floating testimonial card (#83 - strategic positioning) */}
            <div className={`absolute -bottom-6 -left-6 bg-bg-surface rounded-xl p-5 border border-border shadow-lg max-w-xs transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex px-2 py-0.5 bg-success/10 text-success text-xs font-semibold rounded-full">
                  3x repeat customer
                </span>
              </div>
              <blockquote className="text-text-secondary text-sm leading-relaxed mb-2">
                "Lower risk than M&A, better cultural fit than individual hiring."
              </blockquote>
              <p className="text-text-tertiary text-xs">
                — Michael Torres, Director of Strategic Growth
              </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold-100 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-navy-100 rounded-xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
