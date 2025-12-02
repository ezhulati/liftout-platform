import { z } from 'zod';

// Base validation schemas
const emailSchema = z.string().email('Please enter a valid email address');
const phoneSchema = z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number');
const urlSchema = z.string().url('Please enter a valid URL').optional().or(z.literal(''));
const yearSchema = z.number().min(1800).max(new Date().getFullYear()).int();

// Individual User Profile Validation
export const individualProfileSchema = z.object({
  // Basic Information
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  headline: z.string().max(120, 'Headline must be less than 120 characters').optional(),
  bio: z.string().max(2000, 'Bio must be less than 2000 characters').optional(),
  location: z.string().min(1, 'Location is required').max(100, 'Location must be less than 100 characters'),
  phone: phoneSchema,
  
  // Professional Information
  currentCompany: z.string().min(1, 'Current company is required').max(100, 'Company name must be less than 100 characters'),
  currentPosition: z.string().min(1, 'Current position is required').max(100, 'Position must be less than 100 characters'),
  industry: z.string().min(1, 'Industry is required'),
  yearsExperience: z.number().min(0, 'Years of experience cannot be negative').max(60, 'Years of experience seems too high'),
  
  // Skills
  skills: z.array(z.object({
    name: z.string().min(1, 'Skill name is required').max(50, 'Skill name must be less than 50 characters'),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
    yearsExperience: z.number().min(0, 'Years of experience cannot be negative').max(30, 'Years of experience for a skill seems too high'),
  })).min(1, 'At least one skill is required').max(20, 'Maximum 20 skills allowed'),
  
  primarySkills: z.array(z.string()).max(5, 'Maximum 5 primary skills allowed'),
  
  // Experience
  experiences: z.array(z.object({
    id: z.string(),
    company: z.string().min(1, 'Company name is required').max(100, 'Company name must be less than 100 characters'),
    position: z.string().min(1, 'Position is required').max(100, 'Position must be less than 100 characters'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    isCurrent: z.boolean(),
    description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
    achievements: z.array(z.string()).max(10, 'Maximum 10 achievements per experience'),
    technologies: z.array(z.string()).max(20, 'Maximum 20 technologies per experience'),
  })).min(1, 'At least one work experience is required').max(10, 'Maximum 10 work experiences allowed'),
  
  // Education
  education: z.array(z.object({
    id: z.string(),
    institution: z.string().min(1, 'Institution name is required').max(100, 'Institution name must be less than 100 characters'),
    degree: z.string().min(1, 'Degree is required').max(100, 'Degree must be less than 100 characters'),
    field: z.string().min(1, 'Field of study is required').max(100, 'Field must be less than 100 characters'),
    startYear: yearSchema,
    endYear: yearSchema.optional(),
    gpa: z.number().min(0).max(4.0).optional(),
  })).max(10, 'Maximum 10 education entries allowed'),
  
  // Achievements
  achievements: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, 'Achievement title is required').max(100, 'Title must be less than 100 characters'),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
    date: z.string().min(1, 'Date is required'),
    type: z.enum(['award', 'certification', 'project', 'recognition']),
    organization: z.string().max(100, 'Organization name must be less than 100 characters').optional(),
    url: urlSchema,
  })).max(20, 'Maximum 20 achievements allowed'),
  
  // Portfolio
  portfolio: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, 'Project title is required').max(100, 'Title must be less than 100 characters'),
    description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
    url: z.string().url('Please enter a valid URL'),
    imageUrl: urlSchema,
    technologies: z.array(z.string()).max(20, 'Maximum 20 technologies per project'),
    type: z.enum(['project', 'publication', 'presentation', 'other']),
  })).max(20, 'Maximum 20 portfolio items allowed'),
  
  // Preferences
  openToOpportunities: z.boolean(),
  preferredRoles: z.array(z.string()).max(10, 'Maximum 10 preferred roles'),
  salaryRange: z.object({
    min: z.number().min(0, 'Minimum salary cannot be negative'),
    max: z.number().min(0, 'Maximum salary cannot be negative'),
    currency: z.string().min(1, 'Currency is required'),
  }).refine(data => data.max >= data.min, {
    message: 'Maximum salary must be greater than or equal to minimum salary',
    path: ['max'],
  }),
  workAuthorization: z.string().min(1, 'Work authorization status is required'),
  remoteWork: z.enum(['onsite', 'hybrid', 'remote', 'flexible']),
  
  // Social Links
  socialLinks: z.object({
    linkedin: urlSchema,
    github: urlSchema,
    website: urlSchema,
    twitter: urlSchema,
  }),
});

