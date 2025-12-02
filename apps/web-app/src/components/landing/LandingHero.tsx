'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

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

export function LandingHero() {
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
              {/* Eyebrow */}
              <p className="text-text-secondary text-lg mb-4">
                Tired of hiring individuals who take months to gel?
              </p>

              {/* H1 - Large, bold hero headline */}
              <h1 className="font-heading text-5xl sm:text-6xl font-bold text-text-primary tracking-tight leading-tight mb-6">
                Acquire Teams That Deliver From Day One
              </h1>

              {/* Subhead - 18px body */}
              <p className="text-text-secondary text-lg leading-relaxed mb-8 max-w-xl">
                Skip the 6-month team-building phase. Connect with intact,
                high-performing teams who already trust each other and have
                a proven track record together.
              </p>

              {/* CTAs - Practical UI: Primary (solid) + Tertiary (underlined text) */}
              {/* Left-aligned, Primary first, 16pt gap, 48pt touch targets */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* Primary button - ONE per screen, solid fill, Verb+Noun */}
                <Link
                  href="/auth/signup"
                  className="group relative min-h-12 px-8 py-3 text-lg inline-flex items-center justify-center gap-2 bg-[#4C1D95] text-white font-bold rounded-lg shadow-lg shadow-purple-900/25 hover:shadow-xl hover:shadow-purple-900/30 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <span className="relative">Browse verified teams</span>
                  <ArrowRightIcon className="w-5 h-5 relative transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                {/* Tertiary button - underlined text, for secondary action */}
                <Link
                  href="/for-teams"
                  className="min-h-12 px-4 py-3 text-lg inline-flex items-center justify-center text-[#4C1D95] font-medium underline underline-offset-4 decoration-purple-900/30 hover:decoration-purple-900 transition-colors"
                >
                  List your team
                </Link>
              </div>

              {/* Trust signals - Practical UI: 16px minimum for small text */}
              <p className="text-text-tertiary text-base">
                Free to explore. No credit card required.
              </p>
            </div>

            {/* Right - Hero image */}
            <div className="relative hidden lg:block">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/hero-team.jpeg"
                  alt="Professional team collaborating in modern office"
                  width={600}
                  height={450}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
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
          <span className="text-xs font-medium">See how it works</span>
          <ChevronDownIcon className="w-5 h-5 animate-bounce" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
