'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  BuildingOfficeIcon,
  GlobeAltIcon,
  UserGroupIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { FormField, RequiredFieldsNote, ButtonGroup, TextLink } from '@/components/ui';

const companyProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  size: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']),
  location: z.string().min(1, 'Location is required'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  founded: z.number().min(1800).max(new Date().getFullYear()).optional(),
  culture: z.object({
    values: z.array(z.string()).min(1, 'Please add at least one company value'),
    workStyle: z.array(z.string()).min(1, 'Please select at least one work style'),
    benefits: z.array(z.string()).min(1, 'Please add at least one benefit'),
  }),
});

type CompanyProfileFormData = z.infer<typeof companyProfileSchema>;

interface CompanyProfileSetupProps {
  onComplete: () => void;
  onSkip?: () => void;
}

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

const companySizes = [
  { value: 'startup', label: 'Startup (1-10 employees)' },
  { value: 'small', label: 'Small (11-50 employees)' },
  { value: 'medium', label: 'Medium (51-200 employees)' },
  { value: 'large', label: 'Large (201-1000 employees)' },
  { value: 'enterprise', label: 'Enterprise (1000+ employees)' },
];

const commonValues = [
  'Innovation', 'Integrity', 'Collaboration', 'Excellence', 'Diversity',
  'Customer Focus', 'Agility', 'Transparency', 'Growth Mindset', 'Quality',
];

const workStyles = [
  'Remote-first', 'Hybrid', 'In-office', 'Flexible hours', 'Autonomous teams',
  'Collaborative', 'Fast-paced', 'Data-driven', 'Results-oriented',
];

const commonBenefits = [
  'Competitive salary', 'Equity participation', 'Health insurance', 'Dental/Vision',
  '401k matching', 'Flexible PTO', 'Professional development', 'Remote work',
  'Gym membership', 'Catered meals', 'Commuter benefits', 'Parental leave',
];

