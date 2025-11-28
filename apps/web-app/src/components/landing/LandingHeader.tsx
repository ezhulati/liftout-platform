'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navLinks = [
  { href: '/for-companies', label: 'For Companies' },
  { href: '/for-teams', label: 'For Teams' },
  { href: '/auth/signin', label: 'Sign In' },
];

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-base ease-out-quart ${
        isScrolled || isMobileMenuOpen
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
            onClick={() => setIsMobileMenuOpen(false)}
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-secondary hover:text-navy font-medium text-base transition-colors duration-fast ease-out-quart min-h-[44px] flex items-center"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: CTA + Mobile menu button */}
          <div className="flex items-center gap-3">
            {/* CTA Button - 44px min height, 8-point padding, Verb + Noun */}
            <Link
              href="/auth/signup"
              className="btn-secondary min-h-[44px] px-6 text-base font-semibold hidden sm:inline-flex"
            >
              Start free
            </Link>

            {/* Mobile menu button - 48px touch target */}
            <button
              type="button"
              className="md:hidden w-12 h-12 flex items-center justify-center rounded-lg text-text-secondary hover:text-navy hover:bg-navy/5 transition-colors duration-fast"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 bg-navy/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-base ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`absolute top-full left-0 right-0 bg-bg-surface border-t border-border shadow-xl md:hidden transition-all duration-base ease-out-quart z-50 ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block w-full px-4 py-3 text-text-primary hover:text-navy hover:bg-navy/5 font-medium text-lg rounded-lg transition-colors duration-fast"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile CTA */}
          <div className="pt-4 border-t border-border mt-4">
            <Link
              href="/auth/signup"
              className="btn-secondary w-full min-h-[52px] px-6 text-lg font-semibold justify-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Start free
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
