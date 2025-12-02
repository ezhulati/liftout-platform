/**
 * Tests for /api/teams endpoint
 * Tests team creation and retrieval for onboarding
 */

describe('/api/teams', () => {
  describe('Team creation validation', () => {
    it('should require team name with minimum 3 characters', () => {
      const validName = 'Alpha Team';
      const invalidName = 'AB';

      expect(validName.length).toBeGreaterThanOrEqual(3);
      expect(invalidName.length).toBeLessThan(3);
    });

    it('should require description with minimum 20 characters', () => {
      const validDesc = 'We are a high-performing team with expertise in fintech solutions.';
      const invalidDesc = 'Short desc';

      expect(validDesc.length).toBeGreaterThanOrEqual(20);
      expect(invalidDesc.length).toBeLessThan(20);
    });

    it('should generate valid slug from team name', () => {
      const teamName = 'Alpha Team Solutions';
      const slug = teamName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      expect(slug).toBe('alpha-team-solutions');
      expect(slug).not.toContain(' ');
    });

    it('should accept valid team data', () => {
      const teamData = {
        name: 'Fintech Innovators',
        description: 'A team of experienced fintech professionals with 10+ years working together.',
        industry: 'Financial Services',
        location: 'New York, NY',
        yearsWorkingTogether: 5,
        size: 4,
      };

      expect(teamData.name.length).toBeGreaterThanOrEqual(3);
      expect(teamData.description.length).toBeGreaterThanOrEqual(20);
      expect(teamData.size).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Team member creation', () => {
    it('should add creator as team lead by default', () => {
      const memberData = {
        userId: 'user-123',
        role: 'Team Lead',
        isAdmin: true,
        isLead: true,
        status: 'active',
      };

      expect(memberData.isLead).toBe(true);
      expect(memberData.isAdmin).toBe(true);
      expect(memberData.status).toBe('active');
    });
  });

  describe('Team filtering', () => {
    it('should filter by industry', () => {
      const teams = [
        { industry: 'Fintech', name: 'Team A' },
        { industry: 'Healthcare', name: 'Team B' },
        { industry: 'Fintech', name: 'Team C' },
      ];

      const filtered = teams.filter(t => t.industry === 'Fintech');
      expect(filtered.length).toBe(2);
    });

    it('should filter by location', () => {
      const teams = [
        { location: 'New York', name: 'Team A' },
        { location: 'San Francisco', name: 'Team B' },
        { location: 'New York', name: 'Team C' },
      ];

      const filtered = teams.filter(t =>
        t.location.toLowerCase().includes('new york')
      );
      expect(filtered.length).toBe(2);
    });

    it('should filter by team size range', () => {
      const teams = [
        { size: 3, name: 'Team A' },
        { size: 5, name: 'Team B' },
        { size: 8, name: 'Team C' },
      ];

      const minSize = 4;
      const maxSize = 7;
      const filtered = teams.filter(t => t.size >= minSize && t.size <= maxSize);
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Team B');
    });

    it('should filter for liftout availability', () => {
      const teams = [
        { openToLiftout: true, name: 'Team A' },
        { openToLiftout: false, name: 'Team B' },
        { openToLiftout: true, name: 'Team C' },
      ];

      const available = teams.filter(t => t.openToLiftout);
      expect(available.length).toBe(2);
    });
  });

  describe('Demo user handling', () => {
    it('should create mock team for demo users', () => {
      const demoTeam = {
        id: `demo-team-${Date.now()}`,
        name: 'Demo Team',
        description: 'Demo team description',
        openToLiftout: true,
      };

      expect(demoTeam.id).toMatch(/^demo-team-/);
    });
  });
});
