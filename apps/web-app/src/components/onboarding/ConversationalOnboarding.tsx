'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  SparklesIcon,
  RocketLaunchIcon,
  UserIcon,
  BriefcaseIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

interface Question {
  id: string;
  type: 'text' | 'select' | 'multiselect' | 'chips' | 'textarea';
  question: string;
  subtext?: string;
  placeholder?: string;
  options?: { value: string; label: string; description?: string }[];
  required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  validation?: (value: string | string[]) => string | null;
}

const questions: Question[] = [
  {
    id: 'firstName',
    type: 'text',
    question: "What's your first name?",
    subtext: "Let's start with the basics.",
    placeholder: 'Enter your first name',
    required: true,
    icon: UserIcon,
  },
  {
    id: 'lastName',
    type: 'text',
    question: "And your last name?",
    placeholder: 'Enter your last name',
    required: true,
    icon: UserIcon,
  },
  {
    id: 'title',
    type: 'text',
    question: "What's your professional title?",
    subtext: "How would you describe your role?",
    placeholder: 'e.g., Senior Software Engineer',
    required: true,
    icon: BriefcaseIcon,
  },
  {
    id: 'seniorityLevel',
    type: 'select',
    question: "What's your experience level?",
    subtext: "This helps us match you with the right opportunities.",
    required: true,
    icon: BriefcaseIcon,
    options: [
      { value: 'junior', label: 'Junior', description: '0-2 years' },
      { value: 'mid', label: 'Mid-level', description: '2-5 years' },
      { value: 'senior', label: 'Senior', description: '5-8 years' },
      { value: 'lead', label: 'Lead', description: '8-12 years' },
      { value: 'principal', label: 'Principal', description: '12+ years' },
      { value: 'executive', label: 'Executive', description: 'C-level' },
    ],
  },
  {
    id: 'location',
    type: 'text',
    question: "Where are you based?",
    subtext: "City and country is perfect.",
    placeholder: 'e.g., San Francisco, CA',
    required: true,
    icon: MapPinIcon,
  },
  {
    id: 'currentCompany',
    type: 'text',
    question: "Where do you currently work?",
    placeholder: 'Company name',
    required: true,
    icon: BriefcaseIcon,
  },
  {
    id: 'yearsExperience',
    type: 'select',
    question: "How many years of experience do you have?",
    required: true,
    icon: BriefcaseIcon,
    options: [
      { value: '0-2', label: '0-2 years' },
      { value: '3-5', label: '3-5 years' },
      { value: '6-10', label: '6-10 years' },
      { value: '11-15', label: '11-15 years' },
      { value: '15+', label: '15+ years' },
    ],
  },
  {
    id: 'skills',
    type: 'chips',
    question: "What are your key skills?",
    subtext: "Select at least 3 that best represent your expertise.",
    required: true,
    icon: WrenchScrewdriverIcon,
    options: [
      { value: 'JavaScript', label: 'JavaScript' },
      { value: 'TypeScript', label: 'TypeScript' },
      { value: 'React', label: 'React' },
      { value: 'Node.js', label: 'Node.js' },
      { value: 'Python', label: 'Python' },
      { value: 'Java', label: 'Java' },
      { value: 'AWS', label: 'AWS' },
      { value: 'Product Management', label: 'Product Management' },
      { value: 'Data Science', label: 'Data Science' },
      { value: 'Machine Learning', label: 'Machine Learning' },
      { value: 'UI/UX Design', label: 'UI/UX Design' },
      { value: 'DevOps', label: 'DevOps' },
      { value: 'Leadership', label: 'Leadership' },
      { value: 'Strategy', label: 'Strategy' },
      { value: 'Finance', label: 'Finance' },
      { value: 'Sales', label: 'Sales' },
    ],
    validation: (value) => {
      if (Array.isArray(value) && value.length < 3) {
        return 'Please select at least 3 skills';
      }
      return null;
    },
  },
  {
    id: 'interests',
    type: 'chips',
    question: "What industries interest you?",
    subtext: "Select all that apply.",
    required: true,
    icon: HeartIcon,
    options: [
      { value: 'Fintech', label: 'Fintech' },
      { value: 'Healthcare', label: 'Healthcare' },
      { value: 'AI/ML', label: 'AI/ML' },
      { value: 'SaaS', label: 'SaaS' },
      { value: 'E-commerce', label: 'E-commerce' },
      { value: 'Climate Tech', label: 'Climate Tech' },
      { value: 'Cybersecurity', label: 'Cybersecurity' },
      { value: 'EdTech', label: 'EdTech' },
      { value: 'Gaming', label: 'Gaming' },
      { value: 'Blockchain', label: 'Blockchain' },
      { value: 'Enterprise', label: 'Enterprise' },
      { value: 'Startups', label: 'Startups' },
    ],
    validation: (value) => {
      if (Array.isArray(value) && value.length < 1) {
        return 'Please select at least 1 interest';
      }
      return null;
    },
  },
  {
    id: 'bio',
    type: 'textarea',
    question: "Tell us a bit about yourself",
    subtext: "A brief bio helps companies understand what drives you.",
    placeholder: "I'm passionate about...",
    required: true,
    icon: UserIcon,
    validation: (value) => {
      if (typeof value === 'string' && value.length < 50) {
        return 'Please write at least 50 characters';
      }
      return null;
    },
  },
];

