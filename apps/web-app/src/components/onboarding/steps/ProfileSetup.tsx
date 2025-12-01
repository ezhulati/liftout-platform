'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { FormField, RequiredFieldsNote, ButtonGroup, TextLink } from '@/components/ui';

const profileSetupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  title: z.string().min(2, 'Professional title is required'),
  seniorityLevel: z.enum(['junior', 'mid', 'senior', 'lead', 'principal', 'executive']),
  location: z.string().min(1, 'Location is required'),
  linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Please enter a valid portfolio URL').optional().or(z.literal('')),
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  experience: z.object({
    totalYears: z.number().min(0).max(50),
    currentCompany: z.string().min(1, 'Current company is required'),
    currentRole: z.string().min(1, 'Current role is required'),
    previousCompanies: z.array(z.string()).optional(),
  }),
  education: z.object({
    degree: z.string().optional(),
    school: z.string().optional(),
    year: z.number().optional(),
  }),
  skills: z.array(z.string()).min(3, 'Please add at least 3 skills'),
  interests: z.array(z.string()).min(1, 'Please add at least 1 interest'),
});

type ProfileSetupFormData = z.infer<typeof profileSetupSchema>;

interface ProfileSetupProps {
  onComplete: () => void;
  onSkip?: () => void;
}

const seniorityLevels = [
  { value: 'junior', label: 'Junior (0-2 years)' },
  { value: 'mid', label: 'Mid-level (2-5 years)' },
  { value: 'senior', label: 'Senior (5-8 years)' },
  { value: 'lead', label: 'Lead (8-12 years)' },
  { value: 'principal', label: 'Principal (12+ years)' },
  { value: 'executive', label: 'Executive/C-level' },
];

const commonSkills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C#', '.NET',
  'Angular', 'Vue.js', 'Next.js', 'Express.js', 'Django', 'Flask', 'Spring Boot',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'AWS', 'Azure', 'GCP',
  'Docker', 'Kubernetes', 'GraphQL', 'REST API', 'Microservices',
  'UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Sketch',
  'Mobile Development', 'React Native', 'Flutter', 'iOS', 'Android',
  'Machine Learning', 'Data Science', 'TensorFlow', 'PyTorch',
  'DevOps', 'CI/CD', 'Terraform', 'Ansible', 'Jenkins',
  'Product Management', 'Agile', 'Scrum', 'Project Management',
  'Business Analysis', 'Strategy', 'Marketing', 'Sales',
];

const commonInterests = [
  'Fintech', 'Healthcare', 'EdTech', 'Climate Tech', 'AI/ML', 'Blockchain',
  'SaaS', 'E-commerce', 'Gaming', 'Social Impact', 'Cybersecurity',
  'IoT', 'AR/VR', 'Robotics', 'Space Tech', 'Autonomous Vehicles',
  'Remote Work', 'Team Leadership', 'Mentoring', 'Open Source',
  'Startups', 'Scale-ups', 'Enterprise', 'Consulting',
];

