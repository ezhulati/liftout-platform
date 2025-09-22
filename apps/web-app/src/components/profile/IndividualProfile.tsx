'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useIndividualProfileCompletion } from '@/hooks/useProfileCompletion';
import { validateField, individualProfileSchema } from '@/lib/profile-validation';
import PhotoUpload from './PhotoUpload';
import {
  UserIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  BriefcaseIcon,
  PhoneIcon,
  StarIcon,
  TrophyIcon,
  DocumentTextIcon,
  LinkIcon,
  PlusIcon,
  XMarkIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarSolidIcon,
} from '@heroicons/react/24/solid';

interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsExperience: number;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'award' | 'certification' | 'project' | 'recognition';
  organization?: string;
  url?: string;
}

interface Portfolio {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  technologies: string[];
  type: 'project' | 'publication' | 'presentation' | 'other';
}

interface IndividualProfileData {
  // Basic Info
  firstName: string;
  lastName: string;
  headline: string;
  bio: string;
  location: string;
  phone: string;
  
  // Professional Info
  currentCompany: string;
  currentPosition: string;
  industry: string;
  yearsExperience: number;
  
  // Skills & Expertise
  skills: Skill[];
  primarySkills: string[]; // Top 5 skills for quick display
  
  // Experience
  experiences: Experience[];
  
  // Education
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startYear: number;
    endYear?: number;
    gpa?: number;
  }>;
  
  // Achievements & Certifications
  achievements: Achievement[];
  
  // Portfolio
  portfolio: Portfolio[];
  
  // Preferences
  openToOpportunities: boolean;
  preferredRoles: string[];
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  workAuthorization: string;
  remoteWork: 'onsite' | 'hybrid' | 'remote' | 'flexible';
  
  // Social Links
  socialLinks: {
    linkedin?: string;
    github?: string;
    website?: string;
    twitter?: string;
  };
}

interface IndividualProfileProps {
  readonly?: boolean;
  userId?: string;
}

