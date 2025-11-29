'use client';

import { useState, useEffect } from 'react';
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
  userId: string | null;
  companyId: string | null;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  failureReason: string | null;
  createdAt: string;
  processedAt: string | null;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  company: {
    id: string;
    name: string;
  } | null;
}

interface BillingStats {
  totalRevenue: number;
  monthlyRevenue: number;
  mrrChange: number;
  activeSubscriptions: number;
  pendingTransactions: number;
  failedTransactions: number;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; icon: typeof CheckCircleIcon; color: string }> = {
    completed: { label: 'Completed', icon: CheckCircleIcon, color: 'bg-green-500/10 text-green-400' },
    pending: { label: 'Pending', icon: ClockIcon, color: 'bg-yellow-500/10 text-yellow-400' },
    failed: { label: 'Failed', icon: ExclamationTriangleIcon, color: 'bg-red-500/10 text-red-400' },
    refunded: { label: 'Refunded', icon: CurrencyDollarIcon, color: 'bg-gray-500/10 text-gray-400' },
  };

  const cfg = config[status] || config.pending;
  const Icon = cfg.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${cfg.color}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

export default function BillingPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<BillingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'failed' | 'refunded'>('all');

  useEffect(() => {
    async function fetchBilling() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filter !== 'all') {
          params.append('status', filter);
        }
        params.append('limit', '50');

        const response = await fetch(`/api/admin/billing?${params}`);
        if (!response.ok) throw new Error('Failed to fetch billing data');

        const data = await response.json();
        setTransactions(data.transactions || []);
        setStats(data.stats || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchBilling();
  }, [filter]);

  const filteredTransactions = transactions.filter((t) => {
    if (search === '') return true;
    const email = t.user?.email || t.company?.name || '';
    return email.toLowerCase().includes(search.toLowerCase());
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
              <p className="text-2xl font-bold text-white">
                ${stats?.totalRevenue?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-gray-400">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <CreditCardIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats?.activeSubscriptions || 0}</p>
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
              <p className="text-2xl font-bold text-white">
                ${stats?.monthlyRevenue?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-gray-400">
                MRR {stats?.mrrChange !== undefined && (
                  <span className={stats.mrrChange >= 0 ? 'text-green-400' : 'text-red-400'}>
                    ({stats.mrrChange >= 0 ? '+' : ''}{stats.mrrChange}%)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats?.failedTransactions || 0}</p>
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
            placeholder="Search by email or company..."
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
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-8 text-center">
            <CurrencyDollarIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No transactions found</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User / Company
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
                      <p className="text-sm font-medium text-white">{txn.description || txn.type}</p>
                      <p className="text-xs text-gray-500">{txn.id.slice(0, 8)}...</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-300">
                        {txn.user?.email || txn.company?.name || 'N/A'}
                      </p>
                      {txn.user && (
                        <p className="text-xs text-gray-500">
                          {txn.user.firstName} {txn.user.lastName}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${
                      txn.status === 'refunded' ? 'text-gray-400' : 'text-white'
                    }`}>
                      {txn.status === 'refunded' ? '-' : ''}${txn.amount} {txn.currency}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={txn.status} />
                    {txn.failureReason && (
                      <p className="text-xs text-red-400 mt-1">{txn.failureReason}</p>
                    )}
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
        )}
      </div>
    </div>
  );
}