export function ProfileSetup({ onComplete, onSkip }: ProfileSetupProps) {
  const { userData } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileSetupFormData>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      firstName: userData?.name?.split(' ')[0] || '',
      lastName: userData?.name?.split(' ')[1] || '',
      location: userData?.location || '',
      experience: {
        totalYears: 0,
        currentCompany: '',
        currentRole: '',
        previousCompanies: [],
      },
      education: {},
      skills: [],
      interests: [],
    },
  });

  const watchedSkills = watch('skills');
  const watchedInterests = watch('interests');

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !selectedSkills.includes(trimmedSkill)) {
      const newSkills = [...selectedSkills, trimmedSkill];
      setSelectedSkills(newSkills);
      setValue('skills', newSkills);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = selectedSkills.filter(skill => skill !== skillToRemove);
    setSelectedSkills(newSkills);
    setValue('skills', newSkills);
  };

  const toggleInterest = (interest: string) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    setSelectedInterests(newInterests);
    setValue('interests', newInterests);
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const onSubmit = async (data: ProfileSetupFormData) => {
    setIsSubmitting(true);

    try {
      // Save profile to API
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          location: data.location,
          title: data.title,
          bio: data.bio,
          linkedin: data.linkedinUrl,
          yearsExperience: data.experience?.totalYears,
          companyName: data.experience?.currentCompany,
          position: data.experience?.currentRole,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save profile');
      }

      toast.success('Profile saved successfully!');
      onComplete();
    } catch (error) {
      console.error('Profile save error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <RequiredFieldsNote />

        {/* Basic Information - Single column per Practical UI */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-text-tertiary" />
            Basic information
          </h4>

          <FormField label="First name" name="firstName" required error={errors.firstName?.message}>
            <input
              {...register('firstName')}
              id="firstName"
              type="text"
              className="input-field"
              placeholder="John"
            />
          </FormField>

          <FormField label="Last name" name="lastName" required error={errors.lastName?.message}>
            <input
              {...register('lastName')}
              id="lastName"
              type="text"
              className="input-field"
              placeholder="Doe"
            />
          </FormField>

          <FormField label="Professional title" name="title" required error={errors.title?.message}>
            <input
              {...register('title')}
              id="title"
              type="text"
              className="input-field"
              placeholder="Senior Software Engineer"
            />
          </FormField>

          <FormField label="Seniority level" name="seniorityLevel" required error={errors.seniorityLevel?.message}>
            <select {...register('seniorityLevel')} id="seniorityLevel" className="input-field">
              <option value="">Select seniority level</option>
              {seniorityLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
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
              placeholder="San Francisco, CA"
            />
          </FormField>

          <FormField label="LinkedIn URL" name="linkedinUrl" error={errors.linkedinUrl?.message}>
            <input
              {...register('linkedinUrl')}
              id="linkedinUrl"
              type="url"
              className="input-field"
              placeholder="https://linkedin.com/in/johndoe"
            />
          </FormField>

          <FormField label="Professional bio" name="bio" required error={errors.bio?.message}>
            <textarea
              {...register('bio')}
              id="bio"
              rows={3}
              className="input-field"
              placeholder="Tell us about your background, expertise, and what drives you professionally..."
            />
          </FormField>
        </div>

        {/* Experience */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <BriefcaseIcon className="h-5 w-5 mr-2 text-text-tertiary" />
            Experience
          </h4>

          <FormField label="Years of experience" name="experience.totalYears" required error={errors.experience?.totalYears?.message}>
            <input
              {...register('experience.totalYears', { valueAsNumber: true })}
              id="experience.totalYears"
              type="number"
              min="0"
              max="50"
              className="input-field"
              placeholder="5"
            />
          </FormField>

          <FormField label="Current company" name="experience.currentCompany" required error={errors.experience?.currentCompany?.message}>
            <input
              {...register('experience.currentCompany')}
              id="experience.currentCompany"
              type="text"
              className="input-field"
              placeholder="TechCorp Inc."
            />
          </FormField>

          <FormField label="Current role" name="experience.currentRole" required error={errors.experience?.currentRole?.message}>
            <input
              {...register('experience.currentRole')}
              id="experience.currentRole"
              type="text"
              className="input-field"
              placeholder="Senior Engineer"
            />
          </FormField>
        </div>

        {/* Education */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <AcademicCapIcon className="h-5 w-5 mr-2 text-text-tertiary" />
            Education (optional)
          </h4>

          <FormField label="Degree" name="education.degree">
            <input
              {...register('education.degree')}
              id="education.degree"
              type="text"
              className="input-field"
              placeholder="Bachelor of Science"
            />
          </FormField>

          <FormField label="School/university" name="education.school">
            <input
              {...register('education.school')}
              id="education.school"
              type="text"
              className="input-field"
              placeholder="Stanford University"
            />
          </FormField>

          <FormField label="Graduation year" name="education.year">
            <input
              {...register('education.year', { valueAsNumber: true })}
              id="education.year"
              type="number"
              min="1950"
              max={new Date().getFullYear() + 10}
              className="input-field"
              placeholder="2020"
            />
          </FormField>
        </div>

        {/* Skills */}
        <div>
          <label className="label-text">Skills & Technologies *</label>
          <p className="text-sm text-text-tertiary mb-3">
            Add your technical skills, tools, and technologies
          </p>

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
                onClick={() => addSkill(skillInput)}
                className="btn-outline min-h-12"
              >
                Add
              </button>
            </div>

            {/* Common skills suggestions */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-text-tertiary mr-1">Suggestions:</span>
              {commonSkills.slice(0, 12).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill)}
                  disabled={selectedSkills.includes(skill)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all min-h-[36px] ${
                    selectedSkills.includes(skill)
                      ? 'bg-navy-100 text-navy-600 cursor-not-allowed opacity-50'
                      : 'bg-bg-elevated text-text-secondary hover:bg-navy-50 hover:text-navy border border-border hover:border-navy/30'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            {/* Selected skills */}
            {selectedSkills.length > 0 && (
              <div className="mt-4 p-4 bg-navy-50/50 rounded-lg border border-navy/10">
                <p className="text-xs font-medium text-navy-600 mb-3">
                  Selected skills ({selectedSkills.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-navy text-white"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        aria-label={`Remove ${skill}`}
                      >
                        <XMarkIcon className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          {errors.skills && (
            <p className="mt-1 text-sm text-error">{errors.skills.message}</p>
          )}
        </div>

        {/* Interests */}
        <div>
          <label className="label-text">Professional interests *</label>
          <p className="text-sm text-text-tertiary mb-4">
            What industries or types of work interest you?
          </p>
          <div className="flex flex-wrap gap-3">
            {commonInterests.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                    isSelected
                      ? 'bg-navy text-white shadow-sm'
                      : 'bg-bg-surface text-text-secondary border-2 border-border hover:border-navy/40 hover:bg-navy-50'
                  }`}
                >
                  {isSelected && (
                    <CheckIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  )}
                  {interest}
                </button>
              );
            })}
          </div>
          {errors.interests && (
            <p className="mt-2 text-sm text-error">{errors.interests.message}</p>
          )}
        </div>

        {/* Submit Button - LEFT aligned per Practical UI */}
        <ButtonGroup>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary min-h-12"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="loading-spinner mr-2"></div>
                Saving...
              </div>
            ) : (
              'Save profile'
            )}
          </button>
          {onSkip && (
            <TextLink onClick={onSkip} disabled={isSubmitting}>
              Skip for now
            </TextLink>
          )}
        </ButtonGroup>
      </form>
    </div>
  );
}