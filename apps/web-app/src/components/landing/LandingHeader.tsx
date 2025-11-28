'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

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
          {/* Logo with lifted container - Enterprise refinement: subtle lift animation */}
          <Link
            href="/"
            className="flex items-center min-h-12 group"
            aria-label="Liftout Home"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="relative bg-white rounded-xl px-4 py-2 shadow-lg shadow-navy/10 group-hover:shadow-xl group-hover:shadow-navy/15 group-hover:-translate-y-0.5 transition-all duration-300 ease-out">
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-navy/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image
                src="/Liftout-logo-dark.png"
                alt="Liftout"
                width={200}
                height={55}
                className="h-[55px] w-auto relative"
                priority
              />
            </div>
          </Link>

          {/* Desktop navigation with dropdowns - Enterprise refinement */}
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
                  className={`group font-medium text-[15px] transition-all duration-200 min-h-12 flex items-center gap-1.5 px-4 rounded-lg ${
                    useTransparentStyle
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  } ${activeDropdown === link.label ? (useTransparentStyle ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-900') : ''}`}
                >
                  {link.label}
                  {link.submenu && (
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === link.label ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </Link>

                {/* Dropdown menu - Enterprise refinement with descriptions */}
                {link.submenu && (
                  <div
                    className={`absolute top-full left-0 pt-2 transition-all duration-200 ${
                      activeDropdown === link.label
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="bg-white rounded-xl shadow-xl shadow-gray-900/10 border border-gray-100 p-2 min-w-[280px] backdrop-blur-xl">
                      {/* Subtle top accent line */}
                      <div className="absolute top-2 left-4 right-4 h-px bg-gradient-to-r from-transparent via-navy/20 to-transparent" />

                      {link.submenu.map((item, idx) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="group/item flex flex-col gap-0.5 px-4 py-3 rounded-lg hover:bg-navy/5 transition-colors duration-150"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <span className="font-medium text-gray-900 group-hover/item:text-navy transition-colors text-[15px]">
                            {item.label}
                          </span>
                          <span className="text-sm text-gray-500 group-hover/item:text-gray-600 transition-colors">
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

          {/* Right side - Enterprise refinement: polished CTAs */}
          <div className="flex items-center gap-2">
            <Link
              href="/auth/signin"
              className={`hidden sm:flex font-medium text-[15px] transition-all duration-200 min-h-11 items-center px-4 rounded-lg ${
                useTransparentStyle
                  ? 'text-white/90 hover:text-white hover:bg-white/10'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className={`group relative min-h-11 px-5 text-[15px] hidden sm:inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 overflow-hidden ${
                useTransparentStyle
                  ? 'bg-white text-navy hover:bg-white/95 shadow-lg shadow-white/20'
                  : 'bg-navy text-white hover:bg-navy-600 shadow-lg shadow-navy/25 hover:shadow-xl hover:shadow-navy/30 hover:-translate-y-0.5'
              }`}
            >
              {/* Subtle shimmer effect on hover */}
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
