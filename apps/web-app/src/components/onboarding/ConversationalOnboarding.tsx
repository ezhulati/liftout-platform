'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useSession } from 'next-auth/react';
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
  BuildingOfficeIcon,
  UserGroupIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { ProgressRing } from './ProgressRing';

interface Question {
  id: string;
  type: 'text' | 'select' | 'multiselect' | 'chips' | 'textarea' | 'email-list';
  question: string;
  subtext?: string;
  placeholder?: string;
  options?: { value: string; label: string; description?: string }[];
  required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  validation?: (value: string | string[]) => string | null;
  userTypes?: ('individual' | 'company')[]; // Which user types see this question
}

// Questions for TEAM/INDIVIDUAL users
const teamQuestions: Question[] = [
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
  // Team-specific questions
  {
    id: 'teamName',
    type: 'text',
    question: "What would you like to name your team?",
    subtext: "Choose a name that represents your team's identity.",
    placeholder: 'e.g., The Innovation Squad',
    required: true,
    icon: UserGroupIcon,
  },
  {
    id: 'teamDescription',
    type: 'textarea',
    question: "Describe your team",
    subtext: "Tell companies what makes your team special.",
    placeholder: "Our team excels at...",
    required: true,
    icon: DocumentTextIcon,
    validation: (value) => {
      if (typeof value === 'string' && value.length < 30) {
        return 'Please write at least 30 characters';
      }
      return null;
    },
  },
  {
    id: 'inviteMembers',
    type: 'email-list',
    question: "Invite your team members",
    subtext: "Enter email addresses of colleagues you'd like to invite.",
    placeholder: 'colleague@company.com',
    required: false,
    icon: EnvelopeIcon,
  },
];

