'use client';

import { useState, useEffect } from 'react';
import { 
  IntegrationTracker, 
  calculateIntegrationHealthScore, 
  assessRetentionRisk,
  generateEarlyWarnings,
  mockIntegrationTracker 
} from '@/lib/integration';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  ChartBarIcon,
  AcademicCapIcon,
  HeartIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  LightBulbIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

interface IntegrationDashboardProps {
  integrationId?: string;
}

export function IntegrationDashboard({ integrationId }: IntegrationDashboardProps) {
  const [integration, setIntegration] = useState<IntegrationTracker | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIntegration(mockIntegrationTracker);
      setIsLoading(false);
    }, 500);
  }, [integrationId]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!integration) return null;

  const healthScore = calculateIntegrationHealthScore(integration);
  const retentionRisk = assessRetentionRisk(integration);
  const earlyWarnings = generateEarlyWarnings(integration);

  const getPhaseStatus = (phase: string) => {
    const phaseData = integration.phases.find(p => p.phase === phase);
    return phaseData?.status || 'not_started';
  };

  const getHealthColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRetentionRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPhaseIcon = (phase: string) => {
    const status = getPhaseStatus(phase);
    if (status === 'completed') return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    if (status === 'in_progress') return <ClockIcon className="h-5 w-5 text-blue-500" />;
    if (status === 'delayed') return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
    return <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const daysSinceStart = Math.floor((Date.now() - new Date(integration.startDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Integration Success Tracking</h2>
            <p className="text-gray-600 mt-1">
              {integration.teamName} at {integration.companyName}
            </p>
            <div className="mt-3 flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(healthScore)}`}>
                {healthScore}/100 Health Score
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRetentionRiskColor(retentionRisk)}`}>
                {retentionRisk.toUpperCase()} Retention Risk
              </span>
              <span className="text-sm text-gray-500">
                Day {daysSinceStart} of integration
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Current Phase</div>
            <div className="text-lg font-semibold text-gray-900">
              {integration.currentPhase.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
            <div className="text-sm text-gray-500">
              {integration.overallProgress}% Complete
            </div>
          </div>
        </div>
      </div>

      {/* Early Warnings */}
      {earlyWarnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Early Warning Indicators</h3>
              <div className="mt-2 space-y-1">
                {earlyWarnings.map((warning, index) => (
                  <p key={index} className="text-sm text-yellow-700">• {warning}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowTrendingUpIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Performance Score</p>
              <p className="text-2xl font-semibold text-gray-900">{integration.performanceMetrics.productivity[0]?.velocityScore || 0}/100</p>
              <p className="text-xs text-gray-500">+{integration.performanceMetrics.productivity[0]?.benchmarkComparison || 0}% vs benchmark</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <HeartIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Cultural Fit</p>
              <p className="text-2xl font-semibold text-gray-900">{integration.culturalIntegration.culturalFitScore}/100</p>
              <p className="text-xs text-gray-500">Above expectations</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">ROI Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{integration.businessResults.roiMetrics[0]?.roi || 0}%</p>
              <p className="text-xs text-gray-500">{integration.businessResults.roiMetrics[0]?.paybackPeriod || 0} month payback</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarDaysIcon className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Milestones</p>
              <p className="text-2xl font-semibold text-gray-900">
                {integration.milestones.filter(m => m.status === 'completed').length}/{integration.milestones.length}
              </p>
              <p className="text-xs text-gray-500">On schedule</p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Phases */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Integration Phases</h3>
        
        <div className="space-y-4">
          {integration.phases.map((phase, index) => (
            <div key={phase.phase} className="relative">
              {index < integration.phases.length - 1 && (
                <div className="absolute left-6 top-12 h-full w-0.5 bg-gray-200"></div>
              )}
              
              <div className="flex items-start">
                <div className="flex-shrink-0 relative">
                  <div className="flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-200 rounded-full">
                    {getPhaseIcon(phase.phase)}
                  </div>
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{phase.name}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                      phase.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      phase.status === 'delayed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {phase.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">{phase.description}</p>
                  
                  <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                    <span>{formatDate(phase.startDate)} - {formatDate(phase.endDate)}</span>
                    <span>{phase.completedObjectives} objectives completed</span>
                    {phase.issues.length > 0 && (
                      <span className="text-red-600">{phase.issues.length} issues</span>
                    )}
                  </div>
                  
                  {phase.status === 'in_progress' && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{phase.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${phase.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Individual Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <UserGroupIcon className="h-5 w-5 mr-2 text-blue-500" />
            Team Member Performance
          </h3>
          
          <div className="space-y-4">
            {integration.performanceMetrics.individualPerformance.map((member) => (
              <div key={member.employeeId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{member.name}</h4>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{member.performanceScore}/10</div>
                    <div className={`text-xs ${
                      member.retentionRisk === 'low' ? 'text-green-600' :
                      member.retentionRisk === 'medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {member.retentionRisk} risk
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500">Goal Achievement:</span>
                    <span className="ml-1 font-medium">{member.goalAchievement}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Engagement:</span>
                    <span className="ml-1 font-medium">{member.engagementScore}/10</span>
                  </div>
                </div>
                
                {member.skillDevelopment.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Skill Development:</p>
                    {member.skillDevelopment.slice(0, 2).map((skill, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span>{skill.skill}</span>
                        <span>{skill.currentLevel}/{skill.targetLevel}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Business Impact */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2 text-green-500" />
            Business Impact
          </h3>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Revenue Impact</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Direct Revenue:</span>
                  <span className="text-sm font-medium">{formatCurrency(integration.businessResults.revenueMetrics[0]?.directRevenue || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Revenue Growth:</span>
                  <div className="flex items-center">
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600 ml-1">
                      {integration.businessResults.revenueMetrics[0]?.revenueGrowth || 0}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">New Clients:</span>
                  <span className="text-sm font-medium">{integration.businessResults.clientMetrics[0]?.newClientsAcquired || 0}</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Innovation Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Innovation Index:</span>
                  <span className="text-sm font-medium">{integration.businessResults.innovationMetrics[0]?.innovationIndex || 0}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Process Improvements:</span>
                  <span className="text-sm font-medium">{integration.businessResults.innovationMetrics[0]?.processImprovements || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Patents Applied:</span>
                  <span className="text-sm font-medium">{integration.businessResults.innovationMetrics[0]?.patentsApplied || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <LightBulbIcon className="h-5 w-5 mr-2 text-yellow-500" />
          Recent Feedback & Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Latest Feedback Session</h4>
            {integration.feedbackSessions.length > 0 && (
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium">{integration.feedbackSessions[0].type.replace(/_/g, ' ')} Review</span>
                  <span className="text-xs text-gray-500">{formatDate(integration.feedbackSessions[0].date)}</span>
                </div>
                
                <div className="space-y-2">
                  {integration.feedbackSessions[0].feedback.map((feedback, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{feedback.category.replace(/_/g, ' ')}:</span>
                        <span className="font-medium">{feedback.rating}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    <strong>Insights:</strong> {integration.feedbackSessions[0].insights.join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Cultural Integration</h4>
            <div className="space-y-3">
              {integration.culturalIntegration.culturalFeedback.slice(0, 3).map((feedback, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-3">
                  <div className="flex justify-between items-start">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      feedback.feedbackType === 'positive' ? 'bg-green-100 text-green-800' :
                      feedback.feedbackType === 'constructive' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {feedback.feedbackType}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(feedback.date)}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{feedback.feedback}</p>
                  <p className="text-xs text-gray-500">— {feedback.source.replace(/_/g, ' ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button className="btn-primary">
          Schedule Check-in
        </button>
        <button className="btn-secondary">
          Generate Report
        </button>
        <button className="btn-secondary">
          View Detailed Analytics
        </button>
        <button className="btn-secondary">
          Update Milestones
        </button>
      </div>
    </div>
  );
}