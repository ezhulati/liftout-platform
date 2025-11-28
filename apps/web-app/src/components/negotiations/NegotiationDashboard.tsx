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
        <div className="h-8 bg-bg-alt rounded w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-bg-alt rounded"></div>
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
      case 'finalized': return 'text-success-dark bg-success-light';
      case 'negotiating': return 'text-navy bg-navy-50';
      case 'legal_review': return 'text-gold-800 bg-gold-100';
      case 'cancelled': return 'text-error-dark bg-error-light';
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-error-dark bg-error-light';
      case 'medium': return 'text-gold-800 bg-gold-100';
      case 'low': return 'text-success-dark bg-success-light';
      default: return 'text-text-secondary bg-bg-alt';
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
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Deal negotiation</h2>
            <p className="text-text-secondary mt-1">
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
            <div className="text-sm text-text-tertiary">Target close date</div>
            <div className="text-lg font-semibold text-text-primary">
              {new Date(deal.targetCloseDate).toLocaleDateString()}
            </div>
            <div className={`text-sm ${progress.daysToTarget < 7 ? 'text-error' : progress.daysToTarget < 14 ? 'text-gold' : 'text-success'}`}>
              {progress.daysToTarget} days remaining
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-navy" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-text-tertiary">Progress</p>
              <p className="text-2xl font-semibold text-text-primary">{progress.overallProgress}%</p>
              <p className="text-xs text-text-tertiary">Stage {deal.currentRound} of 5</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowPathIcon className="h-8 w-8 text-gold" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-text-tertiary">Rounds</p>
              <p className="text-2xl font-semibold text-text-primary">{deal.currentRound}</p>
              <p className="text-xs text-text-tertiary">{progress.completedRounds} completed</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-success" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-text-tertiary">Package value</p>
              <p className="text-2xl font-semibold text-text-primary">
                {formatCurrency(deal.currentTermSheet.compensation.totalPackageEstimate.year1)}
              </p>
              <p className="text-xs text-text-tertiary">Year 1 estimate</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-gold" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-text-tertiary">Team size</p>
              <p className="text-2xl font-semibold text-text-primary">{deal.currentTermSheet.employment.roleDefinitions.length}</p>
              <p className="text-xs text-text-tertiary">Members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Term Sheet Summary */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-text-primary mb-6">Current term sheet (v{deal.currentTermSheet.version})</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Compensation */}
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-3 flex items-center">
              <CurrencyDollarIcon className="h-4 w-4 mr-2" />
              Compensation
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Base salary:</span>
                <span className="font-medium text-text-primary">
                  {formatCurrency(deal.currentTermSheet.compensation.baseSalaryRange.min)} - {formatCurrency(deal.currentTermSheet.compensation.baseSalaryRange.max)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Signing bonus:</span>
                <span className="font-medium text-text-primary">{formatCurrency(deal.currentTermSheet.compensation.signingBonus || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Equity:</span>
                <span className="font-medium text-text-primary">{deal.currentTermSheet.compensation.equityPackage?.percentage}% options</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Target bonus:</span>
                <span className="font-medium text-text-primary">{formatCurrency(deal.currentTermSheet.compensation.performanceBonus?.target || 0)}</span>
              </div>
            </div>
          </div>

          {/* Employment Terms */}
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-3 flex items-center">
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Employment
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Start date:</span>
                <span className="font-medium text-text-primary">{new Date(deal.currentTermSheet.employment.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Notice period:</span>
                <span className="font-medium text-text-primary">{deal.currentTermSheet.employment.noticePeriod} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Work style:</span>
                <span className="font-medium text-text-primary">{deal.currentTermSheet.employment.workLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Vacation:</span>
                <span className="font-medium text-text-primary">{deal.currentTermSheet.compensation.benefits.vacationDays} days</span>
              </div>
            </div>
          </div>

          {/* Legal & Transition */}
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-3 flex items-center">
              <ScaleIcon className="h-4 w-4 mr-2" />
              Legal & transition
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Non-compete:</span>
                <span className="font-medium text-text-primary">{deal.currentTermSheet.legal.nonCompete.required ? 'Required' : 'Waived'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">NDA:</span>
                <span className="font-medium text-text-primary">{deal.currentTermSheet.legal.nda.required ? 'Required' : 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Relocation:</span>
                <span className="font-medium text-text-primary">{deal.currentTermSheet.transition.relocationSupport?.provided ? formatCurrency(deal.currentTermSheet.transition.relocationSupport.allowance || 0) : 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Transition:</span>
                <span className="font-medium text-text-primary">{deal.currentTermSheet.transition.transitionPeriod} weeks</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-bg-alt rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">Term sheet status:</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              deal.currentTermSheet.status === 'accepted' ? 'bg-success-light text-success-dark' :
              deal.currentTermSheet.status === 'under_review' ? 'bg-navy-50 text-navy-800' :
              deal.currentTermSheet.status === 'rejected' ? 'bg-error-light text-error-dark' :
              'bg-gold-100 text-gold-800'
            }`}>
              {deal.currentTermSheet.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-text-primary mb-6">Recent negotiation activity</h3>

        <div className="space-y-4">
          {deal.negotiationRounds.slice(-3).reverse().map((round) => (
            <div key={round.round} className="border-l-4 border-navy pl-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-text-primary">Round {round.round}</h4>
                <span className="text-xs text-text-tertiary">{new Date(round.startDate).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-text-secondary mt-1">
                {round.proposals.length} proposals • {round.meetings.length} meetings • {round.decisions.length} decisions
              </p>
              <div className="mt-2 flex items-center space-x-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  round.status === 'completed' ? 'bg-success-light text-success-dark' :
                  round.status === 'active' ? 'bg-navy-50 text-navy-800' :
                  'bg-gold-100 text-gold-800'
                }`}>
                  {round.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
          <CalendarDaysIcon className="h-5 w-5 mr-2 text-navy" />
          Next steps
        </h3>
        <div className="space-y-3">
          {deal.negotiationRounds[deal.currentRound - 1]?.nextSteps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-navy rounded-full"></div>
              </div>
              <p className="ml-3 text-sm text-text-secondary">{step}</p>
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