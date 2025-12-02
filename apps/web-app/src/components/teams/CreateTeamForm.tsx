'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useCreateTeam } from '@/hooks/useTeams';
import { useAuth } from '@/contexts/AuthContext';
import { FormField, RequiredFieldsNote, ButtonGroup, TextLink } from '@/components/ui';

// Helper to check if user is a demo user
const isDemoUserEmail = (email: string) =>
  email === 'demo@example.com' || email === 'company@example.com';

// LocalStorage key for demo teams
const DEMO_TEAMS_STORAGE_KEY = 'liftout_demo_teams';

const memberSchema = z.object({
  name: z.string().min(2, 'Member name too short. Enter at least 2 characters.'),
  role: z.string().min(2, 'Member role too short. Enter at least 2 characters.'),
  experience: z.number().min(0, 'Experience cannot be negative. Enter 0 or greater.').max(50, 'Experience too high. Enter 50 years or less.'),
  skills: z.array(z.string().min(1)).min(1, 'No skills added. Add at least one skill.'),
});

const createTeamSchema = z.object({
  name: z.string().min(5, 'Team name too short. Use at least 5 characters.'),
  description: z.string().min(50, 'Description too short. Write at least 50 characters.'),
  industry: z.string().min(1, 'No industry selected. Choose an industry from the list.'),
  location: z.string().min(1, 'Location missing. Enter your team location.'),
  members: z.array(memberSchema).min(2, 'Not enough members. Add at least 2 team members.'),
  compensation: z.object({
    range: z.string().min(1, 'Compensation range missing. Enter your expected range.'),
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
  const { data: session } = useSession();
  const { user } = useAuth();
  const createTeamMutation = useCreateTeam();

  // Check if this is a demo user
  const sessionUser = session?.user as any;
  const userEmail = user?.email || sessionUser?.email || '';
  const isDemoUser = isDemoUserEmail(userEmail);

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
      // For demo users, save to localStorage instead of API
      if (isDemoUser) {
        const existingTeams = JSON.parse(localStorage.getItem(`${DEMO_TEAMS_STORAGE_KEY}_${userEmail}`) || '[]');
        const newTeam = {
          id: `demo-team-${Date.now()}`,
          ...data,
          createdAt: new Date().toISOString(),
          status: 'active',
          leaderId: userEmail,
        };
        existingTeams.push(newTeam);
        localStorage.setItem(`${DEMO_TEAMS_STORAGE_KEY}_${userEmail}`, JSON.stringify(existingTeams));
        toast.success('Team created (demo mode)');
        router.push('/app/teams');
        return;
      }

      await createTeamMutation.mutateAsync(data);
      toast.success('Team created');
      router.push('/app/teams');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create team';
      toast.error(message);
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <RequiredFieldsNote />

        {/* Team Basic Info */}
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-text-primary">Team profile</h3>

          <FormField
            label="Team name"
            name="name"
            required
            error={errors.name?.message}
          >
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

          <FormField
            label="Industry"
            name="industry"
            required
            error={errors.industry?.message}
          >
            <select {...register('industry')} id="industry" className="input-field">
              <option value="">Select an industry</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Location"
            name="location"
            required
            error={errors.location?.message}
          >
            <input
              {...register('location')}
              id="location"
              type="text"
              className="input-field"
              placeholder="e.g., San Francisco, CA or Remote"
            />
          </FormField>
        </div>

        {/* Team Members */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-text-primary">Team members</h3>
            <TextLink onClick={() => append({ name: '', role: '', experience: 0, skills: [] })}>
              + Add member
            </TextLink>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="border border-border rounded-lg p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-text-primary">Member {index + 1}</h4>
                {fields.length > 2 && (
                  <TextLink variant="danger" onClick={() => remove(index)}>
                    Remove member
                  </TextLink>
                )}
              </div>

              {/* Single column layout per Practical UI */}
              <FormField
                label="Name"
                name={`members.${index}.name`}
                required
                error={errors.members?.[index]?.name?.message}
              >
                <input
                  {...register(`members.${index}.name`)}
                  id={`members.${index}.name`}
                  type="text"
                  className="input-field"
                  placeholder="Full name"
                />
              </FormField>

              <FormField
                label="Role"
                name={`members.${index}.role`}
                required
                error={errors.members?.[index]?.role?.message}
              >
                <input
                  {...register(`members.${index}.role`)}
                  id={`members.${index}.role`}
                  type="text"
                  className="input-field"
                  placeholder="e.g., Senior Data Scientist"
                />
              </FormField>

              <FormField
                label="Years experience"
                name={`members.${index}.experience`}
                required
                error={errors.members?.[index]?.experience?.message}
              >
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

              <FormField
                label="Skills"
                name={`members.${index}.skills`}
                required
                error={errors.members?.[index]?.skills?.message}
              >
                <div className="flex flex-wrap gap-2 mb-3">
                  {watch(`members.${index}.skills`)?.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="inline-flex items-center pl-3 pr-2 py-2 rounded-full text-base font-medium bg-navy-100 text-navy-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index, skillIndex)}
                        className="ml-2 inline-flex items-center justify-center min-w-8 min-h-8 rounded-full text-navy-400 hover:bg-navy-200 hover:text-navy-600"
                        aria-label={`Remove ${skill}`}
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
                    className="btn-outline min-h-12"
                  >
                    Add skill
                  </button>
                </div>
              </FormField>
            </div>
          ))}
        </div>

        {/* Compensation */}
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-text-primary">Compensation expectations</h3>

          <FormField
            label="Compensation range"
            name="compensation.range"
            required
            error={errors.compensation?.range?.message}
            hint="Include total compensation expectations for your team or per-person ranges."
          >
            <input
              {...register('compensation.range')}
              id="compensation.range"
              type="text"
              className="input-field"
              placeholder="e.g., $150k-$250k per person, $600k total team package"
            />
          </FormField>

          <FormField
            label="Benefits package"
            name="compensation.benefits"
            optional
          >
            <input
              {...register('compensation.benefits')}
              id="compensation.benefits"
              type="text"
              className="input-field"
              placeholder="e.g., Full package, Health/Dental/Vision"
            />
          </FormField>

          <div className="mt-4">
            <label className="flex items-center gap-3 cursor-pointer min-h-12 px-2 rounded-lg hover:bg-bg-alt transition-colors -mx-2">
              <input
                {...register('compensation.equity')}
                type="checkbox"
                className="rounded border-border text-navy focus:ring-navy w-5 h-5"
              />
              <span className="text-base text-text-secondary">Open to equity participation</span>
            </label>
          </div>
        </div>

        {/* Submit - LEFT aligned per Practical UI, primary button FIRST */}
        <ButtonGroup>
          <button
            type="submit"
            disabled={createTeamMutation.isPending}
            className="btn-primary min-h-12"
          >
            {createTeamMutation.isPending ? 'Creating...' : 'Create team'}
          </button>
          <TextLink onClick={() => router.back()}>
            Cancel
          </TextLink>
        </ButtonGroup>
      </form>
    </div>
  );
}