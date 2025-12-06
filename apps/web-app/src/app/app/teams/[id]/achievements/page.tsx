'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  TrophyIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  verified: boolean;
}

interface Team {
  id: string;
  name: string;
  achievements: Achievement[];
}

export default function TeamAchievementsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const teamId = params?.id as string;

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: 'project',
  });

  const { data: team, isLoading } = useQuery<Team>({
    queryKey: ['team-achievements', teamId],
    queryFn: async () => {
      const response = await fetch(`/api/teams/${teamId}`);
      if (!response.ok) throw new Error('Failed to fetch team');
      const data = await response.json();
      return {
        id: data.team.id,
        name: data.team.name,
        achievements: data.team.achievements || [],
      };
    },
    enabled: !!teamId,
  });

  const addAchievementMutation = useMutation({
    mutationFn: async (achievement: Omit<Achievement, 'id' | 'verified'>) => {
      const response = await fetch(`/api/teams/${teamId}/achievements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(achievement),
      });
      if (!response.ok) throw new Error('Failed to add achievement');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Achievement added');
      queryClient.invalidateQueries({ queryKey: ['team-achievements', teamId] });
      setIsAdding(false);
      resetForm();
    },
    onError: () => {
      toast.error('Failed to add achievement');
    },
  });

  const deleteAchievementMutation = useMutation({
    mutationFn: async (achievementId: string) => {
      const response = await fetch(`/api/teams/${teamId}/achievements/${achievementId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete achievement');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Achievement deleted');
      queryClient.invalidateQueries({ queryKey: ['team-achievements', teamId] });
    },
    onError: () => {
      toast.error('Failed to delete achievement');
    },
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', date: '', category: 'project' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    addAchievementMutation.mutate(formData);
  };

  const categories = [
    { id: 'project', label: 'Project Success' },
    { id: 'award', label: 'Award/Recognition' },
    { id: 'milestone', label: 'Milestone' },
    { id: 'client', label: 'Client Win' },
    { id: 'innovation', label: 'Innovation' },
    { id: 'other', label: 'Other' },
  ];

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-bg-elevated rounded w-64"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-bg-elevated rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push(`/app/teams/${teamId}`)}
          className="flex items-center text-text-secondary hover:text-text-primary mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to team
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Achievements</h1>
            <p className="text-text-secondary mt-1">Team accomplishments.</p>
          </div>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Achievement
            </button>
          )}
        </div>
      </div>

      {/* Add Achievement Form */}
      {isAdding && (
        <div className="card mb-6">
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <h3 className="font-medium text-text-primary">Add New Achievement</h3>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field w-full"
                placeholder="e.g., Launched Product v2.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field w-full"
                rows={3}
                placeholder="Describe this achievement..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field w-full"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-field w-full"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary">
                Add Achievement
              </button>
              <button
                type="button"
                onClick={() => { setIsAdding(false); resetForm(); }}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Achievements List */}
      {team?.achievements && team.achievements.length > 0 ? (
        <div className="space-y-4">
          {team.achievements.map((achievement) => (
            <div key={achievement.id} className="card">
              <div className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-text-primary">{achievement.title}</h3>
                      {achievement.verified && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success-light text-success-dark">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-text-secondary text-sm mb-2">{achievement.description}</p>
                    <div className="flex items-center gap-4 text-xs text-text-tertiary">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-bg-alt">
                        {categories.find((c) => c.id === achievement.category)?.label || achievement.category}
                      </span>
                      {achievement.date && (
                        <span className="flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {new Date(achievement.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => deleteAchievementMutation.mutate(achievement.id)}
                      className="p-2 text-text-tertiary hover:text-error rounded hover:bg-error/10"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <TrophyIcon className="h-12 w-12 mx-auto text-text-tertiary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No achievements yet</h3>
          <p className="text-text-secondary mb-6">
            Add your team&apos;s accomplishments to showcase your track record
          </p>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="btn-primary"
            >
              Add First Achievement
            </button>
          )}
        </div>
      )}
    </div>
  );
}
