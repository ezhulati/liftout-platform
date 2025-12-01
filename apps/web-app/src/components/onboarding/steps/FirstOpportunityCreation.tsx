'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import {
  BriefcaseIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  CheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { FormField, ButtonGroup, TextLink } from '@/components/ui';

const opportunitySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(100, 'Description must be at least 100 characters'),
  teamSize: z.object({
    min: z.number().min(2, 'Minimum team size is 2'),
    max: z.number().min(2, 'Maximum team size must be at least 2'),
  }),
  industry: z.string().min(1, 'Please select an industry'),
  location: z.string().min(1, 'Location is required'),
  locationType: z.enum(['remote', 'hybrid', 'onsite']),
  compensationType: z.enum(['salary', 'equity', 'package']),
  compensationRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }),
  timeline: z.enum(['immediate', '1-3months', '3-6months', '6months+']),
  liftoutType: z.enum(['expansion', 'capability', 'market-entry', 'strategic']),
  requirements: z.array(z.string()).min(1, 'Add at least one requirement'),
  benefits: z.array(z.string()).min(1, 'Add at least one benefit'),
});

type OpportunityFormData = z.infer<typeof opportunitySchema>;

interface FirstOpportunityCreationProps {
  onComplete: () => void;
  onSkip?: () => void;
}

const industries = [
  'Financial Services', 'Investment Banking', 'Private Equity',
  'Management Consulting', 'Healthcare Technology', 'Biotechnology',
  'Enterprise Software', 'Fintech', 'Legal Services', 'Other',
];

const liftoutTypes = [
  { value: 'expansion', label: 'Market Expansion', description: 'Expand into new markets or regions' },
  { value: 'capability', label: 'Capability Building', description: 'Acquire new skills or expertise' },
  { value: 'market-entry', label: 'Market Entry', description: 'Enter a new business area' },
  { value: 'strategic', label: 'Strategic Acquisition', description: 'Strengthen competitive position' },
];

const timelines = [
  { value: 'immediate', label: 'Immediate (ASAP)' },
  { value: '1-3months', label: '1-3 months' },
  { value: '3-6months', label: '3-6 months' },
  { value: '6months+', label: '6+ months' },
];

const commonRequirements = [
  'Proven track record in the industry',
  'Minimum 5 years working together',
  'Strong technical expertise',
  'Leadership experience',
  'Client relationship management',
  'Revenue generation capability',
  'Domain expertise',
  'Cross-functional collaboration',
];

const commonBenefits = [
  'Competitive base salary',
  'Equity participation',
  'Performance bonuses',
  'Full benefits package',
  'Flexible work arrangements',
  'Professional development budget',
  'Relocation assistance',
  'Signing bonus',
];

