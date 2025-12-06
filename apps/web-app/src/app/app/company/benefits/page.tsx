'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  GiftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  HeartIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  HomeIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface Benefit {
  id: string;
  title: string;
  description: string;
  category: 'health' | 'financial' | 'learning' | 'lifestyle' | 'perks';
  value?: string;
}

const categories = [
  { id: 'health', label: 'Health & Insurance', icon: HeartIcon },
  { id: 'financial', label: 'Financial Benefits', icon: CurrencyDollarIcon },
  { id: 'learning', label: 'Learning & Growth', icon: AcademicCapIcon },
  { id: 'lifestyle', label: 'Work-Life Balance', icon: HomeIcon },
  { id: 'perks', label: 'Perks & Extras', icon: SparklesIcon },
];

export default function CompanyBenefitsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Benefit>>({
    title: '',
    description: '',
    category: 'perks',
    value: '',
  });

  const { data, isLoading } = useQuery<{ benefits: Benefit[] }>({
    queryKey: ['company-benefits'],
    queryFn: async () => {
      const response = await fetch('/api/company/benefits');
      if (!response.ok) return { benefits: [] };
      return response.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (benefit: Partial<Benefit>) => {
      const url = editingId ? `/api/company/benefits/${editingId}` : '/api/company/benefits';
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(benefit),
      });
      if (!response.ok) throw new Error('Failed to save');
      return response.json();
    },
    onSuccess: () => {
      toast.success(editingId ? 'Benefit updated' : 'Benefit added');
      queryClient.invalidateQueries({ queryKey: ['company-benefits'] });
      resetForm();
    },
    onError: () => toast.error('Failed to save benefit'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/company/benefits/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Benefit deleted');
      queryClient.invalidateQueries({ queryKey: ['company-benefits'] });
    },
    onError: () => toast.error('Failed to delete benefit'),
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', category: 'perks', value: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (benefit: Benefit) => {
    setFormData(benefit);
    setEditingId(benefit.id);
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

  const benefits = data?.benefits || [];
  const groupedBenefits = categories.map((cat) => ({
    ...cat,
    benefits: benefits.filter((b) => b.category === cat.id),
  })).filter((cat) => cat.benefits.length > 0);

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
            <h1 className="page-title">Benefits</h1>
            <p className="page-subtitle">Employee benefits offered.</p>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="btn-primary flex items-center">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Benefit
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card mb-6">
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <h3 className="font-medium text-text-primary">
              {editingId ? 'Edit Benefit' : 'Add Benefit'}
            </h3>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Title *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field w-full"
                placeholder="e.g., Health Insurance"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field w-full"
                rows={2}
                placeholder="Describe this benefit..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Benefit['category'] })}
                  className="input-field w-full"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Value (optional)</label>
                <input
                  type="text"
                  value={formData.value || ''}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="input-field w-full"
                  placeholder="e.g., $500/month"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Benefit' : 'Add Benefit'}
              </button>
              <button type="button" onClick={resetForm} className="btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Benefits List */}
      {benefits.length === 0 ? (
        <div className="card text-center py-12">
          <GiftIcon className="h-12 w-12 mx-auto text-text-tertiary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No benefits yet</h3>
          <p className="text-text-secondary">Add benefits and perks to attract top talent</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedBenefits.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.id}>
                <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3 flex items-center">
                  <Icon className="h-4 w-4 mr-2" />
                  {group.label}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.benefits.map((benefit) => (
                    <div key={benefit.id} className="card">
                      <div className="px-4 py-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-text-primary">{benefit.title}</p>
                              {benefit.value && (
                                <span className="text-xs px-2 py-0.5 bg-success-light text-success-dark rounded-full">
                                  {benefit.value}
                                </span>
                              )}
                            </div>
                            {benefit.description && (
                              <p className="text-sm text-text-secondary mt-1 line-clamp-2">{benefit.description}</p>
                            )}
                          </div>
                          <div className="flex gap-1 ml-2">
                            <button
                              onClick={() => handleEdit(benefit)}
                              className="p-1.5 text-text-tertiary hover:text-navy rounded hover:bg-navy-50"
                            >
                              <PencilIcon className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => deleteMutation.mutate(benefit.id)}
                              className="p-1.5 text-text-tertiary hover:text-error rounded hover:bg-error/10"
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
