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
        <BuildingOfficeIcon className="mx-auto h-12 w-12 text-primary-600" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          Tell us about your company
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          This information helps teams understand your company culture and what you're looking for.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Company Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="companyName" className="label-text">
              Company Name *
            </label>
            <input
              {...register('companyName')}
              type="text"
              className="input-field"
              placeholder="e.g., Acme Corporation"
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="industry" className="label-text">
              Industry *
            </label>
            <select {...register('industry')} className="input-field">
              <option value="">Select an industry</option>
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
            <label htmlFor="size" className="label-text">
              Company Size *
            </label>
            <select {...register('size')} className="input-field">
              <option value="">Select company size</option>
              {companySizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
            {errors.size && (
              <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="location" className="label-text">
              Headquarters Location *
            </label>
            <input
              {...register('location')}
              type="text"
              className="input-field"
              placeholder="e.g., New York, NY"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="website" className="label-text">
              Website
            </label>
            <input
              {...register('website')}
              type="url"
              className="input-field"
              placeholder="https://www.company.com"
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="founded" className="label-text">
              Year Founded
            </label>
            <input
              {...register('founded', { valueAsNumber: true })}
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              className="input-field"
              placeholder="2020"
            />
            {errors.founded && (
              <p className="mt-1 text-sm text-red-600">{errors.founded.message}</p>
            )}
          </div>
        </div>

        {/* Company Description */}
        <div>
          <label htmlFor="description" className="label-text">
            Company Description *
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="input-field"
            placeholder="Describe your company's mission, what you do, and what makes you unique..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Company Values */}
        <div>
          <label className="label-text">Company Values *</label>
          <p className="text-sm text-gray-500 mb-3">
            Select the values that best represent your company culture
          </p>
          <div className="flex flex-wrap gap-2">
            {commonValues.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleArrayItem(value, selectedValues, setSelectedValues, 'culture.values')}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedValues.includes(value)
                    ? 'bg-primary-100 text-primary-800 border-2 border-primary-200'
                    : 'bg-gray-100 text-gray-800 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {selectedValues.includes(value) && (
                  <CheckIcon className="h-3 w-3 mr-1" />
                )}
                {value}
              </button>
            ))}
          </div>
          {errors.culture?.values && (
            <p className="mt-1 text-sm text-red-600">{errors.culture.values.message}</p>
          )}
        </div>

        {/* Work Style */}
        <div>
          <label className="label-text">Work Style *</label>
          <p className="text-sm text-gray-500 mb-3">
            How does your team typically work?
          </p>
          <div className="flex flex-wrap gap-2">
            {workStyles.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => toggleArrayItem(style, selectedWorkStyles, setSelectedWorkStyles, 'culture.workStyle')}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedWorkStyles.includes(style)
                    ? 'bg-green-100 text-green-800 border-2 border-green-200'
                    : 'bg-gray-100 text-gray-800 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {selectedWorkStyles.includes(style) && (
                  <CheckIcon className="h-3 w-3 mr-1" />
                )}
                {style}
              </button>
            ))}
          </div>
          {errors.culture?.workStyle && (
            <p className="mt-1 text-sm text-red-600">{errors.culture.workStyle.message}</p>
          )}
        </div>

        {/* Benefits */}
        <div>
          <label className="label-text">Benefits & Perks *</label>
          <p className="text-sm text-gray-500 mb-3">
            What benefits do you offer to attract top teams?
          </p>
          <div className="flex flex-wrap gap-2">
            {commonBenefits.map((benefit) => (
              <button
                key={benefit}
                type="button"
                onClick={() => toggleArrayItem(benefit, selectedBenefits, setSelectedBenefits, 'culture.benefits')}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedBenefits.includes(benefit)
                    ? 'bg-purple-100 text-purple-800 border-2 border-purple-200'
                    : 'bg-gray-100 text-gray-800 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {selectedBenefits.includes(benefit) && (
                  <CheckIcon className="h-3 w-3 mr-1" />
                )}
                {benefit}
              </button>
            ))}
          </div>
          {errors.culture?.benefits && (
            <p className="mt-1 text-sm text-red-600">{errors.culture.benefits.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Skip for now
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="loading-spinner mr-2"></div>
                Saving...
              </div>
            ) : (
              'Save Company Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}