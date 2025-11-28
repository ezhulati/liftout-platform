'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserGroupIcon, CheckIcon, ArrowRightIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

// USPs with quantified benefits (#43, #89)
const usps = [
  { text: 'Collective mobility keeps your team intact', stat: '150+ matched' },
  { text: 'Enhanced negotiating power from your collective value', stat: '40% avg increase' },
  { text: 'Better opportunities with companies actively seeking teams', stat: 'Zero job hunting' },
  { text: 'Reduced career risk with team support through transitions', stat: '100% confidential' },
];

export function TeamHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-bg">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Subtle diagonal gradient - gold tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold-50/30 via-transparent to-navy-50/20" />
        {/* Decorative shapes */}
        <div className="absolute top-20 left-[10%] w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-20 right-[5%] w-80 h-80 rounded-full bg-navy/5 blur-3xl" />
      </div>

      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 pt-[120px] lg:pt-[160px] relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Copy */}
          <div className={`transition-all duration-700 ease-out-expo ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {/* Icon badge */}
            <div className="w-16 h-16 rounded-xl bg-gold flex items-center justify-center mb-8 shadow-lg shadow-gold/30">
              <UserGroupIcon className="w-8 h-8 text-on-gold" aria-hidden="true" />
            </div>

            {/* Eyebrow */}
            <p className="font-semibold tracking-wider uppercase text-sm mb-4 text-gold-dark">
              For Teams
            </p>

            {/* Pain Point Headline (#06) */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-6">
              Ready for a new challenge without{' '}
              <span className="text-gold-700">breaking up your team?</span>
            </h1>

            {/* Solution - quantified (#43) */}
            <p className="font-body text-lg lg:text-xl text-text-secondary leading-relaxed mb-6 max-w-xl">
              Move together as a unit. Keep what works, elevate your opportunities. Access companies
              actively seeking proven teams like yours.
            </p>

            {/* Confidentiality callout (#47 - reduce risk) */}
            <div className="flex items-center gap-4 mb-8 p-4 bg-bg-elevated rounded-lg border border-border">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gold/20">
                <ShieldCheckIcon className="w-5 h-5 text-gold-dark" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-text-primary">100% Confidential</p>
                <p className="text-text-secondary text-sm">Your current employer will never know you're exploring</p>
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
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-gold/20">
                      <CheckIcon className="w-3 h-3 text-gold-dark" aria-hidden="true" />
                    </div>
                    <span className="text-text-secondary text-sm leading-snug">{usp.text}</span>
                  </div>
                  <span className="font-semibold text-sm whitespace-nowrap text-gold-dark">{usp.stat}</span>
                </div>
              ))}
            </div>

            {/* CTA - Practical UI: Primary first (left), Verb+Noun labels */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/signup?type=team"
                className="btn-primary min-h-12 px-8 py-3 text-lg font-semibold inline-flex items-center justify-center gap-3 group"
              >
                Register your team
                <ArrowRightIcon className="w-5 h-5 transition-transform duration-fast ease-out-quart group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="#features"
                className="btn-tertiary min-h-12 px-4 py-3 text-lg inline-flex items-center justify-center gap-2"
              >
                Learn how it works
              </Link>
            </div>
          </div>

          {/* Right - Hero Image */}
          <div className={`relative transition-all duration-700 ease-out-expo delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {/* Gold accent border */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-gold/20 z-10 pointer-events-none" />

              <Image
                src="/teams-hero-new.jpeg"
                alt="Diverse professional team collaborating and shaking hands in modern office"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />

              {/* Overlay gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/20 via-transparent to-transparent" />
            </div>

            {/* Floating testimonial card (#83 - strategic positioning) */}
            <div className={`absolute -bottom-6 -left-6 bg-bg-surface rounded-xl p-5 border border-border shadow-lg max-w-xs transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex px-2 py-0.5 bg-success/10 text-success text-xs font-semibold rounded-full">
                  40% compensation increase
                </span>
              </div>
              <blockquote className="text-text-secondary text-sm leading-relaxed mb-2">
                "We had worked together for 4 years. Liftout helped us find a company that valued what we built together."
              </blockquote>
              <p className="text-text-tertiary text-xs">
                — Marcus Johnson, Engineering Team Lead
              </p>
            </div>

            {/* Stats card - top right */}
            <div className={`absolute -top-4 -right-4 bg-gold rounded-xl p-4 shadow-lg transition-all duration-700 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="font-bold text-2xl text-on-gold">150+</p>
              <p className="text-xs text-navy-900/70">teams matched</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
