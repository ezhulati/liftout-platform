'use client';

import Link from 'next/link';
import { ArrowRightIcon, ShieldCheckIcon, ClockIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const trustReassurances = [
  { icon: ShieldCheckIcon, text: 'NDA-protected conversations' },
  { icon: ClockIcon, text: 'Free to explore' },
  { icon: CreditCardIcon, text: 'No credit card required' },
];

const teamTestimonials = [
  {
    quote: 'After 5 years together, we were not willing to split up. Found a company that valued our unit.',
    team: 'Engineering team, 6 members',
  },
  {
    quote: 'The confidential process meant we could explore without risking our current positions.',
    team: 'Analytics team, 4 members',
  },
  {
    quote: 'Our collective negotiation secured better terms than any of us could individually.',
    team: 'Design team, 5 members',
  },
];

export function TeamCTA() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-20 lg:py-28 overflow-hidden dark-section"
      aria-labelledby="team-cta-heading"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Soft gold glows */}
        <div className="absolute top-0 right-[20%] w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-0 left-[20%] w-80 h-80 rounded-full bg-gold/8 blur-3xl" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgb(var(--color-gold) / 0.3) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-gold) / 0.3) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* Practical UI: Left-align on desktop for body text readability */}
      <div className={`relative z-10 max-w-4xl mx-auto px-6 lg:px-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {/* Eyebrow */}
        <p className="font-semibold tracking-wider uppercase text-base mb-4 text-gold text-center lg:text-left">
          Your team's next chapter awaits
        </p>

        {/* Headline - short headlines can be centered */}
        <h2
          id="team-cta-heading"
          className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-on-dark tracking-tight leading-tight mb-6 text-center lg:text-left"
        >
          Your next opportunity should not
          <span className="block mt-2 text-gold">break up what you have built</span>
        </h2>

        {/* Description - Practical UI: left-align body text, 18px min */}
        <p className="font-body text-white/90 text-lg lg:text-xl leading-relaxed max-w-2xl mb-8 text-center lg:text-left">
          You have spent years building trust, refining processes, and achieving together.
          Companies value that. Find the right one for your team.
        </p>

        {/* Trust reassurances - Practical UI: icons with labels, 18px text */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-10">
          {trustReassurances.map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-on-dark-muted">
              <item.icon className="w-5 h-5 text-gold" aria-hidden="true" />
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
        <p className="text-on-dark-muted text-lg text-center lg:text-left">
          Already have an account?{' '}
          <Link
            href="/auth/signin"
            className="text-gold underline underline-offset-4 transition-colors hover:text-white"
          >
            Sign in
          </Link>
        </p>

        {/* What teams are saying - Practical UI: left-aligned testimonials */}
        <div className={`mt-16 pt-8 border-t border-white/20 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-white/60 text-base mb-6 uppercase tracking-wider font-semibold text-center lg:text-left">
            Teams that moved together
          </p>
          <div className="grid sm:grid-cols-3 gap-8 text-left">
            {teamTestimonials.map((item, index) => (
              <div
                key={item.team}
                className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: isVisible ? `${(index + 4) * 100}ms` : '0ms' }}
              >
                <blockquote className="font-body text-white/80 text-lg leading-relaxed mb-3 italic">
                  "{item.quote}"
                </blockquote>
                <p className="text-white/60 text-base font-medium">{item.team}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
