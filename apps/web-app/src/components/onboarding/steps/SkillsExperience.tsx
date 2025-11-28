'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import {
  WrenchScrewdriverIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  StarIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { FormField, ButtonGroup, TextLink } from '@/components/ui';

const skillsExperienceSchema = z.object({
  primaryRole: z.string().min(1, 'Please select a primary role'),
  yearsOfExperience: z.number().min(0).max(50),
  certifications: z.array(z.string()),
  achievements: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    year: z.number().min(1990).max(new Date().getFullYear()),
  })),
});

type SkillsExperienceFormData = z.infer<typeof skillsExperienceSchema>;

interface SkillsExperienceProps {
  onComplete: () => void;
  onSkip?: () => void;
}

const primaryRoles = [
  { value: 'engineering', label: 'Engineering / Development' },
  { value: 'product', label: 'Product Management' },
  { value: 'design', label: 'Design / UX' },
  { value: 'data', label: 'Data Science / Analytics' },
  { value: 'finance', label: 'Finance / Investment' },
  { value: 'consulting', label: 'Consulting / Strategy' },
  { value: 'sales', label: 'Sales / Business Development' },
  { value: 'marketing', label: 'Marketing / Growth' },
  { value: 'operations', label: 'Operations / Program Management' },
  { value: 'legal', label: 'Legal / Compliance' },
  { value: 'hr', label: 'HR / People Operations' },
  { value: 'executive', label: 'Executive / Leadership' },
];

const skillCategories = [
  {
    name: 'Technical Skills',
    skills: [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust',
      'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Spring Boot',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform',
      'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch',
      'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
    ],
  },
  {
    name: 'Business & Strategy',
    skills: [
      'Financial Modeling', 'M&A Advisory', 'Due Diligence', 'Valuation',
      'Strategic Planning', 'Market Analysis', 'Competitive Intelligence',
      'Business Development', 'Client Management', 'Negotiations',
      'Risk Management', 'Compliance', 'Regulatory Affairs',
    ],
  },
  {
    name: 'Leadership & Management',
    skills: [
      'Team Leadership', 'People Management', 'Executive Communication',
      'Change Management', 'Stakeholder Management', 'Board Relations',
      'Crisis Management', 'Cross-functional Collaboration',
      'Mentoring', 'Performance Management', 'OKR/Goal Setting',
    ],
  },
  {
    name: 'Industry Expertise',
    skills: [
      'Investment Banking', 'Private Equity', 'Hedge Funds',
      'Healthcare Technology', 'Biotechnology', 'Medical Devices',
      'Enterprise SaaS', 'Fintech', 'Insurtech', 'Regtech',
      'E-commerce', 'Marketplace', 'Consumer Tech',
    ],
  },
];

const commonCertifications = [
  'CFA (Chartered Financial Analyst)',
  'CPA (Certified Public Accountant)',
  'PMP (Project Management Professional)',
  'AWS Certified Solutions Architect',
  'Google Cloud Professional',
  'Microsoft Azure Administrator',
  'Certified Scrum Master (CSM)',
  'Six Sigma Green Belt',
  'CISSP (Cybersecurity)',
  'Series 7 / Series 63',
  'MBA',
  'PhD',
];

interface Achievement {
  title: string;
  description: string;
  year: number;
}

