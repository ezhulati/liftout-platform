'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  BookmarkIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  TrashIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

interface SavedOpportunity {
  id: string;
  itemType: string;
  itemId: string;
  notes: string | null;
  tags: string[];
  folder: string | null;
  createdAt: string;
  item: {
    id: string;
    title: string;
    description: string;
    location: string;
    industry: string;
    teamSize: number;
    status: string;
    company: {
      id: string;
      name: string;
      logoUrl: string | null;
    };
  } | null;
}

export default function SavedOpportunitiesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<{ savedItems: SavedOpportunity[]; total: number }>({
    queryKey: ['saved-opportunities'],
    queryFn: async () => {
      const response = await fetch('/api/saved?type=opportunity');
      if (!response.ok) throw new Error('Failed to fetch saved opportunities');
      return response.json();
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch(`/api/saved?type=opportunity&id=${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Opportunity removed from saved');
      queryClient.invalidateQueries({ queryKey: ['saved-opportunities'] });
    },
    onError: () => {
      toast.error('Failed to remove opportunity');
    },
  });

  const handleRemove = async (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    setRemovingId(itemId);
    await removeMutation.mutateAsync(itemId);
    setRemovingId(null);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-bg-elevated rounded w-64 mb-6"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-bg-elevated rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="card text-center py-12">
          <p className="text-text-secondary">Failed to load saved opportunities</p>
        </div>
      </div>
    );
  }

  const savedItems = data?.savedItems || [];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary font-heading flex items-center">
          <BookmarkIconSolid className="h-6 w-6 mr-2 text-navy" />
          Saved Opportunities
        </h1>
        <p className="mt-2 text-base text-text-secondary">
          Opportunities you&apos;ve bookmarked for later review
        </p>
      </div>

      {/* Saved Items List */}
      {savedItems.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-bg-elevated flex items-center justify-center mb-4">
            <BookmarkIcon className="h-8 w-8 text-text-tertiary" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">No saved opportunities</h3>
          <p className="text-text-secondary mb-6">
            Browse opportunities and click the bookmark icon to save them here
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
          {savedItems.map((saved) => {
            const opportunity = saved.item;
            if (!opportunity) return null;

            return (
              <div
                key={saved.id}
                onClick={() => router.push(`/app/opportunities/${opportunity.id}`)}
                className="card hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {opportunity.company?.logoUrl ? (
                          <img
                            src={opportunity.company.logoUrl}
                            alt={opportunity.company.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-navy-50 flex items-center justify-center">
                            <BuildingOffice2Icon className="h-6 w-6 text-navy" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-text-primary">{opportunity.title}</h3>
                          <p className="text-sm text-text-secondary">{opportunity.company?.name}</p>
                        </div>
                      </div>

                      <p className="text-text-secondary text-sm line-clamp-2 mb-3">
                        {opportunity.description}
                      </p>

                      <div className="flex flex-wrap gap-3 text-sm text-text-tertiary">
                        <span className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {opportunity.location}
                        </span>
                        <span className="flex items-center">
                          <BriefcaseIcon className="h-4 w-4 mr-1" />
                          {opportunity.industry}
                        </span>
                        <span className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-1" />
                          {opportunity.teamSize} people
                        </span>
                      </div>

                      {saved.notes && (
                        <p className="mt-3 text-sm text-text-secondary italic border-l-2 border-navy-200 pl-3">
                          {saved.notes}
                        </p>
                      )}
                    </div>

                    <div className="ml-4 flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        opportunity.status === 'active'
                          ? 'bg-success-light text-success-dark'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {opportunity.status}
                      </span>
                      <button
                        onClick={(e) => handleRemove(e, opportunity.id)}
                        disabled={removingId === opportunity.id}
                        className="p-2 text-text-tertiary hover:text-error rounded-lg hover:bg-error/10 transition-colors"
                        title="Remove from saved"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      <p className="text-xs text-text-tertiary">
                        Saved {new Date(saved.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
