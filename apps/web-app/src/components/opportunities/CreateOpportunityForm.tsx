'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useCreateOpportunity } from '@/hooks/useOpportunities';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const createOpportunitySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  company: z.string().min(2, 'Company name is required'),
  type: z.string().min(1, 'Please select a liftout type'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  teamSize: z.string().min(1, 'Team size requirement is required'),
  compensation: z.string().min(1, 'Compensation details are required'),
  location: z.string().min(1, 'Location is required'),
  timeline: z.string().min(1, 'Timeline is required'),
  requirements: z.array(z.string()).min(1, 'At least one requirement is required'),
  whatWeOffer: z.array(z.string()).min(1, 'At least one offering is required'),
  integrationPlan: z.string().min(20, 'Integration plan must be at least 20 characters'),
  confidential: z.boolean(),
  urgent: z.boolean(),
  industry: z.string().min(1, 'Please select an industry'),
});

type CreateOpportunityFormData = z.infer<typeof createOpportunitySchema>;

const industries = [
  'Financial Services',
  'Investment Banking',
  'Private Equity',
  'Management Consulting',
  'Healthcare Technology',
  'Biotechnology',
  'Enterprise Software',
  'Fintech',
  'Legal Services',
  'Media & Entertainment',
  'Real Estate Private Equity',
  'Energy & Utilities',
  'Other',
];

const liftoutTypes = [
  'Strategic Expansion',
  'Market Entry',
  'Capability Building',
  'Competitive Acquisition',
  'Rapid Scaling',
  'New Division Launch',
  'Geographic Expansion',
  'Technology Integration',
  'Talent Acquisition',
  'Other',
];

export function CreateOpportunityForm() {
  const [requirementInput, setRequirementInput] = useState('');
  const [offeringInput, setOfferingInput] = useState('');
  const router = useRouter();
  const createOpportunityMutation = useCreateOpportunity();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateOpportunityFormData>({
    resolver: zodResolver(createOpportunitySchema),
    defaultValues: {
      requirements: [],
      whatWeOffer: [],
      confidential: false,
      urgent: false,
    },
  });

  const requirements = watch('requirements');
  const whatWeOffer = watch('whatWeOffer');

  const addRequirement = () => {
    if (!requirementInput.trim()) return;
    setValue('requirements', [...requirements, requirementInput.trim()]);
    setRequirementInput('');
  };

  const removeRequirement = (index: number) => {
    setValue('requirements', requirements.filter((_, i) => i !== index));
  };

  const addOffering = () => {
    if (!offeringInput.trim()) return;
    setValue('whatWeOffer', [...whatWeOffer, offeringInput.trim()]);
    setOfferingInput('');
  };

  const removeOffering = (index: number) => {
    setValue('whatWeOffer', whatWeOffer.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateOpportunityFormData) => {
    try {
      await createOpportunityMutation.mutateAsync(data);
      toast.success('Liftout opportunity created successfully!');
      router.push('/app/opportunities');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create opportunity');
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Liftout Opportunity Details</h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="label-text">
                Opportunity Title *
              </label>
              <input
                {...register('title')}
                type="text"
                className="input-field"
                placeholder="e.g., Lead FinTech Analytics Division"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company" className="label-text">
                  Company Name *
                </label>
                <input
                  {...register('company')}
                  type="text"
                  className="input-field"
                  placeholder="Your company name"
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="type" className="label-text">
                  Liftout Type *
                </label>
                <select {...register('type')} className="input-field">
                  <option value="">Select liftout type</option>
                  {liftoutTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="label-text">
                Strategic Description *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="input-field"
                placeholder="Describe the strategic need, business context, and why you're seeking to acquire an intact team..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="industry" className="label-text">
                  Industry *
                </label>
                <select {...register('industry')} className="input-field">
                  <option value="">Select industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="teamSize" className="label-text">
                  Team Size Needed *
                </label>
                <input
                  {...register('teamSize')}
                  type="text"
                  className="input-field"
                  placeholder="e.g., 4-6 people, or exactly 5 members"
                />
                {errors.teamSize && (
                  <p className="mt-1 text-sm text-red-600">{errors.teamSize.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Compensation & Logistics */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Compensation & Logistics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="compensation" className="label-text">
                Total Team Compensation *
              </label>
              <input
                {...register('compensation')}
                type="text"
                className="input-field"
                placeholder="e.g., $1.2M-$1.8M total package + equity"
              />
              {errors.compensation && (
                <p className="mt-1 text-sm text-red-600">{errors.compensation.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="location" className="label-text">
                Location *
              </label>
              <input
                {...register('location')}
                type="text"
                className="input-field"
                placeholder="e.g., New York, NY (Hybrid) or Remote"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="timeline" className="label-text">
                Start Timeline *
              </label>
              <input
                {...register('timeline')}
                type="text"
                className="input-field"
                placeholder="e.g., Start within 3 months, Q1 2024"
              />
              {errors.timeline && (
                <p className="mt-1 text-sm text-red-600">{errors.timeline.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Team Requirements</h3>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {requirements.map((req, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {req}
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                className="input-field flex-1"
                placeholder="Add a requirement (e.g., 3+ years working together, Quantitative finance expertise)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addRequirement();
                  }
                }}
              />
              <button
                type="button"
                onClick={addRequirement}
                className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
              >
                Add
              </button>
            </div>
            
            {errors.requirements && (
              <p className="mt-1 text-sm text-red-600">{errors.requirements.message}</p>
            )}
          </div>
        </div>

        {/* What We Offer */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">What We Offer</h3>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {whatWeOffer.map((offer, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  {offer}
                  <button
                    type="button"
                    onClick={() => removeOffering(index)}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-500"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={offeringInput}
                onChange={(e) => setOfferingInput(e.target.value)}
                className="input-field flex-1"
                placeholder="Add what you offer (e.g., Full team autonomy, Equity participation, $50B+ trading data access)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addOffering();
                  }
                }}
              />
              <button
                type="button"
                onClick={addOffering}
                className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
              >
                Add
              </button>
            </div>
            
            {errors.whatWeOffer && (
              <p className="mt-1 text-sm text-red-600">{errors.whatWeOffer.message}</p>
            )}
          </div>
        </div>

        {/* Integration Plan */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Integration Plan</h3>
          
          <div>
            <label htmlFor="integrationPlan" className="label-text">
              Team Integration Strategy *
            </label>
            <textarea
              {...register('integrationPlan')}
              rows={4}
              className="input-field"
              placeholder="Describe how the team will be integrated: office space, reporting structure, decision-making authority, timeline, support systems..."
            />
            {errors.integrationPlan && (
              <p className="mt-1 text-sm text-red-600">{errors.integrationPlan.message}</p>
            )}
          </div>
        </div>

        {/* Options */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Opportunity Settings</h3>
          
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                {...register('confidential')}
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Confidential opportunity (only visible to invited teams)
              </span>
            </label>

            <label className="flex items-center">
              <input
                {...register('urgent')}
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Urgent timeline (expedited review process)
              </span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createOpportunityMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createOpportunityMutation.isPending ? 'Creating...' : 'Post Liftout Opportunity'}
          </button>
        </div>
      </form>
    </div>
  );
}