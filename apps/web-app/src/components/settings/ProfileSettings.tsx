'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { FormField, ButtonGroup, TextLink } from '@/components/ui';

// Local storage key for demo user settings data
const DEMO_SETTINGS_STORAGE_KEY = 'liftout_demo_settings';

export function ProfileSettings() {
  const { data: session } = useSession();
  const { user, updateProfile, isUserLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Use session data as fallback when Firestore user hasn't loaded yet
  const sessionUser = session?.user as any;
  const displayName = user?.name || sessionUser?.name || '';
  const displayEmail = user?.email || sessionUser?.email || '';

  // Check if this is a demo user - use email check since AuthContext creates
  // user records for all authenticated users (so `user` will exist even for demo)
  const userEmail = user?.email || sessionUser?.email || '';
  const isDemoUser = userEmail === 'demo@example.com' || userEmail === 'company@example.com';

  // Save settings to localStorage for demo users
  const saveDemoSettings = useCallback((data: typeof formData) => {
    if (typeof window !== 'undefined' && userEmail) {
      try {
        localStorage.setItem(`${DEMO_SETTINGS_STORAGE_KEY}_${userEmail}`, JSON.stringify(data));
      } catch (e) {
        console.error('Error saving demo settings:', e);
      }
    }
  }, [userEmail]);

  // Load settings from localStorage for demo users
  const loadDemoSettings = useCallback(() => {
    if (typeof window !== 'undefined' && userEmail && isDemoUser) {
      try {
        const saved = localStorage.getItem(`${DEMO_SETTINGS_STORAGE_KEY}_${userEmail}`);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.error('Error loading demo settings:', e);
      }
    }
    return null;
  }, [userEmail, isDemoUser]);

  const [formData, setFormData] = useState({
    name: displayName,
    email: displayEmail,
    phone: user?.phone || '',
    location: user?.location || '',
    companyName: user?.companyName || '',
    position: user?.position || '',
    industry: user?.industry || '',
    bio: (user as any)?.profileData?.bio || '',
    website: (user as any)?.profileData?.website || '',
    linkedin: (user as any)?.profileData?.linkedin || '',
  });

  // Update form when user data loads - check localStorage first for demo users
  useEffect(() => {
    // Try to load from localStorage for demo users
    const savedSettings = loadDemoSettings();
    if (savedSettings) {
      setFormData(savedSettings);
      return;
    }

    // Otherwise use user/session data
    if (user) {
      setFormData({
        name: user.name || sessionUser?.name || '',
        email: user.email || sessionUser?.email || '',
        phone: user.phone || '',
        location: user.location || '',
        companyName: user.companyName || '',
        position: user.position || '',
        industry: user.industry || '',
        bio: (user as any)?.profileData?.bio || '',
        website: (user as any)?.profileData?.website || '',
        linkedin: (user as any)?.profileData?.linkedin || '',
      });
    }
  }, [user, sessionUser, loadDemoSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      // For demo users, save to localStorage instead of Firestore
      if (isDemoUser) {
        saveDemoSettings(formData);
        toast.success('Profile saved');
        return;
      }

      // For real users, save via API
      if (!user) {
        toast.error('User not found');
        return;
      }

      await updateProfile(formData);
      toast.success('Profile saved');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToDetailedProfile = () => {
    router.push('/app/profile');
  };

  return (
    <div className="space-y-6">
      {/* Header - Practical UI: bold headings, regular body */}
      <div className="pb-4 border-b border-border">
        <h3 className="text-lg font-bold text-text-primary">Profile information</h3>
        <p className="mt-1 text-sm font-normal text-text-secondary leading-relaxed">
          Update your basic profile information. For detailed profile editing, use the dedicated profile page.
        </p>
        <div className="mt-4">
          <button
            onClick={handleGoToDetailedProfile}
            className="btn-outline min-h-12 inline-flex items-center"
          >
            <UserIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Edit detailed profile
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information - Single column per Practical UI */}
        <div className="space-y-5">
          <FormField label="Full name" name="name" required>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-text-tertiary" />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field pl-10"
                placeholder="Your full name"
              />
            </div>
          </FormField>

          <FormField label="Email address" name="email" required>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-text-tertiary" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field pl-10"
                placeholder="your.email@example.com"
              />
            </div>
          </FormField>

          <FormField label="Phone number" name="phone" optional>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-text-tertiary" />
              </div>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field pl-10"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </FormField>

          <FormField label="Location" name="location" optional>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPinIcon className="h-5 w-5 text-text-tertiary" />
              </div>
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="input-field pl-10"
                placeholder="New York, NY"
              />
            </div>
          </FormField>
        </div>

        {/* Professional Information */}
        <div className="pt-6 border-t border-border space-y-5">
          <h4 className="text-base font-bold text-text-primary">Professional information</h4>

          <FormField label="Current company" name="companyName" optional>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BuildingOfficeIcon className="h-5 w-5 text-text-tertiary" />
              </div>
              <input
                type="text"
                name="companyName"
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="input-field pl-10"
                placeholder="Acme Corporation"
              />
            </div>
          </FormField>

          <FormField label="Job title" name="position" optional>
            <input
              type="text"
              name="position"
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="input-field"
              placeholder="Senior Software Engineer"
            />
          </FormField>

          <FormField label="Industry" name="industry" optional>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="input-field"
            >
              <option value="">Select an industry</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance & Banking</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Consulting">Consulting</option>
              <option value="Legal">Legal Services</option>
              <option value="Marketing">Marketing & Advertising</option>
              <option value="Education">Education</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail">Retail</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Other">Other</option>
            </select>
          </FormField>
        </div>

        {/* Additional Information */}
        <div className="pt-6 border-t border-border space-y-5">
          <h4 className="text-base font-bold text-text-primary">Additional information</h4>

          <FormField label="Bio" name="bio" optional hint="Brief description for your profile. Maximum 500 characters.">
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="input-field"
              placeholder="Tell us about yourself and your professional experience..."
            />
          </FormField>

          <FormField label="Website" name="website" optional>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-text-tertiary" />
              </div>
              <input
                type="url"
                name="website"
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="input-field pl-10"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </FormField>

          <FormField label="LinkedIn profile" name="linkedin" optional>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-text-tertiary" />
              </div>
              <input
                type="url"
                name="linkedin"
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="input-field pl-10"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </FormField>
        </div>

        {/* Action Buttons - LEFT aligned per Practical UI */}
        <ButtonGroup>
          <button
            type="submit"
            disabled={isLoading || isUserLoading}
            className="btn-primary min-h-12"
          >
            {isLoading ? 'Saving...' : 'Save changes'}
          </button>
          <TextLink
            onClick={() => setFormData({
              name: user?.name || sessionUser?.name || '',
              email: user?.email || sessionUser?.email || '',
              phone: user?.phone || '',
              location: user?.location || '',
              companyName: user?.companyName || '',
              position: user?.position || '',
              industry: user?.industry || '',
              bio: (user as any)?.profileData?.bio || '',
              website: (user as any)?.profileData?.website || '',
              linkedin: (user as any)?.profileData?.linkedin || '',
            })}
          >
            Reset
          </TextLink>
        </ButtonGroup>
      </form>
    </div>
  );
}