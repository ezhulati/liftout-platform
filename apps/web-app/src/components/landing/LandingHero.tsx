'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export function LandingHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-bg">
      {/* Subtle background - minimal decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-50/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 pt-32 lg:pt-40 relative z-10 w-full">
        {/* Main content - left aligned per Practical UI */}
        <div className="max-w-3xl">
          {/* Social proof - small, non-distracting */}
          <p className="text-text-secondary text-sm font-medium mb-6">
            500+ teams placed | $2.1B in successful acquisitions
          </p>

          {/* Headline - Major Third scale, tight line height */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-6">
            Acquire proven teams,<br />
            skip the growing pains
          </h1>

          {/* Subheadline - body text size, relaxed line height */}
          <p className="text-text-secondary text-lg leading-relaxed mb-10 max-w-2xl">
            The strategic alternative to individual hiring and costly acquisitions.
            Connect with intact, high-performing teams ready for new challenges.
          </p>

          {/* CTA buttons - left aligned, primary first */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link
              href="/for-companies"
              className="btn-primary inline-flex items-center gap-2 group"
            >
              Browse verified teams
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              href="/for-teams"
              className="btn-outline inline-flex items-center gap-2"
            >
              Register your team
            </Link>
          </div>

          {/* Trust indicators - simple list */}
          <div className="border-t border-border pt-8">
            <p className="text-text-tertiary text-sm mb-4">
              Trusted across industries
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-text-secondary text-sm font-medium">
              <span>Finance</span>
              <span>Technology</span>
              <span>Healthcare</span>
              <span>Consulting</span>
              <span>Legal</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
