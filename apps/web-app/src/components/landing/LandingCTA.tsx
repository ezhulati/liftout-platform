'use client';

import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export function LandingCTA() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 lg:py-32 bg-navy-900"
      aria-labelledby="cta-heading"
    >
      <div className={`max-w-7xl mx-auto px-6 lg:px-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Main CTA content */}
          <div>
            {/* Empathize then solve (#06) */}
            <p className="text-gold text-sm font-semibold uppercase tracking-wider mb-4">
              Stop building teams from scratch
            </p>

            <h2
              id="cta-heading"
              className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-6"
            >
              Ready to hire teams that{' '}
              <span className="text-gold">work from day one?</span>
            </h2>

            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Join 150+ companies who've discovered a smarter alternative to individual
              hiring. Browse verified teams with proven track records.
            </p>

            {/* CTA buttons - action-oriented (#04) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gold text-navy-900 font-semibold hover:bg-gold-400 transition-colors min-h-[52px] group text-lg"
              >
                Browse verified teams free
                <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/for-teams"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors min-h-[52px] text-lg"
              >
                List your team
              </Link>
            </div>

            {/* Trust reassurances - risk reducers (#47) */}
            <div className="flex flex-wrap gap-6 text-white/70 text-sm">
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-gold" aria-hidden="true" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-gold" aria-hidden="true" />
                NDA-protected browsing
              </span>
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-gold" aria-hidden="true" />
                Pay only on successful match
              </span>
            </div>
          </div>

          {/* Right - Testimonial near CTA (#83) */}
          <div className="hidden lg:block">
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              {/* Metric highlight */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                  <span className="text-gold font-bold text-xl">3x</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Repeat customer</p>
                  <p className="text-white/60 text-sm">HealthTech Innovations</p>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="mb-6">
                <p className="text-white/90 text-lg leading-relaxed">
                  "We've now acquired 3 teams through Liftout. Lower risk than M&A,
                  better cultural fit than individual hiring. The due diligence
                  process shows us exactly what we're getting."
                </p>
              </blockquote>

              {/* Author */}
              <footer className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="font-semibold text-white text-sm">MT</span>
                </div>
                <div>
                  <cite className="font-semibold text-white not-italic block">
                    Michael Torres
                  </cite>
                  <span className="text-white/60 text-sm">
                    Director of Strategic Growth
                  </span>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
