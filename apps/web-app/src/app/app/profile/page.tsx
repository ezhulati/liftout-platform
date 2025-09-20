'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import {
  UserIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  BriefcaseIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { userData, loading, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    location: '',
    industry: '',
    companyName: '',
    position: '',
    phone: '',
  });

  // Initialize form data when user data loads
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        location: userData.location || '',
        industry: userData.industry || '',
        companyName: userData.companyName || '',
        position: userData.position || '',
        phone: userData.phone || '',
      });
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      location: userData.location || '',
      industry: userData.industry || '',
      companyName: userData.companyName || '',
      position: userData.position || '',
      phone: userData.phone || '',
    });
    setIsEditing(false);
  };

  const isCompanyUser = userData.type === 'company';

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">
          Manage your {isCompanyUser ? 'company' : 'personal'} profile information
        </p>
      </div>

      {/* Profile card */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                {isCompanyUser ? (
                  <BuildingOfficeIcon className="h-8 w-8 text-primary-600" />
                ) : (
                  <UserIcon className="h-8 w-8 text-primary-600" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {userData.firstName} {userData.lastName}
                </h2>
                <p className="text-sm text-gray-500">
                  {isCompanyUser ? 'Company Representative' : 'Team Member'}
                </p>
              </div>
            </div>
            <div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{userData.firstName || 'Not set'}</span>
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{userData.lastName || 'Not set'}</span>
                  </div>
                )}
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{userData.email}</span>
                  <span className="text-xs text-gray-500">(cannot be changed)</span>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                    placeholder="+1 (555) 123-4567"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{userData.phone || 'Not set'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>
              
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isCompanyUser ? 'Company Name' : 'Current Company'}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{userData.companyName || 'Not set'}</span>
                  </div>
                )}
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <BriefcaseIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{userData.position || 'Not set'}</span>
                  </div>
                )}
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                {isEditing ? (
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select Industry</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="Investment Banking">Investment Banking</option>
                    <option value="Private Equity">Private Equity</option>
                    <option value="Management Consulting">Management Consulting</option>
                    <option value="Healthcare Technology">Healthcare Technology</option>
                    <option value="Enterprise Software">Enterprise Software</option>
                    <option value="Legal Services">Legal Services</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <div className="flex items-center space-x-2">
                    <BriefcaseIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{userData.industry || 'Not set'}</span>
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input-field"
                    placeholder="New York, NY"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{userData.location || 'Not set'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Account Type:</span>
              <span className="ml-2 text-gray-900">
                {isCompanyUser ? 'Company Representative' : 'Team Member'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Member Since:</span>
              <span className="ml-2 text-gray-900">
                {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Email Verified:</span>
              <span className="ml-2 text-gray-900">
                {userData.emailVerified ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">User ID:</span>
              <span className="ml-2 text-gray-500 font-mono text-xs">{userData.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}