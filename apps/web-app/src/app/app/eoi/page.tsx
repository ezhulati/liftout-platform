'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { EOICard } from '@/components/eoi';
import {
  PaperAirplaneIcon,
  InboxIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

// Demo data for when API returns empty
const DEMO_EOIS = {
  sent: [
    {
      id: 'demo-eoi-1',
      fromType: 'company',
      fromId: 'demo-company',
      toType: 'team',
      toId: 'techflow-data-science',
      message: 'We are very impressed with your team\'s work in FinTech analytics. We\'re building a new data science division and believe your team would be a perfect fit to lead it. Would love to discuss how we can work together.',
      interestLevel: 'high',
      specificRole: 'Lead our Data Science Division',
      timeline: '1-3 months',
      budgetRange: '1m-2m',
      status: 'pending' as const,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        toTeamName: 'TechFlow Data Science Team',
      },
    },
    {
      id: 'demo-eoi-2',
      fromType: 'company',
      fromId: 'demo-company',
      toType: 'team',
      toId: 'quantum-ai-team',
      message: 'Your team\'s healthcare AI work is exceptional. We\'re expanding into medical imaging and your expertise would accelerate our roadmap significantly.',
      interestLevel: 'medium',
      specificRole: 'Healthcare AI Research Team',
      timeline: '3-6 months',
      status: 'accepted' as const,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      respondedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        toTeamName: 'Quantum AI Research Team',
      },
    },
  ],
  received: [
    {
      id: 'demo-eoi-3',
      fromType: 'company',
      fromId: 'techcorp-demo',
      toType: 'team',
      toId: 'demo-team',
      message: 'We\'ve been following your team\'s impressive work in the fintech space. Your expertise in building scalable data pipelines and ML models aligns perfectly with our expansion plans. We\'d love to explore bringing your entire team onboard.',
      interestLevel: 'high',
      specificRole: 'Principal Engineering Team',
      timeline: '1-3 months',
      budgetRange: '500k-1m',
      status: 'pending' as const,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        fromCompanyName: 'TechCorp Industries',
        fromUserName: 'Sarah Johnson',
      },
    },
    {
      id: 'demo-eoi-4',
      fromType: 'company',
      fromId: 'healthstart-demo',
      toType: 'team',
      toId: 'demo-team',
      message: 'We are an emerging healthtech startup looking for experienced teams to help us build our core platform. Your track record speaks for itself.',
      interestLevel: 'medium',
      timeline: 'flexible',
      status: 'declined' as const,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      respondedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        fromCompanyName: 'HealthStart Inc',
        responseMessage: 'Thank you for your interest, but we are currently focused on opportunities in the fintech sector.',
      },
    },
  ],
};

export default function EOIPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [direction, setDirection] = useState<'sent' | 'received'>(
    session?.user?.userType === 'company' ? 'sent' : 'received'
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: eois, isLoading } = useQuery({
    queryKey: ['eois', direction, statusFilter === 'all' ? undefined : statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ direction });
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      const response = await fetch(`/api/eoi?${params}`);
      if (!response.ok) throw new Error('Failed to fetch EOIs');
      return response.json();
    },
  });

  // Use demo data if API returns empty
  const displayEOIs = eois?.length > 0 ? eois : DEMO_EOIS[direction];

  const filteredEOIs = displayEOIs?.filter((eoi: typeof displayEOIs[0]) => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const teamName = eoi.metadata?.toTeamName?.toLowerCase() || '';
      const companyName = eoi.metadata?.fromCompanyName?.toLowerCase() || '';
      const message = eoi.message?.toLowerCase() || '';
      return teamName.includes(searchLower) || companyName.includes(searchLower) || message.includes(searchLower);
    }
    return true;
  });

  const handleViewConversation = (eoiId: string) => {
    router.push(`/app/messages?eoi=${eoiId}`);
  };

  const stats = {
    total: displayEOIs?.length || 0,
    pending: displayEOIs?.filter((e: typeof displayEOIs[0]) => e.status === 'pending').length || 0,
    accepted: displayEOIs?.filter((e: typeof displayEOIs[0]) => e.status === 'accepted').length || 0,
    declined: displayEOIs?.filter((e: typeof displayEOIs[0]) => e.status === 'declined').length || 0,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Expressions of Interest</h1>
        <p className="text-text-secondary mt-1">
          {session?.user?.userType === 'company'
            ? 'Track your outreach to teams and manage responses'
            : 'Review and respond to interest from companies'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
          <p className="text-sm text-text-tertiary">Total EOIs</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-gold-600">{stats.pending}</p>
          <p className="text-sm text-text-tertiary">Pending</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-success">{stats.accepted}</p>
          <p className="text-sm text-text-tertiary">Accepted</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-red-500">{stats.declined}</p>
          <p className="text-sm text-text-tertiary">Declined</p>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Direction Tabs */}
        <div className="flex bg-bg-alt rounded-lg p-1">
          <button
            onClick={() => setDirection('sent')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center ${
              direction === 'sent'
                ? 'bg-bg-surface text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <PaperAirplaneIcon className="h-4 w-4 mr-2" />
            Sent
          </button>
          <button
            onClick={() => setDirection('received')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center ${
              direction === 'received'
                ? 'bg-bg-surface text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <InboxIcon className="h-4 w-4 mr-2" />
            Received
          </button>
        </div>

        {/* Search */}
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search EOIs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-bg-surface text-text-primary placeholder-text-tertiary focus:ring-2 focus:ring-navy focus:border-navy"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-border rounded-lg bg-bg-surface text-text-primary focus:ring-2 focus:ring-navy focus:border-navy appearance-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* EOI List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-5 w-1/3 skeleton rounded mb-2" />
              <div className="h-4 w-1/4 skeleton rounded mb-4" />
              <div className="h-16 skeleton rounded mb-4" />
              <div className="flex gap-4">
                <div className="h-4 w-20 skeleton rounded" />
                <div className="h-4 w-24 skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredEOIs?.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-14 h-14 mx-auto rounded-full bg-bg-elevated flex items-center justify-center mb-4">
            {direction === 'sent' ? (
              <PaperAirplaneIcon className="h-7 w-7 text-text-tertiary" />
            ) : (
              <InboxIcon className="h-7 w-7 text-text-tertiary" />
            )}
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">
            No {direction} EOIs yet
          </h3>
          <p className="text-base text-text-secondary leading-relaxed max-w-md mx-auto">
            {direction === 'sent'
              ? 'Browse teams and express interest to start the conversation'
              : 'When companies express interest in your team, they will appear here'}
          </p>
          {direction === 'sent' && (
            <button
              onClick={() => router.push('/app/teams')}
              className="btn-primary mt-6 min-h-12"
            >
              Browse Teams
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEOIs?.map((eoi: typeof filteredEOIs[0]) => (
            <EOICard
              key={eoi.id}
              eoi={eoi}
              direction={direction}
              onViewConversation={handleViewConversation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
