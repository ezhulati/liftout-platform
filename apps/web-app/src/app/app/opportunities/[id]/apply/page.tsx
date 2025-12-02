'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  teamSize: number;
  compensation: {
    range: string;
  };
  description: string;
}

export default function ApplyToOpportunityPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [teamStrengths, setTeamStrengths] = useState('');
  const [availability, setAvailability] = useState('immediate');
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opportunity || !coverLetter.trim()) return;

    setSubmitting(true);
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
          coverLetter: coverLetter.trim(),
          teamStrengths: teamStrengths.trim(),
          availability,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setSubmitted(true);
      toast.success('Application submitted');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    } finally {
      setSubmitting(false);
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
      <div className="space-y-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Opportunity Not Found</h1>
          <p className="text-text-secondary mb-6">
            The opportunity you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/app/opportunities" className="btn-primary min-h-12 inline-flex items-center gap-2">
            <ArrowLeftIcon className="w-5 h-5" />
            Back to opportunities
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-success-light flex items-center justify-center mb-6">
            <CheckCircleIcon className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-4">Application Submitted!</h1>
          <p className="text-text-secondary mb-2">
            Your expression of interest for <strong>{opportunity.title}</strong> at <strong>{opportunity.company}</strong> has been submitted successfully.
          </p>
          <p className="text-text-tertiary mb-8">
            The company will review your application and get back to you soon. You can track your application status in My Applications.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/app/applications" className="btn-primary min-h-12">
              View My Applications
            </Link>
            <Link href="/app/opportunities" className="btn-outline min-h-12">
              Browse More Opportunities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <Link
          href={`/app/opportunities/${params?.id}`}
          className="inline-flex items-center text-sm font-medium text-text-tertiary hover:text-navy mb-4 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Opportunity
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">Express Interest</h1>
        <p className="text-base text-text-secondary mt-2">
          Submit your team&apos;s expression of interest for this liftout opportunity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Letter */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <DocumentTextIcon className="w-5 h-5 text-navy" />
                <h3 className="text-lg font-semibold text-text-primary">Cover Letter</h3>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Explain why your team is a great fit for this opportunity. Highlight relevant experience, achievements, and what excites you about this role.
              </p>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Dear Hiring Team,

Our team has been working together for [X years] and we believe we're an excellent fit for this opportunity because...

We have experience in [relevant areas] and have successfully delivered [key achievements]...

We're particularly excited about this opportunity because..."
                className="input-field w-full h-56 resize-none"
                required
              />
              <p className="text-xs text-text-tertiary mt-2">
                {coverLetter.length} characters
              </p>
            </div>

            {/* Team Strengths */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <UserGroupIcon className="w-5 h-5 text-navy" />
                <h3 className="text-lg font-semibold text-text-primary">Team Strengths</h3>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                What makes your team unique? Describe your team&apos;s key strengths, how long you&apos;ve worked together, and notable accomplishments.
              </p>
              <textarea
                value={teamStrengths}
                onChange={(e) => setTeamStrengths(e.target.value)}
                placeholder="Our team's key strengths include:
- [Strength 1]
- [Strength 2]
- [Strength 3]

We have worked together for [X years] at [Company] and have achieved..."
                className="input-field w-full h-40 resize-none"
              />
            </div>

            {/* Availability */}
            <div className="card">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Availability</h3>
              <p className="text-sm text-text-secondary mb-4">
                When would your team be available to start?
              </p>
              <div className="space-y-3">
                {[
                  { value: 'immediate', label: 'Immediately available', desc: 'Can start within 2 weeks' },
                  { value: '1-month', label: '1 month notice', desc: 'Need to provide notice to current employer' },
                  { value: '2-months', label: '2 months notice', desc: 'Standard notice period required' },
                  { value: '3-months', label: '3+ months', desc: 'Longer transition period needed' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                      availability === option.value
                        ? 'border-navy bg-navy-50'
                        : 'border-border hover:border-navy/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="availability"
                      value={option.value}
                      checked={availability === option.value}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-text-primary">{option.label}</p>
                      <p className="text-sm text-text-tertiary">{option.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between gap-4">
              <Link
                href={`/app/opportunities/${params?.id}`}
                className="btn-outline min-h-12"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting || !coverLetter.trim()}
                className="btn-primary min-h-12 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>

        {/* Opportunity Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Opportunity Summary</h3>

            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <BuildingOffice2Icon className="w-6 h-6 text-navy" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary">{opportunity.title}</h4>
                <p className="text-sm text-text-secondary">{opportunity.company}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <MapPinIcon className="w-4 h-4 text-text-tertiary" />
                <span className="text-text-secondary">{opportunity.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <UserGroupIcon className="w-4 h-4 text-text-tertiary" />
                <span className="text-text-secondary">{opportunity.teamSize} team members</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CurrencyDollarIcon className="w-4 h-4 text-text-tertiary" />
                <span className="text-text-secondary">{opportunity.compensation?.range || 'Competitive'}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-text-secondary line-clamp-4">
                {opportunity.description}
              </p>
            </div>

            <Link
              href={`/app/opportunities/${params?.id}`}
              className="btn-outline min-h-10 w-full mt-4 text-sm"
            >
              View Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
