'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export function TeamHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[80vh] flex items-center bg-bg">
      {/* Main content container */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 lg:py-24 pt-[120px] lg:pt-[140px] w-full text-center">
        <div className={`transition-all duration-700 ease-out-expo ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {/* The emotional hook */}
          <p className="font-body text-xl sm:text-2xl text-text-secondary leading-relaxed mb-6 italic">
            &ldquo;The job market is a lonely desert between two places that preach teamwork.&rdquo;
          </p>

          {/* The question */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight leading-[1.1] mb-8">
            Why cross it alone?
          </h1>

          {/* The value prop */}
          <p className="font-body text-xl lg:text-2xl text-text-secondary leading-relaxed mb-12 max-w-2xl mx-auto">
            Find your next opportunity with the people who helped you succeed.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup?type=team"
              className="btn-primary min-h-12 px-8 py-3 text-lg font-semibold inline-flex items-center justify-center gap-3 group"
            >
              Build your team profile
              <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              href="#how-it-works"
              className="btn-tertiary min-h-12 px-4 py-3 text-lg inline-flex items-center justify-center"
            >
              See how it works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
