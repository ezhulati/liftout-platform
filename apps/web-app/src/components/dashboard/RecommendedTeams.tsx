'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
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
    id: '1',
    name: 'DataViz Analytics Core',
    description: 'High-performing analytics team specializing in enterprise data visualization and business intelligence solutions',
    industry: 'Financial Services',
    location: 'San Francisco, CA',
    size: 5,
    rating: 4.8,
    skills: ['React', 'D3.js', 'Python', 'PostgreSQL'],
    yearsWorkingTogether: 3,
    successfulLiftouts: 2,
    currentCompany: 'DataFlow Inc.',
  },
  {
    id: '2',
    name: 'Mobile First Team',
    description: 'Intact mobile development team with proven track record in consumer and enterprise applications',
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
    id: '3',
    name: 'AI Strategy Group',
    description: 'Elite machine learning team that has successfully implemented AI solutions across multiple industries',
    industry: 'Healthcare Technology',
    location: 'Boston, MA',
    size: 6,
    rating: 4.7,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'AWS'],
    yearsWorkingTogether: 5,
    successfulLiftouts: 3,
    currentCompany: 'MedAI Innovations',
  },
];

export function RecommendedTeams() {
  const { data: teams, isLoading } = useQuery({
    queryKey: ['recommended-teams'],
    queryFn: async () => {
      // This would normally fetch from your API
      return mockTeams;
    },
  });

  if (isLoading) {
    return (
      <div className="card">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Teams</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recommended Teams</h3>
          <Link
            href="/app/search?type=teams"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Browse all
          </Link>
        </div>

        <div className="space-y-4">
          {teams?.map((team) => (
            <div
              key={team.id}
              className="group relative rounded-lg border border-gray-200 p-4 hover:border-primary-300 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {team.profileImageUrl ? (
                    <img
                      className="h-12 w-12 rounded-lg object-cover"
                      src={team.profileImageUrl}
                      alt={team.name}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                      <UserGroupIcon className="h-6 w-6 text-primary-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                      {team.name}
                    </h4>
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-500">{team.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {team.description}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <MapPinIcon className="h-3 w-3 mr-1" />
                      {team.location}
                    </div>
                    <div className="flex items-center">
                      <UserGroupIcon className="h-3 w-3 mr-1" />
                      {team.size} members
                    </div>
                    <div>{team.yearsWorkingTogether} years together</div>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500 space-x-4">
                    <div>{team.industry}</div>
                    <div>•</div>
                    <div>{team.successfulLiftouts} successful liftouts</div>
                    <div>•</div>
                    <div>Currently at {team.currentCompany}</div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {team.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {skill}
                      </span>
                    ))}
                    {team.skills.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
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
          <div className="text-center py-6">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No team recommendations</h3>
            <p className="mt-1 text-sm text-gray-500">
              Complete your company profile to get personalized team recommendations for liftout opportunities.
            </p>
            <div className="mt-6">
              <Link
                href="/app/profile"
                className="btn-primary"
              >
                Complete Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}