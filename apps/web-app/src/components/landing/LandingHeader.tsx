'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navLinks = [
  { href: '/for-companies', label: 'For companies' },
  { href: '/for-teams', label: 'For teams' },
  { href: '#how-it-works', label: 'How it works' },
];

interface LandingHeaderProps {
  variant?: 'light' | 'transparent';
}

export function LandingHeader({ variant = 'light' }: LandingHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // For transparent variant, switch to light style when scrolled
  const useTransparentStyle = variant === 'transparent' && !isScrolled && !isMobileMenuOpen;

  useEffect(() => {
    const threshold = 5;

    const updateHeader = () => {
      const scrollY = window.scrollY;
      const difference = scrollY - lastScrollY.current;

      // Update background state
      setIsScrolled(scrollY > 20);

      // Update visibility state (hide on scroll down, show on scroll up)
      if (Math.abs(difference) >= threshold) {
        if (scrollY <= 0) {
          setIsVisible(true);
        } else if (difference > 0 && scrollY > 100) {
          // Scrolling down past threshold
          setIsVisible(false);
        } else if (difference < 0) {
          // Scrolling up
          setIsVisible(true);
        }
        lastScrollY.current = scrollY;
      }
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateHeader);
        ticking.current = true;
      }
    };

    lastScrollY.current = window.scrollY;
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        useTransparentStyle
          ? 'bg-transparent'
          : isScrolled || isMobileMenuOpen
            ? 'bg-white border-b border-border shadow-sm'
            : 'bg-white/95 backdrop-blur-sm'
      } ${
        isVisible || isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav className={`max-w-7xl mx-auto px-6 lg:px-8 transition-all duration-300 ${
        isScrolled ? 'py-3' : 'py-4'
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo with lifted container */}
          <Link
            href="/"
            className="flex items-center min-h-12"
            aria-label="Liftout Home"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="bg-white rounded-xl px-4 py-2 shadow-lg shadow-navy/10 hover:shadow-xl hover:shadow-navy/15 transition-shadow duration-300">
              <Image
                src="/Liftout-logo-dark.png"
                alt="Liftout"
                width={200}
                height={55}
                className="h-[55px] w-auto"
                priority
              />
            </div>
          </Link>

          {/* Desktop navigation - Practical UI: 18px text, 48px touch targets */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium text-lg transition-colors duration-200 min-h-12 flex items-center px-2 ${
                  useTransparentStyle
                    ? 'text-white/90 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side - Practical UI: Primary button with Verb+Noun label */}
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className={`hidden sm:flex font-medium text-lg transition-colors duration-200 min-h-12 items-center px-2 ${
                useTransparentStyle
                  ? 'text-white/90 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className={`min-h-12 px-6 text-base hidden sm:inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 ${
                useTransparentStyle
                  ? 'bg-white text-navy hover:bg-white/90'
                  : 'btn-primary'
              }`}
            >
              Start free
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className={`md:hidden w-12 h-12 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                useTransparentStyle
                  ? 'text-white hover:text-white hover:bg-white/10'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
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

      {/* Mobile menu panel - solid background for visibility */}
      <div
        id="mobile-menu"
        className={`absolute top-full left-0 right-0 bg-white border-b border-border md:hidden transition-all duration-300 z-50 shadow-lg ${
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
