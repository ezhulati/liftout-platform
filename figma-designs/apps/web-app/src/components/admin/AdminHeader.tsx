'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline';

interface AdminHeaderProps {
  pendingActionsCount?: number;
}

export function AdminHeader({ pendingActionsCount = 0 }: AdminHeaderProps) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Left section - page title area (filled by parent) */}
      <div className="flex-1 flex items-center">
        {/* Placeholder for breadcrumbs or title */}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Pending actions badge */}
        {pendingActionsCount > 0 && (
          <Link
            href="/admin/moderation"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 transition-colors"
          >
            <ShieldExclamationIcon className="h-4 w-4" />
            <span className="text-sm font-medium">{pendingActionsCount} pending</span>
          </Link>
        )}

        {/* Notifications */}
        <button
          type="button"
          className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-5 w-5" aria-hidden="true" />
          {/* Notification badge */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Separator */}
        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-700" aria-hidden="true" />

        {/* User menu */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-x-3 p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                <UserCircleIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="hidden lg:flex lg:flex-col lg:items-start">
                <span className="text-sm font-semibold text-white">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-xs text-gray-400">Super Admin</span>
              </div>
            </div>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2.5 w-56 origin-top-right rounded-lg bg-gray-800 border border-gray-700 shadow-lg focus:outline-none">
              <div className="p-1">
                <div className="px-3 py-2 border-b border-gray-700 mb-1">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Super Admin Account</p>
                </div>

                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/admin/settings"
                      className={`${
                        active ? 'bg-gray-700' : ''
                      } flex items-center gap-3 px-3 py-2 text-sm text-gray-300 rounded-md`}
                    >
                      <Cog6ToothIcon className="h-4 w-4" />
                      Admin Settings
                    </Link>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/app/dashboard"
                      className={`${
                        active ? 'bg-gray-700' : ''
                      } flex items-center gap-3 px-3 py-2 text-sm text-gray-300 rounded-md`}
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      Exit Admin
                    </Link>
                  )}
                </Menu.Item>

                <div className="border-t border-gray-700 mt-1 pt-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                        className={`${
                          active ? 'bg-gray-700' : ''
                        } flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 rounded-md`}
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
}
