'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

// Simple benefit list - Practical UI: concise, scannable
const benefits = [
  'Strength in numbers—stand out together',
  'Your current employer never sees you',
  'A known in an unknown process',
  'Move together when the fit is right',
];

export function TeamHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center bg-bg">
      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 pt-[120px] lg:pt-[140px] w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Copy */}
          <div className={`transition-all duration-700 ease-out-expo ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {/* Eyebrow - Practical UI: simple, no decorative icons */}
            <p className="font-semibold tracking-wider uppercase text-sm mb-4 text-[#4C1D95]">
              A team board, not a job board
            </p>

            {/* Headline - Practical UI: clear, no colored text breaks */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight leading-[1.1] mb-6">
              Ready for the next step? Take it together.
            </h1>

            {/* Subhead - Practical UI: 18px+, max 65 chars per line */}
            <p className="font-body text-xl text-text-secondary leading-relaxed mb-8 max-w-lg">
              Job searching alone is daunting. There&apos;s a better way. You can now take that journey with the people who&apos;ve helped you succeed. Liftout makes sure you get where you want to go—together.
            </p>

            {/* Benefits list - Practical UI: simple checkmarks, no cards */}
            <ul className="space-y-3 mb-10">
              {benefits.map((benefit, index) => (
                <li
                  key={benefit}
                  className={`flex items-center gap-3 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                  style={{ transitionDelay: `${(index + 2) * 100}ms` }}
                >
                  <CheckIcon className="w-5 h-5 text-[#4C1D95] flex-shrink-0" aria-hidden="true" />
                  <span className="text-text-secondary text-lg">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA - Practical UI: Primary + tertiary, clear hierarchy */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/signup?type=team"
                className="btn-primary min-h-12 px-8 py-3 text-lg font-semibold inline-flex items-center justify-center gap-3 group"
              >
                Register your team
                <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="#how-it-works"
                className="btn-tertiary min-h-12 px-4 py-3 text-lg inline-flex items-center justify-center"
              >
                See how it works
              </Link>
            </div>

            {/* Social proof - Practical UI: minimal, text-only */}
            <p className="mt-8 text-text-tertiary text-base">
              This didn&apos;t exist before. Now it does.
            </p>
          </div>

          {/* Right - Hero Image - Practical UI: clean, no overlays */}
          <div className={`relative transition-all duration-700 ease-out-expo delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/teams-hero-new.jpeg"
                alt="Professional team collaborating in modern office"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
