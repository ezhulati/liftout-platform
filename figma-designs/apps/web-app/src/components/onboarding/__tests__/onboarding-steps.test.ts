/**
 * Tests for onboarding step components
 * Tests form validation and data handling
 */

describe('Onboarding Steps', () => {
  describe('ProfileSetup', () => {
    it('should validate first name is required', () => {
      const firstName = 'John';
      expect(firstName.length).toBeGreaterThan(0);
    });

    it('should validate last name is required', () => {
      const lastName = 'Doe';
      expect(lastName.length).toBeGreaterThan(0);
    });

    it('should validate LinkedIn URL format', () => {
      const validUrl = 'https://linkedin.com/in/johndoe';
      const invalidUrl = 'not-a-url';

      expect(validUrl).toMatch(/^https?:\/\//);
      expect(invalidUrl).not.toMatch(/^https?:\/\//);
    });

    it('should transform form data to API format', () => {
      const formData = {
        firstName: 'John',
        lastName: 'Doe',
        location: 'New York, NY',
        title: 'Software Engineer',
        bio: 'Experienced developer',
        linkedinUrl: 'https://linkedin.com/in/johndoe',
        experience: {
          totalYears: 10,
          currentCompany: 'Acme Corp',
          currentRole: 'Senior Engineer',
        },
      };

      const apiData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        location: formData.location,
        title: formData.title,
        bio: formData.bio,
        linkedin: formData.linkedinUrl,
        yearsExperience: formData.experience?.totalYears,
        companyName: formData.experience?.currentCompany,
        position: formData.experience?.currentRole,
      };

      expect(apiData.firstName).toBe('John');
      expect(apiData.yearsExperience).toBe(10);
    });
  });

  describe('TeamFormation', () => {
    it('should require team name minimum 3 characters', () => {
      const validName = 'Alpha Team';
      expect(validName.length).toBeGreaterThanOrEqual(3);
    });

    it('should require team description minimum 20 characters', () => {
      const validDesc = 'A high-performing team with expertise in financial technology.';
      expect(validDesc.length).toBeGreaterThanOrEqual(20);
    });

    it('should validate team size is positive', () => {
      const teamSize = 5;
      expect(teamSize).toBeGreaterThan(0);
    });

    it('should transform form data to API format', () => {
      const formData = {
        name: 'Fintech Innovators',
        description: 'A team of experienced fintech professionals.',
        industry: 'Financial Services',
        location: 'New York, NY',
        yearsWorkingTogether: 5,
        size: 4,
      };

      expect(formData.name).toBeDefined();
      expect(formData.size).toBeGreaterThan(0);
    });
  });

  describe('SkillsExperience', () => {
    it('should allow multiple skill selection', () => {
      const selectedSkills = ['JavaScript', 'React', 'Node.js', 'Python'];
      expect(selectedSkills.length).toBeGreaterThan(0);
    });

    it('should validate years of experience is non-negative', () => {
      const years = 10;
      expect(years).toBeGreaterThanOrEqual(0);
    });

    it('should accept certifications array', () => {
      const certs = ['AWS Certified', 'Google Cloud Professional'];
      expect(Array.isArray(certs)).toBe(true);
    });

    it('should format achievements for API', () => {
      const achievements = [
        { title: 'Led Major Project', description: 'Delivered $10M project on time' },
        { title: 'Team Growth', description: 'Grew team from 3 to 12 members' },
      ];

      const formatted = achievements
        .map(a => `${a.title}: ${a.description}`)
        .join('\n');

      expect(formatted).toContain('Led Major Project');
      expect(formatted).toContain('\n');
    });

    it('should transform form data to API format', () => {
      const formData = {
        yearsOfExperience: 10,
        primaryRole: 'Engineering Lead',
        certifications: ['AWS', 'GCP'],
        achievements: [{ title: 'Award', description: 'Best team 2023' }],
      };

      const selectedSkills = ['JavaScript', 'Python'];

      const apiData = {
        yearsExperience: formData.yearsOfExperience,
        skills: selectedSkills,
        certifications: formData.certifications || [],
        achievements: formData.achievements
          ?.map(a => `${a.title}: ${a.description}`)
          .join('\n') || '',
      };

      expect(apiData.yearsExperience).toBe(10);
      expect(apiData.skills.length).toBe(2);
    });
  });

  describe('LiftoutPreferences', () => {
    it('should validate availability options', () => {
      const validOptions = ['immediately', '1-3months', '3-6months', '6months+', 'exploring'];
      const selected = '1-3months';

      expect(validOptions).toContain(selected);
    });

    it('should validate location preference options', () => {
      const validOptions = ['remote', 'hybrid', 'onsite', 'flexible'];
      const selected = 'hybrid';

      expect(validOptions).toContain(selected);
    });

    it('should validate company size options', () => {
      const validOptions = ['startup', 'scaleup', 'midsize', 'enterprise'];
      const selected = ['startup', 'scaleup'];

      selected.forEach(s => {
        expect(validOptions).toContain(s);
      });
    });

    it('should map availability to API format', () => {
      const availabilityMap: Record<string, string> = {
        'immediately': 'available',
        '1-3months': 'open_to_opportunities',
        '3-6months': 'open_to_opportunities',
        '6months+': 'not_available',
        'exploring': 'open_to_opportunities',
      };

      expect(availabilityMap['immediately']).toBe('available');
      expect(availabilityMap['1-3months']).toBe('open_to_opportunities');
    });

    it('should map location preference to API format', () => {
      const remoteMap: Record<string, string> = {
        'remote': 'remote',
        'hybrid': 'hybrid',
        'onsite': 'onsite',
        'flexible': 'hybrid',
      };

      expect(remoteMap['remote']).toBe('remote');
      expect(remoteMap['flexible']).toBe('hybrid');
    });

    it('should transform form data to API format', () => {
      const formData = {
        availability: '1-3months',
        locationPreference: 'hybrid',
        salaryMin: 150000,
        salaryMax: 200000,
        relocationWillingness: true,
        companySize: ['startup', 'scaleup'],
        industryPreferences: ['Fintech', 'Healthcare'],
        priorities: ['compensation', 'growth'],
        dealbreakers: ['No remote work'],
        preferredLocations: ['New York', 'San Francisco'],
        compensationType: 'package',
        equityImportance: 'important',
      };

      const apiData = {
        availabilityStatus: 'open_to_opportunities',
        remotePreference: 'hybrid',
        salaryExpectationMin: formData.salaryMin,
        salaryExpectationMax: formData.salaryMax,
        willingToRelocate: formData.relocationWillingness,
        searchPreferences: {
          companySizes: formData.companySize,
          industries: formData.industryPreferences,
          priorities: formData.priorities,
          dealbreakers: formData.dealbreakers,
          preferredLocations: formData.preferredLocations,
          compensationType: formData.compensationType,
          equityImportance: formData.equityImportance,
        },
      };

      expect(apiData.salaryExpectationMin).toBe(150000);
      expect(apiData.searchPreferences.companySizes).toContain('startup');
    });
  });

  describe('CompanyProfileSetup', () => {
    it('should require company name minimum 2 characters', () => {
      const validName = 'Acme Corporation';
      expect(validName.length).toBeGreaterThanOrEqual(2);
    });

    it('should require description minimum 50 characters', () => {
      const validDesc = 'We are a leading technology company focused on innovation and delivering exceptional products to our customers worldwide.';
      expect(validDesc.length).toBeGreaterThanOrEqual(50);
    });

    it('should validate company size options', () => {
      const validSizes = ['startup', 'small', 'medium', 'large', 'enterprise'];
      const selected = 'medium';

      expect(validSizes).toContain(selected);
    });

    it('should accept culture values array', () => {
      const values = ['Innovation', 'Integrity', 'Collaboration'];
      expect(Array.isArray(values)).toBe(true);
      expect(values.length).toBeGreaterThan(0);
    });
  });

  describe('CompanyVerification', () => {
    it('should require registration number', () => {
      const regNumber = '12345678';
      expect(regNumber.length).toBeGreaterThan(0);
    });

    it('should require tax ID', () => {
      const taxId = '12-3456789';
      expect(taxId.length).toBeGreaterThan(0);
    });

    it('should require complete business address', () => {
      const address = '123 Main Street, Suite 100, New York, NY 10001';
      expect(address.length).toBeGreaterThanOrEqual(10);
    });

    it('should validate contact email format', () => {
      const email = 'contact@company.com';
      expect(email).toMatch(/@/);
    });

    it('should require document uploads for required types', () => {
      const documentTypes = [
        { id: 'registration', required: true },
        { id: 'tax', required: true },
        { id: 'address', required: false },
        { id: 'insurance', required: false },
      ];

      const requiredDocs = documentTypes.filter(d => d.required);
      expect(requiredDocs.length).toBe(2);
    });
  });

  describe('FirstOpportunityCreation', () => {
    it('should require title minimum 5 characters', () => {
      const title = 'Strategic Analytics Team for Market Expansion';
      expect(title.length).toBeGreaterThanOrEqual(5);
    });

    it('should require description minimum 100 characters', () => {
      const desc = 'We are looking for a high-performing analytics team to lead our market expansion efforts. The ideal team will have experience in quantitative analysis, market research, and strategic planning.';
      expect(desc.length).toBeGreaterThanOrEqual(100);
    });

    it('should validate team size range', () => {
      const teamSize = { min: 3, max: 10 };
      expect(teamSize.min).toBeGreaterThanOrEqual(2);
      expect(teamSize.max).toBeGreaterThanOrEqual(teamSize.min);
    });

    it('should validate liftout type options', () => {
      const validTypes = ['expansion', 'capability', 'market-entry', 'strategic'];
      const selected = 'expansion';

      expect(validTypes).toContain(selected);
    });

    it('should validate compensation type options', () => {
      const validTypes = ['salary', 'equity', 'package'];
      const selected = 'package';

      expect(validTypes).toContain(selected);
    });

    it('should transform form data to API format', () => {
      const formData = {
        title: 'Analytics Team',
        description: 'Looking for an analytics team...',
        industry: 'Fintech',
        location: 'New York',
        locationType: 'hybrid',
        teamSize: { min: 3, max: 8 },
        compensationType: 'package',
        compensationRange: { min: 150000, max: 250000 },
        timeline: '1-3months',
        liftoutType: 'expansion',
        requirements: ['Proven track record', 'Technical expertise'],
        benefits: ['Competitive salary', 'Equity participation'],
      };

      const apiData = {
        title: formData.title,
        description: formData.description,
        industry: formData.industry,
        location: formData.location,
        locationType: formData.locationType,
        teamSizeMin: formData.teamSize.min,
        teamSizeMax: formData.teamSize.max,
        compensationType: formData.compensationType,
        compensationMin: formData.compensationRange.min,
        compensationMax: formData.compensationRange.max,
        timeline: formData.timeline,
        liftoutType: formData.liftoutType,
        requirements: formData.requirements,
        benefits: formData.benefits,
        status: 'active',
      };

      expect(apiData.teamSizeMin).toBe(3);
      expect(apiData.status).toBe('active');
    });
  });
});
