'use client';

import Link from 'next/link';
import { ArrowRightIcon, ShieldCheckIcon, ClockIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const trustReassurances = [
  { icon: ShieldCheckIcon, text: 'NDA-protected conversations' },
  { icon: ClockIcon, text: 'Free to explore' },
  { icon: CreditCardIcon, text: 'No credit card required' },
];


export function TeamCTA() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-20 lg:py-28 overflow-hidden dark-section"
      aria-labelledby="team-cta-heading"
    >

      {/* Practical UI: Left-align on desktop for body text readability */}
      <div className={`relative z-10 max-w-4xl mx-auto px-6 lg:px-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {/* Eyebrow */}
        <p className="font-semibold tracking-wider uppercase text-base mb-4 text-white/60 text-center lg:text-left">
          Your team's next chapter awaits
        </p>

        {/* Headline - short headlines can be centered */}
        <h2
          id="team-cta-heading"
          className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-on-dark tracking-tight leading-tight mb-6 text-center lg:text-left"
        >
          Your next opportunity should not break up what you have built
        </h2>

        {/* Description - Practical UI: left-align body text, 18px min */}
        <p className="font-body text-white/90 text-lg lg:text-xl leading-relaxed max-w-2xl mb-8 text-center lg:text-left">
          You have spent years building trust, refining processes, and achieving together.
          Companies value that. Find the right one for your team.
        </p>

        {/* Trust reassurances - Practical UI: icons with labels, 18px text */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-10">
          {trustReassurances.map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-white/80">
              <item.icon className="w-5 h-5 text-white" aria-hidden="true" />
              <span className="text-lg font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        {/* CTA buttons - Practical UI: Primary first (left), one primary per section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
          {/* Primary CTA - white on dark bg */}
          <Link
            href="/auth/signup?type=team"
            className="btn-primary-on-dark gap-3 px-8 py-3 text-lg group"
          >
            Register your team
            <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>

          {/* Tertiary CTA - underlined text for less important action */}
          <Link
            href="/for-companies"
            className="inline-flex items-center justify-center px-4 py-3 text-lg text-white/80 underline underline-offset-4 hover:text-white transition-colors min-h-12"
          >
            Browse teams
          </Link>
        </div>

        {/* Sign in link - Practical UI: tertiary/underlined link */}
        <p className="text-white/70 text-lg text-center lg:text-left">
          Already have an account?{' '}
          <Link
            href="/auth/signin"
            className="text-white underline underline-offset-4 transition-colors hover:text-white/80"
          >
            Sign in
          </Link>
        </p>

        {/* Pioneer message */}
        <div className={`mt-16 pt-8 border-t border-white/20 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-white/70 text-base text-center lg:text-left">
            This is the first platform built for teams. We&apos;re just getting started—join us.
          </p>
        </div>
      </div>
    </section>
  );
}
