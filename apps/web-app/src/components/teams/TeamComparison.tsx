'use client';

import React, { useState, useMemo } from 'react';
import {
  UserGroupIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ArrowsRightLeftIcon,
  XMarkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { Badge, Button, Skeleton, EmptyState } from '@/components/ui';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  yearsExperience: number;
}

interface ComparisonTeam {
  id: string;
  name: string;
  matchScore: number;
  size: number;
  yearsWorking: number;
  industry: string;
  location: string;
  skills: string[];
  achievements: string[];
  compensation: {
    min: number;
    max: number;
  };
  availability: string;
  members: TeamMember[];
  strengths: string[];
  considerations: string[];
  verificationStatus: 'verified' | 'pending' | 'unverified';
  previousLiftouts: number;
}

interface TeamComparisonProps {
  teams: ComparisonTeam[];
  maxTeams?: number;
  onRemoveTeam?: (teamId: string) => void;
  onAddTeam?: () => void;
  onViewTeam?: (teamId: string) => void;
  onContactTeam?: (teamId: string) => void;
  isLoading?: boolean;
}

const COMPARISON_ATTRIBUTES = [
  { key: 'matchScore', label: 'Match Score', icon: ChartBarIcon, type: 'score' },
  { key: 'size', label: 'Team Size', icon: UserGroupIcon, type: 'number' },
  { key: 'yearsWorking', label: 'Years Together', icon: ClockIcon, type: 'years' },
  { key: 'compensation', label: 'Compensation Range', icon: CurrencyDollarIcon, type: 'compensation' },
  { key: 'location', label: 'Location', icon: MapPinIcon, type: 'text' },
  { key: 'industry', label: 'Industry', icon: BriefcaseIcon, type: 'text' },
  { key: 'availability', label: 'Availability', icon: ClockIcon, type: 'text' },
  { key: 'previousLiftouts', label: 'Previous Liftouts', icon: ArrowsRightLeftIcon, type: 'number' },
] as const;

function formatCompensation(comp: { min: number; max: number }): string {
  const formatK = (n: number) => `$${Math.round(n / 1000)}k`;
  return `${formatK(comp.min)} - ${formatK(comp.max)}`;
}

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-success';
  if (score >= 75) return 'text-navy';
  if (score >= 60) return 'text-gold-600';
  return 'text-text-tertiary';
}

function getScoreBgColor(score: number): string {
  if (score >= 90) return 'bg-success-light';
  if (score >= 75) return 'bg-navy-50';
  if (score >= 60) return 'bg-gold-50';
  return 'bg-bg-elevated';
}

