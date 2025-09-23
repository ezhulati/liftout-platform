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
        <div className="h-8 bg-gray-200 rounded w-64"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!deal) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'under_review':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'countered':
        return <ArrowPathIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'under_review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'countered':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
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
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Term Sheet Management</h3>
            <p className="text-sm text-gray-500 mt-1">
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
              Edit Term Sheet
            </button>
          </div>
        </div>
      </div>

      {/* Current Term Sheet */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-md font-medium text-gray-900 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-500" />
            Term Sheet v{deal.currentTermSheet.version}
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            Created by {deal.currentTermSheet.createdBy} on {new Date(deal.currentTermSheet.createdDate).toLocaleDateString()}
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Compensation Details */}
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                <CurrencyDollarIcon className="h-4 w-4 mr-2 text-green-500" />
                Compensation Package
              </h5>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h6 className="text-sm font-medium text-gray-700 mb-3">Base Compensation</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salary Range:</span>
                      <span className="font-medium">
                        {formatCurrency(deal.currentTermSheet.compensation.baseSalaryRange.min)} - {formatCurrency(deal.currentTermSheet.compensation.baseSalaryRange.max)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Signing Bonus:</span>
                      <span className="font-medium">{formatCurrency(deal.currentTermSheet.compensation.signingBonus || 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h6 className="text-sm font-medium text-gray-700 mb-3">Equity & Incentives</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Equity Package:</span>
                      <span className="font-medium">
                        {formatPercentage(deal.currentTermSheet.compensation.equityPackage?.percentage || 0)} {deal.currentTermSheet.compensation.equityPackage?.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vesting:</span>
                      <span className="font-medium">{deal.currentTermSheet.compensation.equityPackage?.vestingSchedule}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Performance Bonus:</span>
                      <span className="font-medium">
                        {formatCurrency(deal.currentTermSheet.compensation.performanceBonus?.target || 0)} target
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h6 className="text-sm font-medium text-gray-700 mb-3">Benefits</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vacation Days:</span>
                      <span className="font-medium">{deal.currentTermSheet.compensation.benefits.vacationDays} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Professional Development:</span>
                      <span className="font-medium">{formatCurrency(deal.currentTermSheet.compensation.benefits.professionalDevelopment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Health Insurance:</span>
                      <span className="font-medium">{deal.currentTermSheet.compensation.benefits.healthInsurance ? 'Included' : 'Not included'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h6 className="text-sm font-medium text-blue-900 mb-3">Total Package Estimate</h6>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Year 1:</span>
                      <span className="font-semibold text-blue-900">{formatCurrency(deal.currentTermSheet.compensation.totalPackageEstimate.year1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Year 2:</span>
                      <span className="font-semibold text-blue-900">{formatCurrency(deal.currentTermSheet.compensation.totalPackageEstimate.year2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Year 3:</span>
                      <span className="font-semibold text-blue-900">{formatCurrency(deal.currentTermSheet.compensation.totalPackageEstimate.year3)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment & Legal Terms */}
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                <UserGroupIcon className="h-4 w-4 mr-2 text-blue-500" />
                Employment & Legal Terms
              </h5>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h6 className="text-sm font-medium text-gray-700 mb-3">Employment Details</h6>
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
                      <span className="text-gray-600">Work Location:</span>
                      <span className="font-medium">{deal.currentTermSheet.employment.workLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reporting To:</span>
                      <span className="font-medium">{deal.currentTermSheet.employment.reportingManager}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h6 className="text-sm font-medium text-gray-700 mb-3">Legal Terms</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Non-Compete:</span>
                      <span className="font-medium">
                        {deal.currentTermSheet.legal.nonCompete.required 
                          ? `${deal.currentTermSheet.legal.nonCompete.duration} months` 
                          : 'Waived'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Non-Solicitation:</span>
                      <span className="font-medium">
                        {deal.currentTermSheet.legal.nonSolicitation.required 
                          ? `${deal.currentTermSheet.legal.nonSolicitation.duration} months` 
                          : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">NDA Required:</span>
                      <span className="font-medium">{deal.currentTermSheet.legal.nda.required ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IP Assignment:</span>
                      <span className="font-medium">{deal.currentTermSheet.legal.ipAssignment ? 'Required' : 'None'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h6 className="text-sm font-medium text-gray-700 mb-3">Transition Support</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transition Period:</span>
                      <span className="font-medium">{deal.currentTermSheet.transition.transitionPeriod} weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Relocation Support:</span>
                      <span className="font-medium">
                        {deal.currentTermSheet.transition.relocationSupport?.provided 
                          ? formatCurrency(deal.currentTermSheet.transition.relocationSupport.allowance || 0)
                          : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Employer Notice:</span>
                      <span className="font-medium">{deal.currentTermSheet.transition.currentEmployerNotice} days</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h6 className="text-sm font-medium text-gray-700 mb-3">Performance & Development</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Review Cycle:</span>
                      <span className="font-medium">{deal.currentTermSheet.performance.reviewCycle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mentorship:</span>
                      <span className="font-medium">{deal.currentTermSheet.performance.careerDevelopment.mentorship ? 'Included' : 'None'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Training Budget:</span>
                      <span className="font-medium">{formatCurrency(deal.currentTermSheet.performance.careerDevelopment.trainingBudget || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Terms */}
          {deal.currentTermSheet.additionalTerms.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h5 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                <ClipboardDocumentIcon className="h-4 w-4 mr-2 text-purple-500" />
                Additional Terms
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deal.currentTermSheet.additionalTerms.map((term, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="text-sm font-medium text-gray-700">{term.category}</h6>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        term.priority === 'high' ? 'bg-red-100 text-red-800' :
                        term.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {term.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{term.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{term.negotiable ? 'Negotiable' : 'Fixed'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <button className="btn-primary">
          Accept Term Sheet
        </button>
        <button className="btn-secondary">
          Request Changes
        </button>
        <button className="btn-secondary">
          Generate Counter-Proposal
        </button>
        <button className="btn-secondary">
          Export PDF
        </button>
      </div>
    </div>
  );
}