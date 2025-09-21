'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useCreateTeam } from '@/hooks/useTeams';

const memberSchema = z.object({
  name: z.string().min(2, 'Member name is required'),
  role: z.string().min(2, 'Member role is required'),
  experience: z.number().min(0, 'Experience must be 0 or greater').max(50),
  skills: z.array(z.string().min(1)).min(1, 'At least one skill is required'),
});

const createTeamSchema = z.object({
  name: z.string().min(5, 'Team name must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  location: z.string().min(1, 'Location is required'),
  members: z.array(memberSchema).min(2, 'Team must have at least 2 members'),
  compensation: z.object({
    range: z.string().min(1, 'Compensation range is required'),
    equity: z.boolean(),
    benefits: z.string(),
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
  const [skillInput, setSkillInput] = useState<{ [key: number]: string }>({});
  const router = useRouter();
  const createTeamMutation = useCreateTeam();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<CreateTeamFormData>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      members: [
        { name: '', role: '', experience: 0, skills: [] },
        { name: '', role: '', experience: 0, skills: [] },
      ],
      compensation: {
        range: '',
        equity: false,
        benefits: 'Standard',
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
  });

  const onSubmit = async (data: CreateTeamFormData) => {
    try {
      await createTeamMutation.mutateAsync(data);
      toast.success('Team created successfully!');
      router.push('/app/teams');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create team');
    }
  };

  const addSkill = (memberIndex: number, skill: string) => {
    if (!skill.trim()) return;
    
    const currentMembers = watch('members');
    const updatedMembers = [...currentMembers];
    updatedMembers[memberIndex].skills = [...updatedMembers[memberIndex].skills, skill.trim()];
    
    // Update the form with the new skills
    const event = new Event('input', { bubbles: true });
    document.dispatchEvent(event);
    
    setSkillInput({ ...skillInput, [memberIndex]: '' });
  };

  const removeSkill = (memberIndex: number, skillIndex: number) => {
    const currentMembers = watch('members');
    const updatedMembers = [...currentMembers];
    updatedMembers[memberIndex].skills.splice(skillIndex, 1);
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Team Basic Info */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Team Profile</h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="label-text">
                Team Name *
              </label>
              <input
                {...register('name')}
                type="text"
                className="input-field"
                placeholder="e.g., Strategic Analytics Core Team"
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
                rows={4}
                className="input-field"
                placeholder="Describe your team's expertise, achievements, and what makes you valuable for liftout..."
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
                <label htmlFor="location" className="label-text">
                  Location *
                </label>
                <input
                  {...register('location')}
                  type="text"
                  className="input-field"
                  placeholder="e.g., San Francisco, CA or Remote"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
            <button
              type="button"
              onClick={() => append({ name: '', role: '', experience: 0, skills: [] })}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              + Add Member
            </button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-md font-medium text-gray-800">Member {index + 1}</h4>
                {fields.length > 2 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label-text">Name *</label>
                  <input
                    {...register(`members.${index}.name`)}
                    type="text"
                    className="input-field"
                    placeholder="Full name"
                  />
                  {errors.members?.[index]?.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.members[index]?.name?.message}</p>
                  )}
                </div>

                <div>
                  <label className="label-text">Role *</label>
                  <input
                    {...register(`members.${index}.role`)}
                    type="text"
                    className="input-field"
                    placeholder="e.g., Senior Data Scientist"
                  />
                  {errors.members?.[index]?.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.members[index]?.role?.message}</p>
                  )}
                </div>

                <div>
                  <label className="label-text">Years Experience *</label>
                  <input
                    {...register(`members.${index}.experience`, { valueAsNumber: true })}
                    type="number"
                    min="0"
                    max="50"
                    className="input-field"
                    placeholder="5"
                  />
                  {errors.members?.[index]?.experience && (
                    <p className="mt-1 text-sm text-red-600">{errors.members[index]?.experience?.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="label-text">Skills *</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {watch(`members.${index}.skills`)?.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index, skillIndex)}
                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput[index] || ''}
                    onChange={(e) => setSkillInput({ ...skillInput, [index]: e.target.value })}
                    className="input-field flex-1"
                    placeholder="Add a skill and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(index, skillInput[index] || '');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addSkill(index, skillInput[index] || '')}
                    className="px-3 py-2 text-sm bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200"
                  >
                    Add
                  </button>
                </div>
                {errors.members?.[index]?.skills && (
                  <p className="mt-1 text-sm text-red-600">{errors.members[index]?.skills?.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Compensation */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Compensation Expectations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="compensation.range" className="label-text">
                Salary Range *
              </label>
              <input
                {...register('compensation.range')}
                type="text"
                className="input-field"
                placeholder="e.g., $150k-$250k per person"
              />
              {errors.compensation?.range && (
                <p className="mt-1 text-sm text-red-600">{errors.compensation.range.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="compensation.benefits" className="label-text">
                Benefits Package
              </label>
              <input
                {...register('compensation.benefits')}
                type="text"
                className="input-field"
                placeholder="e.g., Full package, Health/Dental/Vision"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center">
              <input
                {...register('compensation.equity')}
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Open to equity participation</span>
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
            disabled={createTeamMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createTeamMutation.isPending ? 'Creating...' : 'Create Team Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}