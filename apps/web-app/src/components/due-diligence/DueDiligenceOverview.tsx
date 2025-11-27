'use client';

import { useState, useEffect } from 'react';
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
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Due Diligence Workflow</h2>
            <p className="text-gray-600 mt-1">
              Strategic Analytics Core × Healthcare AI Innovation Team
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(workflow.status)}`}>
              {workflow.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(riskLevel)}`}>
              {riskLevel.toUpperCase()} Risk
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{progress.progressPercentage}%</p>
              <p className="text-xs text-gray-500">{progress.completedChecks}/{progress.totalChecks} checks</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">High Priority</p>
              <p className="text-2xl font-semibold text-gray-900">{progress.highPriorityCompleted}/{progress.highPriorityTotal}</p>
              <p className="text-xs text-gray-500">Critical checks</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Timeline</p>
              <p className="text-2xl font-semibold text-gray-900">6</p>
              <p className="text-xs text-gray-500">Weeks remaining</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentCheckIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Evidence</p>
              <p className="text-2xl font-semibold text-gray-900">{workflow.checks.reduce((acc, check) => acc + (check.evidence?.length || 0), 0)}</p>
              <p className="text-xs text-gray-500">Documents collected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Progress by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {categoryProgress.map(({ category, name, Icon, completed, total, percentage }) => (
            <div key={category} className="text-center">
              <div className="mx-auto w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-3">
                <Icon className="h-8 w-8 text-gray-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">{name}</h4>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                      {percentage}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
              </div>
              <p className="text-xs text-gray-500">{completed}/{total} complete</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Findings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Key Findings</h3>
        <div className="space-y-3">
          {workflow.keyFindings.map((finding, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
              </div>
              <p className="ml-3 text-sm text-gray-700">{finding}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
        <div className="space-y-3">
          {workflow.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
              </div>
              <p className="ml-3 text-sm text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button className="btn-primary">
          View Detailed Checklist
        </button>
        <button className="btn-secondary">
          Generate Report
        </button>
        <button className="btn-secondary">
          Schedule Review Meeting
        </button>
      </div>
    </div>
  );
}