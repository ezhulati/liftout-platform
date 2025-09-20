'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { teamApi } from '@/lib/api';

const createTeamSchema = z.object({
  name: z.string().min(5, 'Team name must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  specialization: z.string().min(1, 'Specialization is required for liftout teams'),
  size: z.number().min(2, 'Liftout teams must have at least 2 members').max(20, 'Team size cannot exceed 20'),
  location: z.string().min(1, 'Location is required'),
  remoteStatus: z.enum(['remote', 'hybrid', 'onsite']),
  visibility: z.enum(['open', 'selective', 'confidential']),
  yearsWorkingTogether: z.number().min(0.5, 'Must have worked together for at least 6 months').max(20),
  trackRecord: z.string().min(30, 'Track record description must be at least 30 characters'),
  liftoutExperience: z.enum(['first_time', 'experienced', 'veteran']),
  currentEmployer: z.string().min(1, 'Current employer information is required'),
  availabilityTimeline: z.string().min(1, 'Availability timeline is required'),
  compensationExpectation: z.object({
    min: z.number().min(50000, 'Minimum expectation too low'),
    max: z.number().min(50000, 'Maximum expectation too low'),
    currency: z.string().default('USD'),
  }),
});

type CreateTeamFormData = z.infer<typeof createTeamSchema>;

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

export function CreateTeamForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateTeamFormData>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      size: 4,
      remoteStatus: 'hybrid',
      visibility: 'selective',
      liftoutExperience: 'first_time',
      compensationExpectation: { currency: 'USD' },
    },
  });

  const onSubmit = async (data: CreateTeamFormData) => {
    setIsSubmitting(true);

    try {
      const response = await teamApi.createTeam(data);

      if (response.success) {
        toast.success('Team created successfully!');
        router.push('/app/teams');
      } else {
        toast.error(response.error || 'Failed to create team');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to create team. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Team Profile */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Team Profile for Liftout</h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="label-text">
                Team Name *
              </label>
              <input
                {...register('name')}
                type="text"
                className="input-field"
                placeholder="e.g., Strategic Analytics Core Team, Healthcare AI Innovation Group"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="label-text">
                Team Description & Expertise *
              </label>
              <textarea
                {...register('description')}
                rows={5}
                className="input-field"
                placeholder="Describe your team's expertise, notable achievements, and what makes you a valuable intact unit for acquisition. Include specific outcomes and impact you've delivered together."
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
                <label htmlFor="specialization" className="label-text">
                  Core Specialization *
                </label>
                <input
                  {...register('specialization')}
                  type="text"
                  className="input-field"
                  placeholder="e.g., Quantitative Risk Management, M&A Advisory, Healthcare AI, Strategic Consulting"
                />
                {errors.specialization && (
                  <p className="mt-1 text-sm text-red-600">{errors.specialization.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Team Dynamics & History */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Team Dynamics & History</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="size" className="label-text">
                Team Size *
              </label>
              <input
                {...register('size', { valueAsNumber: true })}
                type="number"
                min="2"
                max="20"
                className="input-field"
                placeholder="Number of core team members"
              />
              {errors.size && (
                <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">Liftouts focus on intact, cohesive teams</p>
            </div>

            <div>
              <label htmlFor="yearsWorkingTogether" className="label-text">
                Years Working Together *
              </label>
              <input
                {...register('yearsWorkingTogether', { valueAsNumber: true })}
                type="number"
                min="0.5"
                max="20"
                step="0.5"
                className="input-field"
                placeholder="e.g., 2.5"
              />
              {errors.yearsWorkingTogether && (
                <p className="mt-1 text-sm text-red-600">{errors.yearsWorkingTogether.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label htmlFor="location" className="label-text">
                Current Location *
              </label>
              <input
                {...register('location')}
                type="text"
                className="input-field"
                placeholder="e.g., New York, NY or London, UK"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="currentEmployer" className="label-text">
                Current Employer *
              </label>
              <input
                {...register('currentEmployer')}
                type="text"
                className="input-field"
                placeholder="e.g., Goldman Sachs, McKinsey & Company"
              />
              {errors.currentEmployer && (
                <p className="mt-1 text-sm text-red-600">{errors.currentEmployer.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="trackRecord" className="label-text">
              Track Record & Achievements *
            </label>
            <textarea
              {...register('trackRecord')}
              rows={4}
              className="input-field"
              placeholder="Describe key achievements, successful projects, and measurable outcomes your team has delivered together. Include specific metrics and impact."
            />
            {errors.trackRecord && (
              <p className="mt-1 text-sm text-red-600">{errors.trackRecord.message}</p>
            )}
          </div>
        </div>

        {/* Liftout Readiness */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Liftout Readiness & Expectations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="liftoutExperience" className="label-text">
                Liftout Experience *
              </label>
              <select {...register('liftoutExperience')} className="input-field">
                <option value="first_time">First-time considering liftout</option>
                <option value="experienced">Have been lifted out before</option>
                <option value="veteran">Multiple liftout experiences</option>
              </select>
            </div>

            <div>
              <label htmlFor="availabilityTimeline" className="label-text">
                Availability Timeline *
              </label>
              <select {...register('availabilityTimeline')} className="input-field">
                <option value="">Select timeline</option>
                <option value="immediate">Immediate (within 1 month)</option>
                <option value="short_term">Short-term (1-3 months)</option>
                <option value="medium_term">Medium-term (3-6 months)</option>
                <option value="long_term">Long-term (6+ months)</option>
                <option value="exploring">Just exploring opportunities</option>
              </select>
              {errors.availabilityTimeline && (
                <p className="mt-1 text-sm text-red-600">{errors.availabilityTimeline.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="label-text">Team Compensation Expectations *</label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <input
                  {...register('compensationExpectation.min', { valueAsNumber: true })}
                  type="number"
                  min="50000"
                  step="10000"
                  className="input-field"
                  placeholder="Min per member"
                />
                {errors.compensationExpectation?.min && (
                  <p className="mt-1 text-sm text-red-600">{errors.compensationExpectation.min.message}</p>
                )}
              </div>
              <div>
                <input
                  {...register('compensationExpectation.max', { valueAsNumber: true })}
                  type="number"
                  min="50000"
                  step="10000"
                  className="input-field"
                  placeholder="Max per member"
                />
                {errors.compensationExpectation?.max && (
                  <p className="mt-1 text-sm text-red-600">{errors.compensationExpectation.max.message}</p>
                )}
              </div>
              <div>
                <select {...register('compensationExpectation.currency')} className="input-field">
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label htmlFor="remoteStatus" className="label-text">
                Preferred Work Style *
              </label>
              <select {...register('remoteStatus')} className="input-field">
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </div>

            <div>
              <label htmlFor="visibility" className="label-text">
                Profile Visibility *
              </label>
              <select {...register('visibility')} className="input-field">
                <option value="open">Open to all companies</option>
                <option value="selective">Selective opportunities only</option>
                <option value="confidential">Confidential (invitation only)</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Open profiles are discoverable by all companies. Selective requires companies to meet certain criteria.
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="loading-spinner mr-2"></div>
                Creating Team Profile...
              </div>
            ) : (
              'Create Team Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}