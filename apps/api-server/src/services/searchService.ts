import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export interface SearchResult {
  type: 'opportunity' | 'team' | 'company';
  id: string;
  title: string;
  description: string;
  relevanceScore: number;
  highlights: {
    field: string;
    snippet: string;
  }[];
  metadata: Record<string, unknown>;
}

export interface UnifiedSearchResult {
  query: string;
  total: number;
  opportunities: SearchResult[];
  teams: SearchResult[];
  companies: SearchResult[];
  suggestions: string[];
}

export interface SearchFilters {
  type?: 'opportunity' | 'team' | 'company' | 'all';
  industry?: string;
  location?: string;
  remotePolicy?: string;
  minCompensation?: number;
  maxCompensation?: number;
  teamSize?: { min?: number; max?: number };
  skills?: string[];
}

class SearchService {
  /**
   * Build PostgreSQL full-text search query
   * Converts user query to tsquery format with prefix matching
   */
  private buildSearchQuery(query: string): string {
    // Clean and split query into terms
    const terms = query
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(term => term.length > 1);

    if (terms.length === 0) return '';

    // Build tsquery with prefix matching for partial word matches
    // Use & (AND) for multi-word queries, :* for prefix matching
    return terms.map(term => `${term}:*`).join(' & ');
  }

  /**
   * Extract highlighted snippets from text matching query terms
   */
  private extractHighlights(
    text: string,
    queryTerms: string[],
    field: string,
    maxSnippetLength: number = 150
  ): { field: string; snippet: string }[] {
    if (!text) return [];

    const highlights: { field: string; snippet: string }[] = [];
    const lowerText = text.toLowerCase();

    for (const term of queryTerms) {
      const index = lowerText.indexOf(term.toLowerCase());
      if (index !== -1) {
        // Extract context around the match
        const start = Math.max(0, index - 50);
        const end = Math.min(text.length, index + term.length + 100);
        let snippet = text.slice(start, end);

        // Add ellipsis if truncated
        if (start > 0) snippet = '...' + snippet;
        if (end < text.length) snippet = snippet + '...';

        // Highlight the matched term
        const highlightedSnippet = snippet.replace(
          new RegExp(`(${term})`, 'gi'),
          '<mark>$1</mark>'
        );

        highlights.push({ field, snippet: highlightedSnippet });
        break; // One highlight per field is enough
      }
    }

    return highlights;
  }

  /**
   * Search opportunities using PostgreSQL full-text search
   */
  async searchOpportunities(
    query: string,
    filters: SearchFilters = {},
    limit: number = 20
  ): Promise<SearchResult[]> {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);

