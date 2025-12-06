'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  MapPinIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ArrowLeftIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  type: 'headquarters' | 'office' | 'remote';
  isHeadquarters: boolean;
  employeeCount?: number;
}

export default function CompanyLocationsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Location>>({
    name: '',
    address: '',
    city: '',
    state: '',
    country: 'United States',
    postalCode: '',
    type: 'office',
    isHeadquarters: false,
  });

  const { data, isLoading } = useQuery<{ locations: Location[] }>({
    queryKey: ['company-locations'],
    queryFn: async () => {
      const response = await fetch('/api/company/locations');
      if (!response.ok) {
        return { locations: [] };
      }
      return response.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (location: Partial<Location>) => {
      const url = editingId
        ? `/api/company/locations/${editingId}`
        : '/api/company/locations';
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(location),
      });
      if (!response.ok) throw new Error('Failed to save');
      return response.json();
    },
    onSuccess: () => {
      toast.success(editingId ? 'Location updated' : 'Location added');
      queryClient.invalidateQueries({ queryKey: ['company-locations'] });
      resetForm();
    },
    onError: () => {
      toast.error('Failed to save location');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (locationId: string) => {
      const response = await fetch(`/api/company/locations/${locationId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Location deleted');
      queryClient.invalidateQueries({ queryKey: ['company-locations'] });
    },
    onError: () => {
      toast.error('Failed to delete location');
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      country: 'United States',
      postalCode: '',
      type: 'office',
      isHeadquarters: false,
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (location: Location) => {
    setFormData(location);
    setEditingId(location.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.city) {
      toast.error('City is required');
      return;
    }
    saveMutation.mutate(formData);
  };

  const getTypeBadge = (type: Location['type']) => {
    switch (type) {
      case 'headquarters':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-navy-50 text-navy">
            <BuildingOfficeIcon className="h-3 w-3 mr-1" />
            Headquarters
          </span>
        );
      case 'office':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            Office
          </span>
        );
      case 'remote':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success-light text-success-dark">
            <GlobeAltIcon className="h-3 w-3 mr-1" />
            Remote
          </span>
        );
    }
  };

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

  const locations = data?.locations || [];

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
            <h1 className="page-title">Locations</h1>
            <p className="page-subtitle">Manage office locations.</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Location
            </button>
          )}
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card mb-6">
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <h3 className="font-medium text-text-primary">
              {editingId ? 'Edit Location' : 'Add Location'}
            </h3>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Location Name
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field w-full"
                placeholder="e.g., New York Office"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input-field w-full"
                placeholder="123 Main Street, Suite 100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input-field w-full"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  State/Province
                </label>
                <input
                  type="text"
                  value={formData.state || ''}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="input-field w-full"
                  placeholder="NY"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country || ''}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="input-field w-full"
                  placeholder="United States"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Type
                </label>
                <select
                  value={formData.type || 'office'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Location['type'] })}
                  className="input-field w-full"
                >
                  <option value="headquarters">Headquarters</option>
                  <option value="office">Office</option>
                  <option value="remote">Remote/Virtual</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Location' : 'Add Location'}
              </button>
              <button type="button" onClick={resetForm} className="btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Locations List */}
      {locations.length === 0 ? (
        <div className="card text-center py-12">
          <MapPinIcon className="h-12 w-12 mx-auto text-text-tertiary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No locations yet</h3>
          <p className="text-text-secondary">
            Add your office locations to show teams where you operate
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {locations.map((location) => (
            <div key={location.id} className="card">
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-navy-50 flex items-center justify-center">
                    <MapPinIcon className="h-5 w-5 text-navy" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-text-primary">
                        {location.name || `${location.city}, ${location.state}`}
                      </p>
                      {getTypeBadge(location.type)}
                    </div>
                    <p className="text-sm text-text-tertiary">
                      {[location.address, location.city, location.state, location.country]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(location)}
                    className="p-2 text-text-tertiary hover:text-navy rounded hover:bg-navy-50"
                    title="Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(location.id)}
                    className="p-2 text-text-tertiary hover:text-error rounded hover:bg-error/10"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
