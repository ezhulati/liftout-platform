'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

/**
 * Practical UI Header
 *
 * Design principles applied:
 * - 48pt minimum touch targets (Fitts's Law)
 * - 18px body text minimum for readability
 * - 8pt spacing system (XS:8, S:16, M:24, L:32)
 * - Single primary CTA per screen
 * - Verb + Noun button labels ("Start free" → action-oriented)
 * - 4.5:1 contrast ratio for text
 * - Left-aligned buttons (primary first)
 */

const navLinks = [
  {
    href: '/for-companies',
    label: 'For companies',
    submenu: [
      { href: '/for-companies#discover', label: 'Discover teams', description: 'Find pre-vetted, high-performing teams' },
      { href: '/for-companies#process', label: 'How it works', description: 'Our streamlined liftout process' },
      { href: '/for-companies#pricing', label: 'Pricing', description: 'Transparent, success-based pricing' },
    ]
  },
  {
    href: '/for-teams',
    label: 'For teams',
    submenu: [
      { href: '/for-teams#opportunities', label: 'Explore opportunities', description: 'Browse confidential liftout positions' },
      { href: '/for-teams#profile', label: 'Create team profile', description: 'Showcase your team\'s capabilities' },
      { href: '/for-teams#success', label: 'Success stories', description: 'Teams that made the move' },
    ]
  },
  { href: '#how-it-works', label: 'How it works' },
];

interface LandingHeaderProps {
  variant?: 'light' | 'transparent';
}

export function LandingHeader({ variant = 'light' }: LandingHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // For transparent variant, switch to light style when scrolled
  const useTransparentStyle = variant === 'transparent' && !isScrolled && !isMobileMenuOpen;

  // Handle dropdown with delay for better UX
  const handleMouseEnter = (label: string) => {
    if (dropdownTimeout) clearTimeout(dropdownTimeout);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => setActiveDropdown(null), 150);
    setDropdownTimeout(timeout);
  };

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

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        useTransparentStyle
          ? 'bg-transparent'
          : isScrolled || isMobileMenuOpen
            ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
            : 'bg-white/60 backdrop-blur-md'
      } ${
        isVisible || isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Subtle top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-navy/20 to-transparent transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`} />

      <nav className={`max-w-7xl mx-auto px-6 lg:px-8 transition-all duration-300 ${
        isScrolled ? 'py-2.5' : 'py-4'
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo - Premium badge style with subtle border and inner glow */}
          <Link
            href="/"
            className="flex items-center min-h-12 group"
            aria-label="Liftout Home"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="relative bg-gradient-to-b from-white to-gray-50/80 rounded-xl px-5 py-2.5 border border-gray-200/80 group-hover:border-gray-300/90 transition-all duration-300 ease-out">
              {/* Inner glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/60 via-transparent to-transparent" />
              {/* Subtle bottom shadow for depth */}
              <div className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent" />
              {/* Hover highlight */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-navy/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image
                src="/Liftout-logo-dark.png"
                alt="Liftout"
                width={180}
                height={48}
                className="h-[48px] w-auto relative"
                priority
              />
            </div>
          </Link>

          {/* Desktop navigation - Practical UI: 18px text, 48pt touch targets, 16pt gaps */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.submenu && handleMouseEnter(link.label)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={link.href}
                  className={`group font-medium text-[17px] transition-all duration-200 min-h-12 flex items-center gap-1.5 px-4 rounded-xl ${
                    useTransparentStyle
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                  } ${activeDropdown === link.label ? (useTransparentStyle ? 'bg-white/10 text-white' : 'bg-gray-100/80 text-gray-900') : ''}`}
                >
                  {link.label}
                  {link.submenu && (
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform duration-200 opacity-60 ${
                        activeDropdown === link.label ? 'rotate-180 opacity-100' : ''
                      }`}
                    />
                  )}
                </Link>

                {/* Dropdown menu - Premium glass effect with refined shadows */}
                {link.submenu && (
                  <div
                    className={`absolute top-full left-0 pt-3 transition-all duration-200 ${
                      activeDropdown === link.label
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-gray-900/10 border border-gray-200/80 p-2 min-w-[300px]">
                      {/* Inner glow */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
                      {link.submenu.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="group/item relative flex flex-col gap-0.5 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-150 min-h-12"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <span className="font-semibold text-gray-900 group-hover/item:text-navy transition-colors text-[17px] leading-tight">
                            {item.label}
                          </span>
                          <span className="text-sm text-gray-500 group-hover/item:text-gray-600 transition-colors leading-snug">
                            {item.description}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side - Practical UI: Primary (solid), Secondary (border), 16pt gap */}
          <div className="flex items-center gap-4">
            {/* Secondary button - border + action color text (Practical UI pattern) */}
            <Link
              href="/auth/signin"
              className={`hidden sm:flex font-medium text-lg transition-all duration-200 min-h-12 items-center px-5 rounded-xl border ${
                useTransparentStyle
                  ? 'text-white border-white/30 hover:border-white/50 hover:bg-white/10'
                  : 'text-navy border-navy/20 hover:border-navy/40 hover:bg-navy/5'
              }`}
            >
              Sign in
            </Link>
            {/* Primary button - solid fill, ONE per screen, Verb+Noun label */}
            <Link
              href="/auth/signup"
              className={`group relative min-h-12 px-6 text-lg hidden sm:inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 overflow-hidden ${
                useTransparentStyle
                  ? 'bg-white text-navy hover:bg-gray-50 shadow-lg shadow-black/10'
                  : 'bg-gradient-to-b from-navy to-navy-600 text-white shadow-lg shadow-navy/30 hover:shadow-xl hover:shadow-navy/40 hover:-translate-y-0.5 border border-navy-500/50'
              }`}
            >
              {/* Inner highlight for depth */}
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              {/* Shimmer on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="relative">Start free</span>
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
        className={`fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile menu panel - Premium glass effect */}
      <div
        id="mobile-menu"
        className={`absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 md:hidden transition-all duration-300 ease-out z-50 shadow-xl shadow-gray-900/10 ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        {/* Practical UI: 16pt mobile margins, 8pt vertical spacing */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Navigation links - Practical UI: single column, 48pt targets */}
          <div className="space-y-1">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center justify-between w-full px-4 py-4 text-gray-900 hover:bg-gray-50 font-medium text-lg rounded-xl transition-colors duration-150 min-h-12"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                  {link.submenu && (
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  )}
                </Link>
                {/* Submenu items - Practical UI: visual hierarchy with indentation */}
                {link.submenu && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                    {link.submenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-3 text-gray-600 hover:text-navy hover:bg-gray-50 text-base rounded-lg transition-colors duration-150 min-h-12"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Practical UI: M spacing (24pt) between sections */}
          <div className="my-6 h-px bg-gray-200" />

          {/* Auth buttons - Practical UI: Primary on top (mobile), full-width, 48pt targets */}
          <div className="space-y-3">
            {/* Primary button first on mobile (stacked vertically) */}
            <Link
              href="/auth/signup"
              className="group relative flex items-center justify-center w-full px-4 py-4 bg-gradient-to-b from-navy to-navy-600 text-white font-semibold text-lg rounded-xl transition-all duration-200 min-h-12 shadow-lg shadow-navy/30 overflow-hidden border border-navy-500/50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="relative">Start free</span>
            </Link>
            {/* Secondary button - border + action color (Practical UI) */}
            <Link
              href="/auth/signin"
              className="flex items-center justify-center w-full px-4 py-4 text-navy hover:bg-navy/5 font-medium text-lg rounded-xl transition-all duration-200 min-h-12 border border-navy/20 hover:border-navy/40"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
