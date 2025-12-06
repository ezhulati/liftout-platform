'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { ProductMockup } from './ProductMockup';
import { OpportunitiesMockup } from './OpportunitiesMockup';

/**
 * Practical UI Hero Section
 *
 * Typography Scale (1.25 Major Third):
 * - H1: 44px bold (text-4xl sm:text-5xl)
 * - Body: 18px (text-lg)
 * - Small: 15-16px (text-base)
 *
 * Spacing (8pt grid):
 * - Section: XXL (80pt) padding
 * - Between elements: M (24pt) to L (32pt)
 *
 * Touch targets: 48pt minimum
 * Buttons: Verb + Noun labels
 */

type AudienceType = 'teams' | 'companies';

const heroContent = {
  teams: {
    headline: 'The job board for teams',
    subhead: 'Register your team. Companies find you. Get hired together.',
    ctaText: 'Register your team',
    ctaHref: '/auth/signup?type=team',
    trustLine: 'Free to explore. Completely confidential.',
  },
  companies: {
    headline: 'Hire teams that already work',
    subhead: 'Browse proven teams. Skip the ramp-up. Ship faster.',
    ctaText: 'Find your team',
    ctaHref: '/auth/signup?type=company',
    trustLine: 'No fees until you hire. Completely confidential.',
  },
};

export function LandingHero() {
  const [audience, setAudience] = useState<AudienceType>('teams');
  const content = heroContent[audience];

  const scrollToContent = () => {
    const howItWorks = document.getElementById('how-it-works');
    if (howItWorks) {
      howItWorks.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col bg-bg">
      {/* Main content */}
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 pt-32 lg:pt-40 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text content */}
            <div>
              {/* Audience toggle */}
              <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mb-8">
                <button
                  onClick={() => setAudience('teams')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all min-h-10 ${
                    audience === 'teams'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Teams
                </button>
                <button
                  onClick={() => setAudience('companies')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all min-h-10 ${
                    audience === 'companies'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Companies
                </button>
              </div>

              {/* H1 - Clear, instant understanding */}
              <h1 className="font-heading text-[3.5rem] sm:text-[4.25rem] lg:text-[5.25rem] font-bold text-text-primary tracking-tight leading-[1.02] mb-6">
                {content.headline}
              </h1>

              {/* Subhead - what you do, what happens, the outcome */}
              <p className="text-text-secondary text-lg leading-relaxed mb-8 max-w-xl">
                {content.subhead}
              </p>

              {/* CTAs - Practical UI: ONE primary, one secondary (outline) */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* Primary button - main CTA */}
                <Link
                  href={content.ctaHref}
                  className="btn-primary min-h-12 px-8 py-3 text-lg inline-flex items-center justify-center gap-3 group"
                >
                  {content.ctaText}
                  <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                {/* Secondary button - outline style */}
                <Link
                  href="#how-it-works"
                  className="btn-outline min-h-12 px-8 py-3 text-lg inline-flex items-center justify-center"
                >
                  See how it works
                </Link>
              </div>

              {/* Trust signals - confident but confidential */}
              <p className="text-text-tertiary text-base mb-6">
                {content.trustLine}
              </p>

              {/* Hero image - different for teams vs companies */}
              <div className="relative rounded-xl overflow-hidden shadow-lg max-w-md">
                <img
                  src={audience === 'teams' ? '/hero-team.jpeg' : '/company-hero.webp'}
                  alt={audience === 'teams' ? 'A diverse professional team celebrating together' : 'Company hiring teams'}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Right - Product mockup (responsive) */}
            <div className="relative">
              {audience === 'teams' ? <OpportunitiesMockup /> : <ProductMockup />}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint - 48px touch target */}
      <div className="pb-8 flex justify-center">
        <button
          onClick={scrollToContent}
          className="flex flex-col items-center gap-2 text-text-tertiary hover:text-text-secondary transition-colors min-h-12 min-w-12 justify-center"
          aria-label="Scroll to learn more"
        >
          <span className="text-base font-medium">See how it works</span>
          <ChevronDownIcon className="w-5 h-5 animate-bounce" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
