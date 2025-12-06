'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  BookmarkIcon,
  MapPinIcon,
  UserGroupIcon,
  TrashIcon,
  StarIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

interface SavedTeam {
  id: string;
  itemType: string;
  itemId: string;
  notes: string | null;
  tags: string[];
  folder: string | null;
  createdAt: string;
  item: {
    id: string;
    name: string;
    description: string;
    industry: string;
    location: string;
    size: number;
    cohesionScore: number;
  } | null;
}

export default function SavedTeamsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<{ savedItems: SavedTeam[]; total: number }>({
    queryKey: ['saved-teams'],
    queryFn: async () => {
      const response = await fetch('/api/saved?type=team');
      if (!response.ok) throw new Error('Failed to fetch saved teams');
      return response.json();
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch(`/api/saved?type=team&id=${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Team removed from saved');
      queryClient.invalidateQueries({ queryKey: ['saved-teams'] });
    },
    onError: () => {
      toast.error('Failed to remove team');
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
      <div className="space-y-6">
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
      <div className="space-y-6">
        <div className="card text-center py-12">
          <p className="text-text-secondary">Failed to load saved teams</p>
        </div>
      </div>
    );
  }

  const savedItems = data?.savedItems || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Saved Teams</h1>
        <p className="page-subtitle">Teams you've bookmarked.</p>
      </div>

      {/* Saved Items List */}
      {savedItems.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-bg-elevated flex items-center justify-center mb-4">
            <BookmarkIcon className="h-8 w-8 text-text-tertiary" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">No saved teams</h3>
          <p className="text-text-secondary mb-6">
            Browse teams and click the bookmark icon to save them here
          </p>
          <button
            onClick={() => router.push('/app/teams/browse')}
            className="btn-primary"
          >
            Browse Teams
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedItems.map((saved) => {
            const team = saved.item;
            if (!team) return null;

            return (
              <div
                key={saved.id}
                onClick={() => router.push(`/app/teams/${team.id}`)}
                className="card hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-navy to-navy-700 flex items-center justify-center">
                          <UserGroupIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-text-primary">{team.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <span>{team.size} members</span>
                            <span>•</span>
                            <span className="flex items-center">
                              <StarIcon className="h-4 w-4 mr-1 text-gold-500" />
                              {team.cohesionScore}% cohesion
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-text-secondary text-sm line-clamp-2 mb-3">
                        {team.description}
                      </p>

                      <div className="flex flex-wrap gap-3 text-sm text-text-tertiary">
                        <span className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {team.location}
                        </span>
                        <span className="flex items-center">
                          <BriefcaseIcon className="h-4 w-4 mr-1" />
                          {team.industry}
                        </span>
                      </div>

                      {saved.notes && (
                        <p className="mt-3 text-sm text-text-secondary italic border-l-2 border-navy-200 pl-3">
                          {saved.notes}
                        </p>
                      )}
                    </div>

                    <div className="ml-4 flex flex-col items-end gap-2">
                      <button
                        onClick={(e) => handleRemove(e, team.id)}
                        disabled={removingId === team.id}
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