export function SkillsExperience({ onComplete, onSkip }: SkillsExperienceProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showAchievementForm, setShowAchievementForm] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement>({
    title: '',
    description: '',
    year: new Date().getFullYear(),
  });
  const [expandedCategory, setExpandedCategory] = useState<string | null>(skillCategories[0].name);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SkillsExperienceFormData>({
    resolver: zodResolver(skillsExperienceSchema),
    defaultValues: {
      yearsOfExperience: 5,
      certifications: [],
      achievements: [],
    },
  });

  const toggleSkill = (skill: string) => {
    const newSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    setSelectedSkills(newSkills);
  };

  const toggleCertification = (cert: string) => {
    const newCerts = selectedCertifications.includes(cert)
      ? selectedCertifications.filter(c => c !== cert)
      : [...selectedCertifications, cert];
    setSelectedCertifications(newCerts);
    setValue('certifications', newCerts);
  };

  const addAchievement = () => {
    if (!newAchievement.title || !newAchievement.description) {
      toast.error('Please fill in all achievement fields');
      return;
    }

    const updated = [...achievements, newAchievement];
    setAchievements(updated);
    setValue('achievements', updated);
    setNewAchievement({
      title: '',
      description: '',
      year: new Date().getFullYear(),
    });
    setShowAchievementForm(false);
  };

  const removeAchievement = (index: number) => {
    const updated = achievements.filter((_, i) => i !== index);
    setAchievements(updated);
    setValue('achievements', updated);
  };

  const onSubmit = async (data: SkillsExperienceFormData) => {
    if (selectedSkills.length < 3) {
      toast.error('Please select at least 3 skills');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullData = {
        ...data,
        skills: selectedSkills,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Skills & Experience data:', fullData);
      toast.success('Skills and experience saved!');
      onComplete();
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-navy" />
        <h3 className="mt-2 text-lg font-bold text-text-primary">
          Skills & experience
        </h3>
        <p className="mt-1 text-base text-text-secondary">
          Highlight your expertise and achievements to attract the best opportunities.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Primary Role & Experience */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <BriefcaseIcon className="h-5 w-5 mr-2 text-text-tertiary" />
            Role & experience
          </h4>

          <FormField label="Primary role" name="primaryRole" required error={errors.primaryRole?.message}>
            <select {...register('primaryRole')} className="input-field">
              <option value="">Select your primary role</option>
              {primaryRoles.map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Years of experience" name="yearsOfExperience" required error={errors.yearsOfExperience?.message}>
            <input
              {...register('yearsOfExperience', { valueAsNumber: true })}
              type="number"
              min={0}
              max={50}
              className="input-field"
            />
          </FormField>
        </div>

        {/* Skills Selection */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-text-primary flex items-center">
              <WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-text-tertiary" />
              Skills & expertise
            </h4>
            <span className="text-sm text-text-tertiary">
              {selectedSkills.length} selected
            </span>
          </div>
          <p className="text-sm text-text-tertiary">
            Select skills that represent your expertise. Choose at least 3.
          </p>

          {/* Selected Skills Pills */}
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 p-4 bg-bg-alt rounded-xl">
              {selectedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-navy-100 text-navy-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className="ml-2 hover:text-error"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Skill Categories */}
          <div className="space-y-3">
            {skillCategories.map((category) => (
              <div key={category.name} className="border border-border rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedCategory(
                    expandedCategory === category.name ? null : category.name
                  )}
                  className="w-full flex items-center justify-between p-4 bg-bg-alt hover:bg-bg-elevated transition-colors text-left min-h-12"
                >
                  <span className="font-bold text-text-primary">{category.name}</span>
                  <span className="text-sm text-text-tertiary">
                    {category.skills.filter(s => selectedSkills.includes(s)).length} / {category.skills.length}
                  </span>
                </button>
                {expandedCategory === category.name && (
                  <div className="p-4 border-t border-border">
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-9 ${
                            selectedSkills.includes(skill)
                              ? 'bg-navy text-white'
                              : 'bg-bg-alt text-text-secondary hover:bg-navy-50'
                          }`}
                        >
                          {selectedSkills.includes(skill) && (
                            <CheckIcon className="h-4 w-4 mr-1.5" />
                          )}
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-text-primary flex items-center">
            <AcademicCapIcon className="h-5 w-5 mr-2 text-text-tertiary" />
            Certifications (optional)
          </h4>
          <p className="text-sm text-text-tertiary">
            Add relevant certifications and credentials.
          </p>

          <div className="flex flex-wrap gap-2">
            {commonCertifications.map((cert) => (
              <button
                key={cert}
                type="button"
                onClick={() => toggleCertification(cert)}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-9 ${
                  selectedCertifications.includes(cert)
                    ? 'bg-success-light text-success-dark border-2 border-success/30'
                    : 'bg-bg-alt text-text-secondary border-2 border-transparent hover:bg-success-light/50'
                }`}
              >
                {selectedCertifications.includes(cert) && (
                  <CheckIcon className="h-4 w-4 mr-1.5" />
                )}
                {cert}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-text-primary flex items-center">
              <StarIcon className="h-5 w-5 mr-2 text-text-tertiary" />
              Key achievements (optional)
            </h4>
            {!showAchievementForm && (
              <button
                type="button"
                onClick={() => setShowAchievementForm(true)}
                className="text-link text-sm min-h-10 flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add achievement
              </button>
            )}
          </div>
          <p className="text-sm text-text-tertiary">
            Highlight accomplishments that demonstrate your team's value.
          </p>

          {/* Achievement Form */}
          {showAchievementForm && (
            <div className="p-4 bg-bg-alt rounded-xl space-y-4">
              <FormField label="Achievement title" name="achievementTitle" required>
                <input
                  type="text"
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement(prev => ({ ...prev, title: e.target.value }))}
                  className="input-field"
                  placeholder="e.g., Led $50M product launch"
                />
              </FormField>

              <FormField label="Description" name="achievementDescription" required>
                <textarea
                  value={newAchievement.description}
                  onChange={(e) => setNewAchievement(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="input-field"
                  placeholder="Describe the impact and results..."
                />
              </FormField>

              <FormField label="Year" name="achievementYear" required>
                <input
                  type="number"
                  value={newAchievement.year}
                  onChange={(e) => setNewAchievement(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  min={1990}
                  max={new Date().getFullYear()}
                  className="input-field w-32"
                />
              </FormField>

              <ButtonGroup>
                <button
                  type="button"
                  onClick={addAchievement}
                  className="btn-primary min-h-12"
                >
                  Add achievement
                </button>
                <button
                  type="button"
                  onClick={() => setShowAchievementForm(false)}
                  className="text-link min-h-12"
                >
                  Cancel
                </button>
              </ButtonGroup>
            </div>
          )}

          {/* Achievement List */}
          {achievements.length > 0 && (
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 bg-bg-surface border border-border rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <StarIcon className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-text-primary">{achievement.title}</p>
                      <p className="text-sm text-text-secondary mt-1">{achievement.description}</p>
                      <p className="text-sm text-text-tertiary mt-1">{achievement.year}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
                    className="p-2 text-text-tertiary hover:text-error transition-colors min-h-10 min-w-10"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-border">
          <ButtonGroup>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary min-h-12"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <div className="loading-spinner mr-2" />
                  Saving...
                </span>
              ) : (
                'Save skills & experience'
              )}
            </button>
            {onSkip && (
              <TextLink onClick={onSkip} disabled={isSubmitting}>
                Skip for now
              </TextLink>
            )}
          </ButtonGroup>
        </div>
      </form>
    </div>
  );
}
