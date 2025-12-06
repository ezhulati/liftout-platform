'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import {
  UserGroupIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useUpdateTeam } from '@/hooks/useTeams';

export default function EditTeamPage() {
  const { userData } = useAuth();
  const router = useRouter();
  const updateTeamMutation = useUpdateTeam();

  const { data: team, isLoading, isError } = useQuery({
    queryKey: ['my-team'],
    queryFn: () => fetch('/api/teams/my-team').then(res => res.json()),
    enabled: !!userData,
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    specialization: '',
    specializations: [] as string[],
    achievements: [] as string[],
    size: 0,
    yearsWorkingTogether: 0,
    location: '',
    remoteStatus: 'hybrid',
    availabilityStatus: 'available',
  });

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || '',
        description: team.description || '',
        industry: team.industry || '',
        specialization: team.specialization || '',
        specializations: team.specializations || [],
        achievements: team.achievements || [],
        size: team.size || 0,
        yearsWorkingTogether: team.yearsWorkingTogether || 0,
        location: team.location || '',
        remoteStatus: team.remoteStatus || 'hybrid',
        availabilityStatus: team.availabilityStatus || 'available',
      });
    }
  }, [team]);

  const [newAchievement, setNewAchievement] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const addSpecialization = () => {
    if (newSpecialization.trim() && !formData.specializations.includes(newSpecialization.trim())) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.trim()]
      }));
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateTeamMutation.mutateAsync({ id: team.id, ...formData });
      toast.success('Team profile updated');
      router.push(`/app/teams/${team.id}`);
    } catch (error) {
      toast.error('Failed to update team profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !team) {
    return <div>Team not found</div>;
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header - Practical UI: page-header pattern */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-text-tertiary hover:text-text-secondary min-h-12 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to team profile
        </button>

        <h1 className="page-title">Edit team</h1>
        <p className="page-subtitle">Update your team details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-medium text-text-primary">Basic Information</h2>
          </div>
          {/* Single column layout per Practical UI */}
          <div className="px-6 py-6 space-y-5">
            <div>
              <label htmlFor="name" className="label-text label-required">
                Team name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="description" className="label-text label-required">
                Team description
              </label>
              <p className="form-field-hint">Describe your team's expertise, achievements, and what makes you unique</p>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="size" className="label-text label-required">
                Team size
              </label>
              <input
                type="number"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                min="2"
                max="20"
                required
                className="input-field max-w-32"
              />
            </div>

            <div>
              <label htmlFor="yearsWorkingTogether" className="label-text label-required">
                Years working together
              </label>
              <input
                type="number"
                id="yearsWorkingTogether"
                name="yearsWorkingTogether"
                value={formData.yearsWorkingTogether}
                onChange={handleInputChange}
                min="0.5"
                max="20"
                step="0.5"
                required
                className="input-field max-w-32"
              />
            </div>

            <div>
              <label htmlFor="industry" className="label-text label-required">
                Primary industry
              </label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                required
                className="input-field"
              >
                <option value="Financial Services">Financial Services</option>
                <option value="Healthcare Technology">Healthcare Technology</option>
                <option value="Enterprise Software">Enterprise Software</option>
                <option value="Consulting">Consulting</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Media & Entertainment">Media & Entertainment</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location & Availability - Single column per Practical UI */}
        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-bold text-text-primary">Location & availability</h2>
          </div>
          <div className="px-6 py-6 space-y-5">
            <div>
              <label htmlFor="location" className="label-text label-required">
                Primary location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="input-field"
                placeholder="City, State/Country"
              />
            </div>

            <div>
              <label htmlFor="availabilityStatus" className="label-text label-required">
                Liftout availability
              </label>
              <select
                id="availabilityStatus"
                name="availabilityStatus"
                value={formData.availabilityStatus}
                onChange={handleInputChange}
                required
                className="input-field"
              >
                <option value="available">Available now</option>
                <option value="selective">Selective opportunities</option>
                <option value="not_available">Not available</option>
              </select>
            </div>

            {/* Checkbox with 48px touch target */}
            <label className="flex items-center gap-3 cursor-pointer min-h-12 px-2 rounded-lg hover:bg-bg-alt transition-colors -mx-2">
              <input
                type="checkbox"
                id="remoteWork"
                name="remoteWork"
                checked={formData.remoteStatus === 'remote' || formData.remoteStatus === 'hybrid'}
                onChange={(e) => setFormData(prev => ({...prev, remoteStatus: e.target.checked ? 'hybrid' : 'onsite'}))}
                className="h-5 w-5 text-navy focus:ring-navy border-border rounded"
              />
              <span className="text-base text-text-secondary">Open to remote/hybrid opportunities</span>
            </label>
          </div>
        </div>

        {/* Submit - LEFT aligned per Practical UI, primary button FIRST */}
        <div className="flex items-center gap-4 pt-6 border-t border-border">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary min-h-12"
          >
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-link min-h-12"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}