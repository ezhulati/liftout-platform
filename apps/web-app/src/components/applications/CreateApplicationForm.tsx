'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useCreateApplication } from '@/hooks/useApplications';
import { useTeams } from '@/hooks/useTeams';
import { useSession } from 'next-auth/react';

const createApplicationSchema = z.object({
  teamId: z.string().min(1, 'Please select a team'),
  coverLetter: z.string().min(100, 'Cover letter must be at least 100 characters'),
  whyInterested: z.string().min(50, 'Please explain why you\'re interested (minimum 50 characters)'),
  questionsForCompany: z.string().optional(),
  availabilityTimeline: z.string().min(1, 'Please specify your availability timeline'),
  compensationExpectations: z.string().optional(),
  teamLead: z.object({
    name: z.string().min(2, 'Team lead name is required'),
    role: z.string().min(2, 'Team lead role is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
  }),
});

type CreateApplicationFormData = z.infer<typeof createApplicationSchema>;

interface CreateApplicationFormProps {
  opportunityId: string;
  opportunityTitle: string;
  companyName: string;
}

export function CreateApplicationForm({ 
  opportunityId, 
  opportunityTitle, 
  companyName 
}: CreateApplicationFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const createApplicationMutation = useCreateApplication();
  const { data: teams = [], isLoading: teamsLoading } = useTeams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateApplicationFormData>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: {
      teamLead: {
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        role: 'Team Lead',
      },
    },
  });

  const onSubmit = async (data: CreateApplicationFormData) => {
    try {
      await createApplicationMutation.mutateAsync({
        opportunityId,
        ...data,
      });
      toast.success('Expression of interest submitted successfully!');
      router.push('/app/applications');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application');
    }
  };

  if (teamsLoading) {
    return (
      <div className=\"card animate-pulse\">
        <div className=\"h-96 bg-gray-200 rounded\"></div>
      </div>
    );
  }

  return (
    <div className=\"card\">
      <div className=\"mb-6\">
        <h2 className=\"text-xl font-semibold text-gray-900 mb-2\">
          Express Interest in Liftout Opportunity
        </h2>
        <div className=\"bg-blue-50 border border-blue-200 rounded-lg p-4\">
          <h3 className=\"font-medium text-blue-900\">{opportunityTitle}</h3>
          <p className=\"text-blue-700 text-sm\">{companyName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className=\"space-y-6\">
        {/* Team Selection */}
        <div>
          <label htmlFor=\"teamId\" className=\"label-text\">
            Select Your Team *
          </label>
          <select {...register('teamId')} className=\"input-field\">
            <option value=\"\">Choose the team applying for this opportunity</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name} ({team.size || team.members?.length || 0} members)
              </option>
            ))}
          </select>
          {errors.teamId && (
            <p className=\"mt-1 text-sm text-red-600\">{errors.teamId.message}</p>
          )}
        </div>

        {/* Cover Letter */}
        <div>
          <label htmlFor=\"coverLetter\" className=\"label-text\">
            Cover Letter *
          </label>
          <textarea
            {...register('coverLetter')}
            rows={6}
            className=\"input-field\"
            placeholder=\"Introduce your team and explain why you would be a perfect fit for this liftout opportunity. Highlight your team's experience, achievements, and what makes you work well together...\"
          />
          {errors.coverLetter && (
            <p className=\"mt-1 text-sm text-red-600\">{errors.coverLetter.message}</p>
          )}
        </div>

        {/* Why Interested */}
        <div>
          <label htmlFor=\"whyInterested\" className=\"label-text\">
            Why This Opportunity Interests Your Team *
          </label>
          <textarea
            {...register('whyInterested')}
            rows={4}
            className=\"input-field\"
            placeholder=\"Explain what specifically interests your team about this opportunity, the company, and how it aligns with your career goals...\"
          />
          {errors.whyInterested && (
            <p className=\"mt-1 text-sm text-red-600\">{errors.whyInterested.message}</p>
          )}
        </div>

        {/* Availability Timeline */}
        <div>
          <label htmlFor=\"availabilityTimeline\" className=\"label-text\">
            Availability Timeline *
          </label>
          <select {...register('availabilityTimeline')} className=\"input-field\">
            <option value=\"\">Select your availability</option>
            <option value=\"Immediately available\">Immediately available</option>
            <option value=\"Available within 2 weeks\">Available within 2 weeks</option>
            <option value=\"Available within 1 month\">Available within 1 month</option>
            <option value=\"Available within 2 months\">Available within 2 months</option>
            <option value=\"Available within 3 months\">Available within 3 months</option>
            <option value=\"Flexible timeline\">Flexible timeline</option>
          </select>
          {errors.availabilityTimeline && (
            <p className=\"mt-1 text-sm text-red-600\">{errors.availabilityTimeline.message}</p>
          )}
        </div>

        {/* Team Lead Information */}
        <div>
          <h3 className=\"text-lg font-medium text-gray-900 mb-4\">Team Lead Contact Information</h3>
          
          <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
            <div>
              <label htmlFor=\"teamLead.name\" className=\"label-text\">
                Name *
              </label>
              <input
                {...register('teamLead.name')}
                type=\"text\"
                className=\"input-field\"
                placeholder=\"Team lead full name\"
              />
              {errors.teamLead?.name && (
                <p className=\"mt-1 text-sm text-red-600\">{errors.teamLead.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor=\"teamLead.role\" className=\"label-text\">
                Role/Title *
              </label>
              <input
                {...register('teamLead.role')}
                type=\"text\"
                className=\"input-field\"
                placeholder=\"e.g., Senior Data Scientist, Engineering Manager\"
              />
              {errors.teamLead?.role && (
                <p className=\"mt-1 text-sm text-red-600\">{errors.teamLead.role.message}</p>
              )}
            </div>

            <div>
              <label htmlFor=\"teamLead.email\" className=\"label-text\">
                Email *
              </label>
              <input
                {...register('teamLead.email')}
                type=\"email\"
                className=\"input-field\"
                placeholder=\"team.lead@company.com\"
              />
              {errors.teamLead?.email && (
                <p className=\"mt-1 text-sm text-red-600\">{errors.teamLead.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor=\"teamLead.phone\" className=\"label-text\">
                Phone (Optional)
              </label>
              <input
                {...register('teamLead.phone')}
                type=\"tel\"
                className=\"input-field\"
                placeholder=\"+1 (555) 123-4567\"
              />
            </div>
          </div>
        </div>

        {/* Optional Fields */}
        <div>
          <label htmlFor=\"compensationExpectations\" className=\"label-text\">
            Compensation Expectations (Optional)
          </label>
          <textarea
            {...register('compensationExpectations')}
            rows={3}
            className=\"input-field\"
            placeholder=\"Share any specific compensation expectations or requirements for your team...\"
          />
        </div>

        <div>
          <label htmlFor=\"questionsForCompany\" className=\"label-text\">
            Questions for the Company (Optional)
          </label>
          <textarea
            {...register('questionsForCompany')}
            rows={3}
            className=\"input-field\"
            placeholder=\"Any questions about the opportunity, company culture, integration process, or other aspects you'd like to discuss...\"
          />
        </div>

        {/* Submit */}
        <div className=\"flex justify-end space-x-3 pt-6 border-t border-gray-200\">
          <button
            type=\"button\"
            onClick={() => router.back()}
            className=\"px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500\"
          >
            Cancel
          </button>
          <button
            type=\"submit\"
            disabled={createApplicationMutation.isPending}
            className=\"px-6 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed\"
          >
            {createApplicationMutation.isPending ? 'Submitting...' : 'Submit Expression of Interest'}
          </button>
        </div>
      </form>
    </div>
  );
}