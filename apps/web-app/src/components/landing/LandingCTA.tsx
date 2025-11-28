'use client';

import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ShieldCheckIcon, ClockIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const trustReassurances = [
  { icon: ShieldCheckIcon, text: 'NDA-protected conversations' },
  { icon: ClockIcon, text: 'Free to explore' },
  { icon: CreditCardIcon, text: 'No credit card required' },
];

export function LandingCTA() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 bg-navy-900"
      aria-labelledby="cta-heading"
    >
      <div className={`max-w-7xl mx-auto px-6 lg:px-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {/* Left-aligned content */}
        <div className="max-w-2xl">
          <p className="text-navy-200 font-semibold text-sm mb-3">
            Ready to transform your growth?
          </p>

          <h2
            id="cta-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-6"
          >
            Start acquiring proven teams today
          </h2>

          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Whether you are a company seeking proven teams or a high-performing team exploring new opportunities, Liftout connects you with the right strategic partnerships.
          </p>

          {/* Trust reassurances */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-10">
            {trustReassurances.map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-white/70">
                <item.icon className="w-5 h-5 text-white/50" aria-hidden="true" />
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons - left aligned */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-white text-navy-900 font-semibold hover:bg-white/90 transition-colors min-h-[48px] group"
            >
              Create free account
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors min-h-[48px]"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
