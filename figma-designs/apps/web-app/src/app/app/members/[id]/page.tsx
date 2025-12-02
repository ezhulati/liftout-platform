'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  UserIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  ClockIcon,
  ArrowLeftIcon,
  LinkIcon,
  EnvelopeIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

// Demo member profiles data
const DEMO_MEMBERS: Record<string, {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  bio: string;
  location: string;
  yearsExperience: number;
  photoUrl: string;
  linkedinUrl?: string;
  githubUrl?: string;
  currentEmployer: string;
  currentTitle: string;
  skills: string[];
  achievements: string;
  teamId?: string;
  teamName?: string;
  teamRole?: string;
}> = {
  'demo-user-alex': {
    id: 'demo-user-alex',
    firstName: 'Alex',
    lastName: 'Chen',
    email: 'demo@example.com',
    title: 'Senior Data Scientist & Team Lead',
    bio: 'Passionate technologist with 10+ years leading high-performing data science and engineering teams. Specialized in fintech analytics, machine learning, and building scalable systems that deliver measurable business value. Led my current team through a successful liftout in 2022, and we\'ve been thriving ever since.',
    location: 'San Francisco, CA',
    yearsExperience: 10,
    photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    linkedinUrl: 'https://linkedin.com/in/alexchen',
    githubUrl: 'https://github.com/alexchen',
    currentEmployer: 'TechFlow Analytics',
    currentTitle: 'VP of Data Science',
    skills: ['Machine Learning', 'Python', 'SQL', 'Team Leadership', 'Financial Modeling', 'Data Architecture'],
    achievements: 'Led team that reduced fraud detection false positives by 35%. Built predictive models generating $2.1M annual savings. Mentored 12+ junior data scientists.',
    teamId: 'techflow-data-science',
    teamName: 'TechFlow Data Science Team',
    teamRole: 'Tech Lead',
  },
  'demo-user-sarah': {
    id: 'demo-user-sarah',
    firstName: 'Sarah',
    lastName: 'Martinez',
    email: 'sarah.martinez@example.com',
    title: 'Senior Data Scientist',
    bio: 'Data scientist with deep expertise in NLP and predictive modeling. Stanford PhD in Statistics with 7 years of industry experience. Love working on complex problems that have real-world impact, especially in healthcare and finance.',
    location: 'San Francisco, CA',
    yearsExperience: 7,
    photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    linkedinUrl: 'https://linkedin.com/in/sarahmartinez',
    githubUrl: 'https://github.com/smartinez',
    currentEmployer: 'TechFlow Analytics',
    currentTitle: 'Senior Data Scientist',
    skills: ['NLP', 'Deep Learning', 'PyTorch', 'Python', 'Statistical Analysis', 'Research'],
    achievements: 'Published 5 papers in top ML conferences. Developed sentiment analysis system processing 1M+ daily transactions.',
    teamId: 'techflow-data-science',
    teamName: 'TechFlow Data Science Team',
    teamRole: 'Senior Data Scientist',
  },
  'demo-user-marcus': {
    id: 'demo-user-marcus',
    firstName: 'Marcus',
    lastName: 'Johnson',
    email: 'marcus.johnson@example.com',
    title: 'Machine Learning Engineer',
    bio: 'Full-stack ML engineer focused on taking models from research to production. 6 years experience building and deploying ML systems at scale. Expert in MLOps, cloud infrastructure, and real-time prediction systems.',
    location: 'Oakland, CA',
    yearsExperience: 6,
    photoUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
    linkedinUrl: 'https://linkedin.com/in/marcusjohnson',
    githubUrl: 'https://github.com/mjohnson',
    currentEmployer: 'TechFlow Analytics',
    currentTitle: 'ML Engineer',
    skills: ['MLOps', 'Kubernetes', 'AWS', 'TensorFlow', 'Data Engineering', 'Docker'],
    achievements: 'Built ML pipeline processing 10M+ predictions/day. Reduced model deployment time from 2 weeks to 2 hours.',
    teamId: 'techflow-data-science',
    teamName: 'TechFlow Data Science Team',
    teamRole: 'ML Engineer',
  },
  'demo-user-priya': {
    id: 'demo-user-priya',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@example.com',
    title: 'Senior Data Analyst',
    bio: 'Data analyst passionate about translating complex data into actionable business insights. 4 years experience in fintech with expertise in visualization, reporting, and stakeholder communication. Bridge between technical team and business leadership.',
    location: 'San Jose, CA',
    yearsExperience: 4,
    photoUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
    linkedinUrl: 'https://linkedin.com/in/priyapatel',
    currentEmployer: 'TechFlow Analytics',
    currentTitle: 'Senior Data Analyst',
    skills: ['SQL', 'Tableau', 'Python', 'Business Intelligence', 'Data Visualization', 'Stakeholder Management'],
    achievements: 'Created executive dashboard used by C-suite. Identified $500K cost savings through data analysis.',
    teamId: 'techflow-data-science',
    teamName: 'TechFlow Data Science Team',
    teamRole: 'Data Analyst',
  },
};

