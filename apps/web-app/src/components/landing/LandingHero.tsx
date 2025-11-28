'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, ChevronDownIcon, PlayCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export function LandingHero() {
  const [showVideo, setShowVideo] = useState(false);

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
              {/* Empathize with the problem first (#06) */}
              <p className="text-text-secondary text-lg mb-4">
                Tired of hiring individuals who take months to gel?
              </p>

              {/* Headline - benefit focused with time-saving emphasis (#43) */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-6">
                Acquire teams that deliver{' '}
                <span className="text-navy">from day one</span>
              </h1>

              {/* Subheadline - quantified benefit (#43, #89) */}
              <p className="text-text-secondary text-lg leading-relaxed mb-6 max-w-xl">
                Skip the 6-month team-building phase. Connect with intact,
                high-performing teams who already trust each other and have
                a proven track record together.
              </p>

              {/* Social proof snippet (#52) */}
              <div className="flex items-center gap-4 mb-8 p-4 bg-bg-elevated rounded-lg border border-border">
                <div className="flex -space-x-2">
                  {['SC', 'MJ', 'MT', 'JP'].map((initials, i) => (
                    <div
                      key={initials}
                      className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center text-xs font-semibold text-navy border-2 border-bg-elevated"
                      style={{ zIndex: 4 - i }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-text-primary">150+ teams</span>
                  <span className="text-text-secondary"> successfully matched</span>
                </div>
              </div>

              {/* CTA buttons - action-oriented (#04) */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/auth/signup"
                  className="btn-primary inline-flex items-center justify-center gap-2 group text-base px-6 py-3"
                >
                  Browse verified teams free
                  <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link
                  href="/for-teams"
                  className="btn-outline inline-flex items-center justify-center gap-2 text-base px-6 py-3"
                >
                  List your team
                </Link>
              </div>

              {/* Trust signals - lowering risk (#47) */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-text-tertiary text-sm">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  NDA-protected browsing
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Pay only on successful match
                </span>
              </div>
            </div>

            {/* Right side - Hero image with floating card */}
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

                {/* Watch demo button overlay (#86) */}
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute inset-0 flex items-center justify-center group"
                  aria-label="Watch how it works"
                >
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <PlayCircleIcon className="w-8 h-8 text-navy" />
                  </div>
                </button>
              </div>

              {/* Floating testimonial card (#83 - strategic positioning) */}
              <div className="absolute -bottom-6 -left-6 bg-bg-surface rounded-xl p-5 border border-border shadow-lg max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex px-2 py-0.5 bg-success/10 text-success text-xs font-semibold rounded-full">
                    6 months saved
                  </span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-3">
                  "They were productive from week one. No ramp-up needed."
                </p>
                <p className="text-text-tertiary text-xs">
                  — Sarah Chen, VP Talent, Apex Financial
                </p>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold-100 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-navy-100 rounded-xl -z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint (#68) */}
      <div className="pb-8 flex justify-center">
        <button
          onClick={scrollToContent}
          className="flex flex-col items-center gap-2 text-text-tertiary hover:text-text-secondary transition-colors duration-200 min-h-[48px] min-w-[48px] justify-center"
          aria-label="Scroll to learn more"
        >
          <span className="text-xs font-medium">See how it works</span>
          <ChevronDownIcon className="w-5 h-5 animate-bounce" aria-hidden="true" />
        </button>
      </div>

      {/* Video modal placeholder - would integrate real video (#86) */}
      {showVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div className="bg-bg-surface rounded-2xl p-8 max-w-2xl w-full text-center">
            <p className="text-text-secondary mb-4">Explainer video coming soon</p>
            <button
              onClick={() => setShowVideo(false)}
              className="btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
