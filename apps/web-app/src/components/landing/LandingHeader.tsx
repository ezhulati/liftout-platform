'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navLinks = [
  { href: '/for-companies', label: 'For companies' },
  { href: '/for-teams', label: 'For teams' },
  { href: '#how-it-works', label: 'How it works' },
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-bg-surface/95 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <nav className={`max-w-7xl mx-auto px-6 lg:px-8 transition-all duration-300 ${
        isScrolled ? 'py-3' : 'py-4'
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center min-h-12"
            aria-label="Liftout Home"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Image
              src="/Liftout-logo-dark.png"
              alt="Liftout"
              width={240}
              height={66}
              className="h-[66px] w-auto"
              priority
            />
          </Link>

          {/* Desktop navigation - Practical UI: 18px text, 48px touch targets */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-secondary hover:text-text-primary font-medium text-lg transition-colors duration-200 min-h-12 flex items-center px-2"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side - Practical UI: Primary button with Verb+Noun label */}
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="hidden sm:flex text-text-secondary hover:text-text-primary font-medium text-lg transition-colors duration-200 min-h-12 items-center px-2"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="btn-primary min-h-12 px-6 text-base hidden sm:inline-flex"
            >
              Start free
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden w-12 h-12 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors duration-200"
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
        className={`fixed inset-0 bg-text-primary/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`absolute top-full left-0 right-0 bg-bg-surface border-b border-border md:hidden transition-all duration-300 z-50 ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        {/* Practical UI: 18px text, 48px touch targets for mobile */}
        <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block w-full px-4 py-4 text-text-primary hover:bg-bg-elevated font-medium text-lg rounded-lg transition-colors duration-200 min-h-12"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-4 border-t border-border mt-4 space-y-3">
            <Link
              href="/auth/signin"
              className="block w-full px-4 py-4 text-text-secondary hover:bg-bg-elevated font-medium text-lg rounded-lg transition-colors duration-200 min-h-12"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="btn-primary w-full min-h-12 justify-center text-lg"
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
