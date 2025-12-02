'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import PhotoUpload from './PhotoUpload';
import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  MapPinIcon,
  BriefcaseIcon,
  PhoneIcon,
  GlobeAltIcon,
  UsersIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  LinkIcon,
  PlusIcon,
  XMarkIcon,
  CalendarIcon,
  ChartBarIcon,
  StarIcon,
  TrophyIcon,
  ShieldCheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarSolidIcon,
} from '@heroicons/react/24/solid';
import { useCallback } from 'react';

// Local storage key for demo user company profile data
const DEMO_COMPANY_PROFILE_STORAGE_KEY = 'liftout_demo_company_profile';

interface CompanyValue {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

interface CompanyBenefit {
  id: string;
  category: 'health' | 'financial' | 'time-off' | 'professional' | 'lifestyle' | 'other';
  title: string;
  description: string;
}

interface CompanyTeam {
  id: string;
  name: string;
  position: string;
  department: string;
  photoUrl?: string;
  bio?: string;
  linkedin?: string;
}

interface CompanyOffice {
  id: string;
  city: string;
  country: string;
  address: string;
  isHeadquarters: boolean;
  employeeCount: number;
  amenities: string[];
}

interface CompanyAchievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'award' | 'certification' | 'milestone' | 'recognition' | 'funding';
  organization?: string;
  url?: string;
}

interface CompanyProfileData {
  // Basic Company Info
  companyName: string;
  tagline: string;
  description: string;
  website: string;
  industry: string;
  companySize: string;
  foundedYear: number;
  headquarters: string;
  
  // Contact & Location
  contactEmail: string;
  contactPhone: string;
  offices: CompanyOffice[];
  
  // Culture & Values
  mission: string;
  vision: string;
  values: CompanyValue[];
  culture: string;
  workEnvironment: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  
  // Benefits & Perks
  benefits: CompanyBenefit[];
  perks: string[];
  
  // Team & Leadership
  leadership: CompanyTeam[];
  departments: string[];
  
  // Company Stats
  stats: {
    employeeCount: number;
    annualRevenue?: string;
    fundingRaised?: string;
    customersServed?: number;
    yearsInBusiness: number;
    employeeRetentionRate?: number;
    diversityStats?: {
      genderDiversity: number;
      ethnicDiversity: number;
    };
  };
  
  // Achievements & Recognition
  achievements: CompanyAchievement[];
  certifications: string[];
  awards: string[];
  
  // Hiring & Liftout Info
  hiringPreferences: {
    preferredTeamSizes: number[];
    industries: string[];
    locations: string[];
    remotePolicy: string;
    liftoutBudget: {
      min: number;
      max: number;
      currency: string;
    };
  };
  
  // Social Links
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    blog?: string;
  };
  
  // Verification & Trust
  verified: boolean;
  verificationDocuments: string[];
  trustScore: number;
  clientTestimonials: Array<{
    id: string;
    client: string;
    role: string;
    company: string;
    testimonial: string;
    rating: number;
    date: string;
  }>;
}

interface CompanyProfileProps {
  readonly?: boolean;
  companyId?: string;
}

