'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import {
  PlusIcon,
  TrashIcon,
  PencilSquareIcon,
  UserIcon,
  CheckIcon,
  XMarkIcon,
  StarIcon,
  ClockIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon as CheckIconSolid } from '@heroicons/react/24/solid';

const memberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.string().min(2, 'Role must be at least 2 characters'), 
  experience: z.number().min(0, 'Experience cannot be negative').max(50, 'Experience cannot exceed 50 years'),
  skills: z.array(z.string().min(1)).min(1, 'At least one skill is required'),
  email: z.string().email('Invalid email').optional(),
  linkedIn: z.string().url('Invalid LinkedIn URL').optional(),
  isLead: z.boolean().optional(),
  joinedDate: z.string().optional(),
  performance: z.object({
    rating: z.number().min(1).max(5).optional(),
    projects: z.number().min(0).optional(),
    achievements: z.array(z.string()).optional(),
  }).optional(),
});

const teamMemberFormSchema = z.object({
  members: z.array(memberSchema).min(2, 'Team must have at least 2 members'),
});

type TeamMemberFormData = z.infer<typeof teamMemberFormSchema>;

interface TeamMember {
  id: string;
  name: string;
  role: string;
  experience: number;
  skills: string[];
  email?: string;
  linkedIn?: string;
  isLead?: boolean;
  joinedDate?: string;
  performance?: {
    rating?: number;
    projects?: number;
    achievements?: string[];
  };
}

interface MemberManagementProps {
  teamId: string;
  members: TeamMember[];
  onMembersUpdate: (members: TeamMember[]) => void;
  isEditable?: boolean;
}

