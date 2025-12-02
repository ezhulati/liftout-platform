'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useCreateOpportunity } from '@/hooks/useOpportunities';
import { useAuth } from '@/contexts/AuthContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FormField, RequiredFieldsNote, ButtonGroup, TextLink } from '@/components/ui';

// Helper to check if user is a demo user
const isDemoUserEmail = (email: string) =>
  email === 'demo@example.com' || email === 'company@example.com';

// LocalStorage key for demo opportunities
const DEMO_OPPORTUNITIES_STORAGE_KEY = 'liftout_demo_opportunities';

const createOpportunitySchema = z.object({
  title: z.string().min(5, 'Title too short. Use at least 5 characters.'),
  company: z.string().min(2, 'Company name missing. Enter your company name.'),
  type: z.string().min(1, 'No liftout type selected. Choose a type from the list.'),
  description: z.string().min(50, 'Description too short. Write at least 50 characters.'),
  teamSize: z.string().min(1, 'Team size missing. Specify how many people you need.'),
  compensation: z.string().min(1, 'Compensation missing. Enter your compensation details.'),
  location: z.string().min(1, 'Location missing. Enter the work location.'),
  timeline: z.string().min(1, 'Timeline missing. Specify when the team should start.'),
  requirements: z.array(z.string()).min(1, 'No requirements added. Add at least one requirement.'),
  whatWeOffer: z.array(z.string()).min(1, 'No offerings added. Add at least one offering.'),
  integrationPlan: z.string().min(20, 'Integration plan too short. Write at least 20 characters.'),
  confidential: z.boolean(),
  urgent: z.boolean(),
  industry: z.string().min(1, 'No industry selected. Choose an industry from the list.'),
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
  const { data: session } = useSession();
  const { user } = useAuth();
  const createOpportunityMutation = useCreateOpportunity();

  // Check if this is a demo user
  const sessionUser = session?.user as any;
  const userEmail = user?.email || sessionUser?.email || '';
  const isDemoUser = isDemoUserEmail(userEmail);

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
      // For demo users, save to localStorage instead of API
      if (isDemoUser) {
        const existingOpportunities = JSON.parse(localStorage.getItem(`${DEMO_OPPORTUNITIES_STORAGE_KEY}_${userEmail}`) || '[]');
        const newOpportunity = {
          id: `demo-opp-${Date.now()}`,
          ...data,
          createdAt: new Date().toISOString(),
          status: 'active',
          createdBy: userEmail,
          applicants: 0,
        };
        existingOpportunities.push(newOpportunity);
        localStorage.setItem(`${DEMO_OPPORTUNITIES_STORAGE_KEY}_${userEmail}`, JSON.stringify(existingOpportunities));
        toast.success('Opportunity created (demo mode)');
        router.push('/app/opportunities');
        return;
      }

      await createOpportunityMutation.mutateAsync(data);
      toast.success('Opportunity created');
      router.push('/app/opportunities');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create opportunity';
      toast.error(message);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <RequiredFieldsNote />

        {/* Basic Information - Single column per Practical UI */}
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-text-primary">Liftout opportunity details</h3>

          <FormField
            label="Opportunity title"
            name="title"
            required
            error={errors.title?.message}
          >
            <input
              {...register('title')}
              id="title"
              type="text"
              className="input-field"
              placeholder="e.g., Lead FinTech Analytics Division"
            />
          </FormField>

          <FormField
            label="Company name"
            name="company"
            required
            error={errors.company?.message}
          >
            <input
              {...register('company')}
              id="company"
              type="text"
              className="input-field"
              placeholder="Your company name"
            />
          </FormField>

          <FormField
            label="Liftout type"
            name="type"
            required
            error={errors.type?.message}
          >
            <select {...register('type')} id="type" className="input-field">
              <option value="">Select liftout type</option>
              {liftoutTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Strategic description"
            name="description"
            required
            error={errors.description?.message}
          >
            <textarea
              {...register('description')}
              id="description"
              rows={4}
              className="input-field"
              placeholder="Describe the strategic need, business context, and why you're seeking to acquire an intact team..."
            />
          </FormField>

          <FormField
            label="Industry"
            name="industry"
            required
            error={errors.industry?.message}
          >
            <select {...register('industry')} id="industry" className="input-field">
              <option value="">Select industry</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Team size needed"
            name="teamSize"
            required
            error={errors.teamSize?.message}
          >
            <input
              {...register('teamSize')}
              id="teamSize"
              type="text"
              className="input-field"
              placeholder="e.g., 4-6 people, or exactly 5 members"
            />
          </FormField>
        </div>

        {/* Compensation & Logistics */}
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-text-primary">Compensation and logistics</h3>

          <FormField
            label="Total team compensation"
            name="compensation"
            required
            error={errors.compensation?.message}
          >
            <input
              {...register('compensation')}
              id="compensation"
              type="text"
              className="input-field"
              placeholder="e.g., $1.2M-$1.8M total package + equity"
            />
          </FormField>

          <FormField
            label="Location"
            name="location"
            required
            error={errors.location?.message}
          >
            <input
              {...register('location')}
              id="location"
              type="text"
              className="input-field"
              placeholder="e.g., New York, NY (Hybrid) or Remote"
            />
          </FormField>

          <FormField
            label="Start timeline"
            name="timeline"
            required
            error={errors.timeline?.message}
          >
            <input
              {...register('timeline')}
              id="timeline"
              type="text"
              className="input-field"
              placeholder="e.g., Start within 3 months, Q1 2024"
            />
          </FormField>
        </div>

        {/* Requirements */}
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-text-primary">Team requirements</h3>

          <FormField
            label="Requirements"
            name="requirements"
            required
            error={errors.requirements?.message}
          >
            <div className="flex flex-wrap gap-2 mb-3">
              {requirements.map((req, index) => (
                <span
                  key={index}
                  className="inline-flex items-center pl-4 pr-2 py-2 rounded-full text-base font-medium bg-navy-100 text-navy-800"
                >
                  {req}
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="ml-2 inline-flex items-center justify-center min-w-8 min-h-8 rounded-full text-navy-400 hover:bg-navy-200 hover:text-navy-600"
                    aria-label={`Remove ${req}`}
                  >
                    <XMarkIcon className="w-4 h-4" />
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
                placeholder="Add a requirement (e.g., 3+ years working together)"
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
                className="btn-outline min-h-12"
              >
                Add requirement
              </button>
            </div>
          </FormField>
        </div>

        {/* What We Offer */}
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-text-primary">What we offer</h3>

          <FormField
            label="Offerings"
            name="whatWeOffer"
            required
            error={errors.whatWeOffer?.message}
          >
            <div className="flex flex-wrap gap-2 mb-3">
              {whatWeOffer.map((offer, index) => (
                <span
                  key={index}
                  className="inline-flex items-center pl-4 pr-2 py-2 rounded-full text-base font-medium bg-gold-100 text-gold-800"
                >
                  {offer}
                  <button
                    type="button"
                    onClick={() => removeOffering(index)}
                    className="ml-2 inline-flex items-center justify-center min-w-8 min-h-8 rounded-full text-gold-400 hover:bg-gold-200 hover:text-gold-600"
                    aria-label={`Remove ${offer}`}
                  >
                    <XMarkIcon className="w-4 h-4" />
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
                placeholder="Add what you offer (e.g., Full team autonomy, Equity participation)"
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
                className="btn-outline min-h-12"
              >
                Add offering
              </button>
            </div>
          </FormField>
        </div>

        {/* Integration Plan */}
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-text-primary">Integration plan</h3>

          <FormField
            label="Team integration strategy"
            name="integrationPlan"
            required
            error={errors.integrationPlan?.message}
          >
            <textarea
              {...register('integrationPlan')}
              id="integrationPlan"
              rows={4}
              className="input-field"
              placeholder="Describe how the team will be integrated: office space, reporting structure, decision-making authority, timeline, support systems..."
            />
          </FormField>
        </div>

        {/* Options */}
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-text-primary">Opportunity settings</h3>

          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer min-h-12 px-2 rounded-lg hover:bg-bg-alt transition-colors -mx-2">
              <input
                {...register('confidential')}
                type="checkbox"
                className="rounded border-border text-navy focus:ring-navy w-5 h-5"
              />
              <span className="text-base text-text-secondary">
                Confidential opportunity (only visible to invited teams)
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer min-h-12 px-2 rounded-lg hover:bg-bg-alt transition-colors -mx-2">
              <input
                {...register('urgent')}
                type="checkbox"
                className="rounded border-border text-navy focus:ring-navy w-5 h-5"
              />
              <span className="text-base text-text-secondary">
                Urgent timeline (expedited review process)
              </span>
            </label>
          </div>
        </div>

        {/* Submit - LEFT aligned per Practical UI, primary button FIRST */}
        <ButtonGroup>
          <button
            type="submit"
            disabled={createOpportunityMutation.isPending}
            className="btn-primary min-h-12"
          >
            {createOpportunityMutation.isPending ? 'Creating...' : 'Post opportunity'}
          </button>
          <TextLink onClick={() => router.back()}>
            Cancel
          </TextLink>
        </ButtonGroup>
      </form>
    </div>
  );
}