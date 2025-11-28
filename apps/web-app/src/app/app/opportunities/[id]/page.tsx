'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  EyeIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Opportunity {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  teamSize: number;
  location: string;
  remote: boolean;
  industry: string;
  type: 'expansion' | 'capability' | 'market_entry' | 'acquisition';
  compensation: {
    type: 'salary' | 'total_package' | 'equity';
    range: string;
    equity?: boolean;
    benefits?: string;
  };
  requirements: string[];
  responsibilities: string[];
  strategicRationale: string;
  integrationPlan: string;
  deadline: string;
  status: 'open' | 'in_review' | 'closed';
  postedAt: string;
  applicants: number;
  views: number;
  isConfidential?: boolean;
}

const typeLabels: Record<string, string> = {
  expansion: 'Team Expansion',
  capability: 'Capability Building',
  market_entry: 'Market Entry',
  acquisition: 'Strategic Acquisition',
};

const typeColors: Record<string, string> = {
  expansion: 'bg-success-light text-success',
  capability: 'bg-navy-50 text-navy',
  market_entry: 'bg-gold-light text-gold-dark',
  acquisition: 'bg-navy-100 text-navy-dark',
};

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  const fetchOpportunity = useCallback(async () => {
    if (!params?.id) return;
    try {
      const response = await fetch(`/api/opportunities/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch opportunity');
      }
      const data = await response.json();
      setOpportunity(data.opportunity);
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      toast.error('Failed to load opportunity details');
    } finally {
      setLoading(false);
    }
  }, [params?.id]);

  useEffect(() => {
    if (params?.id) {
      fetchOpportunity();
    }
  }, [params?.id, fetchOpportunity]);

  const handleApply = async () => {
    if (!opportunity) return;

    setApplying(true);
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          opportunityId: opportunity.id,
          opportunityTitle: opportunity.title,
          company: opportunity.company,
          coverLetter,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
      setCoverLetter('');
      router.push('/app/applications');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleExpressInterest = async () => {
    if (!opportunity) return;

    try {
      const response = await fetch('/api/applications/eoi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toType: 'company',
          toId: opportunity.company.toLowerCase().replace(/\s+/g, '_'),
          toName: opportunity.company,
          opportunityId: opportunity.id,
          opportunityTitle: opportunity.title,
          message: `I am interested in the ${opportunity.title} opportunity.`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to express interest');
      }

      toast.success('Interest expressed successfully!');
    } catch (error) {
      console.error('Error expressing interest:', error);
      toast.error('Failed to express interest');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-bg-surface p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Opportunity Not Found</h1>
          <p className="text-text-secondary mb-6">
            The opportunity you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/app/opportunities"
            className="btn-primary min-h-12 inline-flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to opportunities
          </Link>
        </div>
      </div>
    );
  }

  const daysUntilDeadline = Math.ceil(
    (new Date(opportunity.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-bg-surface">
      <div className="max-w-6xl mx-auto p-6">
        {/* Back Navigation */}
        <Link
          href="/app/opportunities"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-navy transition-colors mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Opportunities
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-bg-elevated rounded-lg border border-border p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BuildingOffice2Icon className="w-8 h-8 text-navy" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[opportunity.type]}`}>
                        {typeLabels[opportunity.type]}
                      </span>
                      {opportunity.isConfidential && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-text-tertiary/20 text-text-secondary">
                          Confidential
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">{opportunity.title}</h1>
                    <p className="text-text-secondary text-lg">{opportunity.company}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  opportunity.status === 'open'
                    ? 'bg-success-light text-success'
                    : opportunity.status === 'in_review'
                    ? 'bg-gold-light text-gold-dark'
                    : 'bg-text-tertiary/20 text-text-secondary'
                }`}>
                  {opportunity.status === 'open' ? 'Open' : opportunity.status === 'in_review' ? 'In Review' : 'Closed'}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-border">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-text-tertiary" />
                  <div>
                    <p className="text-xs text-text-tertiary">Location</p>
                    <p className="text-sm font-medium text-text-primary">
                      {opportunity.location}
                      {opportunity.remote && ' (Remote OK)'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-text-tertiary" />
                  <div>
                    <p className="text-xs text-text-tertiary">Team Size</p>
                    <p className="text-sm font-medium text-text-primary">{opportunity.teamSize} members</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BriefcaseIcon className="w-5 h-5 text-text-tertiary" />
                  <div>
                    <p className="text-xs text-text-tertiary">Industry</p>
                    <p className="text-sm font-medium text-text-primary">{opportunity.industry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-text-tertiary" />
                  <div>
                    <p className="text-xs text-text-tertiary">Compensation</p>
                    <p className="text-sm font-medium text-text-primary">{opportunity.compensation.range}</p>
                  </div>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center gap-6 pt-4 text-sm text-text-tertiary">
                <div className="flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" />
                  {opportunity.views} views
                </div>
                <div className="flex items-center gap-1">
                  <UserGroupIcon className="w-4 h-4" />
                  {opportunity.applicants} applicants
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  Posted {new Date(opportunity.postedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-bg-elevated rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">About This Opportunity</h2>
              <p className="text-text-secondary whitespace-pre-wrap">{opportunity.description}</p>
            </div>

            {/* Strategic Rationale */}
            <div className="bg-bg-elevated rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <SparklesIcon className="w-5 h-5 text-gold" />
                <h2 className="text-lg font-semibold text-text-primary">Strategic Rationale</h2>
              </div>
              <p className="text-text-secondary">{opportunity.strategicRationale}</p>
            </div>

            {/* Requirements */}
            <div className="bg-bg-elevated rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircleIcon className="w-5 h-5 text-success" />
                <h2 className="text-lg font-semibold text-text-primary">Requirements</h2>
              </div>
              <ul className="space-y-3">
                {opportunity.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-success-light text-success text-xs font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-text-secondary">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Responsibilities */}
            <div className="bg-bg-elevated rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <ArrowTrendingUpIcon className="w-5 h-5 text-navy" />
                <h2 className="text-lg font-semibold text-text-primary">Responsibilities</h2>
              </div>
              <ul className="space-y-3">
                {opportunity.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-navy-50 text-navy text-xs font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-text-secondary">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Integration Plan */}
            <div className="bg-bg-elevated rounded-lg border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheckIcon className="w-5 h-5 text-navy" />
                <h2 className="text-lg font-semibold text-text-primary">Integration Plan</h2>
              </div>
              <p className="text-text-secondary">{opportunity.integrationPlan}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-bg-elevated rounded-lg border border-border p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Interested?</h3>

              {/* Deadline Warning */}
              {daysUntilDeadline <= 14 && daysUntilDeadline > 0 && (
                <div className="bg-gold-light rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-gold-dark">
                    <ClockIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {daysUntilDeadline} days left to apply
                    </span>
                  </div>
                </div>
              )}

              {daysUntilDeadline <= 0 && (
                <div className="bg-error-light rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-error">
                    <ClockIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Application deadline passed</span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => setShowApplyModal(true)}
                  disabled={opportunity.status !== 'open' || daysUntilDeadline <= 0}
                  className="btn-primary min-h-12 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply with your team
                </button>
                <button
                  onClick={handleExpressInterest}
                  disabled={opportunity.status !== 'open'}
                  className="btn-outline min-h-12 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Express interest
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-sm font-medium text-text-primary mb-3">Compensation Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Type</span>
                    <span className="text-text-secondary capitalize">{opportunity.compensation.type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Range</span>
                    <span className="text-text-secondary font-medium">{opportunity.compensation.range}</span>
                  </div>
                  {opportunity.compensation.equity && (
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Equity</span>
                      <span className="text-success font-medium">Included</span>
                    </div>
                  )}
                  {opportunity.compensation.benefits && (
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Benefits</span>
                      <span className="text-text-secondary">{opportunity.compensation.benefits}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-sm font-medium text-text-primary mb-3">Important Dates</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Posted</span>
                    <span className="text-text-secondary">{new Date(opportunity.postedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Deadline</span>
                    <span className={`font-medium ${daysUntilDeadline <= 7 ? 'text-error' : 'text-text-secondary'}`}>
                      {new Date(opportunity.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-elevated rounded-lg max-w-lg w-full p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Apply for {opportunity.title}</h2>
            <p className="text-text-secondary mb-4">
              Write a cover letter explaining why your team is a great fit for this opportunity.
            </p>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the company about your team's relevant experience, achievements, and why you're interested in this opportunity..."
              className="input-field w-full h-48 resize-none"
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleApply}
                disabled={applying || !coverLetter.trim()}
                className="btn-primary min-h-12 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {applying ? 'Submitting...' : 'Submit application'}
              </button>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-link min-h-12"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
