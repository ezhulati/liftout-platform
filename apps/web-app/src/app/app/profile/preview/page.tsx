'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  UserIcon,
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  LinkIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  title?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    current: boolean;
  }[];
  education: {
    school: string;
    degree: string;
    field?: string;
    year?: number;
  }[];
  isVerified: boolean;
}

export default function ProfilePreviewPage() {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['user-profile-preview'],
    queryFn: async () => {
      const response = await fetch('/api/user/profile');
      if (!response.ok) throw new Error('Failed to load profile');
      return response.json();
    },
  });

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/api/user/profile/export?format=pdf');
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profile?.name?.replace(/\s+/g, '_') || 'profile'}_liftout.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      toast.success('Profile downloaded');
    } catch {
      toast.error('Failed to download profile');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/members/${profile?.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.name} - Liftout Profile`,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Profile link copied to clipboard');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-bg-elevated rounded w-48"></div>
          <div className="h-40 bg-bg-elevated rounded"></div>
          <div className="h-64 bg-bg-elevated rounded"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="card text-center py-12">
          <UserIcon className="h-12 w-12 mx-auto text-text-tertiary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">Profile not found</h3>
          <p className="text-text-secondary">Please complete your profile first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/app/profile')}
          className="flex items-center text-text-secondary hover:text-text-primary mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to profile
        </button>
        <div className="flex items-center justify-between">
          <h1 className="page-title">Profile Preview</h1>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="btn-outline flex items-center"
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              Share
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="btn-primary flex items-center"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </button>
          </div>
        </div>
        <p className="mt-2 text-text-secondary">
          This is how companies and teams will see your profile
        </p>
      </div>

      {/* Preview Card */}
      <div className="card border-2 border-dashed border-border">
        <div className="px-6 py-4 bg-gradient-to-r from-navy to-navy-700 rounded-t-lg">
          <p className="text-xs text-white/70 uppercase tracking-wider">Profile Preview</p>
        </div>

        <div className="px-6 py-6">
          {/* Profile Header */}
          <div className="flex items-start gap-5 mb-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-navy to-navy-600 flex items-center justify-center flex-shrink-0">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" className="h-20 w-20 rounded-full object-cover" />
              ) : (
                <UserIcon className="h-10 w-10 text-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-text-primary">{profile.name}</h2>
                {profile.isVerified && (
                  <CheckBadgeIcon className="h-5 w-5 text-success" title="Verified" />
                )}
              </div>
              {profile.title && (
                <p className="text-text-secondary">{profile.title}</p>
              )}
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-text-tertiary">
                {profile.location && (
                  <span className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {profile.location}
                  </span>
                )}
                {profile.email && (
                  <span className="flex items-center">
                    <EnvelopeIcon className="h-4 w-4 mr-1" />
                    {profile.email}
                  </span>
                )}
                {profile.phone && (
                  <span className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    {profile.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-2">About</h3>
              <p className="text-text-secondary">{profile.bio}</p>
            </div>
          )}

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-bg-alt rounded-full text-sm text-text-secondary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {profile.experience?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3 flex items-center">
                <BriefcaseIcon className="h-4 w-4 mr-2" />
                Experience
              </h3>
              <div className="space-y-4">
                {profile.experience.map((exp, i) => (
                  <div key={i} className="border-l-2 border-border pl-4">
                    <p className="font-medium text-text-primary">{exp.title}</p>
                    <p className="text-text-secondary">{exp.company}</p>
                    <p className="text-sm text-text-tertiary">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {profile.education?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3 flex items-center">
                <AcademicCapIcon className="h-4 w-4 mr-2" />
                Education
              </h3>
              <div className="space-y-4">
                {profile.education.map((edu, i) => (
                  <div key={i} className="border-l-2 border-border pl-4">
                    <p className="font-medium text-text-primary">{edu.degree}</p>
                    <p className="text-text-secondary">{edu.school}</p>
                    {edu.field && <p className="text-sm text-text-tertiary">{edu.field}</p>}
                    {edu.year && <p className="text-sm text-text-tertiary">{edu.year}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LinkedIn */}
          {profile.linkedinUrl && (
            <div>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-navy hover:text-navy-700"
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                View LinkedIn Profile
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