interface ConversationalOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function ConversationalOnboarding({ onComplete, onSkip }: ConversationalOnboardingProps) {
  const { userData } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 = welcome screen
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [currentValue, setCurrentValue] = useState<string | string[]>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const firstName = userData?.name?.split(' ')[0] || 'there';
  const currentQuestion = currentIndex >= 0 ? questions[currentIndex] : null;
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;

  // Pre-fill first/last name from user data
  useEffect(() => {
    if (userData?.name) {
      const [first, ...rest] = userData.name.split(' ');
      setAnswers(prev => ({
        ...prev,
        firstName: first || '',
        lastName: rest.join(' ') || '',
      }));
    }
  }, [userData]);

  // Set current value when navigating to a question
  useEffect(() => {
    if (currentQuestion) {
      const existingAnswer = answers[currentQuestion.id];
      if (existingAnswer !== undefined) {
        setCurrentValue(existingAnswer);
      } else if (currentQuestion.type === 'chips' || currentQuestion.type === 'multiselect') {
        setCurrentValue([]);
      } else {
        setCurrentValue('');
      }
    }
    setError(null);
  }, [currentIndex, currentQuestion, answers]);

  const validateAndProceed = useCallback(() => {
    if (!currentQuestion) return true;

    // Check required
    if (currentQuestion.required) {
      if (Array.isArray(currentValue) && currentValue.length === 0) {
        setError('This field is required');
        return false;
      }
      if (typeof currentValue === 'string' && !currentValue.trim()) {
        setError('This field is required');
        return false;
      }
    }

    // Custom validation
    if (currentQuestion.validation) {
      const validationError = currentQuestion.validation(currentValue);
      if (validationError) {
        setError(validationError);
        return false;
      }
    }

    return true;
  }, [currentQuestion, currentValue]);

