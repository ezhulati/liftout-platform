'use client';

import React, { useState, useEffect } from 'react';
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
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
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

  // Initialize profile data
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        companyName: user.companyName || '',
        contactEmail: user.email || '',
        contactPhone: user.phone || '',
        headquarters: user.location || '',
        industry: user.industry || '',
        stats: {
          ...prev.stats,
          yearsInBusiness: new Date().getFullYear() - prev.foundedYear,
        },
      }));
      
      // Set current logo URL
      setCurrentLogoUrl(user.photoURL || null);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      // Update basic user fields
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
    
    // Auto-save logo URL to user profile
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

  if (!user) {
    return <div>Loading...</div>;
  }

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
                userId={user.id}
                type="company-logo"
                onPhotoUpdate={handleLogoUpdate}
                size="xl"
                disabled={readonly}
                className="rounded-lg"
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
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-fast ${
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
                <h3 className="text-lg font-medium text-text-primary">Company information</h3>
              </div>
              <div className="px-6 py-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Company name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.companyName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, companyName: e.target.value }))}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-text-primary">{profileData.companyName || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Tagline
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.tagline}
                      onChange={(e) => setProfileData(prev => ({ ...prev, tagline: e.target.value }))}
                      className="input-field"
                      placeholder="Transforming the future of work"
                    />
                  ) : (
                    <p className="text-text-primary">{profileData.tagline || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Company description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={profileData.description}
                      onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
                      className="input-field"
                      rows={4}
                      placeholder="Describe your company, what you do, and what makes you unique..."
                    />
                  ) : (
                    <p className="text-text-primary">{profileData.description || 'Not set'}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Industry
                    </label>
                    {isEditing ? (
                      <select
                        value={profileData.industry}
                        onChange={(e) => setProfileData(prev => ({ ...prev, industry: e.target.value }))}
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
                      <p className="text-text-primary">{profileData.industry || 'Not set'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Company size
                    </label>
                    {isEditing ? (
                      <select
                        value={profileData.companySize}
                        onChange={(e) => setProfileData(prev => ({ ...prev, companySize: e.target.value }))}
                        className="input-field"
                      >
                        <option value="">Select Size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501-1000">501-1000 employees</option>
                        <option value="1001-5000">1001-5000 employees</option>
                        <option value="5000+">5000+ employees</option>
                      </select>
                    ) : (
                      <p className="text-text-primary">{profileData.companySize || 'Not set'}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Founded year
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={profileData.foundedYear}
                        onChange={(e) => setProfileData(prev => ({ ...prev, foundedYear: parseInt(e.target.value) || new Date().getFullYear() }))}
                        className="input-field"
                        min="1800"
                        max={new Date().getFullYear()}
                      />
                    ) : (
                      <p className="text-text-primary">{profileData.foundedYear}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                        className="input-field"
                        placeholder="https://company.com"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <GlobeAltIcon className="h-4 w-4 text-text-tertiary" />
                        {profileData.website ? (
                          <a
                            href={profileData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-navy hover:text-navy-800"
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
          </div>
          
          {/* Quick Stats & Contact */}
          <div className="space-y-6">
            <div className="card">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-medium text-text-primary">Contact information</h3>
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
                <h3 className="text-lg font-medium text-text-primary">Company stats</h3>
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
              <h3 className="text-lg font-medium text-text-primary">Mission & vision</h3>
            </div>
            <div className="px-6 py-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Mission statement
                </label>
                {isEditing ? (
                  <textarea
                    value={profileData.mission}
                    onChange={(e) => setProfileData(prev => ({ ...prev, mission: e.target.value }))}
                    className="input-field"
                    rows={3}
                    placeholder="What is your company's purpose and reason for existing?"
                  />
                ) : (
                  <p className="text-text-primary">{profileData.mission || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Vision statement
                </label>
                {isEditing ? (
                  <textarea
                    value={profileData.vision}
                    onChange={(e) => setProfileData(prev => ({ ...prev, vision: e.target.value }))}
                    className="input-field"
                    rows={3}
                    placeholder="What does your company aspire to become in the future?"
                  />
                ) : (
                  <p className="text-text-primary">{profileData.vision || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Company Values */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-medium text-text-primary">Company values</h3>
              {isEditing && (
                <button
                  onClick={addValue}
                  className="btn-secondary text-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add value
                </button>
              )}
            </div>
            <div className="px-6 py-6">
              {profileData.values.length === 0 ? (
                <p className="text-text-tertiary text-center py-8">No values added yet.</p>
              ) : (
                <div className="space-y-4">
                  {profileData.values.map((value, index) => (
                    <div key={value.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                              Value title
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={value.title}
                                onChange={(e) => {
                                  const newValues = [...profileData.values];
                                  newValues[index] = { ...value, title: e.target.value };
                                  setProfileData(prev => ({ ...prev, values: newValues }));
                                }}
                                className="input-field"
                                placeholder="Innovation, Integrity, Collaboration..."
                              />
                            ) : (
                              <p className="font-medium text-text-primary">{value.title}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                              Description
                            </label>
                            {isEditing ? (
                              <textarea
                                value={value.description}
                                onChange={(e) => {
                                  const newValues = [...profileData.values];
                                  newValues[index] = { ...value, description: e.target.value };
                                  setProfileData(prev => ({ ...prev, values: newValues }));
                                }}
                                className="input-field"
                                rows={2}
                                placeholder="Describe what this value means to your company..."
                              />
                            ) : (
                              <p className="text-text-secondary">{value.description}</p>
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
                            className="ml-4 text-error hover:text-error-dark"
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