export function FirstOpportunityCreation({ onComplete, onSkip }: FirstOpportunityCreationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      teamSize: { min: 3, max: 10 },
      locationType: 'hybrid',
      compensationType: 'package',
      compensationRange: { min: 150000, max: 300000 },
      timeline: '1-3months',
      liftoutType: 'expansion',
      requirements: [],
      benefits: [],
    },
  });

  const compensationType = watch('compensationType');
  const liftoutType = watch('liftoutType');

  const toggleRequirement = (req: string) => {
    const newReqs = selectedRequirements.includes(req)
      ? selectedRequirements.filter(r => r !== req)
      : [...selectedRequirements, req];
    setSelectedRequirements(newReqs);
    setValue('requirements', newReqs);
  };

  const toggleBenefit = (benefit: string) => {
    const newBenefits = selectedBenefits.includes(benefit)
      ? selectedBenefits.filter(b => b !== benefit)
      : [...selectedBenefits, benefit];
    setSelectedBenefits(newBenefits);
    setValue('benefits', newBenefits);
  };

  const onSubmit = async (data: OpportunityFormData) => {
    setIsSubmitting(true);

    try {
      // Create opportunity via API
      const response = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          industry: data.industry,
          location: data.location,
          locationType: data.locationType,
          teamSizeMin: data.teamSize.min,
          teamSizeMax: data.teamSize.max,
          compensationType: data.compensationType,
          compensationMin: data.compensationRange.min,
          compensationMax: data.compensationRange.max,
          timeline: data.timeline,
          liftoutType: data.liftoutType,
          requirements: data.requirements,
          benefits: data.benefits,
          status: 'active',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create opportunity');
      }

      toast.success('Your first opportunity has been created! Teams can now discover it.');
      onComplete();
    } catch (error) {
      console.error('Opportunity creation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create opportunity');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <BriefcaseIcon className="mx-auto h-12 w-12 text-navy" />
        <h3 className="mt-2 text-lg font-bold text-text-primary">
          Create your first liftout opportunity
        </h3>
        <p className="mt-1 text-base text-text-secondary">
          Describe what you're looking for to attract the right teams.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <SparklesIcon className="h-5 w-5 mr-2 text-text-tertiary" />
            Opportunity details
          </h4>

          <FormField label="Opportunity title" name="title" required error={errors.title?.message}>
            <input
              {...register('title')}
              type="text"
              className="input-field"
              placeholder="e.g., Strategic Analytics Team for Market Expansion"
            />
          </FormField>

          <FormField label="Description" name="description" required error={errors.description?.message}>
            <textarea
              {...register('description')}
              rows={4}
              className="input-field"
              placeholder="Describe the opportunity, what the team will do, and why this is exciting..."
            />
          </FormField>

          <FormField label="Industry focus" name="industry" required error={errors.industry?.message}>
            <select {...register('industry')} className="input-field">
              <option value="">Select an industry</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </FormField>

          <div>
            <label className="label-text">Liftout type *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {liftoutTypes.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                    liftoutType === type.value
                      ? 'border-navy bg-navy-50'
                      : 'border-border hover:border-navy-200'
                  }`}
                >
                  <input
                    {...register('liftoutType')}
                    type="radio"
                    value={type.value}
                    className="mt-1 h-5 w-5 text-navy focus:ring-navy"
                  />
                  <div>
                    <span className="text-base font-bold text-text-primary">{type.label}</span>
                    <p className="text-sm text-text-tertiary">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Team Requirements */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <UserGroupIcon className="h-5 w-5 mr-2 text-text-tertiary" />
            Team requirements
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Minimum team size" name="teamSize.min" required error={errors.teamSize?.min?.message}>
              <input
                {...register('teamSize.min', { valueAsNumber: true })}
                type="number"
                min={2}
                className="input-field"
              />
            </FormField>

            <FormField label="Maximum team size" name="teamSize.max" required error={errors.teamSize?.max?.message}>
              <input
                {...register('teamSize.max', { valueAsNumber: true })}
                type="number"
                min={2}
                className="input-field"
              />
            </FormField>
          </div>

          <div>
            <label className="label-text">Key requirements *</label>
            {errors.requirements && (
              <p className="text-sm text-error mb-2">{errors.requirements.message}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {commonRequirements.map((req) => (
                <button
                  key={req}
                  type="button"
                  onClick={() => toggleRequirement(req)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-9 ${
                    selectedRequirements.includes(req)
                      ? 'bg-navy-100 text-navy-800 border-2 border-navy-200'
                      : 'bg-bg-alt text-text-secondary border-2 border-transparent hover:bg-navy-50'
                  }`}
                >
                  {selectedRequirements.includes(req) && (
                    <CheckIcon className="h-4 w-4 mr-1.5" />
                  )}
                  {req}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Location & Timeline */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2 text-text-tertiary" />
            Location & timeline
          </h4>

          <FormField label="Location" name="location" required error={errors.location?.message}>
            <input
              {...register('location')}
              type="text"
              className="input-field"
              placeholder="e.g., New York, NY or Multiple Locations"
            />
          </FormField>

          <FormField label="Work arrangement" name="locationType" required>
            <select {...register('locationType')} className="input-field">
              <option value="remote">Fully Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </FormField>

          <FormField label="Timeline" name="timeline" required>
            <select {...register('timeline')} className="input-field">
              {timelines.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Compensation */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <CurrencyDollarIcon className="h-5 w-5 mr-2 text-text-tertiary" />
            Compensation
          </h4>

          <FormField label="Compensation type" name="compensationType" required>
            <select {...register('compensationType')} className="input-field">
              <option value="salary">Base Salary</option>
              <option value="equity">Equity-focused</option>
              <option value="package">Total Package</option>
            </select>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label={`${compensationType === 'package' ? 'Package' : compensationType === 'equity' ? 'Equity value' : 'Salary'} minimum`}
              name="compensationRange.min"
            >
              <input
                {...register('compensationRange.min', { valueAsNumber: true })}
                type="number"
                min={0}
                step={10000}
                className="input-field"
              />
            </FormField>

            <FormField
              label={`${compensationType === 'package' ? 'Package' : compensationType === 'equity' ? 'Equity value' : 'Salary'} maximum`}
              name="compensationRange.max"
            >
              <input
                {...register('compensationRange.max', { valueAsNumber: true })}
                type="number"
                min={0}
                step={10000}
                className="input-field"
              />
            </FormField>
          </div>

          <p className="text-sm text-text-tertiary">
            Displayed as: {formatCurrency(watch('compensationRange.min') || 0)} - {formatCurrency(watch('compensationRange.max') || 0)} per person
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <CalendarDaysIcon className="h-5 w-5 mr-2 text-text-tertiary" />
            Benefits & perks
          </h4>

          <div>
            <label className="label-text">What you offer *</label>
            {errors.benefits && (
              <p className="text-sm text-error mb-2">{errors.benefits.message}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {commonBenefits.map((benefit) => (
                <button
                  key={benefit}
                  type="button"
                  onClick={() => toggleBenefit(benefit)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-9 ${
                    selectedBenefits.includes(benefit)
                      ? 'bg-success-light text-success-dark border-2 border-success/30'
                      : 'bg-bg-alt text-text-secondary border-2 border-transparent hover:bg-success-light/50'
                  }`}
                >
                  {selectedBenefits.includes(benefit) && (
                    <CheckIcon className="h-4 w-4 mr-1.5" />
                  )}
                  {benefit}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-border">
          <ButtonGroup>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary min-h-12"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <div className="loading-spinner mr-2" />
                  Creating...
                </span>
              ) : (
                'Create opportunity'
              )}
            </button>
            {onSkip && (
              <TextLink onClick={onSkip} disabled={isSubmitting}>
                Skip for now
              </TextLink>
            )}
          </ButtonGroup>
        </div>
      </form>
    </div>
  );
}
