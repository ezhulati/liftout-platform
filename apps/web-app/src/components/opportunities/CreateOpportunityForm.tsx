'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { opportunityApi } from '@/lib/api';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const createOpportunitySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  location: z.string().min(1, 'Location is required'),
  workStyle: z.enum(['remote', 'hybrid', 'onsite']),
  budget: z.object({
    min: z.number().min(1000, 'Minimum budget must be at least $1,000'),
    max: z.number().min(1000, 'Maximum budget must be at least $1,000'),
    currency: z.string().default('USD'),
  }),
  duration: z.object({
    value: z.number().min(1, 'Duration must be at least 1'),
    unit: z.enum(['weeks', 'months']),
  }),
  teamSize: z.object({
    min: z.number().min(1, 'Minimum team size must be at least 1'),
    max: z.number().min(1, 'Maximum team size must be at least 1'),
  }),
  deadline: z.string().min(1, 'Application deadline is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  requirements: z.string().min(20, 'Requirements must be at least 20 characters'),
  deliverables: z.string().min(20, 'Deliverables must be at least 20 characters'),
});

type CreateOpportunityFormData = z.infer<typeof createOpportunitySchema>;

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Consulting',
  'Media & Entertainment',
  'Non-profit',
  'Government',
  'Real Estate',
  'Other',
];

const commonSkills = [
  'React', 'Node.js', 'TypeScript', 'Python', 'Java', 'C#', '.NET',
  'Angular', 'Vue.js', 'Next.js', 'Express.js', 'Django', 'Flask',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'AWS', 'Azure', 'GCP',
  'Docker', 'Kubernetes', 'GraphQL', 'REST API', 'Microservices',
  'UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Sketch',
  'Mobile Development', 'React Native', 'Flutter', 'iOS', 'Android',
  'Machine Learning', 'Data Science', 'TensorFlow', 'PyTorch',
  'DevOps', 'CI/CD', 'Terraform', 'Ansible',
];

