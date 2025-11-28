'use client';

import Link from 'next/link';
import { UserGroupIcon, CheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

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
            <div className="w-16 h-16 rounded-xl bg-gold flex items-center justify-center mb-8 shadow-gold">
              <UserGroupIcon className="w-8 h-8 text-navy-900" aria-hidden="true" />
            </div>

            {/* Eyebrow */}
            <p className="text-gold-700 font-semibold tracking-wider uppercase text-xs mb-4">
              For Teams
            </p>

            {/* Pain Point Headline */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-6">
              Ready for a new challenge without{' '}
              <span className="text-gold-700">breaking up your team?</span>
            </h1>

            {/* Solution */}
            <p className="font-body text-lg lg:text-xl text-text-secondary leading-relaxed mb-8 max-w-xl">
              Move together as a unit. Keep what works, elevate your opportunities. Access companies
              actively seeking proven teams like yours.
            </p>

            {/* USPs */}
            <div className="space-y-4 mb-10">
              {[
                'Collective mobility keeps your team intact',
                'Enhanced negotiating power from your collective value',
                'Better opportunities with companies seeking proven teams',
                'Reduced career risk with team support through transitions',
              ].map((usp, index) => (
                <div
                  key={usp}
                  className={`flex items-start gap-3 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                  style={{ transitionDelay: `${(index + 2) * 100}ms` }}
                >
                  <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckIcon className="w-3 h-3 text-gold-700" aria-hidden="true" />
                  </div>
                  <span className="text-text-secondary text-base leading-snug">{usp}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/signup?type=team"
                className="btn-secondary min-h-[52px] px-8 py-3 text-lg font-semibold inline-flex items-center justify-center gap-3 group"
              >
                Register your team
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

          {/* Right - Visual/Benefits */}
          <div className={`relative transition-all duration-700 ease-out-expo delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Benefits card */}
            <div className="bg-bg-surface rounded-2xl p-8 lg:p-10 border border-border shadow-lg">
              {/* Top accent bar */}
              <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-gold/50 via-gold to-gold/50 rounded-t-2xl" aria-hidden="true" />

              <h3 className="font-heading text-xl font-bold text-text-primary mb-6">
                Why teams choose Liftout
              </h3>

              <div className="space-y-4">
                {[
                  'Stay together through transitions',
                  'Access 200+ premium opportunities',
                  'Negotiate as a collective',
                  'Explore confidentially',
                ].map((item, index) => (
                  <div
                    key={item}
                    className={`flex items-center gap-3 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
                    style={{ transitionDelay: `${(index + 4) * 100}ms` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0" aria-hidden="true" />
                    <span className="text-text-secondary text-base leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              {/* Testimonial/Quote */}
              <div className={`mt-8 pt-6 border-t border-border transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <blockquote className="text-text-secondary italic text-base leading-relaxed mb-3">
                  "We had worked together for 4 years. The thought of splitting up was unthinkable.
                  Liftout helped us find a company that valued what we had built together."
                </blockquote>
                <p className="text-text-tertiary text-sm">
                  — Analytics team lead, FinTech
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
