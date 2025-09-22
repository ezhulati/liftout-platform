'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

const memberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Member name is required'),
  role: z.string().min(2, 'Member role is required'),
  experience: z.number().min(0, 'Experience must be 0 or greater').max(50),
  skills: z.array(z.string().min(1)).min(1, 'At least one skill is required'),
});

const editTeamSchema = z.object({
  name: z.string().min(5, 'Team name must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  location: z.string().min(1, 'Location is required'),
  members: z.array(memberSchema).min(2, 'Team must have at least 2 members'),
  achievements: z.array(z.string()).default([]),
  compensation: z.object({
    range: z.string().min(1, 'Compensation range is required'),
    equity: z.boolean(),
    benefits: z.string(),
  }),
  availability: z.string().min(1, 'Availability status is required'),
  openToLiftout: z.boolean(),
});

type EditTeamFormData = z.infer<typeof editTeamSchema>;

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

interface EditTeamFormProps {
  teamId: string;
}

export function EditTeamForm({ teamId }: EditTeamFormProps) {
  const [skillInput, setSkillInput] = useState<{ [key: number]: string }>({});
  const [achievementInput, setAchievementInput] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch existing team data
  const { data: team, isLoading: isLoadingTeam } = useQuery({
    queryKey: ['team', teamId],
    queryFn: async () => {
      const response = await fetch(`/api/teams/${teamId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch team');
      }
      const data = await response.json();
      return data.team;
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<EditTeamFormData>({
    resolver: zodResolver(editTeamSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
  });

  // Update team mutation
  const updateTeamMutation = useMutation({
    mutationFn: async (data: EditTeamFormData) => {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update team');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Team updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['team', teamId] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      router.push(`/app/teams/${teamId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Initialize form with existing team data
  useEffect(() => {
    if (team) {
      reset({
        name: team.name,
        description: team.description,
        industry: team.industry,
        location: team.location,
        members: team.members,
        achievements: team.achievements || [],
        compensation: team.compensation,
        availability: team.availability,
        openToLiftout: team.openToLiftout,
      });
    }
  }, [team, reset]);

  const onSubmit = async (data: EditTeamFormData) => {
    updateTeamMutation.mutate(data);
  };

  const addSkill = (memberIndex: number, skill: string) => {
    if (!skill.trim()) return;
    
    const currentMembers = watch('members');
    const currentMember = currentMembers[memberIndex];
    
    if (currentMember.skills.includes(skill.trim())) {
      toast.error('Skill already added');
      return;
    }
    
    const updatedMembers = [...currentMembers];
    updatedMembers[memberIndex] = {
      ...currentMember,
      skills: [...currentMember.skills, skill.trim()]
    };
    
    setValue('members', updatedMembers);
    setSkillInput({ ...skillInput, [memberIndex]: '' });
  };

  const removeSkill = (memberIndex: number, skillIndex: number) => {
    const currentMembers = watch('members');
    const updatedMembers = [...currentMembers];
    const updatedSkills = [...updatedMembers[memberIndex].skills];
    updatedSkills.splice(skillIndex, 1);
    
    updatedMembers[memberIndex] = {
      ...updatedMembers[memberIndex],
      skills: updatedSkills
    };
    
    setValue('members', updatedMembers);
  };

  const addAchievement = () => {
    if (!achievementInput.trim()) return;
    
    const currentAchievements = watch('achievements') || [];
    setValue('achievements', [...currentAchievements, achievementInput.trim()]);
    setAchievementInput('');
  };

  const removeAchievement = (index: number) => {
    const currentAchievements = watch('achievements') || [];
    const updatedAchievements = [...currentAchievements];
    updatedAchievements.splice(index, 1);
    setValue('achievements', updatedAchievements);
  };

  if (isLoadingTeam) {
    return (
      <div className="card">
        <div className="px-6 py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Team Info */}
        <div className="px-6 py-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Team Information</h3>
          
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
                placeholder="Describe your team's expertise, achievements, and what makes you valuable for liftout opportunities..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Minimum 50 characters. Be specific about your team's achievements and expertise.
              </p>
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
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
            <button
              type="button"
              onClick={() => append({ name: '', role: '', experience: 0, skills: [] })}
              className="btn-sm btn-primary flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Member
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
                    className="text-sm text-red-600 hover:text-red-700 flex items-center"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
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
                <div className="flex flex-wrap gap-2 mb-2 min-h-[2rem] p-2 border border-gray-200 rounded-md bg-gray-50">
                  {watch(`members.${index}.skills`)?.length > 0 ? (
                    watch(`members.${index}.skills`)?.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(index, skillIndex)}
                          className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:outline-none"
                          title="Remove skill"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 italic">No skills added yet</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput[index] || ''}
                    onChange={(e) => setSkillInput({ ...skillInput, [index]: e.target.value })}
                    className="input-field flex-1"
                    placeholder="e.g., Python, Machine Learning, Financial Modeling"
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
                    className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                    disabled={!skillInput[index]?.trim()}
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

        {/* Achievements */}
        <div className="px-6 py-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Team Achievements</h3>
          
          <div className="space-y-3">
            {watch('achievements')?.map((achievement, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-700">{achievement}</span>
                <button
                  type="button"
                  onClick={() => removeAchievement(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={achievementInput}
              onChange={(e) => setAchievementInput(e.target.value)}
              className="input-field flex-1"
              placeholder="Add a team achievement or highlight..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addAchievement();
                }
              }}
            />
            <button
              type="button"
              onClick={addAchievement}
              className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              disabled={!achievementInput.trim()}
            >
              Add
            </button>
          </div>
        </div>

        {/* Compensation & Availability */}
        <div className="px-6 py-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Compensation & Availability</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="compensation.range" className="label-text">
                Compensation Range *
              </label>
              <input
                {...register('compensation.range')}
                type="text"
                className="input-field"
                placeholder="e.g., $150k-$250k per person, $600k total team package"
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

            <div>
              <label htmlFor="availability" className="label-text">
                Availability Timeline *
              </label>
              <input
                {...register('availability')}
                type="text"
                className="input-field"
                placeholder="e.g., Available in 3-6 months, Open to strategic opportunities"
              />
              {errors.availability && (
                <p className="mt-1 text-sm text-red-600">{errors.availability.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <label className="flex items-center">
              <input
                {...register('compensation.equity')}
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Open to equity participation</span>
            </label>

            <label className="flex items-center">
              <input
                {...register('openToLiftout')}
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Open to liftout opportunities</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="px-6 py-6">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateTeamMutation.isPending}
              className="btn-primary flex items-center"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              {updateTeamMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}