// Company Profile Validation
export const companyProfileSchema = z.object({
  // Basic Company Information
  companyName: z.string().min(1, 'Company name is required').max(100, 'Company name must be less than 100 characters'),
  tagline: z.string().max(120, 'Tagline must be less than 120 characters').optional(),
  description: z.string().min(50, 'Company description must be at least 50 characters').max(2000, 'Description must be less than 2000 characters'),
  website: z.string().url('Please enter a valid website URL'),
  industry: z.string().min(1, 'Industry is required'),
  companySize: z.string().min(1, 'Company size is required'),
  foundedYear: yearSchema,
  headquarters: z.string().min(1, 'Headquarters location is required').max(100, 'Location must be less than 100 characters'),
  
  // Contact Information
  contactEmail: emailSchema,
  contactPhone: phoneSchema,
  
  // Offices
  offices: z.array(z.object({
    id: z.string(),
    city: z.string().min(1, 'City is required').max(50, 'City must be less than 50 characters'),
    country: z.string().min(1, 'Country is required').max(50, 'Country must be less than 50 characters'),
    address: z.string().min(1, 'Address is required').max(200, 'Address must be less than 200 characters'),
    isHeadquarters: z.boolean(),
    employeeCount: z.number().min(0, 'Employee count cannot be negative'),
    amenities: z.array(z.string()).max(20, 'Maximum 20 amenities per office'),
  })).min(1, 'At least one office location is required').max(50, 'Maximum 50 office locations'),
  
  // Culture & Values
  mission: z.string().min(50, 'Mission statement must be at least 50 characters').max(1000, 'Mission must be less than 1000 characters'),
  vision: z.string().min(50, 'Vision statement must be at least 50 characters').max(1000, 'Vision must be less than 1000 characters'),
  values: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, 'Value title is required').max(50, 'Title must be less than 50 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
    icon: z.string().optional(),
  })).min(3, 'At least 3 company values are required').max(10, 'Maximum 10 values allowed'),
  
  culture: z.string().max(2000, 'Culture description must be less than 2000 characters').optional(),
  workEnvironment: z.enum(['remote', 'hybrid', 'onsite', 'flexible']),
  
  // Benefits
  benefits: z.array(z.object({
    id: z.string(),
    category: z.enum(['health', 'financial', 'time-off', 'professional', 'lifestyle', 'other']),
    title: z.string().min(1, 'Benefit title is required').max(100, 'Title must be less than 100 characters'),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  })).min(1, 'At least one benefit is required').max(50, 'Maximum 50 benefits allowed'),
  
  perks: z.array(z.string()).max(20, 'Maximum 20 perks allowed'),
  
  // Team & Leadership
  leadership: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
    position: z.string().min(1, 'Position is required').max(100, 'Position must be less than 100 characters'),
    department: z.string().min(1, 'Department is required').max(50, 'Department must be less than 50 characters'),
    photoUrl: urlSchema,
    bio: z.string().max(1000, 'Bio must be less than 1000 characters').optional(),
    linkedin: urlSchema,
  })).max(50, 'Maximum 50 leadership team members'),
  
  departments: z.array(z.string()).min(1, 'At least one department is required').max(20, 'Maximum 20 departments'),
  
  // Company Statistics
  stats: z.object({
    employeeCount: z.number().min(1, 'Employee count must be at least 1'),
    annualRevenue: z.string().optional(),
    fundingRaised: z.string().optional(),
    customersServed: z.number().min(0).optional(),
    yearsInBusiness: z.number().min(0, 'Years in business cannot be negative'),
    employeeRetentionRate: z.number().min(0).max(100).optional(),
    diversityStats: z.object({
      genderDiversity: z.number().min(0).max(100),
      ethnicDiversity: z.number().min(0).max(100),
    }).optional(),
  }),
  
  // Achievements
  achievements: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, 'Achievement title is required').max(100, 'Title must be less than 100 characters'),
    description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
    date: z.string().min(1, 'Date is required'),
    type: z.enum(['award', 'certification', 'milestone', 'recognition', 'funding']),
    organization: z.string().max(100, 'Organization name must be less than 100 characters').optional(),
    url: urlSchema,
  })).max(50, 'Maximum 50 achievements allowed'),
  
  certifications: z.array(z.string()).max(20, 'Maximum 20 certifications'),
  awards: z.array(z.string()).max(20, 'Maximum 20 awards'),
  
  // Hiring Preferences
  hiringPreferences: z.object({
    preferredTeamSizes: z.array(z.number().min(1).max(100)).min(1, 'At least one preferred team size required'),
    industries: z.array(z.string()).min(1, 'At least one industry preference required'),
    locations: z.array(z.string()).min(1, 'At least one location preference required'),
    remotePolicy: z.string().min(1, 'Remote work policy is required'),
    liftoutBudget: z.object({
      min: z.number().min(0, 'Minimum budget cannot be negative'),
      max: z.number().min(0, 'Maximum budget cannot be negative'),
      currency: z.string().min(1, 'Currency is required'),
    }).refine(data => data.max >= data.min, {
      message: 'Maximum budget must be greater than or equal to minimum budget',
      path: ['max'],
    }),
  }),
  
  // Social Links
  socialLinks: z.object({
    linkedin: urlSchema,
    twitter: urlSchema,
    facebook: urlSchema,
    instagram: urlSchema,
    youtube: urlSchema,
    blog: urlSchema,
  }),
  
  // Verification
  verified: z.boolean(),
  verificationDocuments: z.array(z.string()).max(10, 'Maximum 10 verification documents'),
  trustScore: z.number().min(0).max(5),
  
  // Client Testimonials
  clientTestimonials: z.array(z.object({
    id: z.string(),
    client: z.string().min(1, 'Client name is required').max(100, 'Client name must be less than 100 characters'),
    role: z.string().min(1, 'Role is required').max(100, 'Role must be less than 100 characters'),
    company: z.string().min(1, 'Company is required').max(100, 'Company must be less than 100 characters'),
    testimonial: z.string().min(50, 'Testimonial must be at least 50 characters').max(1000, 'Testimonial must be less than 1000 characters'),
    rating: z.number().min(1).max(5),
    date: z.string().min(1, 'Date is required'),
  })).max(20, 'Maximum 20 client testimonials'),
});

