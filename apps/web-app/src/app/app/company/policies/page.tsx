'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Policy {
  id: string;
  title: string;
  description: string;
  category: 'remote' | 'pto' | 'parental' | 'development' | 'wellness' | 'other';
  isHighlight: boolean;
}

const categories = [
  { id: 'remote', label: 'Remote Work' },
  { id: 'pto', label: 'PTO & Time Off' },
  { id: 'parental', label: 'Parental Leave' },
  { id: 'development', label: 'Professional Development' },
  { id: 'wellness', label: 'Health & Wellness' },
  { id: 'other', label: 'Other Policies' },
];

export default function CompanyPoliciesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Policy>>({
    title: '',
    description: '',
    category: 'other',
    isHighlight: false,
  });

  const { data, isLoading } = useQuery<{ policies: Policy[] }>({
    queryKey: ['company-policies'],
    queryFn: async () => {
      const response = await fetch('/api/company/policies');
      if (!response.ok) return { policies: [] };
      return response.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (policy: Partial<Policy>) => {
      const url = editingId ? `/api/company/policies/${editingId}` : '/api/company/policies';
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policy),
      });
      if (!response.ok) throw new Error('Failed to save');
      return response.json();
    },
    onSuccess: () => {
      toast.success(editingId ? 'Policy updated' : 'Policy added');
      queryClient.invalidateQueries({ queryKey: ['company-policies'] });
      resetForm();
    },
    onError: () => toast.error('Failed to save policy'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/company/policies/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Policy deleted');
      queryClient.invalidateQueries({ queryKey: ['company-policies'] });
    },
    onError: () => toast.error('Failed to delete policy'),
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', category: 'other', isHighlight: false });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (policy: Policy) => {
    setFormData(policy);
    setEditingId(policy.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      toast.error('Title is required');
      return;
    }
    saveMutation.mutate(formData);
  };

  const policies = data?.policies || [];
  const groupedPolicies = categories.map((cat) => ({
    ...cat,
    policies: policies.filter((p) => p.category === cat.id),
  })).filter((cat) => cat.policies.length > 0);

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
          onClick={() => router.push('/app/company')}
          className="flex items-center text-text-secondary hover:text-text-primary mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to company
        </button>
        <div className="flex items-center justify-between">
          <div className="page-header">
            <h1 className="page-title">Policies</h1>
            <p className="page-subtitle">Company hiring policies.</p>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="btn-primary flex items-center">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Policy
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card mb-6">
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <h3 className="font-medium text-text-primary">
              {editingId ? 'Edit Policy' : 'Add Policy'}
            </h3>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Title *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field w-full"
                placeholder="e.g., Unlimited PTO"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field w-full"
                rows={3}
                placeholder="Describe this policy..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Policy['category'] })}
                  className="input-field w-full"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isHighlight || false}
                    onChange={(e) => setFormData({ ...formData, isHighlight: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-text-secondary">Highlight on profile</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Policy' : 'Add Policy'}
              </button>
              <button type="button" onClick={resetForm} className="btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Policies List */}
      {policies.length === 0 ? (
        <div className="card text-center py-12">
          <DocumentTextIcon className="h-12 w-12 mx-auto text-text-tertiary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No policies yet</h3>
          <p className="text-text-secondary">Add workplace policies to show teams what you offer</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedPolicies.map((group) => (
            <div key={group.id}>
              <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
                {group.label}
              </h3>
              <div className="space-y-2">
                {group.policies.map((policy) => (
                  <div key={policy.id} className="card">
                    <div className="px-6 py-4 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-text-primary">{policy.title}</p>
                          {policy.isHighlight && (
                            <CheckCircleIcon className="h-4 w-4 text-success" title="Highlighted" />
                          )}
                        </div>
                        {policy.description && (
                          <p className="text-sm text-text-secondary mt-1">{policy.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(policy)}
                          className="p-2 text-text-tertiary hover:text-navy rounded hover:bg-navy-50"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(policy.id)}
                          className="p-2 text-text-tertiary hover:text-error rounded hover:bg-error/10"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
