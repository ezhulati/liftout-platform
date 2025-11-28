'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
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

interface AppHeaderProps {
  user: User;
}

const userNavigation = [
  { name: 'Your profile', href: '/app/profile' },
  { name: 'Settings', href: '/app/settings' },
];

export function AppHeader({ user }: AppHeaderProps) {
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
    <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
      <div className="flex h-16 items-center gap-x-4 border-b border-border bg-bg-surface px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none lg:border-0">
        <button
          type="button"
          className="min-h-12 min-w-12 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-lg lg:hidden transition-colors duration-fast"
          onClick={() => {
            // This would toggle mobile sidebar - implement with context if needed
          }}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-border lg:hidden" aria-hidden="true" />

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <form className="relative flex flex-1" action="#" method="GET">
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <MagnifyingGlassIcon
              className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-text-tertiary"
              aria-hidden="true"
            />
            <input
              id="search-field"
              className="block h-full w-full border-0 py-0 pl-8 pr-0 text-text-primary bg-transparent placeholder:text-text-tertiary focus:ring-0 sm:text-sm"
              placeholder="Search teams, opportunities..."
              type="search"
              name="search"
            />
          </form>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <button
              type="button"
              className="min-h-12 min-w-12 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-elevated rounded-lg transition-colors duration-fast"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="min-h-12 flex items-center px-2 rounded-lg hover:bg-bg-elevated transition-colors duration-fast">
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
                    <span className="text-sm font-medium text-white">
                      {initials}
                    </span>
                  </div>
                )}
                <span className="hidden lg:flex lg:items-center">
                  <div className="ml-3 text-left">
                    <span
                      className="block text-sm font-semibold text-text-primary"
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
              <Transition
                as={Fragment}
                enter="transition ease-out-expo duration-base"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-instant"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-xl bg-bg-surface py-2 shadow-lg ring-1 ring-border focus:outline-none">
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
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}