export function CreateOpportunityForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<CreateOpportunityFormData>({
    resolver: zodResolver(createOpportunitySchema),
    defaultValues: {
      budget: { currency: 'USD' },
      duration: { unit: 'months' },
      teamSize: { min: 1, max: 5 },
      skills: [],
    },
  });

  const { fields: skillFields, append: addSkill, remove: removeSkill } = useFieldArray({
    control,
    name: 'skills',
  });

  const watchedBudgetMin = watch('budget.min');
  const watchedTeamSizeMin = watch('teamSize.min');

  const onSubmit = async (data: CreateOpportunityFormData) => {
    // Validate budget range
    if (data.budget.max < data.budget.min) {
      toast.error('Maximum budget must be greater than minimum budget');
      return;
    }

    // Validate team size range
    if (data.teamSize.max < data.teamSize.min) {
      toast.error('Maximum team size must be greater than minimum team size');
      return;
    }

    // Validate deadline is in the future
    if (new Date(data.deadline) <= new Date()) {
      toast.error('Deadline must be in the future');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await opportunityApi.createOpportunity(data);

      if (response.success) {
        toast.success('Opportunity posted successfully!');
        router.push('/app/opportunities');
      } else {
        toast.error(response.error || 'Failed to post opportunity');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to post opportunity. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    const currentSkills = skillFields.map((field: any) => field.value || field);
    if (trimmedSkill && !currentSkills.includes(trimmedSkill)) {
      addSkill(trimmedSkill);
      setSkillInput('');
    }
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(skillInput);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h3>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="label-text">
                Opportunity Title *
              </label>
              <input
                {...register('title')}
                type="text"
                className="input-field"
                placeholder="e.g., E-commerce Platform Development"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="label-text">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={5}
                className="input-field"
                placeholder="Provide a detailed description of the project, goals, and expectations..."
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
                <label htmlFor="workStyle" className="label-text">
                  Work Style *
                </label>
                <select {...register('workStyle')} className="input-field">
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="location" className="label-text">
                Location *
              </label>
              <input
                {...register('location')}
                type="text"
                className="input-field"
                placeholder="e.g., San Francisco, CA or Global/Remote"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-6">Project Details</h3>
          
          <div className="space-y-6">
            {/* Budget */}
            <div>
              <label className="label-text">Budget Range (USD) *</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    {...register('budget.min', { valueAsNumber: true })}
                    type="number"
                    min="1000"
                    step="1000"
                    className="input-field"
                    placeholder="Minimum budget"
                  />
                  {errors.budget?.min && (
                    <p className="mt-1 text-sm text-red-600">{errors.budget.min.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register('budget.max', { valueAsNumber: true })}
                    type="number"
                    min={watchedBudgetMin || 1000}
                    step="1000"
                    className="input-field"
                    placeholder="Maximum budget"
                  />
                  {errors.budget?.max && (
                    <p className="mt-1 text-sm text-red-600">{errors.budget.max.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="label-text">Project Duration *</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    {...register('duration.value', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="input-field"
                    placeholder="Duration"
                  />
                  {errors.duration?.value && (
                    <p className="mt-1 text-sm text-red-600">{errors.duration.value.message}</p>
                  )}
                </div>
                <div>
                  <select {...register('duration.unit')} className="input-field">
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Team Size */}
            <div>
              <label className="label-text">Team Size *</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    {...register('teamSize.min', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="input-field"
                    placeholder="Minimum team size"
                  />
                  {errors.teamSize?.min && (
                    <p className="mt-1 text-sm text-red-600">{errors.teamSize.min.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register('teamSize.max', { valueAsNumber: true })}
                    type="number"
                    min={watchedTeamSizeMin || 1}
                    className="input-field"
                    placeholder="Maximum team size"
                  />
                  {errors.teamSize?.max && (
                    <p className="mt-1 text-sm text-red-600">{errors.teamSize.max.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label htmlFor="deadline" className="label-text">
                Application Deadline *
              </label>
              <input
                {...register('deadline')}
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="input-field"
              />
              {errors.deadline && (
                <p className="mt-1 text-sm text-red-600">{errors.deadline.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Skills & Requirements */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-6">Skills & Requirements</h3>
          
          <div className="space-y-6">
            {/* Skills */}
            <div>
              <label className="label-text">Required Skills *</label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={handleSkillKeyPress}
                    className="input-field flex-1"
                    placeholder="Type a skill and press Enter"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(skillInput)}
                    className="btn-secondary"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Common skills suggestions */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500">Suggestions:</span>
                  {commonSkills.slice(0, 8).map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleAddSkill(skill)}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                    >
                      {skill}
                    </button>
                  ))}
                </div>

                {/* Selected skills */}
                {skillFields.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skillFields.map((field: any, index) => (
                      <span
                        key={field.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                      >
                        {field.value || field}
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="ml-2 text-primary-600 hover:text-primary-800"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {errors.skills && (
                <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
              )}
            </div>

            {/* Requirements */}
            <div>
              <label htmlFor="requirements" className="label-text">
                Requirements *
              </label>
              <textarea
                {...register('requirements')}
                rows={4}
                className="input-field"
                placeholder="Describe specific requirements, experience level, and qualifications..."
              />
              {errors.requirements && (
                <p className="mt-1 text-sm text-red-600">{errors.requirements.message}</p>
              )}
            </div>

            {/* Deliverables */}
            <div>
              <label htmlFor="deliverables" className="label-text">
                Deliverables *
              </label>
              <textarea
                {...register('deliverables')}
                rows={4}
                className="input-field"
                placeholder="List the expected deliverables and milestones..."
              />
              {errors.deliverables && (
                <p className="mt-1 text-sm text-red-600">{errors.deliverables.message}</p>
              )}
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
                Posting Liftout Opportunity...
              </div>
            ) : (
              'Post Liftout Opportunity'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}