// Questions for COMPANY users
const companyQuestions: Question[] = [
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
    question: "What is your role at the company?",
    subtext: "Your position or job title.",
    placeholder: 'e.g., Head of Talent Acquisition',
    required: true,
    icon: BriefcaseIcon,
  },
  {
    id: 'location',
    type: 'text',
    question: "Where is your company headquartered?",
    subtext: "City and country is perfect.",
    placeholder: 'e.g., New York, NY',
    required: true,
    icon: MapPinIcon,
  },
  {
    id: 'companyName',
    type: 'text',
    question: "What's your company name?",
    subtext: "The official name of your organization.",
    placeholder: 'Enter company name',
    required: true,
    icon: BuildingOfficeIcon,
  },
  {
    id: 'companyIndustry',
    type: 'select',
    question: "What industry is your company in?",
    subtext: "Select the primary industry.",
    required: true,
    icon: BuildingOfficeIcon,
    options: [
      { value: 'financial-services', label: 'Financial Services' },
      { value: 'healthcare', label: 'Healthcare Technology' },
      { value: 'enterprise-software', label: 'Enterprise Software' },
      { value: 'consulting', label: 'Management Consulting' },
      { value: 'private-equity', label: 'Private Equity' },
      { value: 'legal', label: 'Legal Services' },
      { value: 'investment-banking', label: 'Investment Banking' },
      { value: 'technology', label: 'Technology' },
      { value: 'retail', label: 'Retail & E-commerce' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'companyDescription',
    type: 'textarea',
    question: "Tell us about your company",
    subtext: "A brief description helps teams understand your organization.",
    placeholder: "We are a company that...",
    required: true,
    icon: DocumentTextIcon,
    validation: (value) => {
      if (typeof value === 'string' && value.length < 50) {
        return 'Please write at least 50 characters';
      }
      return null;
    },
  },
  {
    id: 'companyWebsite',
    type: 'text',
    question: "Company website (optional)",
    subtext: "Help teams learn more about you.",
    placeholder: 'https://www.company.com',
    required: false,
    icon: GlobeAltIcon,
  },
  {
    id: 'opportunityHeadline',
    type: 'text',
    question: "What kind of team are you looking for?",
    subtext: "A brief headline for your first opportunity.",
    placeholder: 'e.g., Experienced FinTech Engineering Team',
    required: false,
    icon: UserGroupIcon,
  },
  {
    id: 'opportunityDescription',
    type: 'textarea',
    question: "Describe your ideal team",
    subtext: "What would make a team a great fit?",
    placeholder: "We're looking for a team that...",
    required: false,
    icon: DocumentTextIcon,
  },
];

interface ConversationalOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function ConversationalOnboarding({ onComplete, onSkip }: ConversationalOnboardingProps) {
  const { userData } = useAuth();
  const { data: session } = useSession();
  const { markOnboardingComplete, skipOnboarding: contextSkipOnboarding } = useOnboarding();
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 = welcome screen
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [currentValue, setCurrentValue] = useState<string | string[]>('');
  const [emailInput, setEmailInput] = useState(''); // For email-list type
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [hasLoadedProfile, setHasLoadedProfile] = useState(false);

  // Determine user type from session
  const userType = session?.user?.userType || 'individual';
  const isCompanyUser = userType === 'company';

  // Select questions based on user type
  const questions = useMemo(() => {
    return isCompanyUser ? companyQuestions : teamQuestions;
  }, [isCompanyUser]);

  const firstName = userData?.name?.split(' ')[0] || 'there';
  const currentQuestion = currentIndex >= 0 ? questions[currentIndex] : null;
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;

  // Fetch existing profile data and resume from where user left off
  useEffect(() => {
    if (hasLoadedProfile) return;

    const loadExistingProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const profile = await response.json();

          // Map profile data to answer format
          const existingAnswers: Record<string, string | string[]> = {};
          if (profile.firstName) existingAnswers.firstName = profile.firstName;
          if (profile.lastName) existingAnswers.lastName = profile.lastName;
          if (profile.title || profile.position) existingAnswers.title = profile.title || profile.position;
          if (profile.location) existingAnswers.location = profile.location;
          if (profile.companyName) existingAnswers.currentCompany = profile.companyName;
          if (profile.yearsExperience) {
            const years = profile.yearsExperience;
            if (years <= 2) existingAnswers.yearsExperience = '0-2';
            else if (years <= 5) existingAnswers.yearsExperience = '3-5';
            else if (years <= 10) existingAnswers.yearsExperience = '6-10';
            else if (years <= 15) existingAnswers.yearsExperience = '11-15';
            else existingAnswers.yearsExperience = '15+';
          }
          if (profile.bio) existingAnswers.bio = profile.bio;

          setAnswers(existingAnswers);

          // Find first incomplete question to resume from
          // If user has some data, skip welcome screen and go to first incomplete
          const filledQuestions = Object.keys(existingAnswers);
          if (filledQuestions.length > 0) {
            const firstIncomplete = questions.findIndex(q => !existingAnswers[q.id]);
            // Don't skip welcome if no questions completed, otherwise go to first incomplete
            if (firstIncomplete > 0) {
              setCurrentIndex(firstIncomplete);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setIsLoadingProfile(false);
        setHasLoadedProfile(true);
      }
    };

    loadExistingProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoadedProfile]);

  // Pre-fill first/last name from user data (fallback if profile is empty)
  useEffect(() => {
    if (userData?.name && !answers.firstName) {
      const [first, ...rest] = userData.name.split(' ');
      setAnswers(prev => ({
        ...prev,
        firstName: prev.firstName || first || '',
        lastName: prev.lastName || rest.join(' ') || '',
      }));
    }
  }, [userData, answers.firstName]);

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

  // Save current answer to database (incremental save)
  const saveCurrentAnswer = useCallback(async (questionId: string, value: string | string[]) => {
    const updateData: Record<string, unknown> = {};

    // Map question ID to API field based on user type
    switch (questionId) {
      case 'firstName':
        updateData.firstName = value;
        break;
      case 'lastName':
        updateData.lastName = value;
        break;
      case 'title':
        updateData.title = value;
        break;
      case 'location':
        updateData.location = value;
        break;
      case 'currentCompany':
        updateData.companyName = value;
        break;
      case 'companyName':
        updateData.companyName = value;
        break;
      case 'yearsExperience':
        updateData.yearsExperience = parseInt(String(value).split('-')[0]) || 0;
        break;
      case 'skills':
        updateData.skills = value;
        break;
      case 'bio':
        updateData.bio = value;
        break;
      case 'companyIndustry':
        updateData.industry = value;
        break;
      case 'companyDescription':
        updateData.companyDescription = value;
        break;
      case 'companyWebsite':
        updateData.website = value;
        break;
      // Team and opportunity fields are handled in final save
      case 'teamName':
      case 'teamDescription':
      case 'inviteMembers':
      case 'opportunityHeadline':
      case 'opportunityDescription':
      case 'seniorityLevel':
      case 'interests':
        return; // Skip - these are handled in final save or stored separately
      default:
        return; // Skip unknown fields
    }

    try {
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
    } catch (err) {
      console.error('Failed to save answer:', err);
      // Don't block navigation on save failure
    }
  }, []);

  // Create team for team users
  const createTeam = useCallback(async (teamName: string, teamDescription: string, industry: string) => {
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: teamName,
          description: teamDescription,
          industry: industry,
        }),
      });
      if (response.ok) {
        const team = await response.json();
        return team.id;
      }
    } catch (err) {
      console.error('Failed to create team:', err);
    }
    return null;
  }, []);

  // Send team invitations
  const sendTeamInvitations = useCallback(async (teamId: string, emails: string[]) => {
    for (const email of emails) {
      try {
        await fetch('/api/teams/invitations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teamId, email }),
        });
      } catch (err) {
        console.error('Failed to send invitation to:', email, err);
      }
    }
  }, []);

  // Create opportunity for company users
  const createOpportunity = useCallback(async (title: string, description: string) => {
    if (!title) return;
    try {
      await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          status: 'draft',
        }),
      });
    } catch (err) {
      console.error('Failed to create opportunity:', err);
    }
  }, []);

  // Add email to list
  const addEmail = useCallback(() => {
    const email = emailInput.trim().toLowerCase();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const currentEmails = Array.isArray(currentValue) ? currentValue : [];
      if (!currentEmails.includes(email)) {
        setCurrentValue([...currentEmails, email]);
      }
      setEmailInput('');
      setError(null);
    } else {
      setError('Please enter a valid email address');
    }
  }, [emailInput, currentValue]);

  // Remove email from list
  const removeEmail = useCallback((emailToRemove: string) => {
    const currentEmails = Array.isArray(currentValue) ? currentValue : [];
    setCurrentValue(currentEmails.filter(e => e !== emailToRemove));
  }, [currentValue]);

  const handleNext = useCallback(async () => {
    if (!validateAndProceed()) return;

    // Save current answer locally and to database
    if (currentQuestion) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: currentValue,
      }));

      // Save to database incrementally (don't wait for it)
      saveCurrentAnswer(currentQuestion.id, currentValue);
    }

    setDirection('forward');

    if (isLastQuestion) {
      // Submit final answer and mark complete
      setIsSubmitting(true);
      try {
        const finalAnswers = {
          ...answers,
          [currentQuestion!.id]: currentValue,
        };

        if (isCompanyUser) {
          // Company user final save
          const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              firstName: finalAnswers.firstName,
              lastName: finalAnswers.lastName,
              title: finalAnswers.title,
              location: finalAnswers.location,
              companyName: finalAnswers.companyName,
              industry: finalAnswers.companyIndustry,
              companyDescription: finalAnswers.companyDescription,
              website: finalAnswers.companyWebsite,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to save profile');
          }

          // Create opportunity if provided
          if (finalAnswers.opportunityHeadline) {
            await createOpportunity(
              String(finalAnswers.opportunityHeadline),
              String(finalAnswers.opportunityDescription || '')
            );
          }

          toast.success('Company profile created successfully!');
        } else {
          // Team user final save
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
              bio: finalAnswers.bio,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to save profile');
          }

          // Create team
          if (finalAnswers.teamName) {
            const teamId = await createTeam(
              String(finalAnswers.teamName),
              String(finalAnswers.teamDescription || ''),
              Array.isArray(finalAnswers.interests) ? finalAnswers.interests[0] : ''
            );

            // Send invitations if team was created and emails were provided
            if (teamId && Array.isArray(finalAnswers.inviteMembers) && finalAnswers.inviteMembers.length > 0) {
              await sendTeamInvitations(teamId, finalAnswers.inviteMembers);
            }
          }

          toast.success('Profile and team created successfully!');
        }

        // Mark onboarding as complete in the database
        await markOnboardingComplete();

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
  }, [validateAndProceed, currentQuestion, currentValue, isLastQuestion, answers, saveCurrentAnswer, onComplete, markOnboardingComplete, isCompanyUser, createOpportunity, createTeam, sendTeamInvitations]);

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

  // Loading state while fetching profile
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-navy-50 via-bg to-bg">
        <div className="loading-spinner w-10 h-10 mb-4"></div>
        <p className="text-base text-text-secondary">Loading your profile...</p>
      </div>
    );
  }

  // Check if user is resuming (has some answers filled)
  const isResuming = Object.keys(answers).length > 2; // More than just first/last name

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
            {isResuming ? `Welcome back, ${firstName}!` : `Hey ${firstName}!`}
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed mb-8">
            {isResuming
              ? "Let's finish setting up your profile. We saved your progress."
              : isCompanyUser
                ? "Let's set up your company profile. This helps teams learn about your organization and opportunities."
                : "Let's set up your profile and create your team. This helps companies discover your team's unique strengths."
            }
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-text-tertiary mb-10">
            <span className="w-2 h-2 bg-navy rounded-full"></span>
            <span>{isResuming ? 'Just a few more questions' : 'Takes about 2 minutes'}</span>
          </div>

          <button
            onClick={() => setCurrentIndex(0)}
            className="w-full btn-primary min-h-14 text-base font-semibold flex items-center justify-center gap-2 mb-4"
          >
            {isResuming ? 'Continue' : "Let's go"}
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
        <div className="flex flex-col items-center">
          <ProgressRing
            percentage={progress}
            size={48}
            strokeWidth={5}
            showMilestones={false}
          />
          <span className="text-xs text-text-tertiary mt-1">
            {currentIndex + 1} of {questions.length}
          </span>
        </div>
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

            {currentQuestion?.type === 'email-list' && (
              <div className="space-y-4">
                {/* Email input */}
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => { setEmailInput(e.target.value); setError(null); }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addEmail();
                      }
                    }}
                    placeholder={currentQuestion.placeholder}
                    className="flex-1 text-lg border-2 border-border focus:border-purple-500 rounded-lg p-3 outline-none transition-colors placeholder:text-text-tertiary"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={addEmail}
                    className="px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors min-h-12"
                  >
                    Add
                  </button>
                </div>

                {/* Email list */}
                {Array.isArray(currentValue) && currentValue.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-text-secondary">{currentValue.length} team member{currentValue.length > 1 ? 's' : ''} to invite:</p>
                    <div className="flex flex-wrap gap-2">
                      {currentValue.map((email) => (
                        <span
                          key={email}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {email}
                          <button
                            type="button"
                            onClick={() => removeEmail(email)}
                            className="ml-1 hover:text-purple-900"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-sm text-text-tertiary">
                  You can skip this and invite team members later.
                </p>
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
          {currentQuestion?.type !== 'textarea' && currentQuestion?.type !== 'chips' && currentQuestion?.type !== 'select' && currentQuestion?.type !== 'email-list' && (
            <p className="text-center text-sm text-text-tertiary mt-4">
              Press <kbd className="px-2 py-0.5 bg-bg-elevated rounded text-xs font-mono">Enter</kbd> to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
