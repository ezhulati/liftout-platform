'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import {
  CurrencyDollarIcon,
  MapPinIcon,
  CalendarDaysIcon,
  SparklesIcon,
  CheckIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { FormField, ButtonGroup, TextLink } from '@/components/ui';

const liftoutPreferencesSchema = z.object({
  availability: z.enum(['immediately', '1-3months', '3-6months', '6months+', 'exploring']),
  compensationType: z.enum(['salary', 'equity', 'package', 'flexible']),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  equityImportance: z.enum(['essential', 'important', 'nice', 'not-important']),
  locationPreference: z.enum(['remote', 'hybrid', 'onsite', 'flexible']),
  preferredLocations: z.array(z.string()),
  relocationWillingness: z.boolean(),
  companySize: z.array(z.enum(['startup', 'scaleup', 'midsize', 'enterprise'])),
  industryPreferences: z.array(z.string()),
  dealbreakers: z.array(z.string()),
  priorities: z.array(z.string()).min(1, 'Please select at least one priority'),
});

type LiftoutPreferencesFormData = z.infer<typeof liftoutPreferencesSchema>;

interface LiftoutPreferencesProps {
  onComplete: () => void;
  onSkip?: () => void;
}

const availabilityOptions = [
  { value: 'immediately', label: 'Immediately available', description: 'Ready to move right away' },
  { value: '1-3months', label: '1-3 months', description: 'Need some time to transition' },
  { value: '3-6months', label: '3-6 months', description: 'Planning ahead' },
  { value: '6months+', label: '6+ months', description: 'Long-term planning' },
  { value: 'exploring', label: 'Just exploring', description: 'Open to the right opportunity' },
];

const companySizeOptions = [
  { value: 'startup', label: 'Startup', description: '<50 employees' },
  { value: 'scaleup', label: 'Scale-up', description: '50-200 employees' },
  { value: 'midsize', label: 'Mid-size', description: '200-1000 employees' },
  { value: 'enterprise', label: 'Enterprise', description: '1000+ employees' },
];

const industries = [
  'Financial Services', 'Investment Banking', 'Private Equity',
  'Management Consulting', 'Healthcare Technology', 'Biotechnology',
  'Enterprise Software', 'Fintech', 'Legal Services',
  'Advertising & Marketing', 'Consumer Tech', 'E-commerce',
];

const priorities = [
  { value: 'compensation', label: 'Competitive compensation', description: 'Best total package' },
  { value: 'equity', label: 'Equity upside', description: 'Significant ownership stake' },
  { value: 'culture', label: 'Team culture fit', description: 'Values and working style alignment' },
  { value: 'growth', label: 'Career growth', description: 'Clear advancement path' },
  { value: 'impact', label: 'High impact work', description: 'Meaningful contributions' },
  { value: 'stability', label: 'Stability', description: 'Established company, lower risk' },
  { value: 'autonomy', label: 'Autonomy', description: 'Independence and decision-making power' },
  { value: 'flexibility', label: 'Work flexibility', description: 'Remote/hybrid options' },
  { value: 'learning', label: 'Learning opportunities', description: 'Skill development' },
  { value: 'leadership', label: 'Leadership role', description: 'Team or function leadership' },
];

const dealbreakers = [
  'No remote work options',
  'Below-market compensation',
  'No equity participation',
  'Excessive travel requirements',
  'Toxic work culture indicators',
  'No clear career path',
  'Non-compete agreements',
  'Mandatory relocation',
  'Small team (<5 people)',
  'High-risk financial situation',
];

const locations = [
  'San Francisco Bay Area', 'New York City', 'Los Angeles', 'Seattle',
  'Boston', 'Austin', 'Chicago', 'Denver', 'Miami', 'Washington DC',
  'London', 'Singapore', 'Hong Kong', 'Remote (US)', 'Remote (Global)',
];

