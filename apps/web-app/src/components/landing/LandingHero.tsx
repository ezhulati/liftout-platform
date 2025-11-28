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
      {/* Subtle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-50/20 to-transparent" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 pt-32 lg:pt-40 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left side - Text content */}
            <div>
              {/* Empathize with the problem first */}
              <p className="text-text-secondary text-lg mb-4">
                Tired of hiring individuals who take months to gel?
              </p>

              {/* Headline - benefit focused */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-6">
                Acquire teams that deliver from day one
              </h1>

              {/* Subheadline - solution focused */}
              <p className="text-text-secondary text-lg leading-relaxed mb-8 max-w-xl">
                Skip the 6-month team-building phase. Connect with intact,
                high-performing teams who already trust each other and have
                a proven track record together.
              </p>

                {/* CTA buttons - ONE primary per screen, left-aligned, 16px gap */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  href="/auth/signup"
                  className="btn-primary inline-flex items-center gap-2 group"
                >
                  Start exploring free
                  <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link
                  href="/for-teams"
                  className="btn-outline inline-flex items-center gap-2"
                >
                  List your team
                </Link>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-6 text-text-tertiary text-sm">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free to explore
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  NDA-protected
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Pay only on success
                </span>
              </div>
            </div>

            {/* Right side - Hero image */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/hero-team.jpeg"
                  alt="Diverse team members shaking hands and collaborating in a modern office"
                  width={600}
                  height={450}
                  className="w-full h-auto object-cover"
                  priority
                />
                {/* Subtle overlay for brand consistency */}
                <div className="absolute inset-0 bg-gradient-to-tr from-navy-900/10 to-transparent pointer-events-none" />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold-100 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-navy-100 rounded-xl -z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint - 48px touch target */}
      <div className="pb-8 flex justify-center">
        <button
          onClick={scrollToContent}
          className="flex flex-col items-center gap-2 text-text-tertiary hover:text-text-secondary transition-colors duration-200 min-h-[48px] min-w-[48px] justify-center"
          aria-label="Scroll to learn more"
        >
          <span className="text-xs font-medium">Learn more</span>
          <ChevronDownIcon className="w-5 h-5 animate-bounce" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
