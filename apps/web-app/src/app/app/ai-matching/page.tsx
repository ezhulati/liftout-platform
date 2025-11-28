'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { matchingService } from '@/lib/services/matchingService';
import { teamService } from '@/lib/services/teamService';
import { opportunityService } from '@/lib/services/opportunityService';
import { MatchingDashboard } from '@/components/matching/MatchingDashboard';
import { DEMO_ACCOUNTS, DEMO_DATA, isDemoAccount } from '@/lib/demo-accounts';
import {
  SparklesIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ChartBarIcon,
  LightBulbIcon,
  CpuChipIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

export default function AIMatchingPage() {
  const { data: session } = useSession();
  const { user, isCompany, isIndividual } = useAuth();
  const [selectedEntityType, setSelectedEntityType] = useState<'team' | 'opportunity'>('team');
  const [selectedEntityId, setSelectedEntityId] = useState<string>('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Check if demo user (has session but no Firebase user)
  const isDemoUser = session?.user?.email ? isDemoAccount(session.user.email) : false;
  const isAuthenticated = !!session || !!user;

  const isCompanyUser = isDemoUser
    ? session?.user?.email === DEMO_ACCOUNTS.company.email
    : isCompany;
  const isTeamUser = isDemoUser
    ? session?.user?.email === DEMO_ACCOUNTS.individual.email
    : isIndividual;

  // Demo data for team users
  const demoTeams = isDemoUser && isTeamUser ? [{
    id: DEMO_ACCOUNTS.individual.team.id,
    name: DEMO_ACCOUNTS.individual.team.name,
    size: DEMO_ACCOUNTS.individual.team.size,
    industry: ['Financial Services', 'Technology'],
  }] : [];

  // Demo data for company users
  const demoOpportunities = isDemoUser && isCompanyUser ? DEMO_DATA.opportunities.map(opp => ({
    id: opp.id,
    title: opp.title,
    location: opp.location,
    company: opp.company,
  })) : [];

  // Get user's teams (for team users)
  const { data: userTeams } = useQuery({
    queryKey: ['user-teams', user?.id],
    queryFn: async () => {
      if (isDemoUser) return demoTeams;
      if (!isTeamUser || !user?.id) return [];
      return await teamService.getTeamsByUser(user.id);
    },
    enabled: (isTeamUser && !!user?.id) || isDemoUser,
  });

  // Get user's opportunities (for company users)
  const { data: userOpportunities } = useQuery({
    queryKey: ['user-opportunities', user?.id],
    queryFn: async () => {
      if (isDemoUser) return { opportunities: demoOpportunities };
      if (!isCompanyUser || !user?.id) return { opportunities: [] };
      return await opportunityService.searchOpportunities({
        companyId: user.id,
        limit: 50,
      });
    },
    enabled: (isCompanyUser && !!user?.id) || isDemoUser,
  });

  // Get recommended teams (for company users)
  const { data: recommendedTeams } = useQuery({
    queryKey: ['recommended-teams', user?.id],
    queryFn: async () => {
      if (isDemoUser) return DEMO_DATA.teams;
      if (!isCompanyUser || !user?.id) return [];
      return await matchingService.getRecommendedTeams(user.id, 5);
    },
    enabled: (isCompanyUser && !!user?.id) || isDemoUser,
  });

  // Get recommended opportunities (for team users)
  const { data: recommendedOpportunities } = useQuery({
    queryKey: ['recommended-opportunities', selectedEntityId],
    queryFn: async () => {
      if (isDemoUser) return DEMO_DATA.opportunities;
      if (!isTeamUser || !selectedEntityId) return [];
      return await matchingService.getRecommendedOpportunities(selectedEntityId, 5);
    },
    enabled: (isTeamUser && !!selectedEntityId) || isDemoUser,
  });

  // AI Analysis mutation
  const analyzeMatchMutation = useMutation({
    mutationFn: async ({ teamData, opportunityData }: { teamData: any; opportunityData: any }) => {
      const response = await fetch('/api/ai/analyze-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamData, opportunityData }),
      });
      if (!response.ok) throw new Error('Failed to analyze match');
      return response.json();
    },
    onSuccess: (data) => {
      setAiAnalysis(data);
    },
  });

  // Auto-select first entity for demo users
  useEffect(() => {
    if (isDemoUser && !selectedEntityId) {
      if (isTeamUser && demoTeams.length > 0) {
        setSelectedEntityId(demoTeams[0].id);
        setSelectedEntityType('team');
      } else if (isCompanyUser && demoOpportunities.length > 0) {
        setSelectedEntityId(demoOpportunities[0].id);
        setSelectedEntityType('opportunity');
      }
    }
  }, [isDemoUser, isTeamUser, isCompanyUser, selectedEntityId, demoTeams, demoOpportunities]);

  if (!isAuthenticated) {
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

      {/* AI Matching Results - Demo Mode */}
      {isDemoUser && selectedEntityId && (
        <DemoAIMatchingResults
          isTeamUser={isTeamUser}
          isCompanyUser={isCompanyUser}
          teams={DEMO_DATA.teams}
          opportunities={DEMO_DATA.opportunities}
          onAnalyze={analyzeMatchMutation.mutate}
          isAnalyzing={analyzeMatchMutation.isPending}
          aiAnalysis={aiAnalysis}
        />
      )}

      {/* AI Matching Results - Real Mode */}
      {!isDemoUser && selectedEntityId && (
        <MatchingDashboard
          entityId={selectedEntityId}
          entityType={selectedEntityType === 'team' ? 'team' : 'company'}
        />
      )}

      {/* Quick Recommendations */}
      {!selectedEntityId && !isDemoUser && (
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
                          {team.size} members • {'industry' in team ? (team.industry as string[]).join(', ') : (team as any).specialization || 'Technology'}
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
      {!selectedEntityId && !isDemoUser && (isTeamUser && !userTeams?.length || isCompanyUser && !userOpportunities?.opportunities.length) && (
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
                <a href="/app/teams/create" className="btn-primary min-h-12">
                  Create team profile
                </a>
              ) : (
                <a href="/app/opportunities/create" className="btn-primary min-h-12">
                  Post opportunity
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Demo Mode Quick Recommendations */}
      {isDemoUser && !aiAnalysis && (
        <div className="card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-medium text-text-primary flex items-center">
              <RocketLaunchIcon className="h-5 w-5 mr-2 text-gold" />
              Quick Start - Demo Mode
            </h2>
          </div>
          <div className="px-6 py-4">
            <p className="text-text-secondary mb-4">
              Click "Run AI Analysis" on any match below to see Claude analyze the compatibility in real-time.
            </p>
            <div className="p-4 bg-gradient-to-r from-navy-50 to-gold-50 rounded-lg">
              <p className="text-sm text-navy-700">
                <strong>Pro tip:</strong> The AI considers team cohesion, skills alignment, industry fit, compensation expectations, and cultural compatibility to generate actionable insights.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Demo AI Matching Results Component
interface DemoAIMatchingResultsProps {
  isTeamUser: boolean;
  isCompanyUser: boolean;
  teams: typeof DEMO_DATA.teams;
  opportunities: typeof DEMO_DATA.opportunities;
  onAnalyze: (data: { teamData: any; opportunityData: any }) => void;
  isAnalyzing: boolean;
  aiAnalysis: any;
}

function DemoAIMatchingResults({
  isTeamUser,
  isCompanyUser,
  teams,
  opportunities,
  onAnalyze,
  isAnalyzing,
  aiAnalysis,
}: DemoAIMatchingResultsProps) {
  const [selectedMatch, setSelectedMatch] = useState<{ team: any; opportunity: any } | null>(null);

  // For team users, show opportunities they can apply to
  // For company users, show teams they can recruit
  const matches = isTeamUser
    ? opportunities.map((opp, idx) => ({
        team: {
          id: DEMO_ACCOUNTS.individual.team.id,
          name: DEMO_ACCOUNTS.individual.team.name,
          size: DEMO_ACCOUNTS.individual.team.size,
          yearsWorking: DEMO_ACCOUNTS.individual.team.yearsWorking,
          cohesionScore: DEMO_ACCOUNTS.individual.team.cohesionScore,
          successfulProjects: DEMO_ACCOUNTS.individual.team.successfulProjects,
          skills: DEMO_ACCOUNTS.individual.profile.skills,
          achievements: DEMO_ACCOUNTS.individual.profile.achievements,
        },
        opportunity: opp,
        baseScore: 85 - idx * 8,
      }))
    : teams.map((team, idx) => ({
        team: {
          ...team,
          yearsWorking: team.yearsWorking,
        },
        opportunity: opportunities[0],
        baseScore: team.cohesionScore - idx * 3,
      }));

  const handleRunAnalysis = (match: { team: any; opportunity: any }) => {
    setSelectedMatch(match);
    onAnalyze({
      teamData: match.team,
      opportunityData: match.opportunity,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-navy to-gold flex items-center justify-center">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-text-primary">AI-Powered Matches</h2>
            <p className="text-sm text-text-secondary">
              {isTeamUser
                ? 'Opportunities matched to your team\'s profile'
                : 'Teams matched to your opportunity requirements'}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gold-100 text-gold-800">
          Demo Mode
        </span>
      </div>

      {/* AI Analysis Result */}
      {aiAnalysis && selectedMatch && (
        <AIAnalysisCard analysis={aiAnalysis.analysis} match={selectedMatch} />
      )}

      {/* Match Cards */}
      <div className="space-y-4">
        {matches.map((match, index) => (
          <div
            key={`${match.team.id || match.team.name}-${match.opportunity.id}`}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="px-6 py-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-navy-100 flex items-center justify-center">
                      <span className="text-lg font-bold text-navy">#{index + 1}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      {isTeamUser ? (
                        <BriefcaseIcon className="h-5 w-5 text-text-tertiary" />
                      ) : (
                        <UserGroupIcon className="h-5 w-5 text-text-tertiary" />
                      )}
                      <h3 className="text-lg font-medium text-text-primary">
                        {isTeamUser ? match.opportunity.title : match.team.name}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        match.baseScore >= 85 ? 'bg-success-light text-success-dark' :
                        match.baseScore >= 70 ? 'bg-navy-50 text-navy-800' :
                        'bg-gold-100 text-gold-800'
                      }`}>
                        {match.baseScore >= 85 ? 'Excellent' : match.baseScore >= 70 ? 'Good' : 'Fair'}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">
                      {isTeamUser
                        ? `${match.opportunity.company} • ${match.opportunity.location}`
                        : `${match.team.size} members • ${'specialization' in match.team ? (match.team as any).specialization : 'Technology'}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-navy">{match.baseScore}%</div>
                  <div className="text-xs text-text-tertiary">base score</div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {isTeamUser ? (
                  <>
                    <div className="text-center p-3 bg-bg-alt rounded-lg">
                      <div className="text-sm font-medium text-text-primary">{match.opportunity.teamSize}</div>
                      <div className="text-xs text-text-tertiary">Team Size</div>
                    </div>
                    <div className="text-center p-3 bg-bg-alt rounded-lg">
                      <div className="text-sm font-medium text-text-primary">{match.opportunity.compensation}</div>
                      <div className="text-xs text-text-tertiary">Compensation</div>
                    </div>
                    <div className="text-center p-3 bg-bg-alt rounded-lg">
                      <div className="text-sm font-medium text-text-primary">{match.opportunity.timeline}</div>
                      <div className="text-xs text-text-tertiary">Timeline</div>
                    </div>
                    <div className="text-center p-3 bg-bg-alt rounded-lg">
                      <div className="text-sm font-medium text-text-primary">{match.opportunity.urgent ? 'Urgent' : 'Flexible'}</div>
                      <div className="text-xs text-text-tertiary">Priority</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center p-3 bg-bg-alt rounded-lg">
                      <div className="text-sm font-medium text-text-primary">{match.team.yearsWorking} yrs</div>
                      <div className="text-xs text-text-tertiary">Together</div>
                    </div>
                    <div className="text-center p-3 bg-bg-alt rounded-lg">
                      <div className="text-sm font-medium text-text-primary">{match.team.cohesionScore}%</div>
                      <div className="text-xs text-text-tertiary">Cohesion</div>
                    </div>
                    <div className="text-center p-3 bg-bg-alt rounded-lg">
                      <div className="text-sm font-medium text-text-primary">{('successRate' in match.team ? match.team.successRate : 90)}%</div>
                      <div className="text-xs text-text-tertiary">Success Rate</div>
                    </div>
                    <div className="text-center p-3 bg-bg-alt rounded-lg">
                      <div className="text-sm font-medium text-text-primary">{'responseTime' in match.team ? match.team.responseTime : '< 24 hours'}</div>
                      <div className="text-xs text-text-tertiary">Response</div>
                    </div>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                {isTeamUser ? match.opportunity.description : ('description' in match.team ? match.team.description : 'High-performing team with proven track record.')}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-2">
                  {(isTeamUser ? match.opportunity.requirements : match.team.skills)?.slice(0, 3).map((skill: string, i: number) => (
                    <span key={i} className="inline-flex items-center px-2 py-1 rounded text-xs bg-bg-alt text-text-secondary">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleRunAnalysis(match)}
                    disabled={isAnalyzing}
                    className="btn-primary min-h-12 inline-flex items-center gap-2"
                  >
                    {isAnalyzing && selectedMatch?.team.name === match.team.name ? (
                      <>
                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="h-4 w-4" />
                        Run AI Analysis
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// AI Analysis Result Card
function AIAnalysisCard({ analysis, match }: { analysis: any; match: { team: any; opportunity: any } }) {
  return (
    <div className="card border-2 border-gold">
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-navy-50 to-gold-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="h-6 w-6 text-gold" />
            <div>
              <h3 className="text-lg font-semibold text-text-primary">AI Analysis Complete</h3>
              <p className="text-sm text-text-secondary">
                Powered by Claude AI
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-navy">{analysis.overallScore}%</div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              analysis.recommendation === 'excellent' ? 'bg-success-light text-success-dark' :
              analysis.recommendation === 'good' ? 'bg-navy-50 text-navy-800' :
              analysis.recommendation === 'fair' ? 'bg-gold-100 text-gold-800' :
              'bg-error-light text-error-dark'
            }`}>
              {analysis.recommendation.charAt(0).toUpperCase() + analysis.recommendation.slice(1)} Match
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Executive Summary */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center">
            <LightBulbIcon className="h-4 w-4 mr-2 text-gold" />
            Executive Summary
          </h4>
          <p className="text-text-secondary">{analysis.summary}</p>
        </div>

        {/* Compatibility Breakdown */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3">Compatibility Breakdown</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(analysis.compatibility).map(([key, value]: [string, any]) => (
              <div key={key} className="p-3 bg-bg-alt rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-text-primary capitalize">{key}</span>
                  <span className="text-sm font-bold text-navy">{value.score}/{key === 'skills' ? 25 : key === 'industry' ? 20 : key === 'experience' || key === 'compensation' || key === 'culture' ? 15 : 10}</span>
                </div>
                <div className="w-full bg-bg-elevated rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full ${
                      (value.score / (key === 'skills' ? 25 : key === 'industry' ? 20 : key === 'experience' || key === 'compensation' || key === 'culture' ? 15 : 10)) >= 0.8 ? 'bg-success' :
                      (value.score / (key === 'skills' ? 25 : key === 'industry' ? 20 : key === 'experience' || key === 'compensation' || key === 'culture' ? 15 : 10)) >= 0.6 ? 'bg-navy' :
                      'bg-gold'
                    }`}
                    style={{ width: `${(value.score / (key === 'skills' ? 25 : key === 'industry' ? 20 : key === 'experience' || key === 'compensation' || key === 'culture' ? 15 : 10)) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-text-tertiary line-clamp-2">{value.analysis}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Concerns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center">
              <CheckCircleIcon className="h-4 w-4 mr-2 text-success" />
              Key Strengths
            </h4>
            <ul className="space-y-2">
              {analysis.strengths.map((strength: string, i: number) => (
                <li key={i} className="flex items-start text-sm text-text-secondary">
                  <span className="w-1.5 h-1.5 bg-success rounded-full mt-2 mr-2 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center">
              <ExclamationTriangleIcon className="h-4 w-4 mr-2 text-warning" />
              Considerations
            </h4>
            <ul className="space-y-2">
              {analysis.concerns.map((concern: string, i: number) => (
                <li key={i} className="flex items-start text-sm text-text-secondary">
                  <span className="w-1.5 h-1.5 bg-warning rounded-full mt-2 mr-2 flex-shrink-0" />
                  {concern}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center">
            <RocketLaunchIcon className="h-4 w-4 mr-2 text-navy" />
            Recommendations
          </h4>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec: string, i: number) => (
              <li key={i} className="flex items-start text-sm text-text-secondary">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-navy-50 text-navy text-xs font-bold mr-2 flex-shrink-0">
                  {i + 1}
                </span>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* Negotiation Insights */}
        <div className="p-4 bg-gradient-to-r from-navy-50 to-gold-50 rounded-lg">
          <h4 className="text-sm font-semibold text-navy-900 mb-2 flex items-center">
            <TrophyIcon className="h-4 w-4 mr-2 text-gold" />
            Negotiation Insights
          </h4>
          <p className="text-sm text-navy-700">{analysis.negotiationInsights}</p>
        </div>

        {/* Risk & Timeline */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-xs text-text-tertiary">Integration Risk</span>
              <div className={`text-sm font-medium ${
                analysis.integrationRisk === 'low' ? 'text-success' :
                analysis.integrationRisk === 'medium' ? 'text-gold' :
                'text-error'
              }`}>
                {analysis.integrationRisk.charAt(0).toUpperCase() + analysis.integrationRisk.slice(1)}
              </div>
            </div>
            <div>
              <span className="text-xs text-text-tertiary">Time to Productivity</span>
              <div className="text-sm font-medium text-text-primary">{analysis.timeToProductivity}</div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="btn-outline min-h-12">Save Analysis</button>
            <button className="btn-primary min-h-12">Start Conversation</button>
          </div>
        </div>
      </div>
    </div>
  );
}