export function TeamComparison({
  teams,
  maxTeams = 4,
  onRemoveTeam,
  onAddTeam,
  onViewTeam,
  onContactTeam,
  isLoading,
}: TeamComparisonProps) {
  const [highlightBest, setHighlightBest] = useState(true);

  // Calculate best values for each attribute
  const bestValues = useMemo(() => {
    if (teams.length < 2) return {};

    return {
      matchScore: Math.max(...teams.map(t => t.matchScore)),
      size: Math.max(...teams.map(t => t.size)),
      yearsWorking: Math.max(...teams.map(t => t.yearsWorking)),
      previousLiftouts: Math.max(...teams.map(t => t.previousLiftouts)),
    };
  }, [teams]);

  if (isLoading) {
    return (
      <div className="card">
        <div className="p-6 border-b border-border">
          <Skeleton variant="text" width="200px" />
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} variant="rectangular" height="400px" className="rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="card p-8">
        <EmptyState
          icon={<ArrowsRightLeftIcon className="w-12 h-12" />}
          title="No teams to compare"
          description="Add teams to compare them side by side"
          action={
            onAddTeam && (
              <Button variant="primary" onClick={onAddTeam}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Team
              </Button>
            )
          }
        />
      </div>
    );
  }

  const canAddMore = teams.length < maxTeams;

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-bg-alt">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ArrowsRightLeftIcon className="h-5 w-5 text-navy" />
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Team Comparison</h2>
              <p className="text-sm text-text-tertiary">
                Comparing {teams.length} team{teams.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={highlightBest}
                onChange={(e) => setHighlightBest(e.target.checked)}
                className="rounded border-border text-navy focus:ring-navy"
              />
              Highlight best values
            </label>
            {canAddMore && onAddTeam && (
              <Button variant="outline" size="sm" onClick={onAddTeam}>
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Team
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Team Headers */}
          <thead>
            <tr className="border-b border-border">
              <th className="p-4 text-left text-sm font-medium text-text-tertiary w-48">
                Attribute
              </th>
              {teams.map(team => (
                <th key={team.id} className="p-4 text-center min-w-[200px]">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-navy-50 flex items-center justify-center">
                        <UserGroupIcon className="h-5 w-5 text-navy" />
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">{team.name}</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {team.verificationStatus === 'verified' && (
                          <Badge variant="success" size="sm">Verified</Badge>
                        )}
                        {team.verificationStatus === 'pending' && (
                          <Badge variant="warning" size="sm">Pending</Badge>
                        )}
                      </div>
                    </div>
                    {onRemoveTeam && (
                      <button
                        onClick={() => onRemoveTeam(team.id)}
                        className="text-text-tertiary hover:text-error transition-colors"
                        title="Remove from comparison"
                      >
                        <XMarkIcon className="h-4 w-4 mx-auto" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {/* Match Score Row - Special styling */}
            <tr className="bg-bg-alt">
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <ChartBarIcon className="h-4 w-4 text-text-tertiary" />
                  <span className="text-sm font-medium text-text-primary">Match Score</span>
                </div>
              </td>
              {teams.map(team => {
                const isBest = highlightBest && team.matchScore === bestValues.matchScore;
                return (
                  <td key={team.id} className="p-4 text-center">
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getScoreBgColor(team.matchScore)}`}>
                      <span className={`text-xl font-bold ${getScoreColor(team.matchScore)}`}>
                        {team.matchScore}%
                      </span>
                      {isBest && teams.length > 1 && (
                        <StarSolidIcon className="h-4 w-4 text-gold-500" />
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Other Attributes */}
            {COMPARISON_ATTRIBUTES.filter(attr => attr.key !== 'matchScore').map(attr => (
              <tr key={attr.key} className="hover:bg-bg-alt transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <attr.icon className="h-4 w-4 text-text-tertiary" />
                    <span className="text-sm font-medium text-text-primary">{attr.label}</span>
                  </div>
                </td>
                {teams.map(team => {
                  const value = team[attr.key as keyof ComparisonTeam];
                  const isBest = highlightBest &&
                    attr.key in bestValues &&
                    value === bestValues[attr.key as keyof typeof bestValues];

                  let displayValue: React.ReactNode;
                  if (attr.type === 'compensation' && typeof value === 'object' && 'min' in value) {
                    displayValue = formatCompensation(value as { min: number; max: number });
                  } else if (attr.type === 'years' && typeof value === 'number') {
                    displayValue = `${value} year${value !== 1 ? 's' : ''}`;
                  } else if (attr.type === 'number' && typeof value === 'number') {
                    displayValue = String(value);
                  } else if (typeof value === 'string') {
                    displayValue = value;
                  } else {
                    displayValue = String(value);
                  }

                  return (
                    <td key={team.id} className="p-4 text-center">
                      <span className={`text-sm ${isBest ? 'font-semibold text-navy' : 'text-text-secondary'}`}>
                        {displayValue}
                        {isBest && teams.length > 1 && (
                          <StarSolidIcon className="h-3 w-3 text-gold-500 inline ml-1" />
                        )}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Skills Row */}
            <tr className="hover:bg-bg-alt transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <AcademicCapIcon className="h-4 w-4 text-text-tertiary" />
                  <span className="text-sm font-medium text-text-primary">Key Skills</span>
                </div>
              </td>
              {teams.map(team => (
                <td key={team.id} className="p-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {team.skills.slice(0, 4).map(skill => (
                      <Badge key={skill} variant="default" size="sm">
                        {skill}
                      </Badge>
                    ))}
                    {team.skills.length > 4 && (
                      <Badge variant="default" size="sm">
                        +{team.skills.length - 4}
                      </Badge>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Strengths Row */}
            <tr className="hover:bg-bg-alt transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-text-primary">Strengths</span>
                </div>
              </td>
              {teams.map(team => (
                <td key={team.id} className="p-4">
                  <ul className="text-xs text-text-secondary space-y-1">
                    {team.strengths.slice(0, 3).map((strength, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <CheckCircleIcon className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Considerations Row */}
            <tr className="hover:bg-bg-alt transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <XCircleIcon className="h-4 w-4 text-gold-600" />
                  <span className="text-sm font-medium text-text-primary">Considerations</span>
                </div>
              </td>
              {teams.map(team => (
                <td key={team.id} className="p-4">
                  <ul className="text-xs text-text-secondary space-y-1">
                    {team.considerations.slice(0, 3).map((consideration, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <XCircleIcon className="h-3 w-3 text-gold-600 mt-0.5 flex-shrink-0" />
                        <span>{consideration}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>

          {/* Actions Footer */}
          <tfoot>
            <tr className="border-t border-border bg-bg-alt">
              <td className="p-4">
                <span className="text-sm font-medium text-text-tertiary">Actions</span>
              </td>
              {teams.map(team => (
                <td key={team.id} className="p-4">
                  <div className="flex flex-col gap-2">
                    {onViewTeam && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewTeam(team.id)}
                        className="w-full"
                      >
                        View Profile
                      </Button>
                    )}
                    {onContactTeam && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onContactTeam(team.id)}
                        className="w-full"
                      >
                        Contact Team
                      </Button>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default TeamComparison;
