'use client';

import { Fragment, useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Menu, Transition } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import type { User } from '@/types/firebase';
import { GlobalSearch } from '@/components/search/GlobalSearch';

interface AppHeaderProps {
  user: User;
}

function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const threshold = 5;

    const updateVisibility = () => {
      const scrollY = window.scrollY;
      const difference = scrollY - lastScrollY.current;

      if (Math.abs(difference) >= threshold) {
        if (scrollY <= 0) {
          setIsVisible(true);
        } else if (difference > 0) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        lastScrollY.current = scrollY;
      }
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateVisibility);
        ticking.current = true;
      }
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isVisible;
}

const userNavigation = [
  { name: 'Your profile', href: '/app/profile' },
  { name: 'Settings', href: '/app/settings' },
];

export function AppHeader({ user }: AppHeaderProps) {
  const isVisible = useScrollDirection();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get the portal root element
  const getPortalRoot = useCallback(() => {
    if (typeof document === 'undefined') return null;
    return document.getElementById('dropdown-portal') || document.body;
  }, []);

  const updateDropdownPosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, []);

  // Keyboard shortcut to open search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isCompanyUser = user.type === 'company';
  const nameParts = user.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts[1] || '';
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();

  return (
    <header
      className={`sticky top-0 z-[100] bg-bg-surface transition-transform duration-300 ease-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="lg:mx-auto lg:max-w-7xl lg:px-8">
        <div className="flex h-16 items-center gap-x-4 border-b border-border bg-bg-surface px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none lg:border-0">
        <Link
          href="/app/dashboard"
          className="min-h-12 min-w-12 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-lg lg:hidden transition-colors duration-fast"
        >
          <span className="sr-only">Go to dashboard</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </Link>

        {/* Separator */}
        <div className="h-6 w-px bg-border lg:hidden" aria-hidden="true" />

        <div className="flex flex-1 gap-x-4 self-stretch items-center lg:gap-x-6">
          {/* Search trigger button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="group relative flex items-center gap-2 px-3 py-2 min-h-10 text-sm text-text-secondary rounded-lg hover:bg-bg-alt transition-colors"
          >
            <MagnifyingGlassIcon
              className="h-5 w-5 flex-shrink-0 text-text-tertiary"
              aria-hidden="true"
            />
            <span className="hidden sm:inline">{isCompanyUser ? 'Search teams...' : 'Search opportunities...'}</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 ml-2 rounded border border-border bg-bg-surface px-1.5 py-0.5 text-xs text-text-tertiary">
              <span>⌘</span>K
            </kbd>
          </button>

          {/* Right side actions */}
          <div className="flex items-center gap-x-2 lg:gap-x-4 ml-auto">
            <button
              type="button"
              className="min-h-12 min-w-12 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-elevated rounded-lg transition-colors duration-fast"
              onClick={() => {
                toast('No new notifications', { icon: '🔔' });
              }}
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

            {/* Profile dropdown - using portal for proper z-index */}
            <Menu as="div" className="relative">
              {({ open }) => (
                <>
                  <Menu.Button
                    ref={buttonRef}
                    onClick={updateDropdownPosition}
                    className="min-h-12 flex items-center px-2 rounded-lg hover:bg-bg-elevated transition-colors duration-fast"
                  >
                    <span className="sr-only">Open user menu</span>
                    {user.photoURL ? (
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={user.photoURL}
                        alt=""
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-navy flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {initials}
                        </span>
                      </div>
                    )}
                    <span className="hidden lg:flex lg:items-center">
                      <div className="ml-3 text-left">
                        <span
                          className="block text-sm font-bold text-text-primary"
                          aria-hidden="true"
                        >
                          {user.name}
                        </span>
                        <div className="flex items-center mt-0.5">
                          {isCompanyUser ? (
                            <BuildingOfficeIcon className="h-3 w-3 text-navy mr-1" />
                          ) : (
                            <UserGroupIcon className="h-3 w-3 text-gold mr-1" />
                          )}
                          <span className="text-xs text-text-tertiary">
                            {isCompanyUser ? 'Company' : 'Team'}
                          </span>
                        </div>
                      </div>
                      <ChevronDownIcon
                        className="ml-2 h-5 w-5 text-text-tertiary"
                        aria-hidden="true"
                      />
                    </span>
                  </Menu.Button>
                  {isMounted && getPortalRoot() && createPortal(
                    <Transition
                      show={open}
                      as={Fragment}
                      enter="transition ease-out-expo duration-base"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-instant"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items
                        static
                        className="fixed w-52 origin-top-right rounded-xl bg-bg-surface py-2 shadow-lg ring-1 ring-border focus:outline-none pointer-events-auto"
                        style={{
                          top: dropdownPosition.top,
                          right: dropdownPosition.right,
                        }}
                      >
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                href={item.href}
                                className={`flex items-center px-4 py-3 min-h-12 text-base transition-colors duration-fast ${
                                  active ? 'bg-bg-elevated text-text-primary' : 'text-text-secondary'
                                }`}
                              >
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                        <div className="my-1 border-t border-border" />
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleSignOut}
                              className={`flex items-center w-full text-left px-4 py-3 min-h-12 text-base transition-colors duration-fast ${
                                active ? 'bg-bg-elevated text-error' : 'text-text-secondary'
                              }`}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>,
                    getPortalRoot()!
                  )}
                </>
              )}
            </Menu>
          </div>
        </div>
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
}
