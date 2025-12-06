'use client';

import Link from 'next/link';
import { ArrowRightIcon, ShieldCheckIcon, ClockIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const trustReassurances = [
  { icon: ShieldCheckIcon, text: 'NDA-protected conversations' },
  { icon: ClockIcon, text: 'Free to explore' },
  { icon: CreditCardIcon, text: 'No credit card required' },
];

const valueProps = [
  {
    title: 'Immediate impact',
    description: 'Teams hit the ground running with established collaboration patterns.',
  },
  {
    title: 'Verified quality',
    description: 'Every team comes with documented performance history and references.',
  },
  {
    title: 'Confidential process',
    description: 'Discrete exploration protects all parties throughout negotiations.',
  },
];

export function CompanyCTA() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-20 lg:py-28 overflow-hidden dark-section"
      aria-labelledby="company-cta-heading"
    >
      {/* Practical UI: Left-align on desktop for body text readability */}
      <div className={`relative z-10 max-w-4xl mx-auto px-6 lg:px-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {/* Eyebrow - Practical UI: left-aligned */}
        <p className="font-semibold tracking-wider uppercase text-base mb-4 text-white/60">
          Ready to transform your talent strategy?
        </p>

        {/* Headline - Practical UI: left-aligned */}
        <h2
          id="company-cta-heading"
          className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-on-dark tracking-tight leading-tight mb-6"
        >
          Acquire the teams that will drive your next phase of growth
        </h2>

        {/* Description - Practical UI: left-aligned, 18px min */}
        <p className="font-body text-white/90 text-lg lg:text-xl leading-relaxed max-w-2xl mb-8">
          Stop building teams from scratch. Access proven, intact teams with verified track records
          who are ready to deliver immediate impact.
        </p>

        {/* Trust reassurances - Practical UI: left-aligned, icons with labels, 18px text */}
        <div className="flex flex-wrap gap-6 mb-10">
          {trustReassurances.map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-white/80">
              <item.icon className="w-5 h-5 text-white" aria-hidden="true" />
              <span className="text-lg font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        {/* CTA buttons - Practical UI: left-aligned, Primary + tertiary (underlined), one primary per section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Primary CTA - white on dark bg per Practical UI */}
          <Link
            href="/auth/signup?type=company"
            className="btn-primary-on-dark gap-3 px-8 py-3 text-lg group"
          >
            Post a team opportunity
            <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>

          {/* Secondary CTA - browse teams */}
          <Link
            href="/browse-teams"
            className="inline-flex items-center justify-center px-4 py-3 text-lg text-white/80 underline underline-offset-4 hover:text-white transition-colors min-h-12"
          >
            Browse teams
          </Link>
        </div>

        {/* Sign in link - Practical UI: left-aligned, tertiary/underlined link */}
        <p className="text-white/70 text-lg">
          Already have an account?{' '}
          <Link
            href="/auth/signin"
            className="text-white underline underline-offset-4 transition-colors hover:text-white/80"
          >
            Sign in
          </Link>
        </p>

        {/* Value props summary - Practical UI: left-aligned, 18px text */}
        <div className={`mt-16 pt-8 border-t border-white/20 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="grid sm:grid-cols-3 gap-8 text-left">
            {valueProps.map((item, index) => (
              <div
                key={item.title}
                className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: isVisible ? `${(index + 4) * 100}ms` : '0ms' }}
              >
                <h3 className="font-heading text-lg font-bold text-on-dark mb-2">{item.title}</h3>
                <p className="font-body text-white/80 text-lg leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