export function LiftoutPreferences({ onComplete, onSkip }: LiftoutPreferencesProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCompanySizes, setSelectedCompanySizes] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedDealbreakers, setSelectedDealbreakers] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LiftoutPreferencesFormData>({
    resolver: zodResolver(liftoutPreferencesSchema),
    defaultValues: {
      availability: 'exploring',
      compensationType: 'package',
      equityImportance: 'important',
      locationPreference: 'flexible',
      relocationWillingness: false,
      companySize: [],
      industryPreferences: [],
      dealbreakers: [],
      priorities: [],
      preferredLocations: [],
    },
  });

  const availability = watch('availability');
  const locationPreference = watch('locationPreference');
  const compensationType = watch('compensationType');

  const toggleCompanySize = (size: string) => {
    const newSizes = selectedCompanySizes.includes(size)
      ? selectedCompanySizes.filter(s => s !== size)
      : [...selectedCompanySizes, size];
    setSelectedCompanySizes(newSizes);
    setValue('companySize', newSizes as ('startup' | 'scaleup' | 'midsize' | 'enterprise')[]);
  };

  const toggleIndustry = (industry: string) => {
    const newIndustries = selectedIndustries.includes(industry)
      ? selectedIndustries.filter(i => i !== industry)
      : [...selectedIndustries, industry];
    setSelectedIndustries(newIndustries);
    setValue('industryPreferences', newIndustries);
  };

  const togglePriority = (priority: string) => {
    const newPriorities = selectedPriorities.includes(priority)
      ? selectedPriorities.filter(p => p !== priority)
      : [...selectedPriorities, priority];
    setSelectedPriorities(newPriorities);
    setValue('priorities', newPriorities);
  };

  const toggleDealbreaker = (dealbreaker: string) => {
    const newDealbreakers = selectedDealbreakers.includes(dealbreaker)
      ? selectedDealbreakers.filter(d => d !== dealbreaker)
      : [...selectedDealbreakers, dealbreaker];
    setSelectedDealbreakers(newDealbreakers);
    setValue('dealbreakers', newDealbreakers);
  };

  const toggleLocation = (location: string) => {
    const newLocations = selectedLocations.includes(location)
      ? selectedLocations.filter(l => l !== location)
      : [...selectedLocations, location];
    setSelectedLocations(newLocations);
    setValue('preferredLocations', newLocations);
  };

  const onSubmit = async (data: LiftoutPreferencesFormData) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Liftout preferences:', data);
      toast.success('Preferences saved! We\'ll match you with relevant opportunities.');
      onComplete();
    } catch (error) {
      toast.error('Failed to save preferences');
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
        <SparklesIcon className="mx-auto h-12 w-12 text-navy" />
        <h3 className="mt-2 text-lg font-bold text-text-primary">
          Liftout preferences
        </h3>
        <p className="mt-1 text-base text-text-secondary">
          Help us match you with the right opportunities. These preferences are kept confidential.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Availability */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <CalendarDaysIcon className="h-5 w-5 mr-2 text-text-tertiary" />
            Availability
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availabilityOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                  availability === option.value
                    ? 'border-navy bg-navy-50'
                    : 'border-border hover:border-navy-200'
                }`}
              >
                <input
                  {...register('availability')}
                  type="radio"
                  value={option.value}
                  className="mt-1 h-5 w-5 text-navy focus:ring-navy"
                />
                <div>
                  <span className="text-base font-bold text-text-primary">{option.label}</span>
                  <p className="text-sm text-text-tertiary">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Compensation */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <CurrencyDollarIcon className="h-5 w-5 mr-2 text-text-tertiary" />
            Compensation preferences
          </h4>

          <FormField label="Compensation focus" name="compensationType" required>
            <select {...register('compensationType')} className="input-field">
              <option value="salary">Base salary focused</option>
              <option value="equity">Equity focused</option>
              <option value="package">Total package (salary + equity)</option>
              <option value="flexible">Flexible</option>
            </select>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Minimum salary expectation" name="salaryMin">
              <input
                {...register('salaryMin', { valueAsNumber: true })}
                type="number"
                min={0}
                step={10000}
                className="input-field"
                placeholder="150000"
              />
            </FormField>

            <FormField label="Target salary" name="salaryMax">
              <input
                {...register('salaryMax', { valueAsNumber: true })}
                type="number"
                min={0}
                step={10000}
                className="input-field"
                placeholder="250000"
              />
            </FormField>
          </div>

          <FormField label="Equity importance" name="equityImportance" required>
            <select {...register('equityImportance')} className="input-field">
              <option value="essential">Essential - must have significant equity</option>
              <option value="important">Important - meaningful equity expected</option>
              <option value="nice">Nice to have - not a dealbreaker</option>
              <option value="not-important">Not important - prefer cash compensation</option>
            </select>
          </FormField>
        </div>

        {/* Location */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2 text-text-tertiary" />
            Location preferences
          </h4>

          <FormField label="Work arrangement" name="locationPreference" required>
            <select {...register('locationPreference')} className="input-field">
              <option value="remote">Fully remote</option>
              <option value="hybrid">Hybrid (office + remote)</option>
              <option value="onsite">On-site preferred</option>
              <option value="flexible">Flexible / No preference</option>
            </select>
          </FormField>

          {locationPreference !== 'remote' && (
            <>
              <div>
                <label className="label-text">Preferred locations</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {locations.map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => toggleLocation(location)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-9 ${
                        selectedLocations.includes(location)
                          ? 'bg-navy text-white'
                          : 'bg-bg-alt text-text-secondary hover:bg-navy-50'
                      }`}
                    >
                      {selectedLocations.includes(location) && (
                        <CheckIcon className="h-4 w-4 mr-1.5" />
                      )}
                      {location}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 p-4 bg-bg-alt rounded-xl cursor-pointer">
                <input
                  {...register('relocationWillingness')}
                  type="checkbox"
                  className="h-5 w-5 text-navy rounded focus:ring-navy"
                />
                <div>
                  <span className="text-base font-bold text-text-primary">Willing to relocate</span>
                  <p className="text-sm text-text-tertiary">Open to moving for the right opportunity</p>
                </div>
              </label>
            </>
          )}
        </div>

        {/* Company Preferences */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary">
            Company preferences
          </h4>

          <div>
            <label className="label-text">Preferred company size</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {companySizeOptions.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => toggleCompanySize(size.value)}
                  className={`flex flex-col items-start p-4 border rounded-xl transition-colors text-left min-h-12 ${
                    selectedCompanySizes.includes(size.value)
                      ? 'border-navy bg-navy-50'
                      : 'border-border hover:border-navy-200'
                  }`}
                >
                  <span className="font-bold text-text-primary">{size.label}</span>
                  <span className="text-sm text-text-tertiary">{size.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-text">Industry preferences</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {industries.map((industry) => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => toggleIndustry(industry)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-9 ${
                    selectedIndustries.includes(industry)
                      ? 'bg-success-light text-success-dark border-2 border-success/30'
                      : 'bg-bg-alt text-text-secondary border-2 border-transparent hover:bg-success-light/50'
                  }`}
                >
                  {selectedIndustries.includes(industry) && (
                    <CheckIcon className="h-4 w-4 mr-1.5" />
                  )}
                  {industry}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Priorities */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary">
            What matters most to you? *
          </h4>
          <p className="text-sm text-text-tertiary">
            Select your top priorities for your next opportunity.
          </p>
          {errors.priorities && (
            <p className="text-sm text-error">{errors.priorities.message}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {priorities.map((priority) => (
              <button
                key={priority.value}
                type="button"
                onClick={() => togglePriority(priority.value)}
                className={`flex items-start gap-3 p-4 border rounded-xl transition-colors text-left min-h-12 ${
                  selectedPriorities.includes(priority.value)
                    ? 'border-navy bg-navy-50'
                    : 'border-border hover:border-navy-200'
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  selectedPriorities.includes(priority.value)
                    ? 'bg-navy text-white'
                    : 'bg-bg-alt'
                }`}>
                  {selectedPriorities.includes(priority.value) && (
                    <CheckIcon className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <span className="font-bold text-text-primary">{priority.label}</span>
                  <p className="text-sm text-text-tertiary">{priority.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dealbreakers */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary">
            Dealbreakers (optional)
          </h4>
          <p className="text-sm text-text-tertiary">
            Select factors that would automatically disqualify an opportunity.
          </p>

          <div className="flex flex-wrap gap-2">
            {dealbreakers.map((dealbreaker) => (
              <button
                key={dealbreaker}
                type="button"
                onClick={() => toggleDealbreaker(dealbreaker)}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-9 ${
                  selectedDealbreakers.includes(dealbreaker)
                    ? 'bg-error-light text-error border-2 border-error/30'
                    : 'bg-bg-alt text-text-secondary border-2 border-transparent hover:bg-error-light/50'
                }`}
              >
                {selectedDealbreakers.includes(dealbreaker) && (
                  <CheckIcon className="h-4 w-4 mr-1.5" />
                )}
                {dealbreaker}
              </button>
            ))}
          </div>
        </div>

        {/* Confidentiality Notice */}
        <div className="bg-navy-50 border border-navy-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <InformationCircleIcon className="h-5 w-5 text-navy flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-navy-900">Your preferences are confidential</p>
              <p className="text-sm text-navy-700 mt-1">
                This information is used only to match you with relevant opportunities. Companies will not see your specific preferences unless you choose to share them during discussions.
              </p>
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
                  Saving...
                </span>
              ) : (
                'Save preferences'
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
