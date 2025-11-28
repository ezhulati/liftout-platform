'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
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
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarSolidIcon,
} from '@heroicons/react/24/solid';

// Local storage key for demo user profile data
const DEMO_PROFILE_STORAGE_KEY = 'liftout_demo_profile';

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
  const { data: session } = useSession();
  const { user, updateProfile, isUserLoading } = useAuth();
  const completion = useIndividualProfileCompletion();

  // Use session data as fallback
  const sessionUser = session?.user as any;
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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

  // Check if this is a demo user (no Firestore user available)
  const isDemoUser = !user && !!session;
  const userEmail = user?.email || sessionUser?.email || '';

  // Load saved profile data from localStorage for demo users
  const loadDemoProfile = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`${DEMO_PROFILE_STORAGE_KEY}_${userEmail}`);
        if (saved) {
          return JSON.parse(saved) as IndividualProfileData;
        }
      } catch (e) {
        console.error('Error loading demo profile:', e);
      }
    }
    return null;
  }, [userEmail]);

  // Save profile data to localStorage for demo users
  const saveDemoProfile = useCallback((data: IndividualProfileData, photoUrl: string | null) => {
    if (typeof window !== 'undefined' && userEmail) {
      try {
        localStorage.setItem(`${DEMO_PROFILE_STORAGE_KEY}_${userEmail}`, JSON.stringify(data));
        if (photoUrl !== undefined) {
          localStorage.setItem(`${DEMO_PROFILE_STORAGE_KEY}_${userEmail}_photo`, photoUrl || '');
        }
      } catch (e) {
        console.error('Error saving demo profile:', e);
      }
    }
  }, [userEmail]);

  // Initialize profile data from session first, then user, then localStorage
  useEffect(() => {
    // Try to load from localStorage for demo users
    const savedProfile = loadDemoProfile();
    const savedPhoto = typeof window !== 'undefined'
      ? localStorage.getItem(`${DEMO_PROFILE_STORAGE_KEY}_${userEmail}_photo`)
      : null;

    if (savedProfile) {
      setProfileData(savedProfile);
      setCurrentPhotoUrl(savedPhoto || user?.photoURL || sessionUser?.image || null);
      return;
    }

    // Use session data as initial fallback
    const name = user?.name || sessionUser?.name || '';
    const nameParts = name.split(' ');

    setProfileData(prev => ({
      ...prev,
      firstName: user?.name?.split(' ')[0] || nameParts[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || nameParts.slice(1).join(' ') || '',
      location: user?.location || '',
      phone: user?.phone || '',
      currentCompany: user?.companyName || '',
      currentPosition: user?.position || '',
      industry: user?.industry || '',
    }));

    // Set current photo URL
    setCurrentPhotoUrl(user?.photoURL || sessionUser?.image || null);
  }, [user, sessionUser, loadDemoProfile, userEmail]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // For demo users without Firestore, save to localStorage
      if (isDemoUser) {
        saveDemoProfile(profileData, currentPhotoUrl);
        setIsEditing(false);
        toast.success('Profile updated successfully');
        return;
      }

      // For real users with Firestore, update via API
      if (user) {
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
      }

      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle photo upload/delete
  const handlePhotoUpdate = async (photoUrl: string | null) => {
    setCurrentPhotoUrl(photoUrl);

    // For demo users, save to localStorage
    if (isDemoUser) {
      saveDemoProfile(profileData, photoUrl);
      toast.success('Photo updated');
      return;
    }

    // Auto-save photo URL to user profile
    try {
      if (user) {
        await updateProfile({ photoURL: photoUrl || undefined });
      }
    } catch (error) {
      console.error('Failed to save photo URL:', error);
      toast.error('Failed to save photo');
    }
  };

  // Determine if editing is allowed (for both demo and real users)
  const canEdit = !readonly && (!!user || !!session);

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

  // Use session as fallback - don't require Firestore user
  // Don't block on isUserLoading - just show the page with session data
  const displayUser = user || sessionUser;

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
                userId={user?.id || sessionUser?.id || 'demo-user'}
                type="profile"
                onPhotoUpdate={handlePhotoUpdate}
                size="xl"
                disabled={!canEdit}
                useLocalStorage={isDemoUser}
              />
              
              <div>
                <h1 className="text-2xl font-bold text-text-primary">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <p className="text-lg text-text-secondary mt-1">
                  {profileData.headline || profileData.currentPosition || 'Professional'}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-text-tertiary">
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
            
            {canEdit && (
              <div className="flex space-x-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary min-h-12"
                  >
                    Edit profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="btn-primary min-h-12"
                    >
                      {isSaving ? 'Saving...' : 'Save changes'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                      className="text-link min-h-12 flex items-center"
                    >
                      Cancel
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
                <span className="text-sm font-medium text-text-secondary">Profile completeness</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  completionBadge.color === 'green' ? 'bg-success-light text-success-dark' :
                  completionBadge.color === 'blue' ? 'bg-navy-50 text-navy-800' :
                  completionBadge.color === 'yellow' ? 'bg-gold-100 text-gold-800' :
                  'bg-error-light text-error-dark'
                }`}>
                  {completionBadge.icon} {completionBadge.text}
                </span>
              </div>
              <span className="text-sm text-text-tertiary">{completeness}%</span>
            </div>
            <div className="w-full bg-bg-elevated rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-base ${
                  completeness >= 90 ? 'bg-success' :
                  completeness >= 70 ? 'bg-navy' :
                  completeness >= 40 ? 'bg-gold' :
                  'bg-error'
                }`}
                style={{ width: `${completeness}%` }}
              />
            </div>
            
            {/* Recommendations */}
            {completion.recommendations.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-text-secondary mb-2">Next steps to improve your profile:</p>
                <ul className="text-xs text-text-tertiary space-y-1">
                  {completion.recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index} className="flex items-start space-x-1">
                      <span className="text-navy">•</span>
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
      <div className="border-b border-border">
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
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm min-h-12 ${
                activeTab === tab.id
                  ? 'border-navy text-navy'
                  : 'border-transparent text-text-tertiary hover:text-text-primary hover:border-border'
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
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-medium text-text-primary">Basic information</h3>
              </div>
              <div className="px-6 py-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First name field - Practical UI: error above, label on top */}
                  <div>
                    {validationErrors.firstName && isEditing && (
                      <div className="flex items-center gap-1.5 mb-1 text-sm text-error">
                        <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0" />
                        <span>{validationErrors.firstName}</span>
                      </div>
                    )}
                    <label className="label-text mb-1">
                      First name {isEditing && <span className="text-error">*</span>}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => {
                          const value = e.target.value;
                          setProfileData(prev => ({ ...prev, firstName: value }));
                          validateProfileField('firstName', value);
                        }}
                        className={`input-field min-h-12 ${validationErrors.firstName ? 'border-error focus:ring-error' : ''}`}
                        placeholder="Enter your first name"
                      />
                    ) : (
                      <p className="text-text-primary py-3">{profileData.firstName || 'Not set'}</p>
                    )}
                  </div>

                  {/* Last name field - Practical UI: error above, label on top */}
                  <div>
                    {validationErrors.lastName && isEditing && (
                      <div className="flex items-center gap-1.5 mb-1 text-sm text-error">
                        <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0" />
                        <span>{validationErrors.lastName}</span>
                      </div>
                    )}
                    <label className="label-text mb-1">
                      Last name {isEditing && <span className="text-error">*</span>}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => {
                          const value = e.target.value;
                          setProfileData(prev => ({ ...prev, lastName: value }));
                          validateProfileField('lastName', value);
                        }}
                        className={`input-field min-h-12 ${validationErrors.lastName ? 'border-error focus:ring-error' : ''}`}
                        placeholder="Enter your last name"
                      />
                    ) : (
                      <p className="text-text-primary py-3">{profileData.lastName || 'Not set'}</p>
                    )}
                  </div>
                </div>
                
                {/* Professional headline - Practical UI: hint text before field */}
                <div>
                  <label className="label-text mb-1">
                    Professional headline
                  </label>
                  {isEditing && (
                    <p className="text-xs text-text-tertiary mb-1">
                      A brief tagline that describes your role and expertise
                    </p>
                  )}
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.headline}
                      onChange={(e) => setProfileData(prev => ({ ...prev, headline: e.target.value }))}
                      className="input-field min-h-12"
                      placeholder="Senior Software Engineer | Full-Stack Developer"
                      maxLength={120}
                    />
                  ) : (
                    <p className="text-text-primary py-3">{profileData.headline || 'Not set'}</p>
                  )}
                  {isEditing && (
                    <p className="text-xs text-text-tertiary mt-1 text-right">
                      {profileData.headline.length}/120 characters
                    </p>
                  )}
                </div>

                {/* Bio field - Practical UI: hint above field */}
                <div>
                  <label className="label-text mb-1">
                    Bio
                  </label>
                  {isEditing && (
                    <p className="text-xs text-text-tertiary mb-1">
                      Tell us about yourself, your experience, and what drives you professionally
                    </p>
                  )}
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      className="input-field min-h-[120px]"
                      rows={4}
                      placeholder="Write a brief summary of your professional background..."
                      maxLength={2000}
                    />
                  ) : (
                    <p className="text-text-primary py-3">{profileData.bio || 'Not set'}</p>
                  )}
                  {isEditing && (
                    <p className="text-xs text-text-tertiary mt-1 text-right">
                      {profileData.bio.length}/2000 characters
                    </p>
                  )}
                </div>

                {/* Professional info - company and position */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <label className="label-text mb-1 flex items-center gap-2">
                      <BuildingOfficeIcon className="h-4 w-4 text-text-tertiary" />
                      Current company
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.currentCompany}
                        onChange={(e) => setProfileData(prev => ({ ...prev, currentCompany: e.target.value }))}
                        className="input-field min-h-12"
                        placeholder="Acme Inc."
                      />
                    ) : (
                      <p className="text-text-primary py-3">{profileData.currentCompany || 'Not set'}</p>
                    )}
                  </div>

                  <div>
                    <label className="label-text mb-1 flex items-center gap-2">
                      <BriefcaseIcon className="h-4 w-4 text-text-tertiary" />
                      Current position
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.currentPosition}
                        onChange={(e) => setProfileData(prev => ({ ...prev, currentPosition: e.target.value }))}
                        className="input-field min-h-12"
                        placeholder="Software Engineer"
                      />
                    ) : (
                      <p className="text-text-primary py-3">{profileData.currentPosition || 'Not set'}</p>
                    )}
                  </div>
                </div>

                {/* Industry and years of experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-text mb-1">
                      Industry
                    </label>
                    {isEditing ? (
                      <select
                        value={profileData.industry}
                        onChange={(e) => setProfileData(prev => ({ ...prev, industry: e.target.value }))}
                        className="input-field min-h-12"
                      >
                        <option value="">Select industry</option>
                        <option value="Technology">Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Consulting">Consulting</option>
                        <option value="Legal">Legal</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Education">Education</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="text-text-primary py-3">{profileData.industry || 'Not set'}</p>
                    )}
                  </div>

                  <div>
                    <label className="label-text mb-1">
                      Years of experience
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={profileData.yearsExperience}
                        onChange={(e) => setProfileData(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) || 0 }))}
                        className="input-field min-h-12"
                        min="0"
                        max="50"
                        placeholder="5"
                      />
                    ) : (
                      <p className="text-text-primary py-3">{profileData.yearsExperience} years</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact & Social */}
          <div className="space-y-6">
            <div className="card">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-medium text-text-primary">Contact information</h3>
              </div>
              <div className="px-6 py-6 space-y-4">
                {/* Email - read only */}
                <div>
                  <label className="label-text mb-1 flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4 text-text-tertiary" />
                    Email
                  </label>
                  <p className="text-text-primary py-2">{displayUser?.email || 'Email not set'}</p>
                </div>

                {/* Phone - editable */}
                <div>
                  <label className="label-text mb-1 flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4 text-text-tertiary" />
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="input-field min-h-12"
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <p className="text-text-primary py-2">{profileData.phone || 'Not set'}</p>
                  )}
                </div>

                {/* Location - editable */}
                <div>
                  {validationErrors.location && isEditing && (
                    <div className="flex items-center gap-1.5 mb-1 text-sm text-error">
                      <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0" />
                      <span>{validationErrors.location}</span>
                    </div>
                  )}
                  <label className="label-text mb-1 flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-text-tertiary" />
                    Location {isEditing && <span className="text-error">*</span>}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => {
                        const value = e.target.value;
                        setProfileData(prev => ({ ...prev, location: value }));
                        validateProfileField('location', value);
                      }}
                      className={`input-field min-h-12 ${validationErrors.location ? 'border-error focus:ring-error' : ''}`}
                      placeholder="San Francisco, CA"
                    />
                  ) : (
                    <p className="text-text-primary py-2">{profileData.location || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-medium text-text-primary">Quick stats</h3>
              </div>
              <div className="px-6 py-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Years experience</span>
                  <span className="font-medium text-text-primary">{profileData.yearsExperience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Skills</span>
                  <span className="font-medium text-text-primary">{profileData.skills.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Projects</span>
                  <span className="font-medium text-text-primary">{profileData.portfolio.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Achievements</span>
                  <span className="font-medium text-text-primary">{profileData.achievements.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tab content would go here */}
      {activeTab === 'skills' && (
        <div className="card">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-medium text-text-primary">Skills & expertise</h3>
            {isEditing && (
              <button
                onClick={addSkill}
                className="btn-outline min-h-12 text-base"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add skill
              </button>
            )}
          </div>
          <div className="px-6 py-6">
            {profileData.skills.length === 0 ? (
              <p className="text-text-tertiary text-center py-8">No skills added yet.</p>
            ) : (
              <div className="space-y-4">
                {profileData.skills.map((skill, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="label-text mb-1">
                            Skill name
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
                              className="input-field min-h-12"
                              placeholder="React, Python, Project Management..."
                            />
                          ) : (
                            <p className="font-medium text-text-primary">{skill.name}</p>
                          )}
                        </div>

                        <div>
                          <label className="label-text mb-1">
                            Proficiency level
                          </label>
                          {isEditing ? (
                            <select
                              value={skill.level}
                              onChange={(e) => {
                                const newSkills = [...profileData.skills];
                                newSkills[index] = { ...skill, level: e.target.value as any };
                                setProfileData(prev => ({ ...prev, skills: newSkills }));
                              }}
                              className="input-field min-h-12"
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Expert">Expert</option>
                            </select>
                          ) : (
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              skill.level === 'Expert' ? 'bg-gold-100 text-gold-800' :
                              skill.level === 'Advanced' ? 'bg-navy-50 text-navy-800' :
                              skill.level === 'Intermediate' ? 'bg-success-light text-success-dark' :
                              'bg-bg-alt text-text-secondary'
                            }`}>
                              {skill.level}
                            </span>
                          )}
                        </div>

                        <div>
                          <label className="label-text mb-1">
                            Years experience
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
                              className="input-field min-h-12"
                              min="0"
                              max="50"
                            />
                          ) : (
                            <p className="text-text-primary">{skill.yearsExperience} years</p>
                          )}
                        </div>
                      </div>

                      {isEditing && (
                        <button
                          onClick={() => removeSkill(index)}
                          className="ml-4 text-error hover:text-error-dark touch-target transition-colors duration-fast"
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