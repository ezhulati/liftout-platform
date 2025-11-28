'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import {
  UserGroupIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function EditTeamPage() {
  const { userData } = useAuth();
  const router = useRouter();
  
  // Pre-populate with Alex Chen's team data
  const [formData, setFormData] = useState({
    teamName: 'TechFlow Data Science Team',
    description: 'Elite data science team with proven track record in fintech analytics and machine learning solutions. We\'ve successfully delivered $2M+ in value through predictive modeling and risk assessment systems.',
    industry: 'Financial Services',
    specializations: ['Machine Learning', 'Python', 'SQL', 'Team Leadership', 'Financial Modeling', 'Risk Assessment'],
    teamSize: 4,
    yearsWorkingTogether: 3.5,
    location: 'San Francisco, CA',
    remoteWork: true,
    availability: 'available',
    currentCompany: 'TechFlow Analytics',
    achievements: [
      'Reduced fraud detection false positives by 35%',
      'Built predictive models generating $2.1M annual savings',
      'Mentored 12+ junior data scientists across 3 years'
    ],
    compensationExpectations: {
      min: 240000,
      max: 400000,
      currency: 'USD'
    },
    noticeRequired: '8 weeks',
    confidentialProfile: false
  });

  const [newAchievement, setNewAchievement] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: type === 'number' ? parseInt(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) : value
      }));
    }
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Team profile updated successfully!');
      router.push('/app/teams');
    } catch (error) {
      toast.error('Failed to update team profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-navy-50 flex items-center justify-center">
            <UserGroupIcon className="h-6 w-6 text-navy" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary font-heading leading-tight">Edit team profile</h1>
            <p className="text-base text-text-secondary mt-1">Update your team information and liftout availability</p>
          </div>
        </div>
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
              <label htmlFor="teamName" className="label-text label-required">
                Team name
              </label>
              <input
                type="text"
                id="teamName"
                name="teamName"
                value={formData.teamName}
                onChange={handleInputChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="currentCompany" className="label-text label-required">
                Current company
              </label>
              <input
                type="text"
                id="currentCompany"
                name="currentCompany"
                value={formData.currentCompany}
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
              <label htmlFor="teamSize" className="label-text label-required">
                Team size
              </label>
              <input
                type="number"
                id="teamSize"
                name="teamSize"
                value={formData.teamSize}
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

        {/* Specializations */}
        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-medium text-text-primary">Specializations & Skills</h2>
          </div>
          <div className="px-6 py-6">
            <div className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  placeholder="Add a specialization..."
                  className="flex-1 input-field"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                />
                <button
                  type="button"
                  onClick={addSpecialization}
                  className="btn-outline min-h-12"
                >
                  Add
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.specializations.map((spec, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-navy-50 text-navy-800"
                >
                  {spec}
                  <button
                    type="button"
                    onClick={() => removeSpecialization(index)}
                    className="ml-2 text-navy hover:text-navy-800"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-medium text-text-primary">Key Achievements</h2>
          </div>
          <div className="px-6 py-6">
            <div className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  placeholder="Add an achievement..."
                  className="flex-1 input-field"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                />
                <button
                  type="button"
                  onClick={addAchievement}
                  className="btn-outline min-h-12"
                >
                  Add
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              {formData.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-bg-alt rounded-lg"
                >
                  <CheckCircleIcon className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="flex-1 text-text-secondary">{achievement}</span>
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
                    className="text-text-tertiary hover:text-error"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
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
              <label htmlFor="availability" className="label-text label-required">
                Liftout availability
              </label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                required
                className="input-field"
              >
                <option value="available">Available now</option>
                <option value="selective">Selective opportunities</option>
                <option value="not_available">Not available</option>
              </select>
            </div>

            <div>
              <label htmlFor="noticeRequired" className="label-text">
                Notice required
              </label>
              <input
                type="text"
                id="noticeRequired"
                name="noticeRequired"
                value={formData.noticeRequired}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g., 4 weeks, 2 months"
              />
            </div>

            {/* Checkbox with 48px touch target */}
            <label className="flex items-center gap-3 cursor-pointer min-h-12 px-2 rounded-lg hover:bg-bg-alt transition-colors -mx-2">
              <input
                type="checkbox"
                id="remoteWork"
                name="remoteWork"
                checked={formData.remoteWork}
                onChange={handleInputChange}
                className="h-5 w-5 text-navy focus:ring-navy border-border rounded"
              />
              <span className="text-base text-text-secondary">Open to remote/hybrid opportunities</span>
            </label>
          </div>
        </div>

        {/* Compensation - Single column per Practical UI */}
        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-bold text-text-primary">Compensation expectations</h2>
          </div>
          <div className="px-6 py-6 space-y-5">
            <div>
              <label htmlFor="compensationExpectations.min" className="label-text">
                Minimum total team compensation
              </label>
              <input
                type="number"
                id="compensationExpectations.min"
                name="compensationExpectations.min"
                value={formData.compensationExpectations.min}
                onChange={handleInputChange}
                className="input-field max-w-48"
                placeholder="240000"
              />
            </div>

            <div>
              <label htmlFor="compensationExpectations.max" className="label-text">
                Maximum total team compensation
              </label>
              <input
                type="number"
                id="compensationExpectations.max"
                name="compensationExpectations.max"
                value={formData.compensationExpectations.max}
                onChange={handleInputChange}
                className="input-field max-w-48"
                placeholder="400000"
              />
            </div>

            <div>
              <label htmlFor="compensationExpectations.currency" className="label-text">
                Currency
              </label>
              <select
                id="compensationExpectations.currency"
                name="compensationExpectations.currency"
                value={formData.compensationExpectations.currency}
                onChange={handleInputChange}
                className="input-field max-w-32"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-bold text-text-primary">Privacy settings</h2>
          </div>
          <div className="px-6 py-6">
            {/* Checkbox with 48px touch target */}
            <label className="flex items-center gap-3 cursor-pointer min-h-12 px-2 rounded-lg hover:bg-bg-alt transition-colors -mx-2">
              <input
                type="checkbox"
                id="confidentialProfile"
                name="confidentialProfile"
                checked={formData.confidentialProfile}
                onChange={handleInputChange}
                className="h-5 w-5 text-navy focus:ring-navy border-border rounded"
              />
              <span className="text-base text-text-secondary">Make profile confidential (only visible to verified companies)</span>
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