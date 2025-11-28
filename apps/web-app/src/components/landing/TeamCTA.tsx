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
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{ backgroundColor: 'hsl(220, 65%, 15%)' }}
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
            backgroundImage: `linear-gradient(hsl(38, 50%, 55%) 1px, transparent 1px), linear-gradient(90deg, hsl(38, 50%, 55%) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className={`relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {/* Eyebrow */}
        <p className="text-gold font-semibold tracking-wider uppercase text-sm mb-4">
          Your team's next chapter awaits
        </p>

        {/* Headline */}
        <h2
          id="team-cta-heading"
          className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-6"
        >
          Your next opportunity should not
          <span className="block text-gold mt-2">break up what you have built</span>
        </h2>

        {/* Description */}
        <p className="font-body text-white/90 text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
          You have spent years building trust, refining processes, and achieving together.
          Companies value that. Find the right one for your team.
        </p>

        {/* Trust reassurances */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {trustReassurances.map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-white/80">
              <item.icon className="w-5 h-5 text-gold" aria-hidden="true" />
              <span className="text-base font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {/* Primary CTA */}
          <Link
            href="/auth/signup?type=team"
            className="group btn-secondary min-h-[52px] px-10 py-4 text-lg font-semibold inline-flex items-center justify-center gap-3"
          >
            Register your team
            <ArrowRightIcon className="w-5 h-5 transition-transform duration-fast ease-out-quart group-hover:translate-x-1" aria-hidden="true" />
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/for-companies"
            className="group min-h-[52px] px-8 py-3 rounded-lg text-lg font-semibold inline-flex items-center justify-center gap-3 border-2 border-white/40 text-white bg-transparent hover:bg-white/10 hover:border-white/60 transition-all duration-fast ease-out-quart"
          >
            Browse teams
          </Link>
        </div>

        {/* Sign in link */}
        <p className="text-white/70 text-base">
          Already have an account?{' '}
          <Link
            href="/auth/signin"
            className="text-gold hover:text-gold-300 underline underline-offset-4 transition-colors duration-fast"
          >
            Sign in here
          </Link>
        </p>

        {/* What teams are saying */}
        <div className={`mt-16 pt-8 border-t border-white/20 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-white/60 text-sm mb-6 uppercase tracking-wider font-semibold">
            Teams that moved together
          </p>
          <div className="grid sm:grid-cols-3 gap-8 text-left">
            {teamTestimonials.map((item, index) => (
              <div
                key={item.team}
                className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: isVisible ? `${(index + 4) * 100}ms` : '0ms' }}
              >
                <blockquote className="font-body text-white/80 text-base leading-relaxed mb-3 italic">
                  "{item.quote}"
                </blockquote>
                <p className="text-white/60 text-sm">{item.team}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