    if (queryTerms.length === 0) {
      return [];
    }

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      status: 'active',
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    };

    // Apply filters
    if (filters.industry) {
      where.industry = filters.industry;
    }
    if (filters.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }
    if (filters.remotePolicy) {
      where.remotePolicy = filters.remotePolicy;
    }
    if (filters.minCompensation) {
      where.compensationMax = { gte: filters.minCompensation };
    }
    if (filters.maxCompensation) {
      where.compensationMin = { lte: filters.maxCompensation };
    }
    if (filters.teamSize?.min) {
      where.teamSizeMax = { gte: filters.teamSize.min };
    }
    if (filters.teamSize?.max) {
      where.teamSizeMin = { lte: filters.teamSize.max };
    }

    // Search across multiple fields using OR
    where.AND = [
      {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { industry: { contains: query, mode: 'insensitive' } },
          { location: { contains: query, mode: 'insensitive' } },
          // Search in skills arrays
          { requiredSkills: { hasSome: queryTerms } },
          { preferredSkills: { hasSome: queryTerms } },
          { techStack: { hasSome: queryTerms } },
        ]
      }
    ];

    const opportunities = await prisma.opportunity.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            industry: true,
          }
        }
      },
      take: limit,
      orderBy: [
        { featured: 'desc' },
        { boostScore: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Calculate relevance and extract highlights
    return opportunities.map(opp => {
      let relevanceScore = 0;
      const highlights: { field: string; snippet: string }[] = [];

      // Score based on where match was found
      for (const term of queryTerms) {
        const termLower = term.toLowerCase();
        if (opp.title?.toLowerCase().includes(termLower)) {
          relevanceScore += 10; // Title matches are most important
        }
        if (opp.description?.toLowerCase().includes(termLower)) {
          relevanceScore += 5;
        }
        if (opp.industry?.toLowerCase().includes(termLower)) {
          relevanceScore += 3;
        }
        if (opp.requiredSkills.some(s => s.toLowerCase().includes(termLower))) {
          relevanceScore += 4;
        }
        if (opp.techStack.some(s => s.toLowerCase().includes(termLower))) {
          relevanceScore += 3;
        }
      }

      // Boost featured opportunities
      if (opp.featured) relevanceScore += 5;

      // Extract highlights
      highlights.push(...this.extractHighlights(opp.title, queryTerms, 'title'));
      highlights.push(...this.extractHighlights(opp.description, queryTerms, 'description'));

      return {
        type: 'opportunity' as const,
        id: opp.id,
        title: opp.title,
        description: opp.description?.slice(0, 200) + (opp.description && opp.description.length > 200 ? '...' : ''),
        relevanceScore,
        highlights: highlights.slice(0, 2),
        metadata: {
          company: opp.company,
          industry: opp.industry,
          location: opp.location,
          remotePolicy: opp.remotePolicy,
          compensation: {
            min: opp.compensationMin,
            max: opp.compensationMax,
            currency: opp.compensationCurrency
          },
          teamSize: {
            min: opp.teamSizeMin,
            max: opp.teamSizeMax
          },
          requiredSkills: opp.requiredSkills,
          urgency: opp.urgency,
          featured: opp.featured
        }
      };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Search teams using PostgreSQL full-text search
   */
  async searchTeams(
    query: string,
    filters: SearchFilters = {},
    limit: number = 20
  ): Promise<SearchResult[]> {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);

    if (queryTerms.length === 0) {
      return [];
    }

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      visibility: 'public',
      availabilityStatus: { not: 'not_available' }
    };

    // Apply filters
    if (filters.industry) {
      where.industry = filters.industry;
    }
    if (filters.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }
    if (filters.teamSize?.min) {
      where.size = { ...where.size, gte: filters.teamSize.min };
    }
    if (filters.teamSize?.max) {
      where.size = { ...where.size, lte: filters.teamSize.max };
    }

    // Search across multiple fields
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { industry: { contains: query, mode: 'insensitive' } },
      { specialization: { contains: query, mode: 'insensitive' } },
      { location: { contains: query, mode: 'insensitive' } },
    ];

    const teams = await prisma.team.findMany({
      where,
      include: {
        members: {
          where: { status: 'active' },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                skills: {
                  include: { skill: true }
                },
                profile: {
                  select: {
                    title: true,
                    profilePhotoUrl: true
                  }
                }
              }
            }
          },
          take: 5
        },
        _count: {
          select: { applications: true, members: true }
        }
      },
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    // Calculate relevance and extract highlights
    return teams.map(team => {
      let relevanceScore = 0;
      const highlights: { field: string; snippet: string }[] = [];

      // Collect all skills from team members
      const teamSkills = team.members.flatMap(m =>
        m.user.skills.map(s => s.skill.name)
      );

      // Score based on where match was found
      for (const term of queryTerms) {
        const termLower = term.toLowerCase();
        if (team.name?.toLowerCase().includes(termLower)) {
          relevanceScore += 10;
        }
        if (team.description?.toLowerCase().includes(termLower)) {
          relevanceScore += 5;
        }
        if (team.industry?.toLowerCase().includes(termLower)) {
          relevanceScore += 3;
        }
        if (team.specialization?.toLowerCase().includes(termLower)) {
          relevanceScore += 4;
        }
        if (teamSkills.some(s => s.toLowerCase().includes(termLower))) {
          relevanceScore += 3;
        }
      }

      // Extract highlights
      highlights.push(...this.extractHighlights(team.name, queryTerms, 'name'));
      highlights.push(...this.extractHighlights(team.description || '', queryTerms, 'description'));

      return {
        type: 'team' as const,
        id: team.id,
        title: team.name,
        description: team.description?.slice(0, 200) + (team.description && team.description.length > 200 ? '...' : '') || '',
        relevanceScore,
        highlights: highlights.slice(0, 2),
        metadata: {
          size: team.size,
          industry: team.industry,
          specialization: team.specialization,
          location: team.location,
          remoteStatus: team.remoteStatus,
          memberCount: team._count.members,
          applicationCount: team._count.applications,
          skills: teamSkills.slice(0, 10),
          salaryExpectation: {
            min: team.salaryExpectationMin,
            max: team.salaryExpectationMax
          }
        }
      };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Search companies
   */
  async searchCompanies(
    query: string,
    filters: SearchFilters = {},
    limit: number = 10
  ): Promise<SearchResult[]> {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);

    if (queryTerms.length === 0) {
      return [];
    }

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      verificationStatus: 'verified'
    };

    if (filters.industry) {
      where.industry = filters.industry;
    }
    if (filters.location) {
      where.headquartersLocation = { contains: filters.location, mode: 'insensitive' };
    }

    // Search across multiple fields
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { industry: { contains: query, mode: 'insensitive' } },
    ];

    const companies = await prisma.company.findMany({
      where,
      include: {
        _count: {
          select: { opportunities: true }
        }
      },
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    return companies.map(company => {
      let relevanceScore = 0;
      const highlights: { field: string; snippet: string }[] = [];

      for (const term of queryTerms) {
        const termLower = term.toLowerCase();
        if (company.name?.toLowerCase().includes(termLower)) {
          relevanceScore += 10;
        }
        if (company.description?.toLowerCase().includes(termLower)) {
          relevanceScore += 5;
        }
        if (company.industry?.toLowerCase().includes(termLower)) {
          relevanceScore += 3;
        }
      }

      highlights.push(...this.extractHighlights(company.name, queryTerms, 'name'));
      highlights.push(...this.extractHighlights(company.description || '', queryTerms, 'description'));

      return {
        type: 'company' as const,
        id: company.id,
        title: company.name,
        description: company.description?.slice(0, 200) + (company.description && company.description.length > 200 ? '...' : '') || '',
        relevanceScore,
        highlights: highlights.slice(0, 2),
        metadata: {
          logoUrl: company.logoUrl,
          industry: company.industry,
          location: company.headquartersLocation,
          size: company.companySize,
          websiteUrl: company.websiteUrl,
          opportunityCount: company._count.opportunities,
          verificationStatus: company.verificationStatus
        }
      };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Unified search across all entity types
   */
  async unifiedSearch(
    query: string,
    filters: SearchFilters = {},
    limits: { opportunities?: number; teams?: number; companies?: number } = {}
  ): Promise<UnifiedSearchResult> {
    const defaultLimits = {
      opportunities: limits.opportunities ?? 10,
      teams: limits.teams ?? 10,
      companies: limits.companies ?? 5
    };

    // Run searches in parallel
    const [opportunities, teams, companies] = await Promise.all([
      filters.type === 'all' || filters.type === 'opportunity' || !filters.type
        ? this.searchOpportunities(query, filters, defaultLimits.opportunities)
        : Promise.resolve([]),
      filters.type === 'all' || filters.type === 'team' || !filters.type
        ? this.searchTeams(query, filters, defaultLimits.teams)
        : Promise.resolve([]),
      filters.type === 'all' || filters.type === 'company' || !filters.type
        ? this.searchCompanies(query, filters, defaultLimits.companies)
        : Promise.resolve([])
    ]);

    // Generate suggestions based on query
    const suggestions = await this.getSuggestions(query, 5);

    return {
      query,
      total: opportunities.length + teams.length + companies.length,
      opportunities,
      teams,
      companies,
      suggestions
    };
  }

  /**
   * Get search suggestions/autocomplete
   */
  async getSuggestions(query: string, limit: number = 10): Promise<string[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const queryLower = query.toLowerCase();

    // Get suggestions from various sources
    const [
      opportunityTitles,
      teamNames,
      companyNames,
      skills,
      industries
    ] = await Promise.all([
      // Opportunity titles
      prisma.opportunity.findMany({
        where: {
          title: { contains: query, mode: 'insensitive' },
          status: 'active'
        },
        select: { title: true },
        take: 5,
        distinct: ['title']
      }),
      // Team names
      prisma.team.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' },
          visibility: 'public'
        },
        select: { name: true },
        take: 5,
        distinct: ['name']
      }),
      // Company names
      prisma.company.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' },
          verificationStatus: 'verified'
        },
        select: { name: true },
        take: 5,
        distinct: ['name']
      }),
      // Skills
      prisma.skill.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' }
        },
        select: { name: true },
        take: 5,
        distinct: ['name']
      }),
      // Industries
      prisma.opportunity.findMany({
        where: {
          industry: { contains: query, mode: 'insensitive' },
          status: 'active'
        },
        select: { industry: true },
        take: 5,
        distinct: ['industry']
      })
    ]);

    // Collect all suggestions
    const allSuggestions = [
      ...opportunityTitles.map(o => o.title),
      ...teamNames.map(t => t.name),
      ...companyNames.map(c => c.name),
      ...skills.map(s => s.name),
      ...industries.filter(i => i.industry).map(i => i.industry!)
    ];

    // Deduplicate and sort by relevance (starts with query first)
    const uniqueSuggestions = [...new Set(allSuggestions)];
    const sorted = uniqueSuggestions.sort((a, b) => {
      const aStartsWith = a.toLowerCase().startsWith(queryLower);
      const bStartsWith = b.toLowerCase().startsWith(queryLower);
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return a.localeCompare(b);
    });

    return sorted.slice(0, limit);
  }

  /**
   * Get popular/trending search terms
   */
  async getPopularSearches(limit: number = 10): Promise<string[]> {
    // Get popular industries
    const industries = await prisma.opportunity.groupBy({
      by: ['industry'],
      where: {
        status: 'active',
        industry: { not: null }
      },
      _count: { industry: true },
      orderBy: { _count: { industry: 'desc' } },
      take: 5
    });

    // Get popular skills
    const skills = await prisma.skill.findMany({
      include: {
        _count: { select: { users: true } }
      },
      orderBy: { users: { _count: 'desc' } },
      take: 5
    });

    return [
      ...industries.filter(i => i.industry).map(i => i.industry!),
      ...skills.map(s => s.name)
    ].slice(0, limit);
  }

  /**
   * Record a search for analytics (optional - for future use)
   */
  async recordSearch(
    query: string,
    userId?: string,
    resultsCount?: number
  ): Promise<void> {
    // Could be implemented to track popular searches, improve suggestions, etc.
    // For now, just log
    console.log(`Search recorded: "${query}" by ${userId || 'anonymous'}, ${resultsCount} results`);
  }
}

export const searchService = new SearchService();
