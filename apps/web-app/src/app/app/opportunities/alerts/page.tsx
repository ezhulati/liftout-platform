'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  BellIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface OpportunityAlert {
  id: string;
  name: string;
  filters: {
    industry?: string[];
    location?: string[];
    minTeamSize?: number;
    maxTeamSize?: number;
    minCompensation?: number;
    keywords?: string[];
    remote?: boolean;
  };
  frequency: 'instant' | 'daily' | 'weekly';
  isActive: boolean;
  matchCount: number;
  lastSentAt?: string;
  createdAt: string;
}

export default function OpportunityAlertsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    frequency: 'daily' as 'instant' | 'daily' | 'weekly',
    filters: {
      industry: [] as string[],
      location: [] as string[],
      keywords: [] as string[],
      remote: false,
    },
  });

  const { data, isLoading } = useQuery<{ alerts: OpportunityAlert[] }>({
    queryKey: ['opportunity-alerts'],
    queryFn: async () => {
      const response = await fetch('/api/opportunity-alerts');
      if (!response.ok) return { alerts: [] };
      return response.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (alert: typeof formData) => {
      const url = editingId ? `/api/opportunity-alerts/${editingId}` : '/api/opportunity-alerts';
      const response = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert),
      });
      if (!response.ok) throw new Error('Failed to save');
      return response.json();
    },
    onSuccess: () => {
      toast.success(editingId ? 'Alert updated' : 'Alert created');
      queryClient.invalidateQueries({ queryKey: ['opportunity-alerts'] });
      resetForm();
    },
    onError: () => toast.error('Failed to save alert'),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await fetch(`/api/opportunity-alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) throw new Error('Failed to update');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunity-alerts'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/opportunity-alerts/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Alert deleted');
      queryClient.invalidateQueries({ queryKey: ['opportunity-alerts'] });
    },
    onError: () => toast.error('Failed to delete alert'),
  });

  const resetForm = () => {
    setFormData({
      name: '',
      frequency: 'daily',
      filters: { industry: [], location: [], keywords: [], remote: false },
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (alert: OpportunityAlert) => {
    setFormData({
      name: alert.name,
      frequency: alert.frequency,
      filters: {
        industry: alert.filters.industry || [],
        location: alert.filters.location || [],
        keywords: alert.filters.keywords || [],
        remote: alert.filters.remote || false,
      },
    });
    setEditingId(alert.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    saveMutation.mutate(formData);
  };

  const alerts = data?.alerts || [];

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
          onClick={() => router.push('/app/opportunities')}
          className="flex items-center text-text-secondary hover:text-text-primary mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to opportunities
        </button>
        <div className="flex items-center justify-between">
          <div className="page-header">
            <h1 className="page-title">Opportunity alerts</h1>
            <p className="page-subtitle">Manage your alert preferences.</p>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="btn-primary flex items-center">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Alert
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card mb-6">
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <h3 className="font-medium text-text-primary">
              {editingId ? 'Edit Alert' : 'Create Alert'}
            </h3>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Alert Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field w-full"
                placeholder="e.g., Senior Engineering Teams"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as typeof formData.frequency })}
                className="input-field w-full"
              >
                <option value="instant">Instant (as they happen)</option>
                <option value="daily">Daily digest</option>
                <option value="weekly">Weekly digest</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Keywords (comma separated)
              </label>
              <input
                type="text"
                value={formData.filters.keywords?.join(', ') || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  filters: {
                    ...formData.filters,
                    keywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean),
                  },
                })}
                className="input-field w-full"
                placeholder="e.g., React, TypeScript, Fintech"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remote"
                checked={formData.filters.remote}
                onChange={(e) => setFormData({
                  ...formData,
                  filters: { ...formData.filters, remote: e.target.checked },
                })}
                className="h-4 w-4 text-navy focus:ring-navy border-border rounded"
              />
              <label htmlFor="remote" className="ml-2 text-sm text-text-secondary">
                Only remote opportunities
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Alert' : 'Create Alert'}
              </button>
              <button type="button" onClick={resetForm} className="btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <div className="card text-center py-12">
          <BellIcon className="h-12 w-12 mx-auto text-text-tertiary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No alerts yet</h3>
          <p className="text-text-secondary mb-4">
            Create an alert to get notified about matching opportunities
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <PlusIcon className="h-4 w-4 mr-2 inline" />
            Create Your First Alert
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="card">
              <div className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-text-primary">{alert.name}</h3>
                      {alert.isActive ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success-light text-success-dark">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          <XCircleIcon className="h-3 w-3 mr-1" />
                          Paused
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-bg-alt rounded text-text-secondary">
                        {alert.frequency === 'instant' ? 'Instant' : alert.frequency === 'daily' ? 'Daily' : 'Weekly'}
                      </span>
                      {alert.filters.keywords?.map((keyword) => (
                        <span key={keyword} className="text-xs px-2 py-1 bg-navy-50 text-navy rounded">
                          {keyword}
                        </span>
                      ))}
                      {alert.filters.remote && (
                        <span className="text-xs px-2 py-1 bg-gold-100 text-gold-800 rounded">
                          Remote only
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-text-tertiary">
                      <span className="flex items-center">
                        <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
                        {alert.matchCount} matches
                      </span>
                      {alert.lastSentAt && (
                        <span>
                          Last sent: {new Date(alert.lastSentAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleMutation.mutate({ id: alert.id, isActive: !alert.isActive })}
                      className={`px-3 py-1 rounded text-sm ${
                        alert.isActive
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-navy text-white hover:bg-navy-700'
                      }`}
                    >
                      {alert.isActive ? 'Pause' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleEdit(alert)}
                      className="p-2 text-text-tertiary hover:text-navy rounded hover:bg-navy-50"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(alert.id)}
                      className="p-2 text-text-tertiary hover:text-error rounded hover:bg-error/10"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
