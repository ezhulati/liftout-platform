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
} from '@heroicons/react/24/outline';

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
      // In a real app, this would save to your API
      console.log('Profile data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Profile saved successfully!');
      onComplete();
    } catch (error) {
      toast.error('Failed to save profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <UserIcon className="mx-auto h-12 w-12 text-primary-600" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          Set up your professional profile
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          This information helps companies understand your background and expertise.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900 flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
            Basic Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="label-text">
                First Name *
              </label>
              <input
                {...register('firstName')}
                type="text"
                className="input-field"
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="label-text">
                Last Name *
              </label>
              <input
                {...register('lastName')}
                type="text"
                className="input-field"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="title" className="label-text">
                Professional Title *
              </label>
              <input
                {...register('title')}
                type="text"
                className="input-field"
                placeholder="Senior Software Engineer"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="seniorityLevel" className="label-text">
                Seniority Level *
              </label>
              <select {...register('seniorityLevel')} className="input-field">
                <option value="">Select seniority level</option>
                {seniorityLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {errors.seniorityLevel && (
                <p className="mt-1 text-sm text-red-600">{errors.seniorityLevel.message}</p>
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
                placeholder="San Francisco, CA"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="linkedinUrl" className="label-text">
                LinkedIn URL
              </label>
              <input
                {...register('linkedinUrl')}
                type="url"
                className="input-field"
                placeholder="https://linkedin.com/in/johndoe"
              />
              {errors.linkedinUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.linkedinUrl.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="label-text">
              Professional Bio *
            </label>
            <textarea
              {...register('bio')}
              rows={3}
              className="input-field"
              placeholder="Tell us about your background, expertise, and what drives you professionally..."
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
            )}
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900 flex items-center">
            <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-400" />
            Experience
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="experience.totalYears" className="label-text">
                Years of Experience *
              </label>
              <input
                {...register('experience.totalYears', { valueAsNumber: true })}
                type="number"
                min="0"
                max="50"
                className="input-field"
                placeholder="5"
              />
              {errors.experience?.totalYears && (
                <p className="mt-1 text-sm text-red-600">{errors.experience.totalYears.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="experience.currentCompany" className="label-text">
                Current Company *
              </label>
              <input
                {...register('experience.currentCompany')}
                type="text"
                className="input-field"
                placeholder="TechCorp Inc."
              />
              {errors.experience?.currentCompany && (
                <p className="mt-1 text-sm text-red-600">{errors.experience.currentCompany.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="experience.currentRole" className="label-text">
                Current Role *
              </label>
              <input
                {...register('experience.currentRole')}
                type="text"
                className="input-field"
                placeholder="Senior Engineer"
              />
              {errors.experience?.currentRole && (
                <p className="mt-1 text-sm text-red-600">{errors.experience.currentRole.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900 flex items-center">
            <AcademicCapIcon className="h-5 w-5 mr-2 text-gray-400" />
            Education (Optional)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="education.degree" className="label-text">
                Degree
              </label>
              <input
                {...register('education.degree')}
                type="text"
                className="input-field"
                placeholder="Bachelor of Science"
              />
            </div>

            <div>
              <label htmlFor="education.school" className="label-text">
                School/University
              </label>
              <input
                {...register('education.school')}
                type="text"
                className="input-field"
                placeholder="Stanford University"
              />
            </div>

            <div>
              <label htmlFor="education.year" className="label-text">
                Graduation Year
              </label>
              <input
                {...register('education.year', { valueAsNumber: true })}
                type="number"
                min="1950"
                max={new Date().getFullYear() + 10}
                className="input-field"
                placeholder="2020"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="label-text">Skills & Technologies *</label>
          <p className="text-sm text-gray-500 mb-3">
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
                className="btn-secondary"
              >
                Add
              </button>
            </div>
            
            {/* Common skills suggestions */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500">Suggestions:</span>
              {commonSkills.slice(0, 12).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill)}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  {skill}
                </button>
              ))}
            </div>

            {/* Selected skills */}
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      ×
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

        {/* Interests */}
        <div>
          <label className="label-text">Professional Interests *</label>
          <p className="text-sm text-gray-500 mb-3">
            What industries or types of work interest you?
          </p>
          <div className="flex flex-wrap gap-2">
            {commonInterests.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedInterests.includes(interest)
                    ? 'bg-green-100 text-green-800 border-2 border-green-200'
                    : 'bg-gray-100 text-gray-800 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {selectedInterests.includes(interest) && (
                  <CheckIcon className="h-3 w-3 mr-1" />
                )}
                {interest}
              </button>
            ))}
          </div>
          {errors.interests && (
            <p className="mt-1 text-sm text-red-600">{errors.interests.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Skip for now
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="loading-spinner mr-2"></div>
                Saving...
              </div>
            ) : (
              'Save Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}