export default function IndividualProfile({ readonly = false, userId }: IndividualProfileProps) {
  const { user, updateProfile } = useAuth();
  const completion = useIndividualProfileCompletion();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'experience' | 'skills' | 'portfolio' | 'preferences'>('overview');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [profileData, setProfileData] = useState<IndividualProfileData>({
    firstName: '',
    lastName: '',
    headline: '',
    bio: '',
    location: '',
    phone: '',
    currentCompany: '',
    currentPosition: '',
    industry: '',
    yearsExperience: 0,
    skills: [],
    primarySkills: [],
    experiences: [],
    education: [],
    achievements: [],
    portfolio: [],
    openToOpportunities: true,
    preferredRoles: [],
    salaryRange: { min: 0, max: 0, currency: 'USD' },
    workAuthorization: '',
    remoteWork: 'flexible',
    socialLinks: {},
  });

  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null);

  // Initialize profile data
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ')[1] || '',
        location: user.location || '',
        phone: user.phone || '',
        currentCompany: user.companyName || '',
        currentPosition: user.position || '',
        industry: user.industry || '',
      }));
      
      // Set current photo URL
      setCurrentPhotoUrl(user.photoURL || null);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      // Update basic user fields
      await updateProfile({
        name: `${profileData.firstName} ${profileData.lastName}`,
        location: profileData.location,
        phone: profileData.phone,
        companyName: profileData.currentCompany,
        position: profileData.currentPosition,
        industry: profileData.industry,
        photoURL: currentPhotoUrl || undefined,
        // Store extended profile data in a separate field
        profileData,
      });
      
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  // Handle photo upload/delete
  const handlePhotoUpdate = async (photoUrl: string | null) => {
    setCurrentPhotoUrl(photoUrl);
    
    // Auto-save photo URL to user profile
    try {
      await updateProfile({ photoURL: photoUrl || undefined });
    } catch (error) {
      console.error('Failed to save photo URL:', error);
      toast.error('Failed to save photo');
    }
  };

  const addSkill = () => {
    setProfileData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', level: 'Beginner', yearsExperience: 0 }]
    }));
  };

  const removeSkill = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      isCurrent: false,
      description: '',
      achievements: [],
      technologies: [],
    };
    setProfileData(prev => ({
      ...prev,
      experiences: [newExp, ...prev.experiences]
    }));
  };

  const addAchievement = () => {
    const newAchievement: Achievement = {
      id: Date.now().toString(),
      title: '',
      description: '',
      date: '',
      type: 'project',
    };
    setProfileData(prev => ({
      ...prev,
      achievements: [newAchievement, ...prev.achievements]
    }));
  };

  const addPortfolioItem = () => {
    const newItem: Portfolio = {
      id: Date.now().toString(),
      title: '',
      description: '',
      url: '',
      technologies: [],
      type: 'project',
    };
    setProfileData(prev => ({
      ...prev,
      portfolio: [newItem, ...prev.portfolio]
    }));
  };

  // Validate individual fields
  const validateProfileField = (fieldName: string, value: any) => {
    let errorMessage = '';
    
    // Simple validation rules for now
    switch (fieldName) {
      case 'firstName':
      case 'lastName':
        if (!value || value.trim().length === 0) {
          errorMessage = `${fieldName === 'firstName' ? 'First' : 'Last'} name is required`;
        } else if (value.length > 50) {
          errorMessage = `${fieldName === 'firstName' ? 'First' : 'Last'} name must be less than 50 characters`;
        }
        break;
      case 'headline':
        if (value && value.length > 120) {
          errorMessage = 'Headline must be less than 120 characters';
        }
        break;
      case 'bio':
        if (value && value.length > 2000) {
          errorMessage = 'Bio must be less than 2000 characters';
        }
        break;
      case 'location':
        if (!value || value.trim().length === 0) {
          errorMessage = 'Location is required';
        } else if (value.length > 100) {
          errorMessage = 'Location must be less than 100 characters';
        }
        break;
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }));
    
    return errorMessage === '';
  };

  // Recalculate completion when profile data changes
  useEffect(() => {
    completion.recalculate(profileData);
  }, [profileData, completion]);

  const completeness = completion.score;
  const completionBadge = completion.getCompletionBadge();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              {/* Profile Photo Upload */}
              <PhotoUpload
                currentPhotoUrl={currentPhotoUrl || undefined}
                userId={user.id}
                type="profile"
                onPhotoUpdate={handlePhotoUpdate}
                size="xl"
                disabled={readonly}
              />
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  {profileData.headline || profileData.currentPosition || 'Professional'}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{profileData.location || 'Location not set'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BuildingOfficeIcon className="h-4 w-4" />
                    <span>{profileData.currentCompany || 'Company not set'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {!readonly && (
              <div className="flex space-x-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
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
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Profile Completeness */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Profile Completeness</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  completionBadge.color === 'green' ? 'bg-green-100 text-green-800' :
                  completionBadge.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                  completionBadge.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {completionBadge.icon} {completionBadge.text}
                </span>
              </div>
              <span className="text-sm text-gray-500">{completeness}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  completeness >= 90 ? 'bg-green-500' :
                  completeness >= 70 ? 'bg-blue-500' :
                  completeness >= 40 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${completeness}%` }}
              />
            </div>
            
            {/* Recommendations */}
            {completion.recommendations.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">Next steps to improve your profile:</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  {completion.recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index} className="flex items-start space-x-1">
                      <span className="text-blue-500">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: UserIcon },
            { id: 'experience', label: 'Experience', icon: BriefcaseIcon },
            { id: 'skills', label: 'Skills', icon: CodeBracketIcon },
            { id: 'portfolio', label: 'Portfolio', icon: DocumentTextIcon },
            { id: 'preferences', label: 'Preferences', icon: CurrencyDollarIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              </div>
              <div className="px-6 py-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => {
                            const value = e.target.value;
                            setProfileData(prev => ({ ...prev, firstName: value }));
                            validateProfileField('firstName', value);
                          }}
                          className={`input-field ${validationErrors.firstName ? 'border-red-300' : ''}`}
                        />
                        {validationErrors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-900">{profileData.firstName || 'Not set'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => {
                            const value = e.target.value;
                            setProfileData(prev => ({ ...prev, lastName: value }));
                            validateProfileField('lastName', value);
                          }}
                          className={`input-field ${validationErrors.lastName ? 'border-red-300' : ''}`}
                        />
                        {validationErrors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-900">{profileData.lastName || 'Not set'}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Headline
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.headline}
                      onChange={(e) => setProfileData(prev => ({ ...prev, headline: e.target.value }))}
                      className="input-field"
                      placeholder="Senior Software Engineer | Full-Stack Developer"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.headline || 'Not set'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      className="input-field"
                      rows={4}
                      placeholder="Tell us about yourself, your experience, and what drives you professionally..."
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.bio || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact & Social */}
          <div className="space-y-6">
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              </div>
              <div className="px-6 py-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{user.email}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{profileData.phone || 'Not set'}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{profileData.location || 'Not set'}</span>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Stats</h3>
              </div>
              <div className="px-6 py-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Years Experience</span>
                  <span className="font-medium">{profileData.yearsExperience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Skills</span>
                  <span className="font-medium">{profileData.skills.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Projects</span>
                  <span className="font-medium">{profileData.portfolio.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Achievements</span>
                  <span className="font-medium">{profileData.achievements.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tab content would go here */}
      {activeTab === 'skills' && (
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Skills & Expertise</h3>
            {isEditing && (
              <button
                onClick={addSkill}
                className="btn-secondary text-sm"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Skill
              </button>
            )}
          </div>
          <div className="px-6 py-6">
            {profileData.skills.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No skills added yet.</p>
            ) : (
              <div className="space-y-4">
                {profileData.skills.map((skill, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Skill Name
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => {
                                const newSkills = [...profileData.skills];
                                newSkills[index] = { ...skill, name: e.target.value };
                                setProfileData(prev => ({ ...prev, skills: newSkills }));
                              }}
                              className="input-field"
                              placeholder="React, Python, Project Management..."
                            />
                          ) : (
                            <p className="font-medium">{skill.name}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Proficiency Level
                          </label>
                          {isEditing ? (
                            <select
                              value={skill.level}
                              onChange={(e) => {
                                const newSkills = [...profileData.skills];
                                newSkills[index] = { ...skill, level: e.target.value as any };
                                setProfileData(prev => ({ ...prev, skills: newSkills }));
                              }}
                              className="input-field"
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Expert">Expert</option>
                            </select>
                          ) : (
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              skill.level === 'Expert' ? 'bg-purple-100 text-purple-800' :
                              skill.level === 'Advanced' ? 'bg-blue-100 text-blue-800' :
                              skill.level === 'Intermediate' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {skill.level}
                            </span>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Years Experience
                          </label>
                          {isEditing ? (
                            <input
                              type="number"
                              value={skill.yearsExperience}
                              onChange={(e) => {
                                const newSkills = [...profileData.skills];
                                newSkills[index] = { ...skill, yearsExperience: parseInt(e.target.value) || 0 };
                                setProfileData(prev => ({ ...prev, skills: newSkills }));
                              }}
                              className="input-field"
                              min="0"
                              max="50"
                            />
                          ) : (
                            <p>{skill.yearsExperience} years</p>
                          )}
                        </div>
                      </div>
                      
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(index)}
                          className="ml-4 text-red-600 hover:text-red-800"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}