export function CompanyProfileSetup({ onComplete, onSkip }: CompanyProfileSetupProps) {
  const { userData } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedWorkStyles, setSelectedWorkStyles] = useState<string[]>([]);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CompanyProfileFormData>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      companyName: userData?.companyName || '',
      industry: userData?.industry || '',
      location: userData?.location || '',
      culture: {
        values: [],
        workStyle: [],
        benefits: [],
      },
    },
  });

  const watchedValues = watch('culture.values');
  const watchedWorkStyles = watch('culture.workStyle');
  const watchedBenefits = watch('culture.benefits');

  const toggleArrayItem = (
    item: string,
    array: string[],
    setter: (items: string[]) => void,
    fieldName: 'culture.values' | 'culture.workStyle' | 'culture.benefits'
  ) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    setter(newArray);
    setValue(fieldName, newArray);
  };

  const onSubmit = async (data: CompanyProfileFormData) => {
    setIsSubmitting(true);

    try {
      // In a real app, this would save to your API
      console.log('Company profile data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Company profile saved successfully!');
      onComplete();
    } catch (error) {
      toast.error('Failed to save company profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <BuildingOfficeIcon className="mx-auto h-12 w-12 text-navy" />
        <h3 className="mt-2 text-lg font-bold text-text-primary">
          Tell us about your company
        </h3>
        <p className="mt-1 text-sm text-text-secondary">
          This information helps teams understand your company culture and what you're looking for.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <RequiredFieldsNote />

        {/* Basic Company Information - Single column per Practical UI */}
        <div className="space-y-5">
          <FormField label="Company name" name="companyName" required error={errors.companyName?.message}>
            <input
              {...register('companyName')}
              id="companyName"
              type="text"
              className="input-field"
              placeholder="e.g., Acme Corporation"
            />
          </FormField>

          <FormField label="Industry" name="industry" required error={errors.industry?.message}>
            <select {...register('industry')} id="industry" className="input-field">
              <option value="">Select an industry</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Company size" name="size" required error={errors.size?.message}>
            <select {...register('size')} id="size" className="input-field">
              <option value="">Select company size</option>
              {companySizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Headquarters location" name="location" required error={errors.location?.message}>
            <input
              {...register('location')}
              id="location"
              type="text"
              className="input-field"
              placeholder="e.g., New York, NY"
            />
          </FormField>

          <FormField label="Website" name="website" error={errors.website?.message}>
            <input
              {...register('website')}
              id="website"
              type="url"
              className="input-field"
              placeholder="https://www.company.com"
            />
          </FormField>

          <FormField label="Year founded" name="founded" error={errors.founded?.message}>
            <input
              {...register('founded', { valueAsNumber: true })}
              id="founded"
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              className="input-field"
              placeholder="2020"
            />
          </FormField>

          <FormField label="Company description" name="description" required error={errors.description?.message}>
            <textarea
              {...register('description')}
              id="description"
              rows={4}
              className="input-field"
              placeholder="Describe your company's mission, what you do, and what makes you unique..."
            />
          </FormField>
        </div>

        {/* Company Values */}
        <div>
          <label className="label-text">Company values *</label>
          {errors.culture?.values && (
            <p className="text-sm text-error mb-2">{errors.culture.values.message}</p>
          )}
          <p className="text-sm text-text-tertiary mb-3">
            Select the values that best represent your company culture
          </p>
          <div className="flex flex-wrap gap-2">
            {commonValues.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleArrayItem(value, selectedValues, setSelectedValues, 'culture.values')}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-9 ${
                  selectedValues.includes(value)
                    ? 'bg-navy-100 text-navy-800 border-2 border-navy-200'
                    : 'bg-bg-alt text-text-secondary border-2 border-transparent hover:bg-navy-50'
                }`}
              >
                {selectedValues.includes(value) && (
                  <CheckIcon className="h-4 w-4 mr-1.5" />
                )}
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Work Style */}
        <div>
          <label className="label-text">Work style *</label>
          {errors.culture?.workStyle && (
            <p className="text-sm text-error mb-2">{errors.culture.workStyle.message}</p>
          )}
          <p className="text-sm text-text-tertiary mb-3">
            How does your team typically work?
          </p>
          <div className="flex flex-wrap gap-2">
            {workStyles.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => toggleArrayItem(style, selectedWorkStyles, setSelectedWorkStyles, 'culture.workStyle')}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-9 ${
                  selectedWorkStyles.includes(style)
                    ? 'bg-success-light text-success-dark border-2 border-success/30'
                    : 'bg-bg-alt text-text-secondary border-2 border-transparent hover:bg-success-light/50'
                }`}
              >
                {selectedWorkStyles.includes(style) && (
                  <CheckIcon className="h-4 w-4 mr-1.5" />
                )}
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div>
          <label className="label-text">Benefits and perks *</label>
          {errors.culture?.benefits && (
            <p className="text-sm text-error mb-2">{errors.culture.benefits.message}</p>
          )}
          <p className="text-sm text-text-tertiary mb-3">
            What benefits do you offer to attract top teams?
          </p>
          <div className="flex flex-wrap gap-2">
            {commonBenefits.map((benefit) => (
              <button
                key={benefit}
                type="button"
                onClick={() => toggleArrayItem(benefit, selectedBenefits, setSelectedBenefits, 'culture.benefits')}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-9 ${
                  selectedBenefits.includes(benefit)
                    ? 'bg-gold-100 text-gold-800 border-2 border-gold-200'
                    : 'bg-bg-alt text-text-secondary border-2 border-transparent hover:bg-gold-50'
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

        {/* Submit Button - LEFT aligned per Practical UI */}
        <div className="pt-6 border-t border-border">
          <ButtonGroup>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary min-h-12"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="loading-spinner mr-2"></div>
                  Saving...
                </div>
              ) : (
                'Save company profile'
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