'use client';

import React from 'react';
import Link from 'next/link';
import {
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { Badge, Button } from '@/components/ui';
import type { TeamMatch, OpportunityMatch, MatchScore } from '@/hooks/useMatching';
import { getMatchRecommendation, getFactorLabel } from '@/hooks/useMatching';

interface TeamMatchCardProps {
  match: TeamMatch;
  rank?: number;
  onExpressInterest?: (teamId: string) => void;
}

interface OpportunityMatchCardProps {
  match: OpportunityMatch;
  rank?: number;
  onApply?: (opportunityId: string) => void;
}

function ScoreBar({ label, score, weight }: { label: string; score: number; weight: number }) {
  const weightedScore = Math.round((score * weight) / 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-tertiary">{score}%</span>
      </div>
      <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            score >= 80 ? 'bg-success' :
            score >= 60 ? 'bg-navy' :
            score >= 40 ? 'bg-gold' :
            'bg-error'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function ScoreBreakdown({ breakdown }: { breakdown: MatchScore['breakdown'] }) {
  const factors = [
    { key: 'skillsMatch', weight: 30 },
    { key: 'industryMatch', weight: 20 },
    { key: 'compensationMatch', weight: 15 },
    { key: 'sizeMatch', weight: 10 },
    { key: 'locationMatch', weight: 10 },
  ] as const;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {factors.map(({ key, weight }) => (
        <ScoreBar
          key={key}
          label={getFactorLabel(key)}
          score={breakdown[key]}
          weight={weight}
        />
      ))}
    </div>
  );
}

export function TeamMatchCard({ match, rank, onExpressInterest }: TeamMatchCardProps) {
  const { team, score } = match;
  const recommendation = getMatchRecommendation(score.total);

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {rank && (
              <div className="h-10 w-10 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-navy">#{rank}</span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <UserGroupIcon className="h-4 w-4 text-text-tertiary" />
                <Link
                  href={`/app/teams/${team.id}`}
                  className="text-lg font-bold text-text-primary hover:text-navy transition-colors"
                >
                  {team.name}
                </Link>
                {team.verificationStatus === 'verified' && (
                  <Badge variant="success" size="sm">Verified</Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-secondary">
                {team.industry && <span>{team.industry}</span>}
                {team.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="h-3.5 w-3.5" />
                      {team.location}
                    </span>
                  </>
                )}
                <span>•</span>
                <span>{team.memberCount || team.size} members</span>
              </div>
            </div>
          </div>

          {/* Score Badge */}
          <div className="text-right flex-shrink-0">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${recommendation.bgColor}`}>
              <SparklesIcon className={`h-4 w-4 ${recommendation.color}`} />
              <span className={`text-lg font-bold ${recommendation.color}`}>{score.total}%</span>
            </div>
            <div className="text-xs text-text-tertiary mt-1">{recommendation.label}</div>
          </div>
        </div>

        {/* Description */}
        {team.description && (
          <p className="text-sm text-text-secondary mb-4 line-clamp-2">
            {team.description}
          </p>
        )}

        {/* Score Breakdown */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-2">
            Compatibility Breakdown
          </h4>
          <ScoreBreakdown breakdown={score.breakdown} />
        </div>

        {/* Skills */}
        {team.skills && team.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {team.skills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 text-xs bg-bg-alt text-text-secondary rounded"
                >
                  {skill}
                </span>
              ))}
              {team.skills.length > 6 && (
                <span className="px-2 py-0.5 text-xs text-text-tertiary">
                  +{team.skills.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {score.strengths.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-success flex items-center gap-1 mb-2">
                <CheckCircleIcon className="h-3.5 w-3.5" />
                Strengths
              </h4>
              <ul className="space-y-1">
                {score.strengths.slice(0, 3).map((strength, i) => (
                  <li key={i} className="text-xs text-text-secondary flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-success mt-1.5 flex-shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {score.concerns.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gold flex items-center gap-1 mb-2">
                <ExclamationTriangleIcon className="h-3.5 w-3.5" />
                Considerations
              </h4>
              <ul className="space-y-1">
                {score.concerns.slice(0, 3).map((concern, i) => (
                  <li key={i} className="text-xs text-text-secondary flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                    {concern}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-text-tertiary">
            {team.yearsWorkingTogether && (
              <span>{team.yearsWorkingTogether} years together</span>
            )}
            <span className="capitalize">{team.availabilityStatus?.replace('_', ' ')}</span>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/app/teams/${team.id}`}
              className="btn-outline text-sm py-2 px-4"
            >
              View Profile
            </Link>
            {onExpressInterest && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onExpressInterest(team.id)}
              >
                Express Interest
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OpportunityMatchCard({ match, rank, onApply }: OpportunityMatchCardProps) {
  const { opportunity, score } = match;
  const recommendation = getMatchRecommendation(score.total);

  const formatCompensation = () => {
    const { min, max, currency } = opportunity.compensation;
    if (!min && !max) return 'Competitive';
    const format = (n: number | null) => n ? `$${(n / 1000).toFixed(0)}k` : '';
    if (min && max) return `${format(min)} - ${format(max)}`;
    return format(min || max);
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {rank && (
              <div className="h-10 w-10 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-navy">#{rank}</span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BriefcaseIcon className="h-4 w-4 text-text-tertiary" />
                <Link
                  href={`/app/opportunities/${opportunity.id}`}
                  className="text-lg font-bold text-text-primary hover:text-navy transition-colors"
                >
                  {opportunity.title}
                </Link>
                {opportunity.featured && (
                  <Badge variant="warning" size="sm" icon={<StarSolidIcon className="h-3 w-3" />}>
                    Featured
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <BuildingOffice2Icon className="h-3.5 w-3.5" />
                  {opportunity.company.name}
                </span>
                {opportunity.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="h-3.5 w-3.5" />
                      {opportunity.location}
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="capitalize">{opportunity.remotePolicy}</span>
              </div>
            </div>
          </div>

          {/* Score Badge */}
          <div className="text-right flex-shrink-0">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${recommendation.bgColor}`}>
              <SparklesIcon className={`h-4 w-4 ${recommendation.color}`} />
              <span className={`text-lg font-bold ${recommendation.color}`}>{score.total}%</span>
            </div>
            <div className="text-xs text-text-tertiary mt-1">{recommendation.label}</div>
          </div>
        </div>

        {/* Description */}
        {opportunity.description && (
          <p className="text-sm text-text-secondary mb-4 line-clamp-2">
            {opportunity.description}
          </p>
        )}

        {/* Key Info */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1.5">
            <CurrencyDollarIcon className="h-4 w-4 text-text-tertiary" />
            <span className="text-text-primary font-medium">{formatCompensation()}</span>
          </div>
          {opportunity.teamSize.min && (
            <div className="flex items-center gap-1.5">
              <UserGroupIcon className="h-4 w-4 text-text-tertiary" />
              <span className="text-text-secondary">
                {opportunity.teamSize.min}-{opportunity.teamSize.max} members needed
              </span>
            </div>
          )}
          <Badge variant={
            opportunity.urgency === 'critical' ? 'error' :
            opportunity.urgency === 'high' ? 'warning' :
            'info'
          } size="sm">
            {opportunity.urgency === 'critical' ? 'Urgent' :
             opportunity.urgency === 'high' ? 'High Priority' :
             'Standard'}
          </Badge>
        </div>

        {/* Score Breakdown */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-2">
            Match Analysis
          </h4>
          <ScoreBreakdown breakdown={score.breakdown} />
        </div>

        {/* Required Skills */}
        {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {opportunity.requiredSkills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 text-xs bg-navy-50 text-navy rounded"
                >
                  {skill}
                </span>
              ))}
              {opportunity.requiredSkills.length > 6 && (
                <span className="px-2 py-0.5 text-xs text-text-tertiary">
                  +{opportunity.requiredSkills.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {score.strengths.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-success flex items-center gap-1 mb-2">
                <CheckCircleIcon className="h-3.5 w-3.5" />
                Why It's a Good Fit
              </h4>
              <ul className="space-y-1">
                {score.strengths.slice(0, 3).map((strength, i) => (
                  <li key={i} className="text-xs text-text-secondary flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-success mt-1.5 flex-shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {score.concerns.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gold flex items-center gap-1 mb-2">
                <ExclamationTriangleIcon className="h-3.5 w-3.5" />
                Things to Consider
              </h4>
              <ul className="space-y-1">
                {score.concerns.slice(0, 3).map((concern, i) => (
                  <li key={i} className="text-xs text-text-secondary flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                    {concern}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* AI Insights */}
        {score.insights && score.insights.length > 0 && (
          <div className="bg-bg-alt rounded-lg p-3 mb-4">
            <h4 className="text-xs font-semibold text-navy flex items-center gap-1 mb-2">
              <SparklesIcon className="h-3.5 w-3.5" />
              AI Insights
            </h4>
            <ul className="space-y-1">
              {score.insights.map((insight, i) => (
                <li key={i} className="text-xs text-text-secondary">
                  • {insight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-text-tertiary">
            <span>{opportunity.applicationCount} applications</span>
            <span>Posted {new Date(opportunity.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/app/opportunities/${opportunity.id}`}
              className="btn-outline text-sm py-2 px-4"
            >
              View Details
            </Link>
            {onApply && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onApply(opportunity.id)}
              >
                Apply Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { ScoreBreakdown };