// Profile completeness calculation
export interface ProfileCompletenessWeights {
  basic: number;
  professional: number;
  skills: number;
  experience: number;
  portfolio: number;
  preferences: number;
}

export const DEFAULT_INDIVIDUAL_WEIGHTS: ProfileCompletenessWeights = {
  basic: 30,        // 30% - Name, location, phone, bio
  professional: 25, // 25% - Company, position, industry, years experience
  skills: 20,       // 20% - Skills list with levels
  experience: 15,   // 15% - Work experience entries
  portfolio: 5,     // 5% - Portfolio/projects
  preferences: 5,   // 5% - Career preferences
};

export const DEFAULT_COMPANY_WEIGHTS = {
  basic: 25,        // 25% - Name, description, industry, size, website
  culture: 20,      // 20% - Mission, vision, values
  team: 15,         // 15% - Leadership team, departments
  benefits: 15,     // 15% - Benefits and perks
  offices: 10,      // 10% - Office locations
  achievements: 10, // 10% - Awards, certifications, milestones
  hiring: 5,        // 5% - Hiring preferences
};

export function calculateIndividualProfileCompleteness(
  profile: any,
  weights: ProfileCompletenessWeights = DEFAULT_INDIVIDUAL_WEIGHTS
): { score: number; breakdown: Record<string, number>; recommendations: string[] } {
  const breakdown: Record<string, number> = {};
  const recommendations: string[] = [];
  
  // Basic Information (30%)
  const basicFields = [profile.firstName, profile.lastName, profile.location, profile.phone, profile.bio];
  const basicScore = (basicFields.filter(Boolean).length / basicFields.length) * 100;
  breakdown.basic = basicScore;
  
  if (basicScore < 100) {
    const missing = [];
    if (!profile.firstName) missing.push('first name');
    if (!profile.lastName) missing.push('last name');
    if (!profile.location) missing.push('location');
    if (!profile.phone) missing.push('phone number');
    if (!profile.bio) missing.push('professional bio');
    recommendations.push(`Complete your basic information: ${missing.join(', ')}`);
  }
  
  // Professional Information (25%)
  const professionalFields = [
    profile.currentCompany,
    profile.currentPosition,
    profile.industry,
    profile.yearsExperience > 0
  ];
  const professionalScore = (professionalFields.filter(Boolean).length / professionalFields.length) * 100;
  breakdown.professional = professionalScore;
  
  if (professionalScore < 100) {
    recommendations.push('Complete your professional information');
  }
  
  // Skills (20%)
  const skillsScore = profile.skills?.length > 0 ? Math.min((profile.skills.length / 5) * 100, 100) : 0;
  breakdown.skills = skillsScore;
  
  if (skillsScore < 100) {
    recommendations.push('Add more skills to showcase your expertise');
  }
  
  // Experience (15%)
  const experienceScore = profile.experiences?.length > 0 ? Math.min((profile.experiences.length / 3) * 100, 100) : 0;
  breakdown.experience = experienceScore;
  
  if (experienceScore < 100) {
    recommendations.push('Add your work experience history');
  }
  
  // Portfolio (5%)
  const portfolioScore = profile.portfolio?.length > 0 ? Math.min((profile.portfolio.length / 2) * 100, 100) : 0;
  breakdown.portfolio = portfolioScore;
  
  if (portfolioScore < 100) {
    recommendations.push('Add projects to your portfolio');
  }
  
  // Preferences (5%)
  const preferencesFields = [
    profile.openToOpportunities !== undefined,
    profile.preferredRoles?.length > 0,
    profile.salaryRange?.min > 0,
    profile.workAuthorization
  ];
  const preferencesScore = (preferencesFields.filter(Boolean).length / preferencesFields.length) * 100;
  breakdown.preferences = preferencesScore;
  
  if (preferencesScore < 100) {
    recommendations.push('Set your career preferences and availability');
  }
  
  // Calculate weighted score
  const score = Math.round(
    (breakdown.basic * weights.basic +
     breakdown.professional * weights.professional +
     breakdown.skills * weights.skills +
     breakdown.experience * weights.experience +
     breakdown.portfolio * weights.portfolio +
     breakdown.preferences * weights.preferences) / 100
  );
  
  return { score, breakdown, recommendations };
}

