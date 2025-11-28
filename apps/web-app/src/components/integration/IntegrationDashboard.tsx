'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
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
        <div className="h-8 bg-bg-alt rounded w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-bg-alt rounded"></div>
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
    if (score >= 85) return 'text-success-dark bg-success-light';
    if (score >= 70) return 'text-gold-800 bg-gold-100';
    return 'text-error-dark bg-error-light';
  };

  const getRetentionRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-success-dark bg-success-light';
      case 'medium': return 'text-gold-800 bg-gold-100';
      case 'high': return 'text-error-dark bg-error-light';
      default: return 'text-text-secondary bg-bg-alt';
    }
  };

  const getPhaseIcon = (phase: string) => {
    const status = getPhaseStatus(phase);
    if (status === 'completed') return <CheckCircleIcon className="h-5 w-5 text-success" />;
    if (status === 'in_progress') return <ClockIcon className="h-5 w-5 text-navy" />;
    if (status === 'delayed') return <ExclamationTriangleIcon className="h-5 w-5 text-error" />;
    return <div className="h-5 w-5 border-2 border-border rounded-full"></div>;
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
      {/* Header - Practical UI: bold headings, proper spacing */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text-primary font-heading leading-tight">Integration success tracking</h2>
            <p className="text-base font-normal text-text-secondary mt-2 leading-relaxed">
              {integration.teamName} at {integration.companyName}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-bold ${getHealthColor(healthScore)}`}>
                {healthScore}/100 Health score
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-bold ${getRetentionRiskColor(retentionRisk)}`}>
                {retentionRisk.toUpperCase()} Retention risk
              </span>
              <span className="text-sm font-normal text-text-tertiary">
                Day {daysSinceStart} of integration
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-text-tertiary">Current phase</div>
            <div className="text-lg font-bold text-text-primary mt-1">
              {integration.currentPhase.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
            <div className="text-sm font-normal text-text-tertiary mt-1">
              {integration.overallProgress}% Complete
            </div>
          </div>
        </div>
      </div>

      {/* Early Warnings - Practical UI: rounded-xl callout */}
      {earlyWarnings.length > 0 && (
        <div className="bg-gold-50 border border-gold-200 rounded-xl p-4">
          <div className="flex gap-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-gold flex-shrink-0" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-bold text-gold-900">Early warning indicators</h3>
              <div className="mt-2 space-y-1">
                {earlyWarnings.map((warning, index) => (
                  <p key={index} className="text-sm font-normal text-gold-700">• {warning}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics - Practical UI: consistent card styling */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center">
              <ArrowTrendingUpIcon className="h-6 w-6 text-success" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-tertiary truncate">Performance score</p>
              <p className="text-xl font-bold text-text-primary mt-1">{integration.performanceMetrics.productivity[0]?.velocityScore || 0}/100</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm font-normal text-text-tertiary">+{integration.performanceMetrics.productivity[0]?.benchmarkComparison || 0}% vs benchmark</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center">
              <HeartIcon className="h-6 w-6 text-navy" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-tertiary truncate">Cultural fit</p>
              <p className="text-xl font-bold text-text-primary mt-1">{integration.culturalIntegration.culturalFitScore}/100</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm font-normal text-text-tertiary">Above expectations</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center">
              <CurrencyDollarIcon className="h-6 w-6 text-gold" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-tertiary truncate">ROI progress</p>
              <p className="text-xl font-bold text-text-primary mt-1">{integration.businessResults.roiMetrics[0]?.roi || 0}%</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm font-normal text-text-tertiary">{integration.businessResults.roiMetrics[0]?.paybackPeriod || 0} month payback</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center">
              <CalendarDaysIcon className="h-6 w-6 text-gold" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-tertiary truncate">Milestones</p>
              <p className="text-xl font-bold text-text-primary mt-1">
                {integration.milestones.filter(m => m.status === 'completed').length}/{integration.milestones.length}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm font-normal text-text-tertiary">On schedule</span>
          </div>
        </div>
      </div>

      {/* Integration Phases */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-6">Integration phases</h3>

        <div className="space-y-4">
          {integration.phases.map((phase, index) => (
            <div key={phase.phase} className="relative">
              {index < integration.phases.length - 1 && (
                <div className="absolute left-6 top-12 h-full w-0.5 bg-bg-elevated"></div>
              )}

              <div className="flex items-start">
                <div className="flex-shrink-0 relative">
                  <div className="flex items-center justify-center w-12 h-12 bg-bg-surface border-2 border-border rounded-full">
                    {getPhaseIcon(phase.phase)}
                  </div>
                </div>

                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-text-primary">{phase.name}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      phase.status === 'completed' ? 'bg-success-light text-success-dark' :
                      phase.status === 'in_progress' ? 'bg-navy-50 text-navy-800' :
                      phase.status === 'delayed' ? 'bg-error-light text-error-dark' :
                      'bg-bg-alt text-text-secondary'
                    }`}>
                      {phase.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-sm text-text-secondary mt-1">{phase.description}</p>

                  <div className="mt-3 flex items-center space-x-4 text-xs text-text-tertiary">
                    <span>{formatDate(phase.startDate)} - {formatDate(phase.endDate)}</span>
                    <span>{phase.completedObjectives} objectives completed</span>
                    {phase.issues.length > 0 && (
                      <span className="text-error">{phase.issues.length} issues</span>
                    )}
                  </div>

                  {phase.status === 'in_progress' && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-text-secondary mb-1">
                        <span>Progress</span>
                        <span>{phase.progress}%</span>
                      </div>
                      <div className="w-full bg-bg-elevated rounded-full h-2">
                        <div
                          className="bg-navy h-2 rounded-full"
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
        <div className="card p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <UserGroupIcon className="h-5 w-5 text-navy" aria-hidden="true" />
            Team member performance
          </h3>

          <div className="space-y-4">
            {integration.performanceMetrics.individualPerformance.map((member) => (
              <div key={member.employeeId} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">{member.name}</h4>
                    <p className="text-xs text-text-tertiary">{member.role}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-text-primary">{member.performanceScore}/10</div>
                    <div className={`text-xs ${
                      member.retentionRisk === 'low' ? 'text-success' :
                      member.retentionRisk === 'medium' ? 'text-gold' :
                      'text-error'
                    }`}>
                      {member.retentionRisk} risk
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-text-tertiary">Goal achievement:</span>
                    <span className="ml-1 font-medium text-text-primary">{member.goalAchievement}%</span>
                  </div>
                  <div>
                    <span className="text-text-tertiary">Engagement:</span>
                    <span className="ml-1 font-medium text-text-primary">{member.engagementScore}/10</span>
                  </div>
                </div>

                {member.skillDevelopment.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-text-tertiary mb-2">Skill development:</p>
                    {member.skillDevelopment.slice(0, 2).map((skill, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary">{skill.skill}</span>
                        <span className="text-text-primary">{skill.currentLevel}/{skill.targetLevel}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Business Impact */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5 text-success" aria-hidden="true" />
            Business impact
          </h3>

          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="text-sm font-medium text-text-primary mb-3">Revenue impact</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Direct revenue:</span>
                  <span className="text-sm font-medium text-text-primary">{formatCurrency(integration.businessResults.revenueMetrics[0]?.directRevenue || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Revenue growth:</span>
                  <div className="flex items-center">
                    <ArrowUpIcon className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success ml-1">
                      {integration.businessResults.revenueMetrics[0]?.revenueGrowth || 0}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">New clients:</span>
                  <span className="text-sm font-medium text-text-primary">{integration.businessResults.clientMetrics[0]?.newClientsAcquired || 0}</span>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h4 className="text-sm font-medium text-text-primary mb-3">Innovation metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Innovation index:</span>
                  <span className="text-sm font-medium text-text-primary">{integration.businessResults.innovationMetrics[0]?.innovationIndex || 0}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Process improvements:</span>
                  <span className="text-sm font-medium text-text-primary">{integration.businessResults.innovationMetrics[0]?.processImprovements || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Patents applied:</span>
                  <span className="text-sm font-medium text-text-primary">{integration.businessResults.innovationMetrics[0]?.patentsApplied || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <LightBulbIcon className="h-5 w-5 text-gold" aria-hidden="true" />
          Recent feedback & insights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-3">Latest feedback session</h4>
            {integration.feedbackSessions.length > 0 && (
              <div className="border border-border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-text-primary">{integration.feedbackSessions[0].type.replace(/_/g, ' ')} Review</span>
                  <span className="text-xs text-text-tertiary">{formatDate(integration.feedbackSessions[0].date)}</span>
                </div>

                <div className="space-y-2">
                  {integration.feedbackSessions[0].feedback.map((feedback, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">{feedback.category.replace(/_/g, ' ')}:</span>
                        <span className="font-medium text-text-primary">{feedback.rating}/10</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-text-secondary">
                    <strong className="text-text-primary">Insights:</strong> {integration.feedbackSessions[0].insights.join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-3">Cultural integration</h4>
            <div className="space-y-3">
              {integration.culturalIntegration.culturalFeedback.slice(0, 3).map((feedback, index) => (
                <div key={index} className="border-l-4 border-navy pl-3">
                  <div className="flex justify-between items-start">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      feedback.feedbackType === 'positive' ? 'bg-success-light text-success-dark' :
                      feedback.feedbackType === 'constructive' ? 'bg-gold-100 text-gold-800' :
                      'bg-error-light text-error-dark'
                    }`}>
                      {feedback.feedbackType}
                    </span>
                    <span className="text-xs text-text-tertiary">{formatDate(feedback.date)}</span>
                  </div>
                  <p className="text-sm text-text-secondary mt-1">{feedback.feedback}</p>
                  <p className="text-xs text-text-tertiary">— {feedback.source.replace(/_/g, ' ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Practical UI: 48px touch targets */}
      <div className="flex flex-wrap gap-4">
        <button onClick={() => toast.success('Check-in scheduled')} className="btn-primary min-h-12 transition-colors duration-fast">
          Schedule check-in
        </button>
        <button onClick={() => toast.success('Report generated successfully')} className="btn-outline min-h-12 transition-colors duration-fast">
          Generate report
        </button>
        <button onClick={() => toast.success('Loading detailed analytics...')} className="btn-outline min-h-12 transition-colors duration-fast">
          View detailed analytics
        </button>
        <button onClick={() => toast.success('Milestones updated')} className="btn-outline min-h-12 transition-colors duration-fast">
          Update milestones
        </button>
      </div>
    </div>
  );
}