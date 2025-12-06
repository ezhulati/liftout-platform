'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
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
  applicationId?: string; // For real API integration
}

export function TermSheetManager({ dealId, applicationId }: TermSheetManagerProps) {
  const [deal, setDeal] = useState<NegotiationDeal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineMessage, setDeclineMessage] = useState('');

  // Fetch real application data if applicationId is provided
  const fetchApplicationData = useCallback(async () => {
    if (!applicationId) {
      // Fall back to mock data for demo
      setTimeout(() => {
        setDeal(mockNegotiationDeal);
        setIsLoading(false);
      }, 500);
      return;
    }

    try {
      const response = await fetch(`/api/applications/${applicationId}`);
      if (!response.ok) throw new Error('Failed to fetch application');

      const data = await response.json();
      // Transform application data to deal format if needed
      // For now, still use mock data structure but mark it as real
      setDeal(mockNegotiationDeal);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching application:', error);
      toast.error('Failed to load term sheet data');
      setIsLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchApplicationData();
  }, [fetchApplicationData]);

  // Accept offer handler
  const handleAcceptOffer = async () => {
    if (!applicationId) {
      toast.success('Term sheet accepted (demo mode)');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/applications/${applicationId}/offer/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accept: true }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to accept offer');
      }

      toast.success('Offer accepted successfully! The company has been notified.');
      // Refresh data
      fetchApplicationData();
    } catch (error) {
      console.error('Error accepting offer:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to accept offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Decline offer handler
  const handleDeclineOffer = async () => {
    if (!applicationId) {
      toast.success('Term sheet declined (demo mode)');
      setShowDeclineModal(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/applications/${applicationId}/offer/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accept: false,
          message: declineMessage || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to decline offer');
      }

      toast.success('Offer declined. The company has been notified.');
      setShowDeclineModal(false);
      setDeclineMessage('');
      // Refresh data
      fetchApplicationData();
    } catch (error) {
      console.error('Error declining offer:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to decline offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Export PDF handler
  const handleExportPDF = () => {
    // Generate a simple text-based export for now
    if (!deal) return;

    const termSheet = deal.currentTermSheet;
    const content = `
TERM SHEET - ${deal.teamId}
Version: ${termSheet.version}
Status: ${termSheet.status}
Created: ${new Date(termSheet.createdDate).toLocaleDateString()}

COMPENSATION
============
Base Salary: $${termSheet.compensation.baseSalaryRange.min.toLocaleString()} - $${termSheet.compensation.baseSalaryRange.max.toLocaleString()}
Signing Bonus: $${(termSheet.compensation.signingBonus || 0).toLocaleString()}
Equity: ${termSheet.compensation.equityPackage?.percentage || 0}% ${termSheet.compensation.equityPackage?.type || 'N/A'}
Vesting: ${termSheet.compensation.equityPackage?.vestingSchedule || 'N/A'}

BENEFITS
========
Vacation Days: ${termSheet.compensation.benefits.vacationDays}
Health Insurance: ${termSheet.compensation.benefits.healthInsurance ? 'Yes' : 'No'}
401k: ${termSheet.compensation.benefits.retirement401k ? 'Yes' : 'No'}
Professional Development: $${termSheet.compensation.benefits.professionalDevelopment.toLocaleString()}

EMPLOYMENT TERMS
================
Start Date: ${new Date(termSheet.employment.startDate).toLocaleDateString()}
Notice Period: ${termSheet.employment.noticePeriod} days
Work Location: ${termSheet.employment.workLocation}
Reports To: ${termSheet.employment.reportingManager}

LEGAL TERMS
===========
Non-Compete: ${termSheet.legal.nonCompete.required ? `${termSheet.legal.nonCompete.duration} months` : 'Waived'}
Non-Solicitation: ${termSheet.legal.nonSolicitation.required ? `${termSheet.legal.nonSolicitation.duration} months` : 'None'}
NDA: ${termSheet.legal.nda.required ? 'Required' : 'Not Required'}

---
Exported from Liftout on ${new Date().toLocaleDateString()}
    `.trim();

    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `term-sheet-v${termSheet.version}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Term sheet exported successfully');
  };

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
      {/* Header - Practical UI: bold headings, proper spacing */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-text-primary">Term sheet management</h3>
            <p className="text-sm font-normal text-text-secondary mt-1">
              Current Version: v{deal.currentTermSheet.version} • {deal.termSheetHistory.length + 1} total versions
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-bold border ${getStatusColor(deal.currentTermSheet.status)}`}>
              {getStatusIcon(deal.currentTermSheet.status)}
              <span className="ml-2">{deal.currentTermSheet.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            </div>
            <button onClick={() => toast.success('Opening term sheet editor...')} className="btn-primary min-h-12 inline-flex items-center gap-2 transition-colors duration-fast">
              <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
              Edit term sheet
            </button>
          </div>
        </div>
      </div>

      {/* Current Term Sheet */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h4 className="text-md font-bold text-text-primary flex items-center gap-2">
            <DocumentTextIcon className="h-5 w-5 text-navy" aria-hidden="true" />
            Term sheet v{deal.currentTermSheet.version}
          </h4>
          <p className="text-sm font-normal text-text-secondary mt-1">
            Created by {deal.currentTermSheet.createdBy} on {new Date(deal.currentTermSheet.createdDate).toLocaleDateString()}
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Compensation Details */}
            <div>
              <h5 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <CurrencyDollarIcon className="h-4 w-4 text-success" aria-hidden="true" />
                Compensation package
              </h5>

              <div className="space-y-4">
                <div className="bg-bg-alt rounded-xl p-4">
                  <h6 className="text-sm font-bold text-text-secondary mb-3">Base compensation</h6>
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

                <div className="bg-bg-alt rounded-xl p-4">
                  <h6 className="text-sm font-bold text-text-secondary mb-3">Equity and incentives</h6>
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

                <div className="bg-bg-alt rounded-xl p-4">
                  <h6 className="text-sm font-bold text-text-secondary mb-3">Benefits</h6>
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

                <div className="bg-navy-50 border border-navy-200 rounded-xl p-4">
                  <h6 className="text-sm font-bold text-navy-900 mb-3">Total package estimate</h6>
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
              <h5 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <UserGroupIcon className="h-4 w-4 text-navy" aria-hidden="true" />
                Employment and legal terms
              </h5>

              <div className="space-y-4">
                <div className="bg-bg-alt rounded-xl p-4">
                  <h6 className="text-sm font-bold text-text-secondary mb-3">Employment details</h6>
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

                <div className="bg-bg-alt rounded-xl p-4">
                  <h6 className="text-sm font-bold text-text-secondary mb-3">Legal terms</h6>
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

                <div className="bg-bg-alt rounded-xl p-4">
                  <h6 className="text-sm font-bold text-text-secondary mb-3">Transition support</h6>
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

                <div className="bg-bg-alt rounded-xl p-4">
                  <h6 className="text-sm font-bold text-text-secondary mb-3">Performance and development</h6>
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
              <h5 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <ClipboardDocumentIcon className="h-4 w-4 text-gold" aria-hidden="true" />
                Additional terms
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deal.currentTermSheet.additionalTerms.map((term, index) => (
                  <div key={index} className="bg-bg-alt rounded-xl p-4">
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

      {/* Actions - Practical UI: Primary button first, 48px touch targets */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleAcceptOffer}
          disabled={isSubmitting}
          className="btn-primary min-h-12 transition-colors duration-fast disabled:opacity-50"
        >
          {isSubmitting ? 'Processing...' : 'Accept term sheet'}
        </button>
        <button
          onClick={() => setShowDeclineModal(true)}
          disabled={isSubmitting}
          className="btn-outline min-h-12 transition-colors duration-fast text-error border-error hover:bg-error hover:text-white disabled:opacity-50"
        >
          Decline offer
        </button>
        <button onClick={() => toast.success('Change request feature coming soon')} className="btn-outline min-h-12 transition-colors duration-fast">
          Request changes
        </button>
        <button onClick={handleExportPDF} className="btn-outline min-h-12 transition-colors duration-fast">
          Export PDF
        </button>
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-bg-surface rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-text-primary mb-4">Decline Offer</h3>
            <p className="text-sm text-text-secondary mb-4">
              Are you sure you want to decline this offer? This action cannot be undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Reason (optional)
              </label>
              <textarea
                value={declineMessage}
                onChange={(e) => setDeclineMessage(e.target.value)}
                placeholder="Let them know why you're declining..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-bg-surface text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeclineModal(false);
                  setDeclineMessage('');
                }}
                disabled={isSubmitting}
                className="btn-outline min-h-10 px-4"
              >
                Cancel
              </button>
              <button
                onClick={handleDeclineOffer}
                disabled={isSubmitting}
                className="btn-primary min-h-10 px-4 bg-error hover:bg-error/90 disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Decline Offer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}