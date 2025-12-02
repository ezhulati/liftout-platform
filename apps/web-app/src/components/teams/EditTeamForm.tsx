'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { FormField, RequiredFieldsNote, ButtonGroup, TextLink } from '@/components/ui';

// Helper to check if user is a demo user
const isDemoUserEmail = (email: string) =>
  email === 'demo@example.com' || email === 'company@example.com';

// LocalStorage key for demo teams
const DEMO_TEAMS_STORAGE_KEY = 'liftout_demo_teams';

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
  // Visibility settings
  visibility: z.enum(['public', 'selective', 'private']).default('public'),
  hideCurrentEmployer: z.boolean().default(false),
  allowDiscovery: z.boolean().default(true),
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
  const { data: session } = useSession();
  const { user } = useAuth();

  // Check if this is a demo user
  const sessionUser = session?.user as any;
  const userEmail = user?.email || sessionUser?.email || '';
  const isDemoUser = isDemoUserEmail(userEmail);

  // Helper to get demo teams from localStorage
  const getDemoTeams = () => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(`${DEMO_TEAMS_STORAGE_KEY}_${userEmail}`) || '[]');
    } catch {
      return [];
    }
  };

  // Fetch existing team data
  const { data: team, isLoading: isLoadingTeam } = useQuery({
    queryKey: ['team', teamId],
    queryFn: async () => {
      // For demo users, load from localStorage
      if (isDemoUser) {
        const demoTeams = getDemoTeams();
        const foundTeam = demoTeams.find((t: any) => t.id === teamId);
        if (foundTeam) {
          return foundTeam;
        }
        // Return mock team if not found in localStorage
        return null;
      }

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
      // Map form visibility to API visibility (selective -> anonymous)
      const visibilityMap: Record<string, string> = {
        public: 'public',
        selective: 'anonymous',
        private: 'private',
      };
      const apiVisibility = visibilityMap[data.visibility] || 'public';

      // For demo users, save to localStorage
      if (isDemoUser) {
        const demoTeams = getDemoTeams();
        const teamIndex = demoTeams.findIndex((t: any) => t.id === teamId);
        const updatedTeam = {
          ...demoTeams[teamIndex],
          ...data,
          visibility: apiVisibility,
          updatedAt: new Date().toISOString(),
        };
        if (teamIndex >= 0) {
          demoTeams[teamIndex] = updatedTeam;
        } else {
          demoTeams.push(updatedTeam);
        }
        localStorage.setItem(`${DEMO_TEAMS_STORAGE_KEY}_${userEmail}`, JSON.stringify(demoTeams));
        return updatedTeam;
      }

      // Use PATCH for visibility/privacy updates
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          visibility: apiVisibility,
          isAnonymous: apiVisibility === 'anonymous',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update team');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success(isDemoUser ? 'Team updated (demo mode)' : 'Team updated');
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
      // Map database visibility to form visibility
      const visibilityMap: Record<string, 'public' | 'selective' | 'private'> = {
        public: 'public',
        anonymous: 'selective',
        private: 'private',
      };
      const formVisibility = visibilityMap[team.visibility] || 'public';

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
        visibility: formVisibility,
        hideCurrentEmployer: team.metadata?.visibilitySettings?.hideCurrentEmployer ?? false,
        allowDiscovery: team.metadata?.visibilitySettings?.allowDiscovery ?? true,
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
          <p className="mt-2 text-sm text-text-tertiary">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Team Info */}
        <div className="px-6 py-6 border-b border-border">
          <h3 className="text-lg font-medium text-text-primary mb-6">Team information</h3>
          <RequiredFieldsNote />

          <div className="space-y-5 mt-5">
            <FormField label="Team name" name="name" required error={errors.name?.message}>
              <input
                {...register('name')}
                id="name"
                type="text"
                className="input-field"
                placeholder="e.g., Strategic Analytics Core Team"
              />
            </FormField>

            <FormField
              label="Team description and expertise"
              name="description"
              required
              error={errors.description?.message}
              hint="Minimum 50 characters. Be specific about your team's achievements and expertise."
            >
              <textarea
                {...register('description')}
                id="description"
                rows={4}
                className="input-field"
                placeholder="Describe your team's expertise, achievements, and what makes you valuable for liftout opportunities..."
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

            <FormField label="Location" name="location" required error={errors.location?.message}>
              <input
                {...register('location')}
                id="location"
                type="text"
                className="input-field"
                placeholder="e.g., San Francisco, CA or Remote"
              />
            </FormField>
          </div>
        </div>

        {/* Team Members */}
        <div className="px-6 py-6 border-b border-border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-text-primary">Team members</h3>
            <TextLink onClick={() => append({ name: '', role: '', experience: 0, skills: [] })}>
              <PlusIcon className="h-5 w-5 mr-1 inline" />
              Add member
            </TextLink>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="border border-border rounded-lg p-5 mb-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-text-primary">Member {index + 1}</h4>
                {fields.length > 2 && (
                  <TextLink variant="danger" onClick={() => remove(index)}>
                    Remove
                  </TextLink>
                )}
              </div>

              {/* Single column per Practical UI */}
              <FormField label="Name" name={`members.${index}.name`} required error={errors.members?.[index]?.name?.message}>
                <input
                  {...register(`members.${index}.name`)}
                  id={`members.${index}.name`}
                  type="text"
                  className="input-field"
                  placeholder="Full name"
                />
              </FormField>

              <FormField label="Role" name={`members.${index}.role`} required error={errors.members?.[index]?.role?.message}>
                <input
                  {...register(`members.${index}.role`)}
                  id={`members.${index}.role`}
                  type="text"
                  className="input-field"
                  placeholder="e.g., Senior Data Scientist"
                />
              </FormField>

              <FormField label="Years experience" name={`members.${index}.experience`} required error={errors.members?.[index]?.experience?.message}>
                <input
                  {...register(`members.${index}.experience`, { valueAsNumber: true })}
                  id={`members.${index}.experience`}
                  type="number"
                  min="0"
                  max="50"
                  className="input-field"
                  placeholder="5"
                />
              </FormField>

              <FormField label="Skills" name={`members.${index}.skills`} required error={errors.members?.[index]?.skills?.message}>
                <div className="flex flex-wrap gap-2 mb-2 min-h-[2rem] p-2 border border-border rounded-md bg-bg-alt">
                  {watch(`members.${index}.skills`)?.length > 0 ? (
                    watch(`members.${index}.skills`)?.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-navy-100 text-navy-800"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(index, skillIndex)}
                          className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-navy-400 hover:bg-navy-200 hover:text-navy-600 transition-colors duration-fast touch-target"
                          aria-label={`Remove ${skill}`}
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-text-tertiary italic">No skills added yet</span>
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
                    className="btn-outline min-h-12"
                    disabled={!skillInput[index]?.trim()}
                  >
                    Add
                  </button>
                </div>
              </FormField>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="px-6 py-6 border-b border-border">
          <h3 className="text-lg font-medium text-text-primary mb-6">Team achievements</h3>

          <div className="space-y-3">
            {watch('achievements')?.map((achievement, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-bg-alt rounded-md">
                <span className="text-sm text-text-secondary">{achievement}</span>
                <button
                  type="button"
                  onClick={() => removeAchievement(index)}
                  className="min-w-12 min-h-12 p-3 text-error hover:text-error-dark hover:bg-error-light rounded-lg transition-colors"
                  aria-label="Remove achievement"
                >
                  <XMarkIcon className="h-5 w-5" />
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
              className="btn-outline min-h-12"
              disabled={!achievementInput.trim()}
            >
              Add
            </button>
          </div>
        </div>

        {/* Compensation & Availability */}
        <div className="px-6 py-6 border-b border-border space-y-5">
          <h3 className="text-lg font-medium text-text-primary">Compensation and availability</h3>

          <FormField label="Compensation range" name="compensation.range" required error={errors.compensation?.range?.message}>
            <input
              {...register('compensation.range')}
              id="compensation.range"
              type="text"
              className="input-field"
              placeholder="e.g., $150k-$250k per person, $600k total team package"
            />
          </FormField>

          <FormField label="Benefits package" name="compensation.benefits">
            <input
              {...register('compensation.benefits')}
              id="compensation.benefits"
              type="text"
              className="input-field"
              placeholder="e.g., Full package, Health/Dental/Vision"
            />
          </FormField>

          <FormField label="Availability timeline" name="availability" required error={errors.availability?.message}>
            <input
              {...register('availability')}
              id="availability"
              type="text"
              className="input-field"
              placeholder="e.g., Available in 3-6 months, Open to strategic opportunities"
            />
          </FormField>

          <div className="space-y-4 pt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                {...register('compensation.equity')}
                type="checkbox"
                className="rounded border-border text-navy focus:ring-navy w-5 h-5"
              />
              <span className="text-text-secondary">Open to equity participation</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                {...register('openToLiftout')}
                type="checkbox"
                className="rounded border-border text-navy focus:ring-navy w-5 h-5"
              />
              <span className="text-text-secondary">Open to liftout opportunities</span>
            </label>
          </div>
        </div>

        {/* Team Privacy & Visibility - Practical UI: single column, radio buttons */}
        <div className="px-6 py-6 border-b border-border">
          <h3 className="text-lg font-bold text-text-primary mb-2">Privacy and visibility</h3>
          <p className="text-base text-text-secondary mb-6">
            Control who can discover your team and what information they can see.
          </p>

          {/* Visibility Options - Practical UI: radio buttons stacked vertically */}
          <fieldset className="space-y-3 mb-6" role="radiogroup" aria-label="Team visibility">
            {[
              {
                value: 'public',
                title: 'Public',
                description: 'Visible to all users and search engines. Maximum exposure for liftout opportunities.',
                icon: UserGroupIcon,
              },
              {
                value: 'selective',
                title: 'Selective (anonymous mode)',
                description: 'Only visible to verified companies. Your identity is masked until you respond to interest.',
                icon: ShieldCheckIcon,
              },
              {
                value: 'private',
                title: 'Private',
                description: 'Only visible to team members. Companies cannot discover your team.',
                icon: EyeSlashIcon,
              },
            ].map((option) => {
              const isSelected = watch('visibility') === option.value;
              return (
                <label
                  key={option.value}
                  className={`relative flex items-start cursor-pointer rounded-lg border-2 p-4 min-h-[64px] transition-colors ${
                    isSelected
                      ? 'border-navy bg-navy-50'
                      : 'border-border bg-bg-surface hover:border-navy-200'
                  }`}
                >
                  <input
                    type="radio"
                    {...register('visibility')}
                    value={option.value}
                    className="sr-only"
                  />
                  {/* Radio indicator */}
                  <div className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-navy bg-navy' : 'border-border'
                  }`}>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  {/* Label content */}
                  <div className="ml-4 flex-1">
                    <div className="flex items-center gap-2">
                      <option.icon className={`h-5 w-5 ${isSelected ? 'text-navy' : 'text-text-tertiary'}`} />
                      <span className="text-base font-bold text-text-primary">{option.title}</span>
                    </div>
                    <p className="mt-1 text-base text-text-secondary">{option.description}</p>
                  </div>
                </label>
              );
            })}
          </fieldset>

          {/* Warning for private mode */}
          {watch('visibility') === 'private' && (
            <div className="bg-gold-50 border border-gold-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-base font-bold text-gold-900">Limited visibility</p>
                  <p className="mt-1 text-base text-gold-700">
                    With private visibility, companies won't be able to discover your team through search or matching.
                    This may significantly reduce your liftout opportunities.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Additional privacy controls - Practical UI: toggles for immediate effect */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-text-primary">Additional privacy controls</h4>

            <label className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer min-h-[64px] transition-colors ${
              watch('hideCurrentEmployer') ? 'border-navy bg-navy-50' : 'border-border bg-bg-surface hover:border-navy-200'
            }`}>
              <div className="flex items-start gap-3 mr-4">
                <BuildingOfficeIcon className="h-5 w-5 mt-0.5 flex-shrink-0 text-text-tertiary" />
                <div>
                  <span className="text-base font-bold text-text-primary block">Hide current employer</span>
                  <span className="text-base text-text-secondary mt-1 block">Don't show your team's current company to potential employers</span>
                </div>
              </div>
              <input
                type="checkbox"
                {...register('hideCurrentEmployer')}
                className="rounded border-border text-navy focus:ring-navy w-5 h-5"
              />
            </label>

            <label className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer min-h-[64px] transition-colors ${
              watch('allowDiscovery') ? 'border-navy bg-navy-50' : 'border-border bg-bg-surface hover:border-navy-200'
            }`}>
              <div className="flex items-start gap-3 mr-4">
                <MagnifyingGlassIcon className="h-5 w-5 mt-0.5 flex-shrink-0 text-text-tertiary" />
                <div>
                  <span className="text-base font-bold text-text-primary block">Allow discovery</span>
                  <span className="text-base text-text-secondary mt-1 block">Let companies find your team through search and matching</span>
                </div>
              </div>
              <input
                type="checkbox"
                {...register('allowDiscovery')}
                className="rounded border-border text-navy focus:ring-navy w-5 h-5"
              />
            </label>
          </div>
        </div>

        {/* Submit - LEFT aligned per Practical UI */}
        <div className="px-6 py-6">
          <ButtonGroup>
            <button
              type="submit"
              disabled={updateTeamMutation.isPending}
              className="btn-primary min-h-12 flex items-center"
            >
              <CheckIcon className="h-5 w-5 mr-2" />
              {updateTeamMutation.isPending ? 'Saving...' : 'Save changes'}
            </button>
            <TextLink onClick={() => router.back()}>
              Cancel
            </TextLink>
          </ButtonGroup>
        </div>
      </form>
    </div>
  );
}