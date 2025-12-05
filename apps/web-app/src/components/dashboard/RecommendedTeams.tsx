'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import {
  UserGroupIcon,
  MapPinIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

interface Team {
  id: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  size: number;
  rating: number;
  skills: string[];
  profileImageUrl?: string;
  yearsWorkingTogether: number;
  successfulLiftouts: number;
  currentCompany: string;
}

const mockTeams: Team[] = [
  {
    id: 'team_demo_001',
    name: 'TechFlow Data Science Team',
    description: 'Elite data science team with proven track record in fintech analytics and machine learning solutions',
    industry: 'Financial Services',
    location: 'San Francisco, CA',
    size: 4,
    rating: 4.8,
    skills: ['Machine Learning', 'Python', 'SQL', 'Financial Modeling'],
    yearsWorkingTogether: 3,
    successfulLiftouts: 2,
    currentCompany: 'DataFlow Inc.',
  },
  {
    id: 'team_demo_002',
    name: 'Mobile First Team',
    description: 'Intact mobile development team with proven track record in consumer and enterprise applications across iOS and Android',
    industry: 'Technology',
    location: 'Austin, TX',
    size: 4,
    rating: 4.9,
    skills: ['React Native', 'Flutter', 'iOS', 'Android'],
    yearsWorkingTogether: 4,
    successfulLiftouts: 1,
    currentCompany: 'MobileTech Solutions',
  },
  {
    id: 'team_demo_003',
    name: 'AI Strategy Group',
    description: 'Elite machine learning team that has successfully implemented AI solutions across healthcare, finance, and retail',
    industry: 'Healthcare Technology',
    location: 'Boston, MA',
    size: 6,
    rating: 4.7,
    skills: ['Deep Learning', 'TensorFlow', 'PyTorch', 'Computer Vision'],
    yearsWorkingTogether: 5,
    successfulLiftouts: 3,
    currentCompany: 'MedAI Innovations',
  },
];

export function RecommendedTeams() {
  const { data: teams, isLoading } = useQuery({
    queryKey: ['recommended-teams'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/teams?availability=available');
        if (response.ok) {
          const data = await response.json();
          // Transform API response to match our interface
          return (data.teams || []).slice(0, 3).map((team: any) => ({
            id: team.id,
            name: team.name,
            description: team.description,
            industry: team.industry || 'Technology',
            location: team.location || 'Remote',
            size: team.size || team.members?.length || 2,
            rating: (team.cohesionScore || 90) / 20, // Convert 0-100 to 0-5 scale
            skills: team.members?.flatMap((m: any) => m.skills || []).slice(0, 4) || [],
            profileImageUrl: team.profileImageUrl,
            yearsWorkingTogether: team.yearsWorking || team.yearsWorkingTogether || 2,
            successfulLiftouts: team.successfulProjects ? Math.floor(team.successfulProjects / 5) : 1,
            currentCompany: team.members?.[0]?.company || 'Confidential',
          })) as Team[];
        }
      } catch (error) {
        console.error('Error fetching recommended teams:', error);
      }
      // Fallback to mock data if API fails
      return mockTeams;
    },
  });

  if (isLoading) {
    return (
      <div className="card">
        <h3 className="text-lg font-bold text-text-primary mb-6 font-heading">Teams you may be interested in</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border p-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 skeleton rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-4 skeleton rounded w-40 mb-2"></div>
                  <div className="h-3 skeleton rounded w-64 mb-2"></div>
                  <div className="h-3 skeleton rounded w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        {/* Section heading - Practical UI: bold weight */}
        <h3 className="text-lg font-bold text-text-primary font-heading">Teams you may be interested in</h3>
        {/* Tertiary action - underlined link style */}
        <Link
          href="/app/teams"
          className="text-base font-normal text-navy hover:text-navy-600 underline underline-offset-4 transition-colors duration-fast min-h-12 flex items-center"
        >
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {teams?.map((team) => (
          <div
            key={team.id}
            className="group relative rounded-xl border border-border p-4 hover:border-purple-300 hover:shadow-soft transition-all duration-base"
          >
            <div className="flex items-start gap-4">
              {/* Avatar - 48px touch target */}
              <div className="flex-shrink-0">
                {team.profileImageUrl ? (
                  <Image
                    className="h-12 w-12 rounded-xl object-cover"
                    src={team.profileImageUrl}
                    alt={team.name}
                    width={48}
                    height={48}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-navy-50 flex items-center justify-center">
                    <UserGroupIcon className="h-6 w-6 text-navy" aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  {/* Team name - bold weight */}
                  <h4 className="text-base font-bold text-text-primary group-hover:text-navy transition-colors duration-fast leading-snug">
                    {team.name}
                  </h4>
                  {/* Rating */}
                  <div className="flex items-center flex-shrink-0">
                    <StarIcon className="h-4 w-4 text-gold fill-current" aria-hidden="true" />
                    <span className="ml-1 text-sm font-bold text-text-primary">{team.rating}</span>
                  </div>
                </div>
                {/* Description - regular weight */}
                <p className="text-sm font-normal text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                  {team.description}
                </p>
                {/* Meta info - small text */}
                <div className="flex flex-wrap items-center mt-2 text-sm font-normal text-text-tertiary gap-x-3 gap-y-1">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                    {team.location}
                  </div>
                  <div className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                    {team.size} members
                  </div>
                  <div>{team.yearsWorkingTogether} years together</div>
                </div>
                <div className="flex flex-wrap items-center mt-1 text-sm font-normal text-text-tertiary gap-x-2 gap-y-1">
                  <span>{team.industry}</span>
                  <span aria-hidden="true">·</span>
                  <span>{team.successfulLiftouts} successful liftouts</span>
                  <span aria-hidden="true">·</span>
                  <span>Currently at {team.currentCompany}</span>
                </div>
                {/* Skills badges */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {team.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="badge badge-secondary text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {team.skills.length > 3 && (
                    <span className="badge badge-secondary text-xs">
                      +{team.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Link href={`/app/teams/${team.id}`} className="absolute inset-0">
              <span className="sr-only">View team {team.name}</span>
            </Link>
          </div>
        ))}
      </div>

      {(!teams || teams.length === 0) && (
        <div className="text-center py-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-bg-elevated flex items-center justify-center mb-4">
            <UserGroupIcon className="h-7 w-7 text-text-tertiary" />
          </div>
          <h4 className="text-base font-semibold text-text-primary mb-1">No team recommendations yet</h4>
          <p className="text-base text-text-secondary">
            Post an opportunity to start receiving team recommendations.
          </p>
        </div>
      )}
    </div>
  );
}