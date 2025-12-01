'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  HeartIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';

interface EOI {
  id: string;
  status: string;
  message?: string;
  interestLevel?: string;
  createdAt: string;
  from?: {
    name: string;
    type: string;
  };
  to?: {
    name: string;
    type: string;
  };
}

interface EOIResponse {
  sent: EOI[];
  received: EOI[];
}

export function EOISummary() {
  const { data: session } = useSession();
  const isCompanyUser = session?.user?.userType === 'company';

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardEOIs'],
    queryFn: async () => {
      const response = await fetch('/api/eoi');
      if (!response.ok) {
        throw new Error('Failed to fetch EOIs');
      }
      return response.json() as Promise<EOIResponse>;
    },
  });

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            {isCompanyUser ? 'Interest Sent' : 'Interest Received'}
          </h2>
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-3 p-3 bg-bg-alt rounded-lg">
              <div className="h-10 w-10 bg-bg-elevated rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-bg-elevated rounded w-3/4 mb-2" />
                <div className="h-3 bg-bg-elevated rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            {isCompanyUser ? 'Interest Sent' : 'Interest Received'}
          </h2>
        </div>
        <p className="text-sm text-text-tertiary">Unable to load expressions of interest</p>
      </div>
    );
  }

  // Show received EOIs for teams, sent EOIs for companies
  const relevantEOIs = isCompanyUser ? data?.sent || [] : data?.received || [];
  const pendingEOIs = relevantEOIs.filter((eoi) => eoi.status === 'pending');
  const recentEOIs = relevantEOIs.slice(0, 3);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircleIcon className="h-4 w-4 text-success" />;
      case 'declined':
        return <XCircleIcon className="h-4 w-4 text-error" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gold" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'declined':
        return 'Declined';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-text-primary">
            {isCompanyUser ? 'Interest Sent' : 'Interest Received'}
          </h2>
          {pendingEOIs.length > 0 && (
            <span className="px-2 py-0.5 bg-gold/10 text-gold text-xs font-medium rounded-full">
              {pendingEOIs.length} pending
            </span>
          )}
        </div>
        <Link
          href="/app/eoi"
          className="text-sm text-navy hover:text-navy-700 font-medium flex items-center gap-1"
        >
          View all
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      {recentEOIs.length === 0 ? (
        <div className="text-center py-6">
          <HeartIcon className="h-10 w-10 mx-auto text-text-tertiary mb-2" />
          <p className="text-sm text-text-secondary">
            {isCompanyUser ? 'No interest expressed yet' : 'No interest received yet'}
          </p>
          <p className="text-xs text-text-tertiary mt-1">
            {isCompanyUser
              ? 'Browse teams and express your interest'
              : 'Companies will express interest in your team'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentEOIs.map((eoi) => (
            <Link
              key={eoi.id}
              href="/app/eoi"
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-bg-alt ${
                eoi.status === 'pending' ? 'bg-gold/5 border border-gold/20' : 'bg-bg-elevated'
              }`}
            >
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  eoi.status === 'pending'
                    ? 'bg-gold/10 text-gold'
                    : eoi.status === 'accepted'
                    ? 'bg-success/10 text-success'
                    : 'bg-bg-alt text-text-tertiary'
                }`}
              >
                {eoi.status === 'pending' ? (
                  <HeartSolidIcon className="h-5 w-5" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary text-sm truncate">
                  {isCompanyUser ? eoi.to?.name : eoi.from?.name || 'Company'}
                </p>
                {eoi.message && (
                  <p className="text-xs text-text-secondary truncate">{eoi.message}</p>
                )}
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-text-tertiary flex items-center gap-1">
                    {getStatusIcon(eoi.status)}
                    {getStatusLabel(eoi.status)}
                  </span>
                  <span className="text-xs text-text-tertiary">
                    {formatDistanceToNow(new Date(eoi.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