export function MemberManagement({ 
  teamId, 
  members, 
  onMembersUpdate, 
  isEditable = false 
}: MemberManagementProps) {
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [skillInputs, setSkillInputs] = useState<{ [key: string]: string }>({});
  const [achievementInputs, setAchievementInputs] = useState<{ [key: string]: string }>({});

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      members: members.map(member => ({
        ...member,
        performance: member.performance || { rating: 0, projects: 0, achievements: [] }
      }))
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
  });

  const addMember = () => {
    const newMember = {
      id: `temp_${Date.now()}`,
      name: '',
      role: '',
      experience: 0,
      skills: [],
      isLead: false,
      performance: { rating: 0, projects: 0, achievements: [] }
    };
    append(newMember);
    setEditingMember(newMember.id);
  };

  const addSkill = (memberIndex: number, skill: string) => {
    if (!skill.trim()) return;
    
    const currentMembers = getValues('members');
    const member = currentMembers[memberIndex];
    
    if (member.skills.includes(skill.trim())) {
      toast.error('Skill already exists');
      return;
    }

    const updatedSkills = [...member.skills, skill.trim()];
    setValue(`members.${memberIndex}.skills`, updatedSkills);
    setSkillInputs({ ...skillInputs, [`${memberIndex}`]: '' });
  };

  const removeSkill = (memberIndex: number, skillIndex: number) => {
    const currentMembers = getValues('members');
    const member = currentMembers[memberIndex];
    const updatedSkills = member.skills.filter((_, index) => index !== skillIndex);
    setValue(`members.${memberIndex}.skills`, updatedSkills);
  };

  const addAchievement = (memberIndex: number, achievement: string) => {
    if (!achievement.trim()) return;
    
    const currentMembers = getValues('members');
    const member = currentMembers[memberIndex];
    const currentAchievements = member.performance?.achievements || [];
    
    const updatedAchievements = [...currentAchievements, achievement.trim()];
    setValue(`members.${memberIndex}.performance.achievements`, updatedAchievements);
    setAchievementInputs({ ...achievementInputs, [`${memberIndex}`]: '' });
  };

  const removeAchievement = (memberIndex: number, achievementIndex: number) => {
    const currentMembers = getValues('members');
    const member = currentMembers[memberIndex];
    const currentAchievements = member.performance?.achievements || [];
    const updatedAchievements = currentAchievements.filter((_, index) => index !== achievementIndex);
    setValue(`members.${memberIndex}.performance.achievements`, updatedAchievements);
  };

  const saveMember = (memberIndex: number) => {
    const currentMembers = getValues('members');
    const member = currentMembers[memberIndex];
    
    // Validate required fields
    if (!member.name.trim() || !member.role.trim() || member.skills.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Ensure member has an ID
    const updatedMembers = currentMembers.map((m, index) => ({
      ...m,
      id: m.id || `member_${Date.now()}_${index}`,
    }));

    setEditingMember(null);
    onMembersUpdate(updatedMembers);
    toast.success('Member updated successfully');
  };

  const removeMember = (memberIndex: number) => {
    if (fields.length <= 2) {
      toast.error('Team must have at least 2 members');
      return;
    }

    const memberName = getValues(`members.${memberIndex}.name`);
    if (window.confirm(`Are you sure you want to remove ${memberName || 'this member'}?`)) {
      remove(memberIndex);
      const updatedMembers = getValues('members').map((m, index) => ({
        ...m,
        id: m.id || `member_${Date.now()}_${index}`,
      }));
      onMembersUpdate(updatedMembers);
      toast.success('Member removed successfully');
    }
  };

  const toggleTeamLead = (memberIndex: number) => {
    const currentMembers = getValues('members');
    
    // Remove lead status from all other members
    currentMembers.forEach((_, index) => {
      setValue(`members.${index}.isLead`, index === memberIndex);
    });
    
    const updatedMembers = getValues('members').map((m, index) => ({
      ...m,
      id: m.id || `member_${Date.now()}_${index}`,
    }));
    
    onMembersUpdate(updatedMembers);
    toast.success('Team lead updated');
  };

  const calculateTeamStats = () => {
    const currentMembers = getValues('members');
    const totalExperience = currentMembers.reduce((sum, member) => sum + member.experience, 0);
    const avgExperience = totalExperience / currentMembers.length;
    const allSkills = [...new Set(currentMembers.flatMap(member => member.skills))];
    const avgRating = currentMembers.reduce((sum, member) => 
      sum + (member.performance?.rating || 0), 0) / currentMembers.length;

    return {
      totalMembers: currentMembers.length,
      avgExperience: avgExperience.toFixed(1),
      totalSkills: allSkills.length,
      avgRating: avgRating.toFixed(1),
    };
  };

  const stats = calculateTeamStats();

  return (
    <div className="space-y-6">
      {/* Team Statistics */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-medium text-text-primary">Team Statistics</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-navy">{stats.totalMembers}</div>
              <div className="text-sm text-text-secondary">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{stats.avgExperience}</div>
              <div className="text-sm text-text-secondary">Avg Experience (years)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-navy">{stats.totalSkills}</div>
              <div className="text-sm text-text-secondary">Unique Skills</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold-700">{stats.avgRating}</div>
              <div className="text-sm text-text-secondary">Avg Performance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="card">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-text-primary">Team Members</h3>
            {isEditable && (
              <button
                onClick={addMember}
                className="btn-sm btn-primary flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Member
              </button>
            )}
          </div>
        </div>

        <div className="px-6 py-4 space-y-4">
          {fields.map((field, index) => {
            const member = watch(`members.${index}`);
            const isEditing = editingMember === field.id;

            return (
              <div 
                key={field.id} 
                className={`border rounded-lg p-4 ${isEditing ? 'border-navy-300 bg-navy-50' : 'border-border'}`}
              >
                {/* Member Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-bg-alt flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-text-tertiary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-text-primary">
                          {member.name || 'New Member'}
                        </h4>
                        {member.isLead && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <StarIcon className="h-3 w-3 mr-1" />
                            Team Lead
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary">{member.role || 'Role not set'}</p>
                    </div>
                  </div>

                  {isEditable && (
                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveMember(index)}
                            className="text-success hover:text-success-dark"
                            title="Save changes"
                          >
                            <CheckIconSolid className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setEditingMember(null)}
                            className="text-text-secondary hover:text-text-secondary"
                            title="Cancel"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingMember(field.id)}
                            className="text-navy hover:text-navy-hover"
                            title="Edit member"
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => toggleTeamLead(index)}
                            className={`${member.isLead ? 'text-gold-700' : 'text-text-tertiary'} hover:text-gold-800`}
                            title="Toggle team lead"
                          >
                            <StarIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => removeMember(index)}
                            className="text-error hover:text-error-dark"
                            title="Remove member"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Member Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic Information */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Name *
                      </label>
                      {isEditing ? (
                        <input
                          {...register(`members.${index}.name`)}
                          className="input-field"
                          placeholder="Full name"
                        />
                      ) : (
                        <p className="text-sm text-text-primary">{member.name || 'Not set'}</p>
                      )}
                      {errors.members?.[index]?.name && (
                        <p className="text-xs text-error">{errors.members[index]?.name?.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Role *
                      </label>
                      {isEditing ? (
                        <input
                          {...register(`members.${index}.role`)}
                          className="input-field"
                          placeholder="e.g., Senior Data Scientist"
                        />
                      ) : (
                        <p className="text-sm text-text-primary">{member.role || 'Not set'}</p>
                      )}
                      {errors.members?.[index]?.role && (
                        <p className="text-xs text-error">{errors.members[index]?.role?.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Experience (years) *
                      </label>
                      {isEditing ? (
                        <input
                          {...register(`members.${index}.experience`, { valueAsNumber: true })}
                          type="number"
                          min="0"
                          max="50"
                          className="input-field"
                        />
                      ) : (
                        <div className="flex items-center text-sm text-text-primary">
                          <ClockIcon className="h-4 w-4 mr-1 text-text-tertiary" />
                          {member.experience} years
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Performance & Contact */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          {...register(`members.${index}.email`)}
                          type="email"
                          className="input-field"
                          placeholder="email@example.com"
                        />
                      ) : (
                        <p className="text-sm text-text-primary">{member.email || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Performance Rating
                      </label>
                      {isEditing ? (
                        <select
                          {...register(`members.${index}.performance.rating`, { valueAsNumber: true })}
                          className="input-field"
                        >
                          <option value={0}>Not rated</option>
                          <option value={1}>1 - Needs improvement</option>
                          <option value={2}>2 - Below expectations</option>
                          <option value={3}>3 - Meets expectations</option>
                          <option value={4}>4 - Exceeds expectations</option>
                          <option value={5}>5 - Outstanding</option>
                        </select>
                      ) : (
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < (member.performance?.rating || 0) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-text-tertiary'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-text-secondary">
                            {member.performance?.rating || 0}/5
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Projects Completed
                      </label>
                      {isEditing ? (
                        <input
                          {...register(`members.${index}.performance.projects`, { valueAsNumber: true })}
                          type="number"
                          min="0"
                          className="input-field"
                          placeholder="0"
                        />
                      ) : (
                        <p className="text-sm text-text-primary">
                          {member.performance?.projects || 0} projects
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Skills *
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2 min-h-[2rem]">
                    {member.skills?.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-navy-100 text-navy-800"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeSkill(index, skillIndex)}
                            className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-navy-400 hover:bg-navy-200 hover:text-navy-500"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                    {(!member.skills || member.skills.length === 0) && (
                      <span className="text-sm text-text-tertiary italic">No skills added</span>
                    )}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={skillInputs[index] || ''}
                        onChange={(e) => setSkillInputs({ ...skillInputs, [index]: e.target.value })}
                        className="input-field flex-1"
                        placeholder="Add a skill..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill(index, skillInputs[index] || '');
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => addSkill(index, skillInputs[index] || '')}
                        className="px-3 py-2 text-sm bg-navy text-white rounded-md hover:bg-navy-hover disabled:opacity-50"
                        disabled={!skillInputs[index]?.trim()}
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>

                {/* Achievements */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Achievements
                  </label>
                  <div className="space-y-2 mb-2">
                    {member.performance?.achievements?.map((achievement, achievementIndex) => (
                      <div
                        key={achievementIndex}
                        className="flex items-center justify-between p-2 bg-bg-alt rounded-md"
                      >
                        <span className="text-sm text-text-secondary">{achievement}</span>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeAchievement(index, achievementIndex)}
                            className="text-error hover:text-error-dark"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )) || <span className="text-sm text-text-tertiary italic">No achievements recorded</span>}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={achievementInputs[index] || ''}
                        onChange={(e) => setAchievementInputs({ ...achievementInputs, [index]: e.target.value })}
                        className="input-field flex-1"
                        placeholder="Add an achievement..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addAchievement(index, achievementInputs[index] || '');
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => addAchievement(index, achievementInputs[index] || '')}
                        className="px-3 py-2 text-sm bg-text-secondary text-white rounded-md hover:bg-text-primary disabled:opacity-50"
                        disabled={!achievementInputs[index]?.trim()}
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}