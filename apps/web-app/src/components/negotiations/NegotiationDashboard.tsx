'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
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
      {/* Header - Practical UI: bold headings, proper spacing */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text-primary font-heading leading-tight">Deal negotiation</h2>
            <p className="text-base font-normal text-text-secondary mt-2 leading-relaxed">
              Strategic Analytics Core × Healthcare AI Innovation Team
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-bold ${getStatusColor(deal.status)}`}>
                {progress.currentStage}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-bold ${getPriorityColor(deal.priority)}`}>
                {deal.priority.toUpperCase()} Priority
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-bold ${getRiskColor(riskLevel)}`}>
                {riskLevel.toUpperCase()} Risk
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-text-tertiary">Target close date</div>
            <div className="text-lg font-bold text-text-primary mt-1">
              {new Date(deal.targetCloseDate).toLocaleDateString()}
            </div>
            <div className={`text-sm font-normal mt-1 ${progress.daysToTarget < 7 ? 'text-error' : progress.daysToTarget < 14 ? 'text-gold' : 'text-success'}`}>
              {progress.daysToTarget} days remaining
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics - Practical UI: consistent card styling */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center">
              <ChartBarIcon className="h-6 w-6 text-navy" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-tertiary truncate">Progress</p>
              <p className="text-xl font-bold text-text-primary mt-1">{progress.overallProgress}%</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm font-normal text-text-tertiary">Stage {deal.currentRound} of 5</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center">
              <ArrowPathIcon className="h-6 w-6 text-gold" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-tertiary truncate">Rounds</p>
              <p className="text-xl font-bold text-text-primary mt-1">{deal.currentRound}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm font-normal text-text-tertiary">{progress.completedRounds} completed</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center">
              <CurrencyDollarIcon className="h-6 w-6 text-success" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-tertiary truncate">Package value</p>
              <p className="text-xl font-bold text-text-primary mt-1">
                {formatCurrency(deal.currentTermSheet.compensation.totalPackageEstimate.year1)}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm font-normal text-text-tertiary">Year 1 estimate</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 text-gold" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-tertiary truncate">Team size</p>
              <p className="text-xl font-bold text-text-primary mt-1">{deal.currentTermSheet.employment.roleDefinitions.length}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm font-normal text-text-tertiary">Members</span>
          </div>
        </div>
      </div>

      {/* Current Term Sheet Summary */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-6">Current term sheet (v{deal.currentTermSheet.version})</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Compensation */}
          <div>
            <h4 className="text-base font-bold text-text-secondary mb-3 flex items-center gap-2">
              <CurrencyDollarIcon className="h-5 w-5" aria-hidden="true" />
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
            <h4 className="text-base font-bold text-text-secondary mb-3 flex items-center gap-2">
              <DocumentTextIcon className="h-5 w-5" aria-hidden="true" />
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
            <h4 className="text-base font-bold text-text-secondary mb-3 flex items-center gap-2">
              <ScaleIcon className="h-5 w-5" aria-hidden="true" />
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

        <div className="mt-6 p-4 bg-bg-alt rounded-xl">
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
        <h3 className="text-lg font-bold text-text-primary mb-6">Recent negotiation activity</h3>

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
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <CalendarDaysIcon className="h-5 w-5 text-navy" aria-hidden="true" />
          Next steps
        </h3>
        <div className="space-y-3">
          {deal.negotiationRounds[deal.currentRound - 1]?.nextSteps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-navy rounded-full"></div>
              </div>
              <p className="ml-3 text-base text-text-secondary">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons - Practical UI: 48px touch targets */}
      <div className="flex flex-wrap gap-4">
        <button onClick={() => toast.success('Feature coming soon')} className="btn-primary min-h-12 transition-colors duration-fast">
          View full term sheet
        </button>
        <button onClick={() => toast.success('Feature coming soon')} className="btn-outline min-h-12 transition-colors duration-fast">
          Schedule meeting
        </button>
        <button onClick={() => toast.success('Feature coming soon')} className="btn-outline min-h-12 transition-colors duration-fast">
          Generate status report
        </button>
        <button onClick={() => toast.success('Feature coming soon')} className="btn-outline min-h-12 transition-colors duration-fast">
          Update timeline
        </button>
      </div>
    </div>
  );
}