export default function MemberProfilePage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params.id as string;

  // Fetch member profile
  const { data: member, isLoading, error } = useQuery({
    queryKey: ['member', memberId],
    queryFn: async () => {
      // Check demo members first
      if (memberId && DEMO_MEMBERS[memberId]) {
        await new Promise(resolve => setTimeout(resolve, 200));
        return DEMO_MEMBERS[memberId];
      }

      // Fetch from API for real users
      const response = await fetch(`/api/users/${memberId}/profile`);
      if (!response.ok) {
        throw new Error('Member not found');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="flex items-center space-x-6 mb-8">
            <div className="h-24 w-24 bg-bg-elevated rounded-full"></div>
            <div className="space-y-2">
              <div className="h-8 bg-bg-elevated rounded w-48"></div>
              <div className="h-4 bg-bg-elevated rounded w-64"></div>
            </div>
          </div>
          <div className="h-64 bg-bg-elevated rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <UserIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
          <h2 className="text-lg font-medium text-text-primary mb-2">Member not found</h2>
          <p className="text-text-secondary mb-6">The profile you're looking for doesn't exist or is not accessible.</p>
          <button
            onClick={() => router.back()}
            className="btn-primary min-h-12 inline-flex items-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center text-text-secondary hover:text-text-primary transition-colors min-h-12"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to team
      </button>

      {/* Profile Header */}
      <div className="card">
        <div className="px-6 py-6">
          <div className="flex items-start space-x-6">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={`${member.firstName} ${member.lastName}`}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-bg-alt"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-bg-alt flex items-center justify-center">
                  <UserIcon className="h-12 w-12 text-text-tertiary" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text-primary">
                {member.firstName} {member.lastName}
              </h1>
              <p className="text-lg text-text-secondary mt-1">
                {member.title}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-text-tertiary">
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {member.location}
                </div>
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                  {member.currentEmployer}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {member.yearsExperience} years experience
                </div>
              </div>

              {/* Team affiliation */}
              {member.teamName && (
                <div className="mt-4">
                  <Link
                    href={`/app/teams/${member.teamId}`}
                    className="inline-flex items-center px-3 py-2 bg-navy-50 text-navy-800 rounded-lg hover:bg-navy-100 transition-colors"
                  >
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    <span className="font-medium">{member.teamName}</span>
                    <span className="text-navy-600 ml-2">({member.teamRole})</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-medium text-text-primary">About</h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-text-secondary leading-relaxed">{member.bio}</p>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-medium text-text-primary">Skills & Expertise</h2>
            </div>
            <div className="px-6 py-4">
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-navy-50 text-navy-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          {member.achievements && (
            <div className="card">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-lg font-medium text-text-primary">Key Achievements</h2>
              </div>
              <div className="px-6 py-4">
                <p className="text-text-secondary leading-relaxed">{member.achievements}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-medium text-text-primary">Profile Info</h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <p className="text-sm text-text-tertiary">Current Role</p>
                <p className="text-text-primary font-medium">{member.currentTitle}</p>
              </div>
              <div>
                <p className="text-sm text-text-tertiary">Company</p>
                <p className="text-text-primary font-medium">{member.currentEmployer}</p>
              </div>
              <div>
                <p className="text-sm text-text-tertiary">Location</p>
                <p className="text-text-primary font-medium">{member.location}</p>
              </div>
              <div>
                <p className="text-sm text-text-tertiary">Experience</p>
                <p className="text-text-primary font-medium">{member.yearsExperience} years</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          {(member.linkedinUrl || member.githubUrl) && (
            <div className="card">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-lg font-medium text-text-primary">Connect</h2>
              </div>
              <div className="px-6 py-4 space-y-3">
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-text-secondary hover:text-navy transition-colors min-h-12"
                  >
                    <LinkIcon className="h-5 w-5 mr-3" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
                {member.githubUrl && (
                  <a
                    href={member.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-text-secondary hover:text-navy transition-colors min-h-12"
                  >
                    <LinkIcon className="h-5 w-5 mr-3" />
                    <span>GitHub Profile</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Contact (for company users) */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-medium text-text-primary">Interested?</h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-text-secondary mb-4">
                Contact the team to learn more about this member and their availability.
              </p>
              <Link
                href={member.teamId ? `/app/teams/${member.teamId}` : '/app/teams'}
                className="btn-primary min-h-12 w-full flex items-center justify-center"
              >
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                View Team Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
