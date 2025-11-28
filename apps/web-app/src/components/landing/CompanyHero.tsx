'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

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

            {/* Pain Point Headline */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-6">
              Tired of hiring individuals that{' '}
              <span className="text-navy">never gel?</span>
            </h1>

            {/* Solution */}
            <p className="font-body text-lg lg:text-xl text-text-secondary leading-relaxed mb-8 max-w-xl">
              Acquire proven, intact teams that hit the ground running. Zero team-building phase,
              verified track records, immediate productivity.
            </p>

            {/* USPs */}
            <div className="space-y-4 mb-10">
              {[
                'Zero team-building phase with immediate productivity',
                'Verified track records with quantifiable performance history',
                'Lower risk than M&A as a strategic alternative',
                'Competitive advantage by acquiring proven talent',
              ].map((usp, index) => (
                <div
                  key={usp}
                  className={`flex items-start gap-3 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                  style={{ transitionDelay: `${(index + 2) * 100}ms` }}
                >
                  <div className="w-5 h-5 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckIcon className="w-3 h-3 text-navy" aria-hidden="true" />
                  </div>
                  <span className="text-text-secondary text-base leading-snug">{usp}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/signup?type=company"
                className="btn-primary min-h-[52px] px-8 py-3 text-lg font-semibold inline-flex items-center justify-center gap-3 group"
              >
                Browse verified teams
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

          {/* Right - Hero Image */}
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
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold-100 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-navy-100 rounded-xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
