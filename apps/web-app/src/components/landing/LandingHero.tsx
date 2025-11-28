'use client';

import Link from 'next/link';
import { BuildingOfficeIcon, UserGroupIcon, CheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export function LandingHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-bg">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Subtle diagonal gradient - left side navy tint, right side gold tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-50/40 via-transparent to-gold-50/30" />
        {/* Decorative blobs with subtle animation */}
        <div className="absolute top-[15%] left-[5%] w-96 h-96 rounded-full bg-navy/5 blur-3xl" />
        <div className="absolute bottom-[15%] right-[5%] w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-gold/3 to-transparent blur-3xl" />
      </div>

      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20 pt-[120px] lg:pt-[140px] relative z-10 w-full">

        {/* Brand tagline - left-aligned per Practical UI */}
        <div className={`mb-12 lg:mb-16 max-w-3xl transition-all duration-700 ease-out-expo ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy/5 border border-navy/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-text-secondary text-sm font-medium">500+ teams | 200+ companies | $2.1B in acquisitions</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight leading-tight">
            Acquire proven teams,
            <span className="block text-navy mt-2">skip the growing pains</span>
          </h1>
          <p className="mt-6 text-text-secondary text-lg lg:text-xl leading-relaxed">
            The strategic alternative to individual hiring and costly acquisitions. Connect with intact, high-performing teams ready for new challenges.
          </p>
        </div>

        {/* Equal Split Hero - Two Columns with enhanced styling */}
        <div className={`grid lg:grid-cols-2 gap-6 lg:gap-0 max-w-5xl transition-all duration-700 ease-out-expo delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* LEFT SIDE - For Companies */}
          <div className="group relative bg-bg-surface rounded-2xl lg:rounded-r-none p-8 lg:p-10 border border-border lg:border-r-0 shadow-sm hover:shadow-xl transition-all duration-base">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-navy via-navy to-navy/50 rounded-t-2xl lg:rounded-tr-none" aria-hidden="true" />

            {/* Icon badge */}
            <div className="w-14 h-14 rounded-xl bg-navy flex items-center justify-center mb-6 shadow-navy group-hover:scale-105 transition-transform duration-base">
              <BuildingOfficeIcon className="w-7 h-7 text-gold" aria-hidden="true" />
            </div>

            {/* Eyebrow */}
            <p className="text-navy font-semibold tracking-wider uppercase text-xs mb-3">
              For Companies
            </p>

            {/* Pain-point headline */}
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary leading-tight tracking-tight mb-4">
              Stop building teams from scratch
            </h2>

            {/* Value prop */}
            <p className="font-body text-text-secondary leading-relaxed mb-6">
              Acquire teams with 3+ years working together. Verified results, zero ramp-up time, day-one productivity.
            </p>

            {/* USPs with checkmarks */}
            <div className="space-y-3 mb-8">
              {[
                'Browse 500+ verified teams',
                'Due diligence and track records',
                'Confidential negotiations',
              ].map((usp) => (
                <div key={usp} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-3 h-3 text-navy" aria-hidden="true" />
                  </div>
                  <span className="text-text-secondary text-sm">{usp}</span>
                </div>
              ))}
            </div>

            {/* CTA - Verb + Noun pattern */}
            <Link
              href="/for-companies"
              className="btn-primary min-h-[48px] px-6 py-3 text-base font-semibold inline-flex items-center gap-2 group/btn"
            >
              Browse verified teams
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-fast ease-out-quart group-hover/btn:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {/* RIGHT SIDE - For Teams */}
          <div className="group relative bg-bg-surface rounded-2xl lg:rounded-l-none p-8 lg:p-10 border border-border shadow-sm hover:shadow-xl transition-all duration-base">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/50 via-gold to-gold rounded-t-2xl lg:rounded-tl-none" aria-hidden="true" />

            {/* Icon badge */}
            <div className="w-14 h-14 rounded-xl bg-gold flex items-center justify-center mb-6 shadow-gold group-hover:scale-105 transition-transform duration-base">
              <UserGroupIcon className="w-7 h-7 text-navy-900" aria-hidden="true" />
            </div>

            {/* Eyebrow */}
            <p className="text-gold-700 font-semibold tracking-wider uppercase text-xs mb-3">
              For Teams
            </p>

            {/* Pain-point headline */}
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary leading-tight tracking-tight mb-4">
              Move together, grow together
            </h2>

            {/* Value prop */}
            <p className="font-body text-text-secondary leading-relaxed mb-6">
              Keep your team intact. Access 200+ companies actively seeking proven teams with established track records.
            </p>

            {/* USPs with checkmarks */}
            <div className="space-y-3 mb-8">
              {[
                'Showcase collective achievements',
                'AI-powered opportunity matching',
                'Confidential exploration',
              ].map((usp) => (
                <div key={usp} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-3 h-3 text-gold-700" aria-hidden="true" />
                  </div>
                  <span className="text-text-secondary text-sm">{usp}</span>
                </div>
              ))}
            </div>

            {/* CTA - Verb + Noun pattern */}
            <Link
              href="/for-teams"
              className="btn-secondary min-h-[48px] px-6 py-3 text-base font-semibold inline-flex items-center gap-2 group/btn"
            >
              Register your team
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-fast ease-out-quart group-hover/btn:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Bottom trust/social proof - left-aligned per Practical UI */}
        <div className={`mt-16 lg:mt-20 transition-all duration-700 ease-out-expo delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-text-tertiary text-sm mb-5 font-medium">
            Trusted by forward-thinking organizations across
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-text-secondary">
            {['Finance', 'Technology', 'Healthcare', 'Consulting', 'Legal'].map((industry) => (
              <div key={industry} className="flex items-center gap-2 text-sm font-medium">
                <div className="w-2 h-2 rounded-full bg-gold" aria-hidden="true" />
                <span>{industry}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">
        <div className="w-6 h-10 rounded-full border-2 border-navy-300 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-navy-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
