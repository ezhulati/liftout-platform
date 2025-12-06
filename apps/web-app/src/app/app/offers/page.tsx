'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  GiftIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface Offer {
  id: string;
  applicationId: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'negotiating';
  createdAt: string;
  expiresAt: string | null;
  salary: string | null;
  equity: string | null;
  startDate: string | null;
  notes: string | null;
  opportunity: {
    id: string;
    title: string;
    company: {
      id: string;
      name: string;
      logoUrl: string | null;
    };
  };
  team: {
    id: string;
    name: string;
  };
}

export default function OffersPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');

  const { data, isLoading } = useQuery<{ offers: Offer[] }>({
    queryKey: ['offers', filter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      const response = await fetch(`/api/offers?${params}`);
      if (!response.ok) {
        // Return empty list if API doesn't exist
        return { offers: [] };
      }
      return response.json();
    },
  });

  const getStatusBadge = (status: Offer['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-100 text-gold-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending Review
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-light text-success-dark">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Accepted
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <XCircleIcon className="h-3 w-3 mr-1" />
            Declined
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error/10 text-error">
            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
            Expired
          </span>
        );
      case 'negotiating':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <ChatBubbleLeftRightIcon className="h-3 w-3 mr-1" />
            Negotiating
          </span>
        );
    }
  };

  const offers = data?.offers || [];
  const filteredOffers = filter === 'all' ? offers : offers.filter((o) => o.status === filter);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-bg-elevated rounded w-48"></div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-bg-elevated rounded w-24"></div>
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-bg-elevated rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="page-header mb-8">
        <h1 className="page-title">Offers</h1>
        <p className="page-subtitle">Team offers and contracts.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'all', label: 'All Offers' },
          { id: 'pending', label: 'Pending' },
          { id: 'accepted', label: 'Accepted' },
          { id: 'declined', label: 'Declined' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as typeof filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.id
                ? 'bg-navy text-white'
                : 'bg-bg-elevated text-text-secondary hover:bg-bg-alt'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Offers List */}
      {filteredOffers.length === 0 ? (
        <div className="card text-center py-12">
          <GiftIcon className="h-12 w-12 mx-auto text-text-tertiary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            {filter === 'all' ? 'No offers yet' : `No ${filter} offers`}
          </h3>
          <p className="text-text-secondary mb-6">
            When companies extend offers to your team, they&apos;ll appear here
          </p>
          <button
            onClick={() => router.push('/app/opportunities')}
            className="btn-primary"
          >
            Browse Opportunities
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              onClick={() => router.push(`/app/applications/${offer.applicationId}`)}
              className="card hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {offer.opportunity.company.logoUrl ? (
                        <img
                          src={offer.opportunity.company.logoUrl}
                          alt={offer.opportunity.company.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-navy-50 flex items-center justify-center">
                          <BuildingOffice2Icon className="h-6 w-6 text-navy" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-text-primary">
                          {offer.opportunity.title}
                        </h3>
                        <p className="text-sm text-text-secondary">
                          {offer.opportunity.company.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-text-tertiary mt-3">
                      {offer.salary && (
                        <span className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          {offer.salary}
                        </span>
                      )}
                      {offer.startDate && (
                        <span className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Start: {new Date(offer.startDate).toLocaleDateString()}
                        </span>
                      )}
                      {offer.equity && (
                        <span className="flex items-center">
                          Equity: {offer.equity}
                        </span>
                      )}
                    </div>

                    {offer.notes && (
                      <p className="mt-3 text-sm text-text-secondary line-clamp-2">
                        {offer.notes}
                      </p>
                    )}
                  </div>

                  <div className="ml-4 flex flex-col items-end gap-2">
                    {getStatusBadge(offer.status)}
                    <p className="text-xs text-text-tertiary">
                      Received {new Date(offer.createdAt).toLocaleDateString()}
                    </p>
                    {offer.expiresAt && offer.status === 'pending' && (
                      <p className="text-xs text-gold-600">
                        Expires {new Date(offer.expiresAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action buttons for pending offers */}
                {offer.status === 'pending' && (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/app/applications/${offer.applicationId}?action=accept`);
                      }}
                      className="btn-primary flex-1"
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Accept Offer
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/app/applications/${offer.applicationId}?action=negotiate`);
                      }}
                      className="btn-outline flex-1"
                    >
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                      Negotiate
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/app/applications/${offer.applicationId}?action=decline`);
                      }}
                      className="btn-outline text-error border-error hover:bg-error/10 flex-1"
                    >
                      <XCircleIcon className="h-4 w-4 mr-2" />
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
