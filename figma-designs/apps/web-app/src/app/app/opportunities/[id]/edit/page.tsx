'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeftIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  BriefcaseIcon,
  SparklesIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

const opportunitySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  teamSize: z.coerce.number().min(2, 'Team size must be at least 2'),
  location: z.string().min(2, 'Location is required'),
  remote: z.boolean(),
  industry: z.string().min(1, 'Industry is required'),
  type: z.enum(['expansion', 'capability', 'market_entry', 'acquisition']),
  compensationType: z.enum(['salary', 'total_package', 'equity']),
  compensationRange: z.string().min(1, 'Compensation range is required'),
  compensationEquity: z.boolean(),
  compensationBenefits: z.string().optional(),
  requirements: z.string().min(10, 'Add at least one requirement'),
  responsibilities: z.string().min(10, 'Add at least one responsibility'),
  strategicRationale: z.string().min(20, 'Strategic rationale is required'),
  integrationPlan: z.string().min(20, 'Integration plan is required'),
  deadline: z.string().min(1, 'Deadline is required'),
});

type OpportunityFormData = z.infer<typeof opportunitySchema>;

interface Opportunity {
  id: string;
  title: string;
  company: string;
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
  createdBy?: string;
}

const typeOptions = [
  { value: 'expansion', label: 'Team Expansion' },
  { value: 'capability', label: 'Capability Building' },
  { value: 'market_entry', label: 'Market Entry' },
  { value: 'acquisition', label: 'Strategic Acquisition' },
];

const industryOptions = [
  'Financial Services',
  'Investment Banking',
  'Private Equity',
  'Management Consulting',
  'Healthcare Technology',
  'Biotechnology',
  'Enterprise Software',
  'Fintech',
  'Legal Services',
  'Other',
];

