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
              {/* H1 - Clean, impactful headline */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-text-primary tracking-tight leading-[1.1] mb-6">
                Move up with the people who made you better
              </h1>

              {/* Subhead - direct, action-oriented for teams */}
              <p className="text-text-secondary text-lg leading-relaxed mb-8 max-w-xl">
                Your best work happened with this team. Why start over with strangers? Explore what&apos;s next—together, confidentially.
              </p>

              {/* CTAs - Practical UI: ONE primary, one secondary (outline) */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* Primary button - main CTA */}
                <Link
                  href="/auth/signup"
                  className="btn-primary min-h-12 px-8 py-3 text-lg inline-flex items-center justify-center gap-3 group"
                >
                  Get started free
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
              <p className="text-text-tertiary text-base">
                Free to explore. Completely confidential.
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
          <span className="text-base font-medium">See how it works</span>
          <ChevronDownIcon className="w-5 h-5 animate-bounce" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
