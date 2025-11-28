'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

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

              {/* H1 - 44px bold per Practical UI */}
              <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-6">
                Acquire teams that deliver from day one
              </h1>

              {/* Subhead - 18px body */}
              <p className="text-text-secondary text-lg leading-relaxed mb-8 max-w-xl">
                Skip the 6-month team-building phase. Connect with intact,
                high-performing teams who already trust each other and have
                a proven track record together.
              </p>

              {/* CTAs - One primary, left-aligned, 16px gap */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/auth/signup"
                  className="btn-primary inline-flex items-center justify-center gap-2 group"
                >
                  Browse verified teams
                  <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link
                  href="/for-teams"
                  className="btn-outline inline-flex items-center justify-center gap-2"
                >
                  List your team
                </Link>
              </div>

              {/* Trust signals - simple, minimal */}
              <p className="text-text-tertiary text-sm">
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
          className="flex flex-col items-center gap-2 text-text-tertiary hover:text-text-secondary transition-colors min-h-[48px] min-w-[48px] justify-center"
          aria-label="Scroll to learn more"
        >
          <span className="text-xs font-medium">See how it works</span>
          <ChevronDownIcon className="w-5 h-5 animate-bounce" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
