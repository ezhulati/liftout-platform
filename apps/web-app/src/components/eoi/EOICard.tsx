'use client';

import React, { useState } from 'react';
import {
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface EOI {
  id: string;
  fromType: string;
  fromId: string;
  toType: string;
  toId: string;
  message: string;
  interestLevel: string;
  specificRole?: string;
  timeline?: string;
  budgetRange?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
  expiresAt?: string;
  respondedAt?: string;
  metadata?: {
    responseMessage?: string;
    respondedBy?: string;
    fromUserName?: string;
    fromCompanyName?: string;
    toTeamName?: string;
  };
}

interface EOICardProps {
  eoi: EOI;
  direction: 'sent' | 'received';
  onViewConversation?: (eoiId: string) => void;
}

export function EOICard({ eoi, direction, onViewConversation }: EOICardProps) {
  const queryClient = useQueryClient();
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const respondToEOI = useMutation({
    mutationFn: async ({ status, message }: { status: 'accepted' | 'declined'; message: string }) => {
      const response = await fetch(`/api/eoi/${eoi.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, responseMessage: message }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to respond');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eois'] });
      setShowResponseModal(false);
    },
  });

  const getStatusBadge = () => {
    switch (eoi.status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-100 text-gold-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
            <CheckIcon className="h-3 w-3 mr-1" />
            Accepted
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XMarkIcon className="h-3 w-3 mr-1" />
            Declined
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  const getInterestLevelIndicator = () => {
    const colors = {
      high: 'bg-success',
      medium: 'bg-navy',
      low: 'bg-gold-500',
    };
    return (
      <div className="flex items-center gap-1.5">
        <div className={`h-2 w-2 rounded-full ${colors[eoi.interestLevel as keyof typeof colors] || 'bg-gray-400'}`} />
        <span className="text-xs text-text-secondary capitalize">{eoi.interestLevel} interest</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <div className="card p-5 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-text-primary">
              {direction === 'sent'
                ? eoi.metadata?.toTeamName || 'Team'
                : eoi.metadata?.fromCompanyName || 'Company'}
            </h3>
            <p className="text-sm text-text-tertiary">
              {direction === 'sent' ? 'Sent' : 'Received'} on {formatDate(eoi.createdAt)}
            </p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Message */}
        <p className="text-sm text-text-secondary mb-4 line-clamp-3">{eoi.message}</p>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            {getInterestLevelIndicator()}
          </div>
          {eoi.timeline && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <CalendarIcon className="h-4 w-4 text-text-tertiary" />
              <span>{eoi.timeline}</span>
            </div>
          )}
          {eoi.specificRole && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <UserGroupIcon className="h-4 w-4 text-text-tertiary" />
              <span className="truncate">{eoi.specificRole}</span>
            </div>
          )}
          {eoi.budgetRange && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <CurrencyDollarIcon className="h-4 w-4 text-text-tertiary" />
              <span>{eoi.budgetRange.replace(/-/g, ' - ').replace(/k/gi, 'K')}</span>
            </div>
          )}
        </div>

        {/* Response Message (if declined) */}
        {eoi.status === 'declined' && eoi.metadata?.responseMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-xs font-medium text-red-800 mb-1">Response:</p>
            <p className="text-sm text-red-700">{eoi.metadata.responseMessage}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {/* For received EOIs that are pending */}
          {direction === 'received' && eoi.status === 'pending' && (
            <>
              <button
                onClick={() => respondToEOI.mutate({ status: 'accepted', message: '' })}
                disabled={respondToEOI.isPending}
                className="flex-1 btn-primary inline-flex items-center justify-center text-sm py-2"
              >
                <CheckIcon className="h-4 w-4 mr-1.5" />
                Accept
              </button>
              <button
                onClick={() => setShowResponseModal(true)}
                disabled={respondToEOI.isPending}
                className="flex-1 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm inline-flex items-center justify-center"
              >
                <XMarkIcon className="h-4 w-4 mr-1.5" />
                Decline
              </button>
            </>
          )}

          {/* For accepted EOIs - view conversation */}
          {eoi.status === 'accepted' && onViewConversation && (
            <button
              onClick={() => onViewConversation(eoi.id)}
              className="flex-1 btn-primary inline-flex items-center justify-center text-sm py-2"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1.5" />
              View Conversation
            </button>
          )}

          {/* For pending sent EOIs */}
          {direction === 'sent' && eoi.status === 'pending' && (
            <div className="flex-1 text-center text-sm text-text-tertiary py-2">
              Awaiting response...
            </div>
          )}
        </div>
      </div>

      {/* Decline Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface rounded-xl shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-text-primary">Decline EOI</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-text-secondary mb-4">
                Optionally provide a message explaining why you&apos;re declining this expression of interest.
              </p>
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="e.g., We're not looking for new opportunities at this time..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-bg-surface text-text-primary placeholder-text-tertiary focus:ring-2 focus:ring-navy focus:border-navy"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-text-primary hover:bg-bg-alt transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => respondToEOI.mutate({ status: 'declined', message: responseMessage })}
                  disabled={respondToEOI.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {respondToEOI.isPending ? 'Declining...' : 'Decline EOI'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
