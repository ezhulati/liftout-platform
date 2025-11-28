'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { matchingService } from '@/lib/services/matchingService';
import { teamService } from '@/lib/services/teamService';
import { opportunityService } from '@/lib/services/opportunityService';
import { MatchingDashboard } from '@/components/matching/MatchingDashboard';
import {
  SparklesIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ChartBarIcon,
  LightBulbIcon,
  CpuChipIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export default function AIMatchingPage() {
  const { user, isCompany, isIndividual } = useAuth();
  const [selectedEntityType, setSelectedEntityType] = useState<'team' | 'opportunity'>('team');
  const [selectedEntityId, setSelectedEntityId] = useState<string>('');

  const isCompanyUser = isCompany;
  const isTeamUser = isIndividual;

  // Get user's teams (for team users)
  const { data: userTeams } = useQuery({
    queryKey: ['user-teams', user?.id],
    queryFn: async () => {
      if (!isTeamUser || !user?.id) return [];
      return await teamService.getTeamsByUser(user.id);
    },
    enabled: isTeamUser && !!user?.id,
  });

  // Get user's opportunities (for company users)
  const { data: userOpportunities } = useQuery({
    queryKey: ['user-opportunities', user?.id],
    queryFn: async () => {
      if (!isCompanyUser || !user?.id) return { opportunities: [] };
      return await opportunityService.searchOpportunities({
        companyId: user.id,
        limit: 50,
      });
    },
    enabled: isCompanyUser && !!user?.id,
  });

  // Get recommended teams (for company users)
  const { data: recommendedTeams } = useQuery({
    queryKey: ['recommended-teams', user?.id],
    queryFn: async () => {
      if (!isCompanyUser || !user?.id) return [];
      return await matchingService.getRecommendedTeams(user.id, 5);
    },
    enabled: isCompanyUser && !!user?.id,
  });

  // Get recommended opportunities (for team users)
  const { data: recommendedOpportunities } = useQuery({
    queryKey: ['recommended-opportunities', selectedEntityId],
    queryFn: async () => {
      if (!isTeamUser || !selectedEntityId) return [];
      return await matchingService.getRecommendedOpportunities(selectedEntityId, 5);
    },
    enabled: isTeamUser && !!selectedEntityId,
  });

  if (!user) {
    return (
      <div className="text-center py-12">
        <CpuChipIcon className="mx-auto h-12 w-12 text-text-tertiary" />
        <h3 className="mt-2 text-sm font-medium text-text-primary">Authentication Required</h3>
        <p className="mt-1 text-sm text-text-tertiary">Please log in to access AI matching features.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-navy to-navy-700 flex items-center justify-center">
            <CpuChipIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="page-title flex items-center">
              AI-Powered Matching
              <SparklesIcon className="h-6 w-6 ml-2 text-gold" />
            </h1>
            <p className="page-subtitle">
              Discover perfect team-opportunity matches using advanced compatibility analysis
            </p>
          </div>
        </div>
      </div>

      {/* Entity Selection */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-medium text-text-primary">Select Analysis Focus</h2>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Entity Type Selection */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">
                What would you like to analyze?
              </label>
              <div className="space-y-2">
                {isTeamUser && (
                  <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-bg-alt">
                    <input
                      type="radio"
                      value="team"
                      checked={selectedEntityType === 'team'}
                      onChange={(e) => setSelectedEntityType(e.target.value as 'team')}
                      className="h-4 w-4 text-navy focus:ring-navy border-border"
                    />
                    <div className="ml-3 flex items-center">
                      <UserGroupIcon className="h-5 w-5 text-text-tertiary mr-2" />
                      <span className="text-sm font-medium text-text-primary">
                        Find opportunities for my team
                      </span>
                    </div>
                  </label>
                )}
                
                {isCompanyUser && (
                  <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-bg-alt">
                    <input
                      type="radio"
                      value="opportunity"
                      checked={selectedEntityType === 'opportunity'}
                      onChange={(e) => setSelectedEntityType(e.target.value as 'opportunity')}
                      className="h-4 w-4 text-navy focus:ring-navy border-border"
                    />
                    <div className="ml-3 flex items-center">
                      <BriefcaseIcon className="h-5 w-5 text-text-tertiary mr-2" />
                      <span className="text-sm font-medium text-text-primary">
                        Find teams for my opportunity
                      </span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Entity Selection */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">
                {selectedEntityType === 'team' ? 'Select your team' : 'Select your opportunity'}
              </label>
              
              {selectedEntityType === 'team' && isTeamUser && (
                <select
                  value={selectedEntityId}
                  onChange={(e) => setSelectedEntityId(e.target.value)}
                  className="input-field"
                >
                  <option value="">Choose a team...</option>
                  {userTeams?.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.size} members)
                    </option>
                  ))}
                </select>
              )}
              
              {selectedEntityType === 'opportunity' && isCompanyUser && (
                <select
                  value={selectedEntityId}
                  onChange={(e) => setSelectedEntityId(e.target.value)}
                  className="input-field"
                >
                  <option value="">Choose an opportunity...</option>
                  {userOpportunities?.opportunities.map((opportunity) => (
                    <option key={opportunity.id} value={opportunity.id}>
                      {opportunity.title} - {opportunity.location}
                    </option>
                  ))}
                </select>
              )}
              
              {((selectedEntityType === 'team' && !userTeams?.length) || 
                (selectedEntityType === 'opportunity' && !userOpportunities?.opportunities.length)) && (
                <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                  <div className="text-text-tertiary">
                    {selectedEntityType === 'team' ? (
                      <>
                        <UserGroupIcon className="mx-auto h-8 w-8 mb-2" />
                        <p className="text-sm">No teams found. Create a team profile first.</p>
                      </>
                    ) : (
                      <>
                        <BriefcaseIcon className="mx-auto h-8 w-8 mb-2" />
                        <p className="text-sm">No opportunities found. Post an opportunity first.</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Matching Results */}
      {selectedEntityId && (
        <MatchingDashboard
          entityId={selectedEntityId}
          entityType={selectedEntityType === 'team' ? 'team' : 'company'}
        />
      )}

      {/* Quick Recommendations */}
      {!selectedEntityId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recommended Teams (for company users) */}
          {isCompanyUser && recommendedTeams && recommendedTeams.length > 0 && (
            <div className="card">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-lg font-medium text-text-primary flex items-center">
                  <SparklesIcon className="h-5 w-5 mr-2 text-gold" />
                  Recommended Teams
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  Teams that match your company&apos;s hiring patterns
                </p>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {recommendedTeams.slice(0, 3).map((team) => (
                    <div key={team.id} className="flex items-center space-x-4 p-3 border border-border rounded-lg hover:bg-bg-alt">
                      <div className="h-10 w-10 rounded-full bg-navy-50 flex items-center justify-center">
                        <UserGroupIcon className="h-5 w-5 text-navy" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-text-primary">{team.name}</h3>
                        <p className="text-sm text-text-secondary">
                          {team.size} members • {team.industry.join(', ')}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          // Auto-select this team for analysis if user has opportunities
                          if (userOpportunities?.opportunities.length) {
                            setSelectedEntityType('opportunity');
                            setSelectedEntityId(userOpportunities.opportunities[0].id);
                          }
                        }}
                        className="btn-outline min-h-12 text-base"
                      >
                        Analyze match
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Insights */}
          <div className="card">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-medium text-text-primary flex items-center">
                <LightBulbIcon className="h-5 w-5 mr-2 text-gold" />
                AI Insights
              </h2>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-navy rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-text-primary">Smart Compatibility Scoring</h4>
                    <p className="text-sm text-text-secondary">
                      Our AI analyzes 7 key dimensions including skills, industry experience, team dynamics, and compensation alignment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-gold rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-text-primary">Predictive Analysis</h4>
                    <p className="text-sm text-text-secondary">
                      Machine learning models trained on successful liftout outcomes to identify the highest-potential matches.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-success rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-text-primary">Risk Assessment</h4>
                    <p className="text-sm text-text-secondary">
                      Identifies potential challenges and provides actionable recommendations to improve match success.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-navy-50 to-gold-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <ChartBarIcon className="h-4 w-4 text-navy" />
                  <span className="text-sm font-medium text-navy-900">Success Rate</span>
                </div>
                <p className="text-sm text-navy-700">
                  Teams with 85%+ match scores have a 3x higher success rate in liftout negotiations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Getting Started */}
      {!selectedEntityId && (isTeamUser && !userTeams?.length || isCompanyUser && !userOpportunities?.opportunities.length) && (
        <div className="card">
          <div className="px-6 py-8 text-center">
            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-text-tertiary" />
            <h3 className="mt-4 text-lg font-medium text-text-primary">Get Started with AI Matching</h3>
            <p className="mt-2 text-sm text-text-secondary max-w-2xl mx-auto">
              {isTeamUser 
                ? 'Create a comprehensive team profile to discover opportunities that perfectly match your skills and experience.'
                : 'Post liftout opportunities to find teams with exactly the expertise you need.'
              }
            </p>
            <div className="mt-6">
              {isTeamUser ? (
                <a href="/app/teams/create" className="btn-primary">
                  Create Team Profile
                </a>
              ) : (
                <a href="/app/opportunities/create" className="btn-primary">
                  Post Opportunity
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}