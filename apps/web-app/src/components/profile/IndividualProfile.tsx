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
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if this is a demo user - use email check since AuthContext creates
  // user records for all authenticated users (so `user` will exist even for demo)
  const userEmail = user?.email || sessionUser?.email || '';
  const isDemoUser = userEmail === 'demo@example.com' || userEmail === 'company@example.com';

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

  // Initialize profile data - only runs once when we have an email
  useEffect(() => {
    // Don't re-initialize if already done
    if (isInitialized || !userEmail) return;

    // Try to load from localStorage first
    let savedProfile: IndividualProfileData | null = null;
    let savedPhoto: string | null = null;

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`${DEMO_PROFILE_STORAGE_KEY}_${userEmail}`);
        if (saved) {
          savedProfile = JSON.parse(saved) as IndividualProfileData;
        }
        savedPhoto = localStorage.getItem(`${DEMO_PROFILE_STORAGE_KEY}_${userEmail}_photo`);
      } catch (e) {
        console.error('Error loading demo profile:', e);
      }
    }

    // For demo user, check if saved profile is complete or use mock data
    if (userEmail === 'demo@example.com') {
      // Demo photo URL - professional placeholder
      const demoPhotoUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face';

      // Check if saved profile has meaningful data (not just empty defaults)
      const hasCompleteProfile = savedProfile &&
        savedProfile.headline &&
        savedProfile.bio &&
        savedProfile.experiences?.length > 0;

      if (hasCompleteProfile && savedProfile) {
        setProfileData(savedProfile);
        // Use saved photo if it's a valid URL, otherwise fall back to demo photo
        const photoToUse = (savedPhoto && savedPhoto.startsWith('http'))
          ? savedPhoto
          : (user?.photoURL || sessionUser?.image || demoPhotoUrl);
        setCurrentPhotoUrl(photoToUse);
        setIsInitialized(true);
        return;
      }

      // Otherwise, load the complete demo profile
      const demoProfileData: IndividualProfileData = {
        firstName: 'Alex',
        lastName: 'Chen',
        headline: 'Senior Analytics Lead | Team Builder | Data-Driven Decision Maker',
        bio: 'Experienced analytics leader with 8+ years building and leading high-performing data teams. Passionate about transforming complex data into actionable insights that drive business growth. Successfully led teams through 3 company acquisitions and multiple product launches. Known for fostering collaborative environments where team members thrive and deliver exceptional results.',
        location: 'San Francisco, CA',
        phone: '+1 (415) 555-0123',
        currentCompany: 'TechVentures Inc.',
        currentPosition: 'Senior Analytics Lead',
        industry: 'Technology',
        yearsExperience: 8,
        skills: [
          { name: 'Data Analytics', level: 'Expert', yearsExperience: 8 },
          { name: 'Team Leadership', level: 'Expert', yearsExperience: 6 },
          { name: 'Python', level: 'Advanced', yearsExperience: 7 },
          { name: 'SQL', level: 'Expert', yearsExperience: 8 },
          { name: 'Machine Learning', level: 'Advanced', yearsExperience: 5 },
          { name: 'Tableau', level: 'Expert', yearsExperience: 6 },
          { name: 'Apache Spark', level: 'Intermediate', yearsExperience: 3 },
          { name: 'Strategic Planning', level: 'Advanced', yearsExperience: 5 },
        ],
        primarySkills: ['Data Analytics', 'Team Leadership', 'Python', 'SQL', 'Machine Learning'],
        experiences: [
          {
            id: 'exp-1',
            company: 'TechVentures Inc.',
            position: 'Senior Analytics Lead',
            startDate: '2021-03',
            isCurrent: true,
            description: 'Lead a team of 6 analysts and data scientists driving product analytics and business intelligence initiatives. Spearheaded the development of a real-time analytics platform that increased conversion rates by 23%. Collaborate with executive leadership to define data strategy and KPIs.',
            achievements: ['Increased conversion by 23%', 'Built team from 2 to 6 members', 'Launched real-time analytics platform'],
            technologies: ['Python', 'Spark', 'Tableau', 'AWS', 'Snowflake'],
          },
          {
            id: 'exp-2',
            company: 'DataDriven Solutions',
            position: 'Analytics Manager',
            startDate: '2018-06',
            endDate: '2021-02',
            isCurrent: false,
            description: 'Managed analytics team through company acquisition. Built predictive models that reduced customer churn by 18%. Established data governance practices and self-service BI tools for non-technical stakeholders.',
            achievements: ['Reduced churn by 18%', 'Led team through acquisition', 'Implemented data governance'],
            technologies: ['Python', 'R', 'Looker', 'BigQuery', 'dbt'],
          },
          {
            id: 'exp-3',
            company: 'StartupXYZ',
            position: 'Senior Data Analyst',
            startDate: '2016-01',
            endDate: '2018-05',
            isCurrent: false,
            description: 'First analytics hire at Series A startup. Built analytics infrastructure from ground up. Created dashboards and reports that supported $50M Series B fundraise.',
            achievements: ['Built analytics from scratch', 'Supported $50M fundraise', 'Hired first 2 team members'],
            technologies: ['Python', 'SQL', 'Mixpanel', 'Redshift', 'Mode'],
          },
        ],
        education: [
          {
            id: 'edu-1',
            institution: 'Stanford University',
            degree: 'Master of Science',
            field: 'Statistics',
            startYear: 2014,
            endYear: 2016,
            gpa: 3.8,
          },
          {
            id: 'edu-2',
            institution: 'UC Berkeley',
            degree: 'Bachelor of Arts',
            field: 'Economics',
            startYear: 2010,
            endYear: 2014,
            gpa: 3.6,
          },
        ],
        achievements: [
          {
            id: 'ach-1',
            title: 'Analytics Excellence Award',
            description: 'Recognized for building the most impactful analytics initiative of the year',
            date: '2023-06',
            type: 'award',
            organization: 'TechVentures Inc.',
          },
          {
            id: 'ach-2',
            title: 'Google Cloud Professional Data Engineer',
            description: 'Certified in designing and building data processing systems on Google Cloud',
            date: '2022-03',
            type: 'certification',
            organization: 'Google Cloud',
          },
          {
            id: 'ach-3',
            title: 'Speaker at Data Summit 2022',
            description: 'Presented "Building High-Performing Analytics Teams" to 500+ attendees',
            date: '2022-09',
            type: 'recognition',
            organization: 'Data Summit Conference',
          },
        ],
        portfolio: [
          {
            id: 'port-1',
            title: 'Real-Time Analytics Dashboard',
            description: 'Built a comprehensive real-time analytics platform tracking user behavior, conversion funnels, and business KPIs. Processes 10M+ events daily with sub-second latency.',
            url: 'https://github.com/alexchen/realtime-analytics',
            technologies: ['Python', 'Kafka', 'Spark Streaming', 'React', 'D3.js'],
            type: 'project',
          },
          {
            id: 'port-2',
            title: 'Churn Prediction Model',
            description: 'Machine learning model predicting customer churn with 92% accuracy. Reduced churn by 18% through targeted intervention campaigns.',
            url: 'https://github.com/alexchen/churn-prediction',
            technologies: ['Python', 'scikit-learn', 'XGBoost', 'MLflow'],
            type: 'project',
          },
          {
            id: 'port-3',
            title: 'Building High-Performing Analytics Teams',
            description: 'Published article on best practices for hiring, developing, and retaining analytics talent in competitive markets.',
            url: 'https://medium.com/@alexchen/building-analytics-teams',
            technologies: [],
            type: 'publication',
          },
        ],
        openToOpportunities: true,
        preferredRoles: ['VP of Analytics', 'Head of Data', 'Analytics Director', 'Data Science Lead'],
        salaryRange: { min: 200000, max: 280000, currency: 'USD' },
        workAuthorization: 'citizen',
        remoteWork: 'hybrid',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/alexchen',
          github: 'https://github.com/alexchen',
          website: 'https://alexchen.dev',
          twitter: 'https://twitter.com/alexchen_data',
        },
      };

      setProfileData(demoProfileData);
      setCurrentPhotoUrl(user?.photoURL || sessionUser?.image || demoPhotoUrl);
      // Save to localStorage so it persists
      saveDemoProfile(demoProfileData, demoPhotoUrl);
      setIsInitialized(true);
      return;
    }

    // For non-demo users, check if they have saved profile data
    if (savedProfile) {
      setProfileData(savedProfile);
      setCurrentPhotoUrl(savedPhoto || user?.photoURL || sessionUser?.image || null);
      setIsInitialized(true);
      return;
    }

    // Use session/user data as initial fallback for non-demo users
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
    setIsInitialized(true);
  }, [userEmail, user, sessionUser, isInitialized, saveDemoProfile]);

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
        // Transform profile data to match User.profileData type
        const profileDataForApi = {
          bio: profileData.bio,
          website: profileData.socialLinks.website,
          linkedin: profileData.socialLinks.linkedin,
          twitter: profileData.socialLinks.twitter,
          github: profileData.socialLinks.github,
          headline: profileData.headline,
          yearsExperience: profileData.yearsExperience,
          skills: profileData.skills.map((skill: Skill) => skill.name),
          education: profileData.education.map((edu) => ({
            degree: edu.degree,
            institution: edu.institution,
            year: edu.endYear || edu.startYear,
          })),
          workHistory: profileData.experiences.map((exp) => ({
            company: exp.company,
            role: exp.position,
            duration: exp.isCurrent
              ? `${exp.startDate} - Present`
              : `${exp.startDate} - ${exp.endDate || 'Present'}`,
          })),
        };
        await updateProfile({
          name: `${profileData.firstName} ${profileData.lastName}`,
          location: profileData.location,
          phone: profileData.phone,
          companyName: profileData.currentCompany,
          position: profileData.currentPosition,
          industry: profileData.industry,
          photoURL: currentPhotoUrl || undefined,
          // Store extended profile data in a separate field
          profileData: profileDataForApi,
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
                <span className={`badge text-xs ${
                  completionBadge.color === 'green' ? 'badge-success' :
                  completionBadge.color === 'blue' ? 'badge-primary' :
                  completionBadge.color === 'yellow' ? 'badge-warning' :
                  'badge-error'
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
                <h3 className="text-lg font-bold text-text-primary">Basic information</h3>
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
                <h3 className="text-lg font-bold text-text-primary">Contact information</h3>
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
                <h3 className="text-lg font-bold text-text-primary">Quick stats</h3>
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
            <h3 className="text-lg font-bold text-text-primary">Skills & expertise</h3>
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
              <div className="text-center py-12">
                <CodeBracketIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                <p className="text-text-tertiary mb-4">No skills added yet.</p>
                {isEditing && (
                  <button onClick={addSkill} className="btn-primary min-h-12">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add your first skill
                  </button>
                )}
              </div>
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
                            <span className={`badge text-xs ${
                              skill.level === 'Expert' ? 'badge-warning' :
                              skill.level === 'Advanced' ? 'badge-primary' :
                              skill.level === 'Intermediate' ? 'badge-success' :
                              'badge-secondary'
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

      {/* Experience Tab */}
      {activeTab === 'experience' && (
        <div className="card">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary">Work experience</h3>
            {isEditing && (
              <button
                onClick={addExperience}
                className="btn-outline min-h-12 text-base"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add experience
              </button>
            )}
          </div>
          <div className="px-6 py-6">
            {profileData.experiences.length === 0 ? (
              <div className="text-center py-12">
                <BriefcaseIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                <p className="text-text-tertiary mb-4">No work experience added yet.</p>
                {isEditing && (
                  <button onClick={addExperience} className="btn-primary min-h-12">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add your first experience
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {profileData.experiences.map((exp, index) => (
                  <div key={exp.id} className="border border-border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        {isEditing ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="label-text mb-1">Position</label>
                              <input
                                type="text"
                                value={exp.position}
                                onChange={(e) => {
                                  const newExps = [...profileData.experiences];
                                  newExps[index] = { ...exp, position: e.target.value };
                                  setProfileData(prev => ({ ...prev, experiences: newExps }));
                                }}
                                className="input-field min-h-12"
                                placeholder="Senior Software Engineer"
                              />
                            </div>
                            <div>
                              <label className="label-text mb-1">Company</label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => {
                                  const newExps = [...profileData.experiences];
                                  newExps[index] = { ...exp, company: e.target.value };
                                  setProfileData(prev => ({ ...prev, experiences: newExps }));
                                }}
                                className="input-field min-h-12"
                                placeholder="Acme Inc."
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <h4 className="text-base font-bold text-text-primary">{exp.position || 'Position not set'}</h4>
                            <p className="text-sm text-text-secondary">{exp.company || 'Company not set'}</p>
                          </>
                        )}
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => {
                            setProfileData(prev => ({
                              ...prev,
                              experiences: prev.experiences.filter(e => e.id !== exp.id)
                            }));
                          }}
                          className="ml-4 text-error hover:text-error-dark touch-target transition-colors duration-fast"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="label-text mb-1">Start date</label>
                        {isEditing ? (
                          <input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => {
                              const newExps = [...profileData.experiences];
                              newExps[index] = { ...exp, startDate: e.target.value };
                              setProfileData(prev => ({ ...prev, experiences: newExps }));
                            }}
                            className="input-field min-h-12"
                          />
                        ) : (
                          <p className="text-text-primary">{exp.startDate || 'Not set'}</p>
                        )}
                      </div>
                      <div>
                        <label className="label-text mb-1">End date</label>
                        {isEditing ? (
                          <input
                            type="month"
                            value={exp.endDate || ''}
                            onChange={(e) => {
                              const newExps = [...profileData.experiences];
                              newExps[index] = { ...exp, endDate: e.target.value || undefined };
                              setProfileData(prev => ({ ...prev, experiences: newExps }));
                            }}
                            className="input-field min-h-12"
                            disabled={exp.isCurrent}
                          />
                        ) : (
                          <p className="text-text-primary">{exp.isCurrent ? 'Present' : exp.endDate || 'Not set'}</p>
                        )}
                      </div>
                      <div className="flex items-end">
                        {isEditing && (
                          <label className="flex items-center space-x-2 min-h-12">
                            <input
                              type="checkbox"
                              checked={exp.isCurrent}
                              onChange={(e) => {
                                const newExps = [...profileData.experiences];
                                newExps[index] = { ...exp, isCurrent: e.target.checked, endDate: e.target.checked ? undefined : exp.endDate };
                                setProfileData(prev => ({ ...prev, experiences: newExps }));
                              }}
                              className="rounded border-border text-navy focus:ring-navy"
                            />
                            <span className="text-sm text-text-secondary">Currently working here</span>
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="label-text mb-1">Description</label>
                      {isEditing ? (
                        <textarea
                          value={exp.description}
                          onChange={(e) => {
                            const newExps = [...profileData.experiences];
                            newExps[index] = { ...exp, description: e.target.value };
                            setProfileData(prev => ({ ...prev, experiences: newExps }));
                          }}
                          className="input-field min-h-[100px]"
                          rows={3}
                          placeholder="Describe your responsibilities and accomplishments..."
                        />
                      ) : (
                        <p className="text-text-primary whitespace-pre-wrap">{exp.description || 'No description'}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Portfolio Tab */}
      {activeTab === 'portfolio' && (
        <div className="card">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary">Portfolio & projects</h3>
            {isEditing && (
              <button
                onClick={addPortfolioItem}
                className="btn-outline min-h-12 text-base"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add project
              </button>
            )}
          </div>
          <div className="px-6 py-6">
            {profileData.portfolio.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                <p className="text-text-tertiary mb-4">No portfolio items added yet.</p>
                {isEditing && (
                  <button onClick={addPortfolioItem} className="btn-primary min-h-12">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add your first project
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profileData.portfolio.map((item, index) => (
                  <div key={item.id} className="border border-border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        {isEditing ? (
                          <div className="space-y-4">
                            <div>
                              <label className="label-text mb-1">Project title</label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => {
                                  const newPortfolio = [...profileData.portfolio];
                                  newPortfolio[index] = { ...item, title: e.target.value };
                                  setProfileData(prev => ({ ...prev, portfolio: newPortfolio }));
                                }}
                                className="input-field min-h-12"
                                placeholder="My Awesome Project"
                              />
                            </div>
                            <div>
                              <label className="label-text mb-1">Type</label>
                              <select
                                value={item.type}
                                onChange={(e) => {
                                  const newPortfolio = [...profileData.portfolio];
                                  newPortfolio[index] = { ...item, type: e.target.value as any };
                                  setProfileData(prev => ({ ...prev, portfolio: newPortfolio }));
                                }}
                                className="input-field min-h-12"
                              >
                                <option value="project">Project</option>
                                <option value="publication">Publication</option>
                                <option value="presentation">Presentation</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h4 className="text-base font-bold text-text-primary">{item.title || 'Untitled project'}</h4>
                            <span className={`badge text-xs mt-1 ${
                              item.type === 'project' ? 'badge-primary' :
                              item.type === 'publication' ? 'badge-warning' :
                              item.type === 'presentation' ? 'badge-success' :
                              'badge-secondary'
                            }`}>
                              {item.type}
                            </span>
                          </>
                        )}
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => {
                            setProfileData(prev => ({
                              ...prev,
                              portfolio: prev.portfolio.filter(p => p.id !== item.id)
                            }));
                          }}
                          className="ml-4 text-error hover:text-error-dark touch-target transition-colors duration-fast"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="label-text mb-1">Description</label>
                        {isEditing ? (
                          <textarea
                            value={item.description}
                            onChange={(e) => {
                              const newPortfolio = [...profileData.portfolio];
                              newPortfolio[index] = { ...item, description: e.target.value };
                              setProfileData(prev => ({ ...prev, portfolio: newPortfolio }));
                            }}
                            className="input-field min-h-[80px]"
                            rows={2}
                            placeholder="Describe your project..."
                          />
                        ) : (
                          <p className="text-text-secondary text-sm">{item.description || 'No description'}</p>
                        )}
                      </div>

                      <div>
                        <label className="label-text mb-1 flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 text-text-tertiary" />
                          Project URL
                        </label>
                        {isEditing ? (
                          <input
                            type="url"
                            value={item.url}
                            onChange={(e) => {
                              const newPortfolio = [...profileData.portfolio];
                              newPortfolio[index] = { ...item, url: e.target.value };
                              setProfileData(prev => ({ ...prev, portfolio: newPortfolio }));
                            }}
                            className="input-field min-h-12"
                            placeholder="https://github.com/..."
                          />
                        ) : item.url ? (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-link text-sm hover:underline">
                            {item.url}
                          </a>
                        ) : (
                          <p className="text-text-tertiary text-sm">No URL</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Work Preferences */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-bold text-text-primary">Work preferences</h3>
            </div>
            <div className="px-6 py-6 space-y-6">
              {/* Open to opportunities */}
              <div>
                <label className="label-text mb-2 flex items-center gap-2">
                  <StarIcon className="h-4 w-4 text-text-tertiary" />
                  Open to opportunities
                </label>
                {isEditing ? (
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={profileData.openToOpportunities}
                      onChange={(e) => setProfileData(prev => ({ ...prev, openToOpportunities: e.target.checked }))}
                      className="rounded border-border text-navy focus:ring-navy h-5 w-5"
                    />
                    <span className="text-text-primary">I&apos;m open to new opportunities</span>
                  </label>
                ) : (
                  <p className={`font-medium ${profileData.openToOpportunities ? 'text-success' : 'text-text-tertiary'}`}>
                    {profileData.openToOpportunities ? 'Open to opportunities' : 'Not actively looking'}
                  </p>
                )}
              </div>

              {/* Remote work preference */}
              <div>
                <label className="label-text mb-1">Remote work preference</label>
                {isEditing ? (
                  <select
                    value={profileData.remoteWork}
                    onChange={(e) => setProfileData(prev => ({ ...prev, remoteWork: e.target.value as any }))}
                    className="input-field min-h-12"
                  >
                    <option value="onsite">On-site only</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="remote">Remote only</option>
                    <option value="flexible">Flexible</option>
                  </select>
                ) : (
                  <p className="text-text-primary capitalize">{profileData.remoteWork}</p>
                )}
              </div>

              {/* Work authorization */}
              <div>
                <label className="label-text mb-1">Work authorization</label>
                {isEditing ? (
                  <select
                    value={profileData.workAuthorization}
                    onChange={(e) => setProfileData(prev => ({ ...prev, workAuthorization: e.target.value }))}
                    className="input-field min-h-12"
                  >
                    <option value="">Select authorization</option>
                    <option value="citizen">US Citizen</option>
                    <option value="permanent_resident">Permanent Resident</option>
                    <option value="visa_holder">Visa Holder</option>
                    <option value="no_sponsorship">No Sponsorship Required</option>
                    <option value="requires_sponsorship">Requires Sponsorship</option>
                  </select>
                ) : (
                  <p className="text-text-primary">{profileData.workAuthorization || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Compensation */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-bold text-text-primary">Compensation expectations</h3>
            </div>
            <div className="px-6 py-6 space-y-6">
              {/* Salary range */}
              <div>
                <label className="label-text mb-1 flex items-center gap-2">
                  <CurrencyDollarIcon className="h-4 w-4 text-text-tertiary" />
                  Desired salary range
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-text-tertiary mb-1 block">Minimum</label>
                      <input
                        type="number"
                        value={profileData.salaryRange.min || ''}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          salaryRange: { ...prev.salaryRange, min: parseInt(e.target.value) || 0 }
                        }))}
                        className="input-field min-h-12"
                        placeholder="100000"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-text-tertiary mb-1 block">Maximum</label>
                      <input
                        type="number"
                        value={profileData.salaryRange.max || ''}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          salaryRange: { ...prev.salaryRange, max: parseInt(e.target.value) || 0 }
                        }))}
                        className="input-field min-h-12"
                        placeholder="150000"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-text-primary">
                    {profileData.salaryRange.min && profileData.salaryRange.max
                      ? `$${profileData.salaryRange.min.toLocaleString()} - $${profileData.salaryRange.max.toLocaleString()} ${profileData.salaryRange.currency}`
                      : 'Not specified'}
                  </p>
                )}
              </div>

              {/* Currency */}
              {isEditing && (
                <div>
                  <label className="label-text mb-1">Currency</label>
                  <select
                    value={profileData.salaryRange.currency}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      salaryRange: { ...prev.salaryRange, currency: e.target.value }
                    }))}
                    className="input-field min-h-12"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>
              )}

              {/* Preferred roles */}
              <div>
                <label className="label-text mb-1">Preferred role types</label>
                {isEditing && (
                  <p className="text-xs text-text-tertiary mb-2">Enter roles separated by commas</p>
                )}
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.preferredRoles.join(', ')}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      preferredRoles: e.target.value.split(',').map(r => r.trim()).filter(Boolean)
                    }))}
                    className="input-field min-h-12"
                    placeholder="Full-stack Developer, Tech Lead, Engineering Manager"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profileData.preferredRoles.length > 0 ? (
                      profileData.preferredRoles.map((role, i) => (
                        <span key={i} className="badge badge-primary text-xs">
                          {role}
                        </span>
                      ))
                    ) : (
                      <p className="text-text-tertiary">No preferred roles specified</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="card lg:col-span-2">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-bold text-text-primary">Social & professional links</h3>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label-text mb-1 flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-text-tertiary" />
                    LinkedIn
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profileData.socialLinks.linkedin || ''}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                      }))}
                      className="input-field min-h-12"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  ) : profileData.socialLinks.linkedin ? (
                    <a href={profileData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-link hover:underline">
                      {profileData.socialLinks.linkedin}
                    </a>
                  ) : (
                    <p className="text-text-tertiary">Not set</p>
                  )}
                </div>

                <div>
                  <label className="label-text mb-1 flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-text-tertiary" />
                    GitHub
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profileData.socialLinks.github || ''}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        socialLinks: { ...prev.socialLinks, github: e.target.value }
                      }))}
                      className="input-field min-h-12"
                      placeholder="https://github.com/yourusername"
                    />
                  ) : profileData.socialLinks.github ? (
                    <a href={profileData.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-link hover:underline">
                      {profileData.socialLinks.github}
                    </a>
                  ) : (
                    <p className="text-text-tertiary">Not set</p>
                  )}
                </div>

                <div>
                  <label className="label-text mb-1 flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-text-tertiary" />
                    Personal website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profileData.socialLinks.website || ''}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        socialLinks: { ...prev.socialLinks, website: e.target.value }
                      }))}
                      className="input-field min-h-12"
                      placeholder="https://yourwebsite.com"
                    />
                  ) : profileData.socialLinks.website ? (
                    <a href={profileData.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-link hover:underline">
                      {profileData.socialLinks.website}
                    </a>
                  ) : (
                    <p className="text-text-tertiary">Not set</p>
                  )}
                </div>

                <div>
                  <label className="label-text mb-1 flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-text-tertiary" />
                    Twitter / X
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profileData.socialLinks.twitter || ''}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                      }))}
                      className="input-field min-h-12"
                      placeholder="https://twitter.com/yourhandle"
                    />
                  ) : profileData.socialLinks.twitter ? (
                    <a href={profileData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-link hover:underline">
                      {profileData.socialLinks.twitter}
                    </a>
                  ) : (
                    <p className="text-text-tertiary">Not set</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}