export default function CompanyProfile({ readonly = false, companyId }: CompanyProfileProps) {
  const { data: session } = useSession();
  const { user, updateProfile, isUserLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Use session data as fallback
  const sessionUser = session?.user as any;

  // Check if this is a demo user - use email check since AuthContext creates
  // user records for all authenticated users (so `user` will exist even for demo)
  const userEmail = user?.email || sessionUser?.email || '';
  const isDemoUser = userEmail === 'demo@example.com' || userEmail === 'company@example.com';

  // Save profile data to localStorage for demo users
  const saveDemoCompanyProfile = useCallback((data: CompanyProfileData, logoUrl: string | null) => {
    if (typeof window !== 'undefined' && userEmail) {
      try {
        localStorage.setItem(`${DEMO_COMPANY_PROFILE_STORAGE_KEY}_${userEmail}`, JSON.stringify(data));
        if (logoUrl !== undefined) {
          localStorage.setItem(`${DEMO_COMPANY_PROFILE_STORAGE_KEY}_${userEmail}_logo`, logoUrl || '');
        }
      } catch (e) {
        console.error('Error saving demo company profile:', e);
      }
    }
  }, [userEmail]);
  const [activeTab, setActiveTab] = useState<'overview' | 'culture' | 'team' | 'benefits' | 'hiring' | 'achievements'>('overview');
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<CompanyProfileData>({
    companyName: '',
    tagline: '',
    description: '',
    website: '',
    industry: '',
    companySize: '',
    foundedYear: new Date().getFullYear(),
    headquarters: '',
    contactEmail: '',
    contactPhone: '',
    offices: [],
    mission: '',
    vision: '',
    values: [],
    culture: '',
    workEnvironment: 'flexible',
    benefits: [],
    perks: [],
    leadership: [],
    departments: [],
    stats: {
      employeeCount: 0,
      yearsInBusiness: 0,
    },
    achievements: [],
    certifications: [],
    awards: [],
    hiringPreferences: {
      preferredTeamSizes: [],
      industries: [],
      locations: [],
      remotePolicy: '',
      liftoutBudget: { min: 0, max: 0, currency: 'USD' },
    },
    socialLinks: {},
    verified: false,
    verificationDocuments: [],
    trustScore: 0,
    clientTestimonials: [],
  });

  // Initialize profile data - load from localStorage for demo users
  useEffect(() => {
    // Don't re-initialize if already done
    if (isInitialized || !userEmail) return;

    // Try to load from localStorage first (for demo users)
    let savedProfile: CompanyProfileData | null = null;
    let savedLogo: string | null = null;

    if (typeof window !== 'undefined' && isDemoUser) {
      try {
        const saved = localStorage.getItem(`${DEMO_COMPANY_PROFILE_STORAGE_KEY}_${userEmail}`);
        if (saved) {
          savedProfile = JSON.parse(saved) as CompanyProfileData;
        }
        savedLogo = localStorage.getItem(`${DEMO_COMPANY_PROFILE_STORAGE_KEY}_${userEmail}_logo`);
      } catch (e) {
        console.error('Error loading demo company profile:', e);
      }
    }

    // If we have saved profile data, use it
    if (savedProfile && savedProfile.companyName) {
      setProfileData(savedProfile);
      setCurrentLogoUrl(savedLogo || user?.photoURL || sessionUser?.image || null);
      setIsInitialized(true);
      return;
    }

    // Otherwise use session/user data as initial values
    const companyName = user?.companyName || sessionUser?.name || '';
    const email = user?.email || sessionUser?.email || '';

    setProfileData(prev => ({
      ...prev,
      companyName: companyName,
      contactEmail: email,
      contactPhone: user?.phone || '',
      headquarters: user?.location || '',
      industry: user?.industry || '',
      stats: {
        ...prev.stats,
        yearsInBusiness: new Date().getFullYear() - prev.foundedYear,
      },
    }));

    // Set current logo URL
    setCurrentLogoUrl(user?.photoURL || sessionUser?.image || null);
    setIsInitialized(true);
  }, [user, sessionUser, userEmail, isDemoUser, isInitialized]);

  const handleSave = async () => {
    try {
      // For demo users, save to localStorage instead of Firestore
      if (isDemoUser) {
        saveDemoCompanyProfile(profileData, currentLogoUrl);
        setIsEditing(false);
        toast.success('Company profile updated successfully');
        return;
      }

      // For real users, update via API
      await updateProfile({
        companyName: profileData.companyName,
        phone: profileData.contactPhone,
        location: profileData.headquarters,
        industry: profileData.industry,
        photoURL: currentLogoUrl || undefined,
        // Store extended profile data
        profileData,
      });

      setIsEditing(false);
      toast.success('Company profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  // Handle logo upload/delete
  const handleLogoUpdate = async (logoUrl: string | null) => {
    setCurrentLogoUrl(logoUrl);

    // For demo users, save to localStorage
    if (isDemoUser) {
      saveDemoCompanyProfile(profileData, logoUrl);
      toast.success('Logo updated');
      return;
    }

    // Auto-save logo URL to user profile for real users
    try {
      await updateProfile({ photoURL: logoUrl || undefined });
    } catch (error) {
      console.error('Failed to save logo URL:', error);
      toast.error('Failed to save logo');
    }
  };

  const addValue = () => {
    const newValue: CompanyValue = {
      id: Date.now().toString(),
      title: '',
      description: '',
    };
    setProfileData(prev => ({
      ...prev,
      values: [...prev.values, newValue]
    }));
  };

  const addBenefit = () => {
    const newBenefit: CompanyBenefit = {
      id: Date.now().toString(),
      category: 'other',
      title: '',
      description: '',
    };
    setProfileData(prev => ({
      ...prev,
      benefits: [...prev.benefits, newBenefit]
    }));
  };

  const addOffice = () => {
    const newOffice: CompanyOffice = {
      id: Date.now().toString(),
      city: '',
      country: '',
      address: '',
      isHeadquarters: false,
      employeeCount: 0,
      amenities: [],
    };
    setProfileData(prev => ({
      ...prev,
      offices: [...prev.offices, newOffice]
    }));
  };

  const addAchievement = () => {
    const newAchievement: CompanyAchievement = {
      id: Date.now().toString(),
      title: '',
      description: '',
      date: '',
      type: 'milestone',
    };
    setProfileData(prev => ({
      ...prev,
      achievements: [...prev.achievements, newAchievement]
    }));
  };

  const calculateProfileCompleteness = () => {
    const fields = [
      profileData.companyName,
      profileData.description,
      profileData.industry,
      profileData.companySize,
      profileData.website,
      profileData.mission,
      profileData.vision,
      profileData.values.length > 0,
      profileData.benefits.length > 0,
      profileData.offices.length > 0,
    ];
    
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const completeness = calculateProfileCompleteness();

  // Use session as fallback - don't require Firestore user
  // Don't block on isUserLoading - just show the page with session data
  const displayUser = user || sessionUser;

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="card">
        <div className="px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              {/* Company Logo Upload */}
              <PhotoUpload
                currentPhotoUrl={currentLogoUrl || undefined}
                userId={user?.id || sessionUser?.id || 'demo-company-user'}
                type="company-logo"
                onPhotoUpdate={handleLogoUpdate}
                size="xl"
                disabled={readonly}
                className="rounded-lg"
                useLocalStorage={isDemoUser}
              />
              
              <div>
                <h1 className="text-2xl font-bold text-text-primary">
                  {profileData.companyName || 'Company Name'}
                </h1>
                <p className="text-lg text-text-secondary mt-1">
                  {profileData.tagline || 'Company tagline'}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-text-tertiary">
                  <div className="flex items-center space-x-1">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{profileData.headquarters || 'Location not set'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <UsersIcon className="h-4 w-4" />
                    <span>{profileData.companySize || 'Size not set'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Founded {profileData.foundedYear}</span>
                  </div>
                </div>

                {/* Trust Score */}
                <div className="flex items-center space-x-2 mt-3">
                  <ShieldCheckIcon className={`h-5 w-5 ${profileData.verified ? 'text-success' : 'text-text-tertiary'}`} />
                  <span className="text-sm font-medium">
                    {profileData.verified ? 'Verified company' : 'Unverified'}
                  </span>
                  {profileData.trustScore > 0 && (
                    <div className="flex items-center space-x-1 ml-4">
                      <StarSolidIcon className="h-4 w-4 text-gold" />
                      <span className="text-sm font-medium">{profileData.trustScore}/5.0 trust score</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {!readonly && (
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
                      className="btn-primary min-h-12"
                    >
                      Save changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
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
              <span className="text-sm font-medium text-text-secondary">Profile completeness</span>
              <span className="text-sm text-text-tertiary">{completeness}%</span>
            </div>
            <div className="w-full bg-bg-alt rounded-full h-2">
              <div
                className="bg-navy-500 h-2 rounded-full transition-all duration-fast"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BuildingOfficeIcon },
            { id: 'culture', label: 'Culture & values', icon: StarIcon },
            { id: 'team', label: 'Team', icon: UsersIcon },
            { id: 'benefits', label: 'Benefits', icon: TrophyIcon },
            { id: 'hiring', label: 'Hiring', icon: BriefcaseIcon },
            { id: 'achievements', label: 'Achievements', icon: ChartBarIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-base min-h-12 transition-colors duration-fast ${
                activeTab === tab.id
                  ? 'border-navy-500 text-navy-600'
                  : 'border-transparent text-text-tertiary hover:text-text-secondary hover:border-border'
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
          {/* Company Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-bold text-text-primary">Company information</h3>
              </div>
              {/* Practical UI: Single column layout for forms */}
              <div className="px-6 py-6 space-y-5">
                <div>
                  <label className="label-text">Company name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.companyName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, companyName: e.target.value }))}
                      className="input-field min-h-12"
                    />
                  ) : (
                    <p className="text-text-primary py-3">{profileData.companyName || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="label-text">Tagline</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.tagline}
                      onChange={(e) => setProfileData(prev => ({ ...prev, tagline: e.target.value }))}
                      className="input-field min-h-12"
                      placeholder="Transforming the future of work"
                    />
                  ) : (
                    <p className="text-text-primary py-3">{profileData.tagline || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="label-text">Company description</label>
                  {isEditing && (
                    <p className="form-field-hint">Describe your company, what you do, and what makes you unique</p>
                  )}
                  {isEditing ? (
                    <textarea
                      value={profileData.description}
                      onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
                      className="input-field min-h-[120px]"
                      rows={4}
                    />
                  ) : (
                    <p className="text-text-primary py-3">{profileData.description || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="label-text">Industry</label>
                  {isEditing ? (
                    <select
                      value={profileData.industry}
                      onChange={(e) => setProfileData(prev => ({ ...prev, industry: e.target.value }))}
                      className="input-field min-h-12"
                    >
                      <option value="">Select industry</option>
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
                    <p className="text-text-primary py-3">{profileData.industry || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="label-text">Company size</label>
                  {isEditing ? (
                    <select
                      value={profileData.companySize}
                      onChange={(e) => setProfileData(prev => ({ ...prev, companySize: e.target.value }))}
                      className="input-field min-h-12"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1001-5000">1001-5000 employees</option>
                      <option value="5000+">5000+ employees</option>
                    </select>
                  ) : (
                    <p className="text-text-primary py-3">{profileData.companySize || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="label-text">Founded year</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={profileData.foundedYear}
                      onChange={(e) => setProfileData(prev => ({ ...prev, foundedYear: parseInt(e.target.value) || new Date().getFullYear() }))}
                      className="input-field min-h-12 max-w-32"
                      min="1800"
                      max={new Date().getFullYear()}
                    />
                  ) : (
                    <p className="text-text-primary py-3">{profileData.foundedYear}</p>
                  )}
                </div>

                <div>
                  <label className="label-text">Website</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                      className="input-field min-h-12"
                      placeholder="https://company.com"
                    />
                  ) : (
                    <div className="flex items-center gap-2 py-3">
                      <GlobeAltIcon className="h-4 w-4 text-text-tertiary" />
                      {profileData.website ? (
                        <a
                          href={profileData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-link hover:underline"
                        >
                          {profileData.website}
                        </a>
                      ) : (
                        <span className="text-text-tertiary">Not set</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats & Contact */}
          <div className="space-y-6">
            <div className="card">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-bold text-text-primary">Contact information</h3>
              </div>
              <div className="px-6 py-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-text-tertiary" />
                  <span className="text-text-primary">{profileData.contactEmail}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-text-tertiary" />
                  <span className="text-text-primary">{profileData.contactPhone || 'Not set'}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPinIcon className="h-5 w-5 text-text-tertiary" />
                  <span className="text-text-primary">{profileData.headquarters || 'Not set'}</span>
                </div>
              </div>
            </div>

            {/* Company Stats */}
            <div className="card">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-bold text-text-primary">Company stats</h3>
              </div>
              <div className="px-6 py-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Employees</span>
                  <span className="font-medium text-text-primary">{profileData.stats.employeeCount || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Years in business</span>
                  <span className="font-medium text-text-primary">{profileData.stats.yearsInBusiness}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Offices</span>
                  <span className="font-medium text-text-primary">{profileData.offices.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Awards</span>
                  <span className="font-medium text-text-primary">{profileData.achievements.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tab content would go here */}
      {activeTab === 'culture' && (
        <div className="space-y-6">
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-bold text-text-primary">Mission & vision</h3>
            </div>
            <div className="px-6 py-6 space-y-5">
              <div>
                <label className="label-text">Mission statement</label>
                {isEditing && (
                  <p className="form-field-hint">What is your company's purpose and reason for existing?</p>
                )}
                {isEditing ? (
                  <textarea
                    value={profileData.mission}
                    onChange={(e) => setProfileData(prev => ({ ...prev, mission: e.target.value }))}
                    className="input-field min-h-[100px]"
                    rows={3}
                  />
                ) : (
                  <p className="text-text-primary py-3">{profileData.mission || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="label-text">Vision statement</label>
                {isEditing && (
                  <p className="form-field-hint">What does your company aspire to become in the future?</p>
                )}
                {isEditing ? (
                  <textarea
                    value={profileData.vision}
                    onChange={(e) => setProfileData(prev => ({ ...prev, vision: e.target.value }))}
                    className="input-field min-h-[100px]"
                    rows={3}
                  />
                ) : (
                  <p className="text-text-primary py-3">{profileData.vision || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Company Values */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-text-primary">Company values</h3>
              {isEditing && (
                <button
                  onClick={addValue}
                  className="btn-outline min-h-12"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add value
                </button>
              )}
            </div>
            <div className="px-6 py-6">
              {profileData.values.length === 0 ? (
                <div className="text-center py-12">
                  <StarIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                  <p className="text-text-tertiary mb-4">No values added yet</p>
                  {isEditing && (
                    <button onClick={addValue} className="btn-primary min-h-12">
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Add your first value
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {profileData.values.map((value, index) => (
                    <div key={value.id} className="border border-border rounded-xl p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-4">
                          <div>
                            <label className="label-text">Value title</label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={value.title}
                                onChange={(e) => {
                                  const newValues = [...profileData.values];
                                  newValues[index] = { ...value, title: e.target.value };
                                  setProfileData(prev => ({ ...prev, values: newValues }));
                                }}
                                className="input-field min-h-12"
                                placeholder="Innovation, Integrity, Collaboration..."
                              />
                            ) : (
                              <p className="font-bold text-text-primary py-2">{value.title}</p>
                            )}
                          </div>

                          <div>
                            <label className="label-text">Description</label>
                            {isEditing ? (
                              <textarea
                                value={value.description}
                                onChange={(e) => {
                                  const newValues = [...profileData.values];
                                  newValues[index] = { ...value, description: e.target.value };
                                  setProfileData(prev => ({ ...prev, values: newValues }));
                                }}
                                className="input-field min-h-[80px]"
                                rows={2}
                                placeholder="Describe what this value means to your company..."
                              />
                            ) : (
                              <p className="text-text-secondary py-2">{value.description}</p>
                            )}
                          </div>
                        </div>

                        {isEditing && (
                          <button
                            onClick={() => {
                              setProfileData(prev => ({
                                ...prev,
                                values: prev.values.filter(v => v.id !== value.id)
                              }));
                            }}
                            className="min-h-12 min-w-12 flex items-center justify-center text-error hover:text-error-dark hover:bg-error-light rounded-lg transition-colors"
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
        </div>
      )}
    </div>
  );
}