'use client';

import { useState } from 'react';
import {
  CreditCardIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface Transaction {
  id: string;
  userId: string;
  userEmail: string;
  type: 'subscription' | 'one_time' | 'refund';
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  description: string;
  createdAt: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'txn-1',
    userId: 'user-123',
    userEmail: 'company@example.com',
    type: 'subscription',
    amount: 299,
    status: 'completed',
    description: 'Pro Plan - Monthly',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'txn-2',
    userId: 'user-456',
    userEmail: 'enterprise@example.com',
    type: 'subscription',
    amount: 999,
    status: 'completed',
    description: 'Enterprise Plan - Monthly',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'txn-3',
    userId: 'user-789',
    userEmail: 'team@example.com',
    type: 'one_time',
    amount: 49,
    status: 'completed',
    description: 'Team Verification Fee',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'txn-4',
    userId: 'user-101',
    userEmail: 'failed@example.com',
    type: 'subscription',
    amount: 299,
    status: 'failed',
    description: 'Pro Plan - Monthly (Card Declined)',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
];

function StatusBadge({ status }: { status: Transaction['status'] }) {
  const config = {
    completed: { label: 'Completed', icon: CheckCircleIcon, color: 'bg-green-500/10 text-green-400' },
    pending: { label: 'Pending', icon: ClockIcon, color: 'bg-yellow-500/10 text-yellow-400' },
    failed: { label: 'Failed', icon: ExclamationTriangleIcon, color: 'bg-red-500/10 text-red-400' },
    refunded: { label: 'Refunded', icon: CurrencyDollarIcon, color: 'bg-gray-500/10 text-gray-400' },
  }[status];

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

export default function BillingPage() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'failed' | 'refunded'>('all');

  // Calculate stats
  const totalRevenue = transactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const failedPayments = transactions.filter((t) => t.status === 'failed').length;

  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch =
      search === '' || t.userEmail.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Billing Management</h1>
        <p className="mt-1 text-sm text-gray-400">
          View transactions, manage subscriptions, and process refunds
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <CurrencyDollarIcon className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Total Revenue (30d)</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <CreditCardIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">156</p>
              <p className="text-sm text-gray-400">Active Subscriptions</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <ArrowTrendingUpIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">$42,350</p>
              <p className="text-sm text-gray-400">MRR</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{failedPayments}</p>
              <p className="text-sm text-gray-400">Failed Payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'completed', 'failed', 'refunded'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === status
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions table */}
      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredTransactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-white">{txn.description}</p>
                    <p className="text-xs text-gray-500">{txn.id}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">{txn.userEmail}</td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${
                    txn.status === 'refunded' ? 'text-gray-400' : 'text-white'
                  }`}>
                    {txn.status === 'refunded' ? '-' : ''}${txn.amount}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={txn.status} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{formatDate(txn.createdAt)}</td>
                <td className="px-6 py-4 text-right">
                  {txn.status === 'completed' && (
                    <button className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors">
                      Refund
                    </button>
                  )}
                  {txn.status === 'failed' && (
                    <button className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
                      Retry
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