export function calculateCompanyProfileCompleteness(
  profile: any,
  weights = DEFAULT_COMPANY_WEIGHTS
): { score: number; breakdown: Record<string, number>; recommendations: string[] } {
  const breakdown: Record<string, number> = {};
  const recommendations: string[] = [];
  
  // Basic Information (25%)
  const basicFields = [
    profile.companyName,
    profile.description,
    profile.industry,
    profile.companySize,
    profile.website
  ];
  const basicScore = (basicFields.filter(Boolean).length / basicFields.length) * 100;
  breakdown.basic = basicScore;
  
  if (basicScore < 100) {
    recommendations.push('Complete basic company information');
  }
  
  // Culture & Values (20%)
  const cultureFields = [
    profile.mission,
    profile.vision,
    profile.values?.length >= 3
  ];
  const cultureScore = (cultureFields.filter(Boolean).length / cultureFields.length) * 100;
  breakdown.culture = cultureScore;
  
  if (cultureScore < 100) {
    recommendations.push('Define your company culture, mission, and values');
  }
  
  // Team & Leadership (15%)
  const teamScore = profile.leadership?.length > 0 ? Math.min((profile.leadership.length / 3) * 100, 100) : 0;
  breakdown.team = teamScore;
  
  if (teamScore < 100) {
    recommendations.push('Add leadership team information');
  }
  
  // Benefits (15%)
  const benefitsScore = profile.benefits?.length > 0 ? Math.min((profile.benefits.length / 5) * 100, 100) : 0;
  breakdown.benefits = benefitsScore;
  
  if (benefitsScore < 100) {
    recommendations.push('List employee benefits and perks');
  }
  
  // Offices (10%)
  const officesScore = profile.offices?.length > 0 ? 100 : 0;
  breakdown.offices = officesScore;
  
  if (officesScore < 100) {
    recommendations.push('Add office locations');
  }
  
  // Achievements (10%)
  const achievementsScore = profile.achievements?.length > 0 ? Math.min((profile.achievements.length / 3) * 100, 100) : 0;
  breakdown.achievements = achievementsScore;
  
  if (achievementsScore < 100) {
    recommendations.push('Showcase company achievements and awards');
  }
  
  // Hiring Preferences (5%)
  const hiringScore = profile.hiringPreferences?.preferredTeamSizes?.length > 0 ? 100 : 0;
  breakdown.hiring = hiringScore;
  
  if (hiringScore < 100) {
    recommendations.push('Set hiring preferences for liftout opportunities');
  }
  
  // Calculate weighted score
  const score = Math.round(
    (breakdown.basic * weights.basic +
     breakdown.culture * weights.culture +
     breakdown.team * weights.team +
     breakdown.benefits * weights.benefits +
     breakdown.offices * weights.offices +
     breakdown.achievements * weights.achievements +
     breakdown.hiring * weights.hiring) / 100
  );
  
  return { score, breakdown, recommendations };
}

// Field validation helpers
export function validateField<T>(
  schema: z.ZodSchema<T>,
  value: any
): { isValid: boolean; error?: string } {
  try {
    schema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: 'Validation failed' };
  }
}

// Real-time validation helper
export function validateProfileSection<T>(
  schema: z.ZodSchema<T>,
  data: any
): { isValid: boolean; errors: Record<string, string> } {
  try {
    schema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach(err => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
}

export type IndividualProfileData = z.infer<typeof individualProfileSchema>;
export type CompanyProfileData = z.infer<typeof companyProfileSchema>;