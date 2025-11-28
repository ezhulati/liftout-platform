'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  DueDiligenceWorkflow, 
  calculateWorkflowProgress, 
  assessOverallRisk,
  mockDueDiligenceWorkflow 
} from '@/lib/due-diligence';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentCheckIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CogIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface DueDiligenceOverviewProps {
  workflowId?: string;
}

export function DueDiligenceOverview({ workflowId }: DueDiligenceOverviewProps) {
  const [workflow, setWorkflow] = useState<DueDiligenceWorkflow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setWorkflow(mockDueDiligenceWorkflow);
      setIsLoading(false);
    }, 500);
  }, [workflowId]);

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

  if (!workflow) return null;

  const progress = calculateWorkflowProgress(workflow);
  const riskLevel = assessOverallRisk(workflow);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success-dark bg-success-light';
      case 'in_progress': return 'text-navy-800 bg-navy-50';
      case 'on_hold': return 'text-gold-800 bg-gold-100';
      default: return 'text-text-secondary bg-bg-alt';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-success-dark bg-success-light';
      case 'medium': return 'text-gold-800 bg-gold-100';
      case 'high': return 'text-error-dark bg-error-light';
      default: return 'text-text-secondary bg-bg-alt';
    }
  };

  const categoryIcons = {
    team_validation: UserGroupIcon,
    performance_verification: ChartBarIcon,
    cultural_assessment: DocumentCheckIcon,
    risk_evaluation: ShieldCheckIcon,
    integration_planning: CogIcon,
  };

  const categoryProgress = Object.entries(categoryIcons).map(([category, Icon]) => {
    const categoryChecks = workflow.checks.filter(check => check.category === category);
    const completed = categoryChecks.filter(check => check.status === 'completed').length;
    const total = categoryChecks.length;
    const percentage = Math.round((completed / total) * 100);

    return {
      category,
      name: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      Icon,
      completed,
      total,
      percentage,
    };
  });

  return (
    <div className="space-y-8">
      {/* Header - Practical UI: bold headings, proper spacing */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text-primary font-heading leading-tight">Due diligence workflow</h2>
            <p className="text-base font-normal text-text-secondary mt-2 leading-relaxed">
              Strategic Analytics Core × Healthcare AI Innovation Team
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-bold ${getStatusColor(workflow.status)}`}>
              {workflow.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-bold ${getRiskColor(riskLevel)}`}>
              {riskLevel.toUpperCase()} Risk
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics - Practical UI: consistent card styling */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-success" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-tertiary truncate">Progress</p>
              <p className="text-xl font-bold text-text-primary mt-1">{progress.progressPercentage}%</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm font-normal text-text-tertiary">{progress.completedChecks}/{progress.totalChecks} checks</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-gold" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-tertiary truncate">High priority</p>
              <p className="text-xl font-bold text-text-primary mt-1">{progress.highPriorityCompleted}/{progress.highPriorityTotal}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm font-normal text-text-tertiary">Critical checks</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center">
              <ClockIcon className="h-6 w-6 text-navy" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-tertiary truncate">Timeline</p>
              <p className="text-xl font-bold text-text-primary mt-1">6</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm font-normal text-text-tertiary">Weeks remaining</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center">
              <DocumentCheckIcon className="h-6 w-6 text-gold" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-tertiary truncate">Evidence</p>
              <p className="text-xl font-bold text-text-primary mt-1">{workflow.checks.reduce((acc, check) => acc + (check.evidence?.length || 0), 0)}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm font-normal text-text-tertiary">Documents collected</span>
          </div>
        </div>
      </div>

      {/* Category Progress */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-6">Progress by category</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {categoryProgress.map(({ category, name, Icon, completed, total, percentage }) => (
            <div key={category} className="text-center">
              <div className="mx-auto w-16 h-16 bg-bg-alt rounded-xl flex items-center justify-center mb-3">
                <Icon className="h-8 w-8 text-text-secondary" aria-hidden="true" />
              </div>
              <h4 className="text-base font-bold text-text-primary mb-2">{name}</h4>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-navy bg-navy-50">
                      {percentage}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-navy-100">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-navy"
                  ></div>
                </div>
              </div>
              <p className="text-xs text-text-tertiary">{completed}/{total} complete</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Findings */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">Key findings</h3>
        <div className="space-y-3">
          {workflow.keyFindings.map((finding, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-navy rounded-full mt-2"></div>
              </div>
              <p className="ml-3 text-base text-text-secondary">{finding}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">Recommendations</h3>
        <div className="space-y-3">
          {workflow.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-success mt-0.5" />
              </div>
              <p className="ml-3 text-base text-text-secondary">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons - Practical UI: 48px touch targets */}
      <div className="flex flex-wrap gap-4">
        <button onClick={() => toast.success('Loading detailed checklist...')} className="btn-primary min-h-12 transition-colors duration-fast">
          View detailed checklist
        </button>
        <button onClick={() => toast.success('Report generated successfully')} className="btn-outline min-h-12 transition-colors duration-fast">
          Generate report
        </button>
        <button onClick={() => toast.success('Meeting invitation sent')} className="btn-outline min-h-12 transition-colors duration-fast">
          Schedule review meeting
        </button>
      </div>
    </div>
  );
}