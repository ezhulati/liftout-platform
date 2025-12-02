import {
  calculateIndividualProfileCompleteness,
  calculateCompanyProfileCompleteness,
  validateField,
  validateProfileSection,
  DEFAULT_INDIVIDUAL_WEIGHTS,
  DEFAULT_COMPANY_WEIGHTS,
  individualProfileSchema,
} from '../profile-validation';
import { z } from 'zod';

describe('calculateIndividualProfileCompleteness', () => {
  it('should return 0 for empty profile', () => {
    const result = calculateIndividualProfileCompleteness({});
    expect(result.score).toBe(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('should calculate correct score for basic info only', () => {
    const profile = {
      firstName: 'John',
      lastName: 'Doe',
      location: 'New York',
      phone: '+1234567890',
      bio: 'A professional bio',
    };
    const result = calculateIndividualProfileCompleteness(profile);

    // Basic info is 30% weight, all fields filled = 100% of 30 = 30
    expect(result.breakdown.basic).toBe(100);
    expect(result.score).toBeGreaterThanOrEqual(30);
  });

  it('should calculate correct score for professional info', () => {
    const profile = {
      currentCompany: 'Acme Inc',
      currentPosition: 'Engineer',
      industry: 'Technology',
      yearsExperience: 5,
    };
    const result = calculateIndividualProfileCompleteness(profile);

    expect(result.breakdown.professional).toBe(100);
    expect(result.score).toBeGreaterThanOrEqual(25);
  });

  it('should calculate skills score based on count', () => {
    const profile = {
      skills: [
        { name: 'JavaScript', level: 'Expert' },
        { name: 'TypeScript', level: 'Advanced' },
      ],
    };
    const result = calculateIndividualProfileCompleteness(profile);

    // 2 skills out of target 5 = 40%
    expect(result.breakdown.skills).toBe(40);
  });

  it('should cap skills score at 100%', () => {
    const profile = {
      skills: Array(10).fill({ name: 'Skill', level: 'Expert' }),
    };
    const result = calculateIndividualProfileCompleteness(profile);

    expect(result.breakdown.skills).toBe(100);
  });

  it('should calculate experience score based on count', () => {
    const profile = {
      experiences: [
        { company: 'Company A', position: 'Dev' },
        { company: 'Company B', position: 'Senior Dev' },
      ],
    };
    const result = calculateIndividualProfileCompleteness(profile);

    // 2 experiences out of target 3 = 66.67%
    expect(result.breakdown.experience).toBeCloseTo(66.67, 0);
  });

  it('should generate appropriate recommendations', () => {
    const profile = {
      firstName: 'John',
      // Missing lastName, location, phone, bio
    };
    const result = calculateIndividualProfileCompleteness(profile);

    // Check that at least one recommendation mentions basic information
    const hasBasicRecommendation = result.recommendations.some(rec =>
      rec.toLowerCase().includes('basic information')
    );
    expect(hasBasicRecommendation).toBe(true);
  });

  it('should return full score for complete profile', () => {
    const profile = {
      firstName: 'John',
      lastName: 'Doe',
      location: 'New York',
      phone: '+1234567890',
      bio: 'Professional bio',
      currentCompany: 'Acme Inc',
      currentPosition: 'Engineer',
      industry: 'Technology',
      yearsExperience: 5,
      skills: Array(5).fill({ name: 'Skill', level: 'Expert' }),
      experiences: Array(3).fill({ company: 'Co', position: 'Dev' }),
      portfolio: [{ title: 'Project 1' }, { title: 'Project 2' }],
      openToOpportunities: true,
      preferredRoles: ['Developer'],
      salaryRange: { min: 100000, max: 150000, currency: 'USD' },
      workAuthorization: 'US Citizen',
    };
    const result = calculateIndividualProfileCompleteness(profile);

    expect(result.score).toBe(100);
    expect(result.recommendations).toHaveLength(0);
  });

  it('should use custom weights', () => {
    const profile = {
      firstName: 'John',
      lastName: 'Doe',
      location: 'New York',
      phone: '+1234567890',
      bio: 'Bio',
    };

    const customWeights = {
      basic: 100, // All weight on basic
      professional: 0,
      skills: 0,
      experience: 0,
      portfolio: 0,
      preferences: 0,
    };

    const result = calculateIndividualProfileCompleteness(profile, customWeights);
    expect(result.score).toBe(100);
  });
});

describe('calculateCompanyProfileCompleteness', () => {
  it('should return 0 for empty profile', () => {
    const result = calculateCompanyProfileCompleteness({});
    expect(result.score).toBe(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('should calculate correct score for basic company info', () => {
    const profile = {
      companyName: 'Acme Inc',
      description: 'A great company',
      industry: 'Technology',
      companySize: '51-200',
      website: 'https://acme.com',
    };
    const result = calculateCompanyProfileCompleteness(profile);

    expect(result.breakdown.basic).toBe(100);
  });

  it('should calculate culture score', () => {
    const profile = {
      mission: 'Our mission statement',
      vision: 'Our vision statement',
      values: [
        { title: 'Value 1' },
        { title: 'Value 2' },
        { title: 'Value 3' },
      ],
    };
    const result = calculateCompanyProfileCompleteness(profile);

    expect(result.breakdown.culture).toBe(100);
  });

  it('should require at least 3 values for full culture score', () => {
    const profile = {
      mission: 'Mission',
      vision: 'Vision',
      values: [{ title: 'Value 1' }, { title: 'Value 2' }],
    };
    const result = calculateCompanyProfileCompleteness(profile);

    // Only 2 out of 3 culture fields complete (values < 3)
    expect(result.breakdown.culture).toBeCloseTo(66.67, 0);
  });

  it('should calculate team/leadership score', () => {
    const profile = {
      leadership: [
        { name: 'CEO' },
        { name: 'CTO' },
        { name: 'CFO' },
      ],
    };
    const result = calculateCompanyProfileCompleteness(profile);

    expect(result.breakdown.team).toBe(100);
  });

  it('should calculate benefits score', () => {
    const profile = {
      benefits: Array(5).fill({ title: 'Benefit' }),
    };
    const result = calculateCompanyProfileCompleteness(profile);

    expect(result.breakdown.benefits).toBe(100);
  });

  it('should calculate offices score', () => {
    const profile = {
      offices: [{ city: 'New York', country: 'USA' }],
    };
    const result = calculateCompanyProfileCompleteness(profile);

    expect(result.breakdown.offices).toBe(100);
  });

  it('should generate appropriate recommendations', () => {
    const profile = {};
    const result = calculateCompanyProfileCompleteness(profile);

    // Check that at least one recommendation mentions company information
    const hasCompanyRecommendation = result.recommendations.some(rec =>
      rec.toLowerCase().includes('company information') || rec.toLowerCase().includes('basic')
    );
    expect(hasCompanyRecommendation).toBe(true);
  });
});

describe('validateField', () => {
  const stringSchema = z.string().min(1, 'Required');

  it('should return isValid true for valid input', () => {
    const result = validateField(stringSchema, 'valid string');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should return isValid false with error for invalid input', () => {
    const result = validateField(stringSchema, '');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Required');
  });

  it('should handle complex schemas', () => {
    const emailSchema = z.string().email('Invalid email');

    expect(validateField(emailSchema, 'test@example.com').isValid).toBe(true);
    expect(validateField(emailSchema, 'invalid').isValid).toBe(false);
    expect(validateField(emailSchema, 'invalid').error).toBe('Invalid email');
  });

  it('should handle number schemas', () => {
    const numberSchema = z.number().min(0, 'Must be positive');

    expect(validateField(numberSchema, 5).isValid).toBe(true);
    expect(validateField(numberSchema, -1).isValid).toBe(false);
  });
});

describe('validateProfileSection', () => {
  const sectionSchema = z.object({
    name: z.string().min(1, 'Name required'),
    email: z.string().email('Invalid email'),
  });

  it('should return isValid true for valid section', () => {
    const result = validateProfileSection(sectionSchema, {
      name: 'John',
      email: 'john@example.com',
    });
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('should return errors for invalid fields', () => {
    const result = validateProfileSection(sectionSchema, {
      name: '',
      email: 'invalid',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Name required');
    expect(result.errors.email).toBe('Invalid email');
  });

  it('should handle nested paths', () => {
    const nestedSchema = z.object({
      user: z.object({
        profile: z.object({
          name: z.string().min(1, 'Name required'),
        }),
      }),
    });

    const result = validateProfileSection(nestedSchema, {
      user: { profile: { name: '' } },
    });
    expect(result.isValid).toBe(false);
    expect(result.errors['user.profile.name']).toBe('Name required');
  });
});

describe('DEFAULT_INDIVIDUAL_WEIGHTS', () => {
  it('should sum to 100', () => {
    const sum = Object.values(DEFAULT_INDIVIDUAL_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBe(100);
  });
});

describe('DEFAULT_COMPANY_WEIGHTS', () => {
  it('should sum to 100', () => {
    const sum = Object.values(DEFAULT_COMPANY_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBe(100);
  });
});
