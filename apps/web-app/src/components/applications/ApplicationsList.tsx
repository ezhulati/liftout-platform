'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import type { Application } from '@/types/applications';
import { applicationService } from '@/lib/services/applicationService';

interface ApplicationsListProps {
  applications: Application[];
  isCompanyUser: boolean;
  onRefresh: () => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const statusColors = {
  pending: 'bg-gold-100 text-gold-800',
  under_review: 'bg-navy-50 text-navy-800',
  interview_scheduled: 'bg-gold-100 text-gold-800',
  accepted: 'bg-success-light text-success-dark',
  rejected: 'bg-error-light text-error-dark',
  withdrawn: 'bg-bg-alt text-text-secondary',
};

const statusIcons = {
  pending: ClockIcon,
  under_review: EyeIcon,
  interview_scheduled: CalendarIcon,
  accepted: CheckCircleIcon,
  rejected: XCircleIcon,
  withdrawn: XCircleIcon,
};

// Demo opportunity titles mapping
const opportunityTitles: Record<string, string> = {
  'opp_001': 'Lead FinTech Analytics Division at NextGen Financial',
  'opp_002': 'Healthcare AI Innovation Lab at MedTech Innovations',
  'opp_003': 'European Market Expansion Team at Confidential Fortune 500',
  'opp_004': 'Senior Quantitative Analysts at DataFlow Analytics',
  'opp_005': 'Enterprise Analytics Transformation at GlobalCorp',
  'opp_ng_002': 'AI Research Division at NextGen Financial',
};

const getOpportunityTitle = (opportunityId: string): string => {
  return opportunityTitles[opportunityId] || `Application #${opportunityId.slice(-6)}`;
};

export function ApplicationsList({ applications, isCompanyUser, onRefresh }: ApplicationsListProps) {
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const handleStatusUpdate = async (applicationId: string, newStatus: Application['status']) => {
    setUpdatingStatus(applicationId);
    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus);
      toast.success('Application status updated');
      onRefresh();
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleMarkAsViewed = async (applicationId: string) => {
    try {
      await applicationService.markAsViewed(applicationId);
      onRefresh();
    } catch (error) {
      console.error('Error marking as viewed:', error);
    }
  };

  const handleWithdraw = async (applicationId: string) => {
    if (confirm('Are you sure you want to withdraw this application?')) {
      try {
        await applicationService.withdrawApplication(applicationId);
        toast.success('Application withdrawn');
        onRefresh();
      } catch (error) {
        toast.error('Failed to withdraw application');
        console.error('Error withdrawing application:', error);
      }
    }
  };

  if (applications.length === 0) {
    return (
      <div className="card p-6">
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-text-tertiary" />
          <h3 className="mt-4 text-lg font-medium text-text-primary">
            {isCompanyUser ? 'No applications yet' : 'No applications submitted'}
          </h3>
          <p className="mt-2 text-sm text-text-secondary">
            {isCompanyUser
              ? 'When teams express interest in your opportunities, they\'ll appear here.'
              : 'Applications you submit to liftout opportunities will be tracked here.'
            }
          </p>
          <div className="mt-6">
            <Link
              href={isCompanyUser ? "/app/opportunities/create" : "/app/opportunities"}
              className="btn-primary"
            >
              {isCompanyUser ? 'Post your first opportunity' : 'Browse opportunities'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => {
        const StatusIcon = statusIcons[application.status];

        return (
          <div key={application.id} className="card hover:shadow-md transition-shadow duration-fast">
            <div className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <StatusIcon className="h-5 w-5 text-text-tertiary" />
                    <span className={classNames(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      statusColors[application.status]
                    )}>
                      {application.status.replace('_', ' ')}
                    </span>
                    {isCompanyUser && !application.viewedByCompany && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error-light text-error-dark">
                        New
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    {getOpportunityTitle(application.opportunityId)}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-text-secondary mb-4">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      <span>
                        Submitted {formatDistanceToNow(application.submittedAt, { addSuffix: true })}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-2" />
                      <span>Team ID: {application.teamId.slice(-6)}</span>
                    </div>

                    {application.compensationExpectations && (
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                        <span>
                          {application.compensationExpectations.currency} {application.compensationExpectations.min.toLocaleString()} - {application.compensationExpectations.max.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {application.viewedAt && (
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-2" />
                        <span>
                          Viewed {formatDistanceToNow(application.viewedAt, { addSuffix: true })}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="prose prose-sm max-w-none">
                    <p className="text-text-secondary line-clamp-3 mb-2">
                      <strong className="text-text-primary">Cover letter:</strong> {application.coverLetter}
                    </p>
                    <p className="text-text-secondary line-clamp-2">
                      <strong className="text-text-primary">Availability:</strong> {application.availabilityTimeline}
                    </p>
                  </div>
                </div>

                <div className="ml-6 flex flex-col space-y-2">
                  {isCompanyUser ? (
                    <>
                      {!application.viewedByCompany && (
                        <button
                          onClick={() => handleMarkAsViewed(application.id)}
                          className="btn-secondary text-xs"
                        >
                          Mark as Viewed
                        </button>
                      )}
                      
                      {application.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(application.id, 'under_review')}
                            disabled={updatingStatus === application.id}
                            className="btn-primary text-xs"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(application.id, 'rejected')}
                            disabled={updatingStatus === application.id}
                            className="btn-danger text-xs"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      
                      {application.status === 'under_review' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(application.id, 'interview_scheduled')}
                            disabled={updatingStatus === application.id}
                            className="btn-primary text-xs"
                          >
                            Schedule Interview
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(application.id, 'accepted')}
                            disabled={updatingStatus === application.id}
                            className="btn-success text-xs"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(application.id, 'rejected')}
                            disabled={updatingStatus === application.id}
                            className="btn-danger text-xs"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      
                      {application.status === 'interview_scheduled' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(application.id, 'accepted')}
                            disabled={updatingStatus === application.id}
                            className="btn-success text-xs"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(application.id, 'rejected')}
                            disabled={updatingStatus === application.id}
                            className="btn-danger text-xs"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      
                      <button className="btn-secondary text-xs flex items-center">
                        <ChatBubbleLeftRightIcon className="h-3 w-3 mr-1" />
                        Message
                      </button>
                    </>
                  ) : (
                    <>
                      {application.status === 'pending' && (
                        <button
                          onClick={() => handleWithdraw(application.id)}
                          className="btn-danger text-xs"
                        >
                          Withdraw
                        </button>
                      )}
                      
                      <button className="btn-secondary text-xs flex items-center">
                        <ChatBubbleLeftRightIcon className="h-3 w-3 mr-1" />
                        Message Company
                      </button>
                      
                      <Link
                        href={`/app/opportunities/${application.opportunityId}`}
                        className="btn-secondary text-xs text-center"
                      >
                        View Opportunity
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}