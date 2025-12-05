'use client';

import { UserGroupIcon, MapPinIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

interface PreviewTeam {
  name: string;
  industry: string;
  location: string;
  size: number;
  yearsWorking: number;
  cohesionScore: number;
  skills: string[];
  verified?: boolean;
}

interface PreviewTeamCardProps {
  team: PreviewTeam;
  compact?: boolean;
}

/**
 * PreviewTeamCard - Simplified static team card for landing pages
 * Mirrors the app's team card design without interactivity
 */
export function PreviewTeamCard({ team, compact = false }: PreviewTeamCardProps) {
  return (
    <div className={`bg-bg-surface border border-border rounded-xl ${compact ? 'p-3' : 'p-4'} hover:border-purple-200 transition-colors`}>
      <div className="flex items-start gap-3">
        {/* Team icon */}
        <div className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0`}>
          <UserGroupIcon className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} text-[#4C1D95]`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold text-text-primary truncate ${compact ? 'text-sm' : 'text-base'}`}>
              {team.name}
            </h3>
            {team.verified && (
              <CheckBadgeIcon className="w-4 h-4 text-[#4C1D95] flex-shrink-0" />
            )}
          </div>

          {/* Meta */}
          <div className={`flex items-center gap-3 text-text-secondary ${compact ? 'text-xs' : 'text-sm'} mb-2`}>
            <span className="flex items-center gap-1">
              <MapPinIcon className="w-3.5 h-3.5" />
              {team.location}
            </span>
            <span>{team.size} members</span>
          </div>

          {/* Stats row */}
          <div className={`flex items-center gap-4 ${compact ? 'text-xs' : 'text-sm'} mb-2`}>
            <span className="text-text-secondary">
              <span className="font-medium text-[#4C1D95]">{team.cohesionScore}%</span> cohesion
            </span>
            <span className="text-text-secondary">
              <span className="font-medium text-text-primary">{team.yearsWorking}</span> years together
            </span>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5">
            {team.skills.slice(0, compact ? 2 : 3).map((skill) => (
              <span
                key={skill}
                className={`px-2 py-0.5 bg-purple-50 text-[#4C1D95] rounded-full ${compact ? 'text-[10px]' : 'text-xs'} font-medium`}
              >
                {skill}
              </span>
            ))}
            {team.skills.length > (compact ? 2 : 3) && (
              <span className={`px-2 py-0.5 bg-gray-100 text-text-tertiary rounded-full ${compact ? 'text-[10px]' : 'text-xs'}`}>
                +{team.skills.length - (compact ? 2 : 3)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export mock data for use in preview sections
export const previewTeams: PreviewTeam[] = [
  {
    name: 'TechFlow Data Science Team',
    industry: 'Financial Services',
    location: 'San Francisco, CA',
    size: 4,
    yearsWorking: 3.5,
    cohesionScore: 94,
    skills: ['Machine Learning', 'Python', 'Financial Modeling', 'SQL'],
    verified: true,
  },
  {
    name: 'HealthTech AI Research',
    industry: 'Healthcare',
    location: 'Boston, MA',
    size: 5,
    yearsWorking: 4,
    cohesionScore: 91,
    skills: ['Medical Imaging', 'Deep Learning', 'FDA Compliance', 'PyTorch'],
    verified: true,
  },
  {
    name: 'Enterprise Platform Team',
    industry: 'Enterprise Software',
    location: 'Austin, TX',
    size: 6,
    yearsWorking: 5,
    cohesionScore: 97,
    skills: ['Kubernetes', 'Go', 'Distributed Systems', 'AWS'],
    verified: true,
  },
];
