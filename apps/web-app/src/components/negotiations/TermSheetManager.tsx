'use client';

import { useState, useEffect } from 'react';
import { 
  NegotiationDeal, 
  TermSheet,
  mockNegotiationDeal 
} from '@/lib/negotiations';
import {
  DocumentTextIcon,
  PencilSquareIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ScaleIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';

interface TermSheetManagerProps {
  dealId?: string;
}

export function TermSheetManager({ dealId }: TermSheetManagerProps) {
  const [deal, setDeal] = useState<NegotiationDeal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);

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
        <div className="h-64 bg-bg-alt rounded"></div>
      </div>
    );
  }

  if (!deal) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircleIcon className="h-5 w-5 text-success" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-error" />;
      case 'under_review':
        return <ClockIcon className="h-5 w-5 text-navy" />;
      case 'countered':
        return <ArrowPathIcon className="h-5 w-5 text-gold" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-text-tertiary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-success-light text-success-dark border-success/30';
      case 'rejected':
        return 'bg-error-light text-error-dark border-error/30';
      case 'under_review':
        return 'bg-navy-50 text-navy-700 border-navy-200';
      case 'countered':
        return 'bg-gold-50 text-gold-700 border-gold-200';
      default:
        return 'bg-bg-alt text-text-secondary border-border';
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

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-text-primary">Term sheet management</h3>
            <p className="text-sm text-text-secondary mt-1">
              Current Version: v{deal.currentTermSheet.version} • {deal.termSheetHistory.length + 1} total versions
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(deal.currentTermSheet.status)}`}>
              {getStatusIcon(deal.currentTermSheet.status)}
              <span className="ml-2">{deal.currentTermSheet.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            </div>
            <button className="btn-primary inline-flex items-center">
              <PencilSquareIcon className="h-4 w-4 mr-2" />
              Edit term sheet
            </button>
          </div>
        </div>
      </div>

      {/* Current Term Sheet */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h4 className="text-md font-medium text-text-primary flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2 text-navy" />
            Term sheet v{deal.currentTermSheet.version}
          </h4>
          <p className="text-sm text-text-secondary mt-1">
            Created by {deal.currentTermSheet.createdBy} on {new Date(deal.currentTermSheet.createdDate).toLocaleDateString()}
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Compensation Details */}
            <div>
              <h5 className="text-sm font-medium text-text-primary mb-4 flex items-center">
                <CurrencyDollarIcon className="h-4 w-4 mr-2 text-success" />
                Compensation package
              </h5>

              <div className="space-y-4">
                <div className="bg-bg-alt rounded-lg p-4">
                  <h6 className="text-sm font-medium text-text-secondary mb-3">Base compensation</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Salary range:</span>
                      <span className="font-medium text-text-primary">
                        {formatCurrency(deal.currentTermSheet.compensation.baseSalaryRange.min)} - {formatCurrency(deal.currentTermSheet.compensation.baseSalaryRange.max)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Signing bonus:</span>
                      <span className="font-medium text-text-primary">{formatCurrency(deal.currentTermSheet.compensation.signingBonus || 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-bg-alt rounded-lg p-4">
                  <h6 className="text-sm font-medium text-text-secondary mb-3">Equity and incentives</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Equity package:</span>
                      <span className="font-medium text-text-primary">
                        {formatPercentage(deal.currentTermSheet.compensation.equityPackage?.percentage || 0)} {deal.currentTermSheet.compensation.equityPackage?.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Vesting:</span>
                      <span className="font-medium text-text-primary">{deal.currentTermSheet.compensation.equityPackage?.vestingSchedule}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Performance bonus:</span>
                      <span className="font-medium text-text-primary">
                        {formatCurrency(deal.currentTermSheet.compensation.performanceBonus?.target || 0)} target
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-bg-alt rounded-lg p-4">
                  <h6 className="text-sm font-medium text-text-secondary mb-3">Benefits</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Vacation days:</span>
                      <span className="font-medium text-text-primary">{deal.currentTermSheet.compensation.benefits.vacationDays} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Professional development:</span>
                      <span className="font-medium text-text-primary">{formatCurrency(deal.currentTermSheet.compensation.benefits.professionalDevelopment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Health insurance:</span>
                      <span className="font-medium text-text-primary">{deal.currentTermSheet.compensation.benefits.healthInsurance ? 'Included' : 'Not included'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-navy-50 border border-navy-200 rounded-lg p-4">
                  <h6 className="text-sm font-medium text-navy-900 mb-3">Total package estimate</h6>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-navy-700">Year 1:</span>
                      <span className="font-semibold text-navy-900">{formatCurrency(deal.currentTermSheet.compensation.totalPackageEstimate.year1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy-700">Year 2:</span>
                      <span className="font-semibold text-navy-900">{formatCurrency(deal.currentTermSheet.compensation.totalPackageEstimate.year2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy-700">Year 3:</span>
                      <span className="font-semibold text-navy-900">{formatCurrency(deal.currentTermSheet.compensation.totalPackageEstimate.year3)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment & Legal Terms */}
            <div>
              <h5 className="text-sm font-medium text-text-primary mb-4 flex items-center">
                <UserGroupIcon className="h-4 w-4 mr-2 text-navy" />
                Employment and legal terms
              </h5>

              <div className="space-y-4">
                <div className="bg-bg-alt rounded-lg p-4">
                  <h6 className="text-sm font-medium text-text-secondary mb-3">Employment details</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Start date:</span>
                      <span className="font-medium text-text-primary">{new Date(deal.currentTermSheet.employment.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Notice period:</span>
                      <span className="font-medium text-text-primary">{deal.currentTermSheet.employment.noticePeriod} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Work location:</span>
                      <span className="font-medium text-text-primary">{deal.currentTermSheet.employment.workLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Reporting to:</span>
                      <span className="font-medium text-text-primary">{deal.currentTermSheet.employment.reportingManager}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-bg-alt rounded-lg p-4">
                  <h6 className="text-sm font-medium text-text-secondary mb-3">Legal terms</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Non-compete:</span>
                      <span className="font-medium text-text-primary">
                        {deal.currentTermSheet.legal.nonCompete.required
                          ? `${deal.currentTermSheet.legal.nonCompete.duration} months`
                          : 'Waived'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Non-solicitation:</span>
                      <span className="font-medium text-text-primary">
                        {deal.currentTermSheet.legal.nonSolicitation.required
                          ? `${deal.currentTermSheet.legal.nonSolicitation.duration} months`
                          : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">NDA required:</span>
                      <span className="font-medium text-text-primary">{deal.currentTermSheet.legal.nda.required ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">IP assignment:</span>
                      <span className="font-medium text-text-primary">{deal.currentTermSheet.legal.ipAssignment ? 'Required' : 'None'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-bg-alt rounded-lg p-4">
                  <h6 className="text-sm font-medium text-text-secondary mb-3">Transition support</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Transition period:</span>
                      <span className="font-medium text-text-primary">{deal.currentTermSheet.transition.transitionPeriod} weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Relocation support:</span>
                      <span className="font-medium text-text-primary">
                        {deal.currentTermSheet.transition.relocationSupport?.provided
                          ? formatCurrency(deal.currentTermSheet.transition.relocationSupport.allowance || 0)
                          : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Current employer notice:</span>
                      <span className="font-medium text-text-primary">{deal.currentTermSheet.transition.currentEmployerNotice} days</span>
                    </div>
                  </div>
                </div>

                <div className="bg-bg-alt rounded-lg p-4">
                  <h6 className="text-sm font-medium text-text-secondary mb-3">Performance and development</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Review cycle:</span>
                      <span className="font-medium text-text-primary">{deal.currentTermSheet.performance.reviewCycle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Mentorship:</span>
                      <span className="font-medium text-text-primary">{deal.currentTermSheet.performance.careerDevelopment.mentorship ? 'Included' : 'None'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Training budget:</span>
                      <span className="font-medium text-text-primary">{formatCurrency(deal.currentTermSheet.performance.careerDevelopment.trainingBudget || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Terms */}
          {deal.currentTermSheet.additionalTerms.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border">
              <h5 className="text-sm font-medium text-text-primary mb-4 flex items-center">
                <ClipboardDocumentIcon className="h-4 w-4 mr-2 text-gold" />
                Additional terms
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deal.currentTermSheet.additionalTerms.map((term, index) => (
                  <div key={index} className="bg-bg-alt rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="text-sm font-medium text-text-secondary">{term.category}</h6>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        term.priority === 'high' ? 'bg-error-light text-error-dark' :
                        term.priority === 'medium' ? 'bg-gold-100 text-gold-800' :
                        'bg-success-light text-success-dark'
                      }`}>
                        {term.priority}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">{term.description}</p>
                    <p className="text-xs text-text-tertiary mt-1">{term.negotiable ? 'Negotiable' : 'Fixed'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions - Primary button first per Practical UI */}
      <div className="flex flex-wrap gap-3">
        <button className="btn-primary">
          Accept term sheet
        </button>
        <button className="btn-outline">
          Request changes
        </button>
        <button className="btn-outline">
          Generate counter-proposal
        </button>
        <button className="btn-outline">
          Export PDF
        </button>
      </div>
    </div>
  );
}