'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-base ease-out-quart ${
        isScrolled
          ? 'bg-bg-surface/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      {/* 8-point grid: py-3 = 24px scrolled, py-5 = 40px default */}
      <nav className={`max-w-7xl mx-auto px-6 lg:px-8 transition-all duration-base ease-out-quart ${
        isScrolled ? 'py-3' : 'py-5'
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group min-h-[44px] min-w-[44px]"
            aria-label="Liftout Home"
          >
            <Image
              src="/logo-icon.png"
              alt="Liftout"
              width={40}
              height={40}
              className="w-10 h-10 transition-transform duration-fast ease-out-quart group-hover:scale-105"
              priority
            />
            <span className="font-heading font-bold text-2xl text-navy tracking-tight leading-none">Liftout</span>
          </Link>

          {/* Navigation links - hidden on mobile, shown on larger screens */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              href="/for-companies"
              className="text-text-secondary hover:text-navy font-medium text-base transition-colors duration-fast ease-out-quart min-h-[44px] flex items-center"
            >
              For Companies
            </Link>
            <Link
              href="/for-teams"
              className="text-text-secondary hover:text-navy font-medium text-base transition-colors duration-fast ease-out-quart min-h-[44px] flex items-center"
            >
              For Teams
            </Link>
            <Link
              href="/auth/signin"
              className="text-text-secondary hover:text-navy font-medium text-base transition-colors duration-fast ease-out-quart min-h-[44px] flex items-center"
            >
              Sign In
            </Link>
          </div>

          {/* CTA Button - 44px min height, 8-point padding, Verb + Noun */}
          <Link
            href="/auth/signup"
            className="btn-secondary min-h-[44px] px-6 text-base font-semibold"
          >
            Start free
          </Link>
        </div>
      </nav>
    </header>
  );
}
