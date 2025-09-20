'use client';

import { useState, useEffect } from 'react';
import { 
  NegotiationDeal, 
  calculateNegotiationProgress, 
  assessDealRisk,
  mockNegotiationDeal 
} from '@/lib/negotiations';
import {
  DocumentTextIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ScaleIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface NegotiationDashboardProps {
  dealId?: string;
}

export function NegotiationDashboard({ dealId }: NegotiationDashboardProps) {
  const [deal, setDeal] = useState<NegotiationDeal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setDeal(mockNegotiationDeal);
      setIsLoading(false);
    }, 500);
  }, [dealId]);

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

  if (!deal) return null;

  const progress = calculateNegotiationProgress(deal);
  const riskLevel = assessDealRisk(deal);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'finalized': return 'text-green-600 bg-green-100';
      case 'negotiating': return 'text-blue-600 bg-blue-100';
      case 'legal_review': return 'text-purple-600 bg-purple-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Deal Negotiation</h2>
            <p className="text-gray-600 mt-1">
              Strategic Analytics Core × Healthcare AI Innovation Team
            </p>
            <div className="mt-3 flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(deal.status)}`}>
                {progress.currentStage}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(deal.priority)}`}>
                {deal.priority.toUpperCase()} Priority
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(riskLevel)}`}>
                {riskLevel.toUpperCase()} Risk
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Target Close Date</div>
            <div className="text-lg font-semibold text-gray-900">
              {new Date(deal.targetCloseDate).toLocaleDateString()}
            </div>
            <div className={`text-sm ${progress.daysToTarget < 7 ? 'text-red-600' : progress.daysToTarget < 14 ? 'text-yellow-600' : 'text-green-600'}`}>
              {progress.daysToTarget} days remaining
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{progress.overallProgress}%</p>
              <p className="text-xs text-gray-500">Stage {deal.currentRound} of 5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowPathIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rounds</p>
              <p className="text-2xl font-semibold text-gray-900">{deal.currentRound}</p>
              <p className="text-xs text-gray-500">{progress.completedRounds} completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Package Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(deal.currentTermSheet.compensation.totalPackageEstimate.year1)}
              </p>
              <p className="text-xs text-gray-500">Year 1 estimate</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Team Size</p>
              <p className="text-2xl font-semibold text-gray-900">{deal.currentTermSheet.employment.roleDefinitions.length}</p>
              <p className="text-xs text-gray-500">Members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Term Sheet Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Current Term Sheet (v{deal.currentTermSheet.version})</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Compensation */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <CurrencyDollarIcon className="h-4 w-4 mr-2" />
              Compensation
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Salary:</span>
                <span className="font-medium">
                  {formatCurrency(deal.currentTermSheet.compensation.baseSalaryRange.min)} - {formatCurrency(deal.currentTermSheet.compensation.baseSalaryRange.max)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Signing Bonus:</span>
                <span className="font-medium">{formatCurrency(deal.currentTermSheet.compensation.signingBonus || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Equity:</span>
                <span className="font-medium">{deal.currentTermSheet.compensation.equityPackage?.percentage}% options</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Target Bonus:</span>
                <span className="font-medium">{formatCurrency(deal.currentTermSheet.compensation.performanceBonus?.target || 0)}</span>
              </div>
            </div>
          </div>

          {/* Employment Terms */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Employment
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-medium">{new Date(deal.currentTermSheet.employment.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Notice Period:</span>
                <span className="font-medium">{deal.currentTermSheet.employment.noticePeriod} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Work Style:</span>
                <span className="font-medium">{deal.currentTermSheet.employment.workLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vacation:</span>
                <span className="font-medium">{deal.currentTermSheet.compensation.benefits.vacationDays} days</span>
              </div>
            </div>
          </div>

          {/* Legal & Transition */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <ScaleIcon className="h-4 w-4 mr-2" />
              Legal & Transition
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Non-Compete:</span>
                <span className="font-medium">{deal.currentTermSheet.legal.nonCompete.required ? 'Required' : 'Waived'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">NDA:</span>
                <span className="font-medium">{deal.currentTermSheet.legal.nda.required ? 'Required' : 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Relocation:</span>
                <span className="font-medium">{deal.currentTermSheet.transition.relocationSupport?.provided ? formatCurrency(deal.currentTermSheet.transition.relocationSupport.allowance || 0) : 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transition:</span>
                <span className="font-medium">{deal.currentTermSheet.transition.transitionPeriod} weeks</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Term Sheet Status:</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              deal.currentTermSheet.status === 'accepted' ? 'bg-green-100 text-green-800' :
              deal.currentTermSheet.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
              deal.currentTermSheet.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {deal.currentTermSheet.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Negotiation Activity</h3>
        
        <div className="space-y-4">
          {deal.negotiationRounds.slice(-3).reverse().map((round) => (
            <div key={round.round} className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">Round {round.round}</h4>
                <span className="text-xs text-gray-500">{new Date(round.startDate).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {round.proposals.length} proposals • {round.meetings.length} meetings • {round.decisions.length} decisions
              </p>
              <div className="mt-2 flex items-center space-x-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  round.status === 'completed' ? 'bg-green-100 text-green-800' :
                  round.status === 'active' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {round.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <CalendarDaysIcon className="h-5 w-5 mr-2 text-blue-500" />
          Next Steps
        </h3>
        <div className="space-y-3">
          {deal.negotiationRounds[deal.currentRound - 1]?.nextSteps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              </div>
              <p className="ml-3 text-sm text-gray-700">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button className="btn-primary">
          View Full Term Sheet
        </button>
        <button className="btn-secondary">
          Schedule Meeting
        </button>
        <button className="btn-secondary">
          Generate Status Report
        </button>
        <button className="btn-secondary">
          Update Timeline
        </button>
      </div>
    </div>
  );
}