export default function EditOpportunityPage() {
  const params = useParams();
  const router = useRouter();
  const { userData, isCompany } = useAuth();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
  });

  const fetchOpportunity = useCallback(async () => {
    if (!params?.id) return;
    try {
      const response = await fetch(`/api/opportunities/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch opportunity');
      }
      const data = await response.json();
      setOpportunity(data.opportunity);

      // Populate form with existing data
      const opp = data.opportunity;
      reset({
        title: opp.title,
        description: opp.description,
        teamSize: opp.teamSize,
        location: opp.location,
        remote: opp.remote,
        industry: opp.industry,
        type: opp.type,
        compensationType: opp.compensation.type,
        compensationRange: opp.compensation.range,
        compensationEquity: opp.compensation.equity || false,
        compensationBenefits: opp.compensation.benefits || '',
        requirements: opp.requirements.join('\n'),
        responsibilities: opp.responsibilities.join('\n'),
        strategicRationale: opp.strategicRationale,
        integrationPlan: opp.integrationPlan,
        deadline: opp.deadline.split('T')[0], // Format for date input
      });
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      toast.error('Failed to load opportunity');
    } finally {
      setLoading(false);
    }
  }, [params?.id, reset]);

  useEffect(() => {
    if (params?.id) {
      fetchOpportunity();
    }
  }, [params?.id, fetchOpportunity]);

  // Check ownership
  const isOwner = opportunity?.createdBy === userData?.id ||
    (isCompany && opportunity?.company === 'NextGen Financial');

  const onSubmit = async (data: OpportunityFormData) => {
    if (!opportunity) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/opportunities/${opportunity.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          requirements: data.requirements.split('\n').filter(r => r.trim()),
          responsibilities: data.responsibilities.split('\n').filter(r => r.trim()),
          compensation: {
            type: data.compensationType,
            range: data.compensationRange,
            equity: data.compensationEquity,
            benefits: data.compensationBenefits,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update opportunity');
      }

      toast.success('Opportunity updated successfully!');
      router.push(`/app/opportunities/${opportunity.id}`);
    } catch (error) {
      console.error('Error updating opportunity:', error);
      toast.error('Failed to update opportunity');
    } finally {
      setSaving(false);
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

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-bg-surface p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Access Denied</h1>
          <p className="text-text-secondary mb-6">
            You don&apos;t have permission to edit this opportunity.
          </p>
          <Link
            href={`/app/opportunities/${opportunity.id}`}
            className="btn-primary min-h-12 inline-flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to opportunity
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-surface">
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Navigation */}
        <Link
          href={`/app/opportunities/${opportunity.id}`}
          className="inline-flex items-center gap-2 text-text-secondary hover:text-navy transition-colors mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Opportunity
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Edit Opportunity</h1>
          <p className="text-text-secondary mt-1">Update your liftout opportunity details</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-bg-elevated rounded-lg border border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <SparklesIcon className="w-5 h-5 text-navy" />
              <h2 className="text-lg font-semibold text-text-primary">Basic Information</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Opportunity Title *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  className="input-field w-full"
                  placeholder="e.g., Strategic Analytics Team for Market Expansion"
                />
                {errors.title && (
                  <p className="text-sm text-error mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="input-field w-full"
                  placeholder="Describe the opportunity and what the team will do..."
                />
                {errors.description && (
                  <p className="text-sm text-error mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Industry *
                  </label>
                  <select {...register('industry')} className="input-field w-full">
                    <option value="">Select industry</option>
                    {industryOptions.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                  {errors.industry && (
                    <p className="text-sm text-error mt-1">{errors.industry.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Opportunity Type *
                  </label>
                  <select {...register('type')} className="input-field w-full">
                    {typeOptions.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="text-sm text-error mt-1">{errors.type.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Team Requirements */}
          <div className="bg-bg-elevated rounded-lg border border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <UsersIcon className="w-5 h-5 text-navy" />
              <h2 className="text-lg font-semibold text-text-primary">Team Requirements</h2>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Team Size *
                  </label>
                  <input
                    {...register('teamSize')}
                    type="number"
                    min={2}
                    className="input-field w-full"
                  />
                  {errors.teamSize && (
                    <p className="text-sm text-error mt-1">{errors.teamSize.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Location *
                  </label>
                  <input
                    {...register('location')}
                    type="text"
                    className="input-field w-full"
                    placeholder="e.g., New York, NY"
                  />
                  {errors.location && (
                    <p className="text-sm text-error mt-1">{errors.location.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  {...register('remote')}
                  type="checkbox"
                  id="remote"
                  className="h-5 w-5 rounded border-border text-navy focus:ring-navy"
                />
                <label htmlFor="remote" className="text-sm text-text-primary">
                  Remote work available
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Requirements * (one per line)
                </label>
                <textarea
                  {...register('requirements')}
                  rows={4}
                  className="input-field w-full"
                  placeholder="Minimum 3 years working together&#10;Proven track record in fintech&#10;Experience with ML models"
                />
                {errors.requirements && (
                  <p className="text-sm text-error mt-1">{errors.requirements.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Responsibilities * (one per line)
                </label>
                <textarea
                  {...register('responsibilities')}
                  rows={4}
                  className="input-field w-full"
                  placeholder="Lead analytics initiatives&#10;Build predictive models&#10;Mentor junior team members"
                />
                {errors.responsibilities && (
                  <p className="text-sm text-error mt-1">{errors.responsibilities.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Compensation */}
          <div className="bg-bg-elevated rounded-lg border border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <CurrencyDollarIcon className="w-5 h-5 text-navy" />
              <h2 className="text-lg font-semibold text-text-primary">Compensation</h2>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Compensation Type *
                  </label>
                  <select {...register('compensationType')} className="input-field w-full">
                    <option value="salary">Base Salary</option>
                    <option value="total_package">Total Package</option>
                    <option value="equity">Equity-focused</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Compensation Range *
                  </label>
                  <input
                    {...register('compensationRange')}
                    type="text"
                    className="input-field w-full"
                    placeholder="e.g., $180k - $250k per person"
                  />
                  {errors.compensationRange && (
                    <p className="text-sm text-error mt-1">{errors.compensationRange.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  {...register('compensationEquity')}
                  type="checkbox"
                  id="compensationEquity"
                  className="h-5 w-5 rounded border-border text-navy focus:ring-navy"
                />
                <label htmlFor="compensationEquity" className="text-sm text-text-primary">
                  Equity included
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Benefits
                </label>
                <input
                  {...register('compensationBenefits')}
                  type="text"
                  className="input-field w-full"
                  placeholder="e.g., Full package including relocation assistance"
                />
              </div>
            </div>
          </div>

          {/* Strategic Details */}
          <div className="bg-bg-elevated rounded-lg border border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheckIcon className="w-5 h-5 text-navy" />
              <h2 className="text-lg font-semibold text-text-primary">Strategic Details</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Strategic Rationale *
                </label>
                <textarea
                  {...register('strategicRationale')}
                  rows={3}
                  className="input-field w-full"
                  placeholder="Explain why you're seeking this team and the strategic value..."
                />
                {errors.strategicRationale && (
                  <p className="text-sm text-error mt-1">{errors.strategicRationale.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Integration Plan *
                </label>
                <textarea
                  {...register('integrationPlan')}
                  rows={3}
                  className="input-field w-full"
                  placeholder="Describe how the team will be integrated into your organization..."
                />
                {errors.integrationPlan && (
                  <p className="text-sm text-error mt-1">{errors.integrationPlan.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Application Deadline *
                </label>
                <input
                  {...register('deadline')}
                  type="date"
                  className="input-field w-full"
                />
                {errors.deadline && (
                  <p className="text-sm text-error mt-1">{errors.deadline.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Link
              href={`/app/opportunities/${opportunity.id}`}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || !isDirty}
              className="btn-primary min-h-12 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
