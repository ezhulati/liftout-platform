'use client';

import Link from 'next/link';
import {
  LockClosedIcon,
  DocumentMagnifyingGlassIcon,
  ShieldCheckIcon,
  KeyIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const securityLinks = [
  {
    name: 'Audit Log',
    description: 'View all admin actions and system events',
    href: '/admin/security/audit',
    icon: DocumentMagnifyingGlassIcon,
  },
];

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Security</h1>
        <p className="mt-1 text-sm text-gray-400">
          Security settings and audit logs
        </p>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="h-8 w-8 text-green-400" />
            <div>
              <p className="text-lg font-semibold text-white">Security Status: Good</p>
              <p className="text-sm text-green-400">All systems operating normally</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
          <div className="flex items-center gap-3">
            <LockClosedIcon className="h-8 w-8 text-gray-400" />
            <div>
              <p className="text-lg font-semibold text-white">Admin Access</p>
              <p className="text-sm text-gray-400">You have full admin privileges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start gap-4">
              <link.icon className="h-6 w-6 text-gray-400" />
              <div>
                <p className="text-lg font-semibold text-white">{link.name}</p>
                <p className="text-sm text-gray-400 mt-1">{link.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Security Events */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Recent Security Events</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <ShieldCheckIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No security alerts</p>
            <p className="text-sm text-gray-500 mt-1">All systems are secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
