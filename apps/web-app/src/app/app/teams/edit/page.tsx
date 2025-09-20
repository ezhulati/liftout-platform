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
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Team Profile
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <UserGroupIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Team Profile</h1>
            <p className="text-gray-600">Update your team information and liftout availability</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
          </div>
          <div className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name *
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
                <label htmlFor="currentCompany" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Company *
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
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Team Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
                className="input-field"
                placeholder="Describe your team's expertise, achievements, and what makes you unique..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-2">
                  Team Size *
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
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="yearsWorkingTogether" className="block text-sm font-medium text-gray-700 mb-2">
                  Years Working Together *
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
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Industry *
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
        </div>

        {/* Specializations */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Specializations & Skills</h2>
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
                  className="btn-secondary"
                >
                  Add
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.specializations.map((spec, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {spec}
                  <button
                    type="button"
                    onClick={() => removeSpecialization(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
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
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Key Achievements</h2>
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
                  className="btn-secondary"
                >
                  Add
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              {formData.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="flex-1 text-gray-700">{achievement}</span>
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Location & Availability */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Location & Availability</h2>
          </div>
          <div className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Location *
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
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                  Liftout Availability *
                </label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                >
                  <option value="available">Available Now</option>
                  <option value="selective">Selective Opportunities</option>
                  <option value="not_available">Not Available</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="noticeRequired" className="block text-sm font-medium text-gray-700 mb-2">
                  Notice Required
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

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remoteWork"
                  name="remoteWork"
                  checked={formData.remoteWork}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remoteWork" className="ml-2 block text-sm text-gray-900">
                  Open to remote/hybrid opportunities
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Compensation */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Compensation Expectations</h2>
          </div>
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="compensationExpectations.min" className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum (Total Team)
                </label>
                <input
                  type="number"
                  id="compensationExpectations.min"
                  name="compensationExpectations.min"
                  value={formData.compensationExpectations.min}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="240000"
                />
              </div>

              <div>
                <label htmlFor="compensationExpectations.max" className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum (Total Team)
                </label>
                <input
                  type="number"
                  id="compensationExpectations.max"
                  name="compensationExpectations.max"
                  value={formData.compensationExpectations.max}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="400000"
                />
              </div>

              <div>
                <label htmlFor="compensationExpectations.currency" className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  id="compensationExpectations.currency"
                  name="compensationExpectations.currency"
                  value={formData.compensationExpectations.currency}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Privacy Settings</h2>
          </div>
          <div className="px-6 py-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="confidentialProfile"
                name="confidentialProfile"
                checked={formData.confidentialProfile}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="confidentialProfile" className="ml-2 block text-sm text-gray-900">
                Make profile confidential (only visible to verified companies)
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}