  const handleNext = useCallback(async () => {
    if (!validateAndProceed()) return;

    // Save current answer
    if (currentQuestion) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: currentValue,
      }));
    }

    setDirection('forward');

    if (isLastQuestion) {
      // Submit all answers
      setIsSubmitting(true);
      try {
        const finalAnswers = {
          ...answers,
          [currentQuestion!.id]: currentValue,
        };

        const response = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: finalAnswers.firstName,
            lastName: finalAnswers.lastName,
            title: finalAnswers.title,
            location: finalAnswers.location,
            companyName: finalAnswers.currentCompany,
            yearsExperience: parseInt(String(finalAnswers.yearsExperience).split('-')[0]) || 0,
            skills: finalAnswers.skills,
            interests: finalAnswers.interests,
            bio: finalAnswers.bio,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save profile');
        }

        toast.success('Profile created successfully!');
        onComplete();
      } catch (err) {
        console.error('Save error:', err);
        toast.error('Failed to save profile. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [validateAndProceed, currentQuestion, currentValue, isLastQuestion, answers, onComplete]);

  const handleBack = useCallback(() => {
    if (currentQuestion) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: currentValue,
      }));
    }
    setDirection('backward');
    setCurrentIndex(prev => Math.max(-1, prev - 1));
  }, [currentQuestion, currentValue]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && currentQuestion?.type !== 'textarea') {
      e.preventDefault();
      handleNext();
    }
  }, [handleNext, currentQuestion]);

  const toggleChip = (value: string) => {
    setCurrentValue(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      if (arr.includes(value)) {
        return arr.filter(v => v !== value);
      }
      return [...arr, value];
    });
    setError(null);
  };

  // Welcome screen
  if (currentIndex === -1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-navy-50 via-bg to-bg">
        <div className="max-w-md w-full text-center animate-fadeIn">
          <div className="mb-8 relative inline-block">
            <div className="w-20 h-20 bg-navy rounded-2xl flex items-center justify-center shadow-lg shadow-navy/20">
              <RocketLaunchIcon className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gold rounded-full flex items-center justify-center">
              <SparklesIcon className="h-3 w-3 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-text-primary mb-4">
            Hey {firstName}!
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed mb-8">
            Let's set up your profile in a few quick questions. This helps us match you with the best opportunities.
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-text-tertiary mb-10">
            <span className="w-2 h-2 bg-navy rounded-full"></span>
            <span>Takes about 2 minutes</span>
          </div>

          <button
            onClick={() => setCurrentIndex(0)}
            className="w-full btn-primary min-h-14 text-base font-semibold flex items-center justify-center gap-2 mb-4"
          >
            Let's go
            <ArrowRightIcon className="h-5 w-5" />
          </button>

          <button
            onClick={onSkip}
            className="text-text-tertiary hover:text-text-secondary text-sm"
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  const Icon = currentQuestion?.icon;

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-border z-10">
        <div
          className="h-full bg-navy transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-text-tertiary hover:text-text-primary transition-colors min-h-12"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="text-sm">Back</span>
        </button>
        <span className="text-sm text-text-tertiary">
          {currentIndex + 1} of {questions.length}
        </span>
        <button
          onClick={onSkip}
          className="text-sm text-text-tertiary hover:text-text-secondary min-h-12"
        >
          Skip
        </button>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div
          key={currentIndex}
          className={`max-w-lg w-full animate-${direction === 'forward' ? 'slideInRight' : 'slideInLeft'}`}
        >
          {Icon && (
            <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center mb-6">
              <Icon className="h-6 w-6 text-navy" />
            </div>
          )}

          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {currentQuestion?.question}
          </h2>

          {currentQuestion?.subtext && (
            <p className="text-base text-text-secondary mb-8">
              {currentQuestion.subtext}
            </p>
          )}

          {/* Input based on type */}
          <div className="mb-6">
            {currentQuestion?.type === 'text' && (
              <input
                type="text"
                value={currentValue as string}
                onChange={(e) => { setCurrentValue(e.target.value); setError(null); }}
                onKeyPress={handleKeyPress}
                placeholder={currentQuestion.placeholder}
                className="w-full text-xl border-0 border-b-2 border-border focus:border-navy bg-transparent py-3 outline-none transition-colors placeholder:text-text-tertiary"
                autoFocus
              />
            )}

            {currentQuestion?.type === 'textarea' && (
              <textarea
                value={currentValue as string}
                onChange={(e) => { setCurrentValue(e.target.value); setError(null); }}
                placeholder={currentQuestion.placeholder}
                rows={4}
                className="w-full text-lg border-2 border-border focus:border-navy rounded-xl p-4 outline-none transition-colors placeholder:text-text-tertiary resize-none"
                autoFocus
              />
            )}

            {currentQuestion?.type === 'select' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => { setCurrentValue(option.value); setError(null); }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                      currentValue === option.value
                        ? 'border-navy bg-navy-50'
                        : 'border-border hover:border-navy-200'
                    }`}
                  >
                    <div>
                      <span className="font-medium text-text-primary">{option.label}</span>
                      {option.description && (
                        <span className="text-text-tertiary ml-2">({option.description})</span>
                      )}
                    </div>
                    {currentValue === option.value && (
                      <CheckIcon className="h-5 w-5 text-navy" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion?.type === 'chips' && (
              <div className="flex flex-wrap gap-3">
                {currentQuestion.options?.map((option) => {
                  const selected = Array.isArray(currentValue) && currentValue.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => toggleChip(option.value)}
                      className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                        selected
                          ? 'bg-navy text-white'
                          : 'bg-bg-elevated text-text-secondary border border-border hover:border-navy-200'
                      }`}
                    >
                      {selected && <CheckIcon className="h-4 w-4 inline mr-1.5" />}
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {error && (
            <p className="text-error text-sm mb-4">{error}</p>
          )}

          {/* Continue button */}
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="w-full btn-primary min-h-14 text-base font-semibold flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner w-5 h-5" />
                Saving...
              </>
            ) : isLastQuestion ? (
              <>
                Complete setup
                <CheckIcon className="h-5 w-5" />
              </>
            ) : (
              <>
                Continue
                <ArrowRightIcon className="h-5 w-5" />
              </>
            )}
          </button>

          {/* Keyboard hint */}
          {currentQuestion?.type !== 'textarea' && currentQuestion?.type !== 'chips' && currentQuestion?.type !== 'select' && (
            <p className="text-center text-sm text-text-tertiary mt-4">
              Press <kbd className="px-2 py-0.5 bg-bg-elevated rounded text-xs font-mono">Enter</kbd> to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
