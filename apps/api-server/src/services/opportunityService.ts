import { prisma } from '../lib/prisma';
import { Opportunity, OpportunityStatus, RemotePreference, UrgencyLevel, SeniorityLevel } from '@prisma/client';
import { getPaginationParams } from '../lib/utils';
import { NotFoundError, AuthorizationError } from '../middleware/errorHandler';

// Types
export interface OpportunityFilters {
  search?: string;
  industry?: string;
  location?: string;
  status?: OpportunityStatus;
  companyId?: string;
  minCompensation?: number;
  maxCompensation?: number;
  teamSizeMin?: number;
  teamSizeMax?: number;
  remotePolicy?: RemotePreference;
  urgency?: UrgencyLevel;
  seniorityLevel?: SeniorityLevel;
  featured?: boolean;
  excludeExpired?: boolean;
}

export interface CreateOpportunityInput {
  title: string;
  description: string;
  teamSizeMin?: number;
  teamSizeMax?: number;
  requiredSkills?: string[];
  preferredSkills?: string[];
  niceToHaveSkills?: string[];
  industry?: string;
  department?: string;
  seniorityLevel?: SeniorityLevel;
  location?: string;
  multipleLocations?: string[];
  remotePolicy?: RemotePreference;
  compensationMin?: number;
  compensationMax?: number;
  compensationCurrency?: string;
  equityOffered?: boolean;
  equityRange?: string;
  benefits?: string[];
  perks?: string[];
  urgency?: UrgencyLevel;
  startDate?: Date;
  projectDuration?: string;
  contractType?: string;
  reportingStructure?: string;
  growthOpportunities?: string;
  techStack?: string[];
  teamStructure?: string;
  interviewProcess?: string;
  onboardingPlan?: string;
  successMetrics?: string;
  challenges?: string;
  isAnonymous?: boolean;
  visibility?: string;
  expiresAt?: Date;
}

export interface UpdateOpportunityInput extends Partial<CreateOpportunityInput> {
  status?: OpportunityStatus;
}

export interface PaginatedOpportunitiesResult {
  opportunities: Opportunity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class OpportunityService {
  /**
   * List opportunities with filtering and pagination
   */
  async listOpportunities(
    filters: OpportunityFilters = {},
    page?: string | number,
    limit?: string | number
  ): Promise<PaginatedOpportunitiesResult> {
    const { page: pageNum, limit: limitNum, skip, take } = getPaginationParams(page, limit);

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    // Default to active and not expired
    if (filters.excludeExpired !== false) {
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ];
    }

    // Status filter (default to active for public listings)
    if (filters.status) {
      where.status = filters.status;
    } else {
      where.status = 'active';
    }

    // Company filter
    if (filters.companyId) {
      where.companyId = filters.companyId;
    }

    // Search filter
    if (filters.search) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { title: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
            { industry: { contains: filters.search, mode: 'insensitive' } },
          ]
        }
      ];
    }

    // Industry filter
    if (filters.industry) {
      where.industry = filters.industry;
    }

    // Location filter
    if (filters.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }

    // Compensation filter
    if (filters.minCompensation) {
      where.compensationMax = { gte: filters.minCompensation };
    }
    if (filters.maxCompensation) {
      where.compensationMin = { lte: filters.maxCompensation };
    }

    // Team size filter
    if (filters.teamSizeMin) {
      where.teamSizeMax = { gte: filters.teamSizeMin };
    }
    if (filters.teamSizeMax) {
      where.teamSizeMin = { lte: filters.teamSizeMax };
    }

    // Remote policy filter
    if (filters.remotePolicy) {
      where.remotePolicy = filters.remotePolicy;
    }

    // Urgency filter
    if (filters.urgency) {
      where.urgency = filters.urgency;
    }

    // Seniority level filter
    if (filters.seniorityLevel) {
      where.seniorityLevel = filters.seniorityLevel;
    }

    // Featured filter
    if (filters.featured) {
      where.featured = true;
      where.OR = [
        { featuredUntil: null },
        { featuredUntil: { gt: new Date() } }
      ];
    }

    // Execute query
    const [opportunities, total] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
              industry: true,
              companySize: true,
              headquartersLocation: true,
              verificationStatus: true,
            }
          },
          _count: {
            select: { applications: true }
          }
        },
        skip,
        take,
        orderBy: [
          { featured: 'desc' },
          { boostScore: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.opportunity.count({ where })
    ]);

    return {
      opportunities,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    };
  }

  /**
   * Get a single opportunity by ID
   */
  async getOpportunityById(id: string): Promise<Opportunity> {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            industry: true,
            companySize: true,
            headquartersLocation: true,
            description: true,
            websiteUrl: true,
            verificationStatus: true,
            techStack: true,
            companyCulture: true,
          }
        },
        applications: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
                size: true,
                industry: true,
              }
            }
          },
          orderBy: { appliedAt: 'desc' }
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    if (!opportunity) {
      throw new NotFoundError('Opportunity not found');
    }

    return opportunity;
  }

  /**
   * Create a new opportunity
   */
  async createOpportunity(
    data: CreateOpportunityInput,
    userId: string,
    companyId: string
  ): Promise<Opportunity> {
    const opportunity = await prisma.opportunity.create({
      data: {
        companyId,
        createdBy: userId,
        title: data.title,
        description: data.description,
        teamSizeMin: data.teamSizeMin,
        teamSizeMax: data.teamSizeMax,
        requiredSkills: data.requiredSkills || [],
        preferredSkills: data.preferredSkills || [],
        niceToHaveSkills: data.niceToHaveSkills || [],
        industry: data.industry,
        department: data.department,
        seniorityLevel: data.seniorityLevel,
        location: data.location,
        multipleLocations: data.multipleLocations || [],
        remotePolicy: data.remotePolicy || 'hybrid',
        compensationMin: data.compensationMin,
        compensationMax: data.compensationMax,
        compensationCurrency: data.compensationCurrency || 'USD',
        equityOffered: data.equityOffered || false,
        equityRange: data.equityRange,
        benefits: data.benefits || [],
        perks: data.perks || [],
        urgency: data.urgency || 'standard',
        startDate: data.startDate,
        projectDuration: data.projectDuration,
        contractType: data.contractType || 'full_time',
        reportingStructure: data.reportingStructure,
        growthOpportunities: data.growthOpportunities,
        techStack: data.techStack || [],
        teamStructure: data.teamStructure,
        interviewProcess: data.interviewProcess,
        onboardingPlan: data.onboardingPlan,
        successMetrics: data.successMetrics,
        challenges: data.challenges,
        isAnonymous: data.isAnonymous || false,
        visibility: data.visibility || 'public',
        expiresAt: data.expiresAt,
        status: 'active',
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          }
        }
      }
    });

    return opportunity;
  }

  /**
   * Update an existing opportunity
   */
  async updateOpportunity(
    id: string,
    data: UpdateOpportunityInput,
    userId: string
  ): Promise<Opportunity> {
    // Check if opportunity exists and user has permission
    const existing = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        company: {
          include: {
            users: {
              where: { userId },
            }
          }
        }
      }
    });

    if (!existing) {
      throw new NotFoundError('Opportunity not found');
    }

    // Check if user belongs to the company that owns this opportunity
    if (existing.company.users.length === 0) {
      throw new AuthorizationError('You do not have permission to update this opportunity');
    }

    const opportunity = await prisma.opportunity.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.teamSizeMin !== undefined && { teamSizeMin: data.teamSizeMin }),
        ...(data.teamSizeMax !== undefined && { teamSizeMax: data.teamSizeMax }),
        ...(data.requiredSkills && { requiredSkills: data.requiredSkills }),
        ...(data.preferredSkills && { preferredSkills: data.preferredSkills }),
        ...(data.niceToHaveSkills && { niceToHaveSkills: data.niceToHaveSkills }),
        ...(data.industry && { industry: data.industry }),
        ...(data.department && { department: data.department }),
        ...(data.seniorityLevel && { seniorityLevel: data.seniorityLevel }),
        ...(data.location && { location: data.location }),
        ...(data.multipleLocations && { multipleLocations: data.multipleLocations }),
        ...(data.remotePolicy && { remotePolicy: data.remotePolicy }),
        ...(data.compensationMin !== undefined && { compensationMin: data.compensationMin }),
        ...(data.compensationMax !== undefined && { compensationMax: data.compensationMax }),
        ...(data.compensationCurrency && { compensationCurrency: data.compensationCurrency }),
        ...(data.equityOffered !== undefined && { equityOffered: data.equityOffered }),
        ...(data.equityRange && { equityRange: data.equityRange }),
        ...(data.benefits && { benefits: data.benefits }),
        ...(data.perks && { perks: data.perks }),
        ...(data.urgency && { urgency: data.urgency }),
        ...(data.startDate && { startDate: data.startDate }),
        ...(data.projectDuration && { projectDuration: data.projectDuration }),
        ...(data.contractType && { contractType: data.contractType }),
        ...(data.reportingStructure && { reportingStructure: data.reportingStructure }),
        ...(data.growthOpportunities && { growthOpportunities: data.growthOpportunities }),
        ...(data.techStack && { techStack: data.techStack }),
        ...(data.teamStructure && { teamStructure: data.teamStructure }),
        ...(data.interviewProcess && { interviewProcess: data.interviewProcess }),
        ...(data.onboardingPlan && { onboardingPlan: data.onboardingPlan }),
        ...(data.successMetrics && { successMetrics: data.successMetrics }),
        ...(data.challenges && { challenges: data.challenges }),
        ...(data.isAnonymous !== undefined && { isAnonymous: data.isAnonymous }),
        ...(data.visibility && { visibility: data.visibility }),
        ...(data.expiresAt && { expiresAt: data.expiresAt }),
        ...(data.status && { status: data.status }),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          }
        }
      }
    });

    return opportunity;
  }

  /**
   * Delete (soft-delete by setting status to expired) an opportunity
   */
  async deleteOpportunity(id: string, userId: string): Promise<void> {
    // Check if opportunity exists and user has permission
    const existing = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        company: {
          include: {
            users: {
              where: { userId },
            }
          }
        }
      }
    });

    if (!existing) {
      throw new NotFoundError('Opportunity not found');
    }

    // Check if user belongs to the company that owns this opportunity
    if (existing.company.users.length === 0) {
      throw new AuthorizationError('You do not have permission to delete this opportunity');
    }

    await prisma.opportunity.update({
      where: { id },
      data: { status: 'expired' }
    });
  }

  /**
   * Get all opportunities for a specific company
   */
  async getCompanyOpportunities(
    companyId: string,
    page?: string | number,
    limit?: string | number
  ): Promise<PaginatedOpportunitiesResult> {
    const { page: pageNum, limit: limitNum, skip, take } = getPaginationParams(page, limit);

    const where = { companyId };

    const [opportunities, total] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        include: {
          _count: {
            select: { applications: true }
          }
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.opportunity.count({ where })
    ]);

    return {
      opportunities,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    };
  }

  /**
   * Update opportunity status
   */
  async updateOpportunityStatus(
    id: string,
    status: OpportunityStatus,
    userId: string
  ): Promise<Opportunity> {
    // Check if opportunity exists and user has permission
    const existing = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        company: {
          include: {
            users: {
              where: { userId },
            }
          }
        }
      }
    });

    if (!existing) {
      throw new NotFoundError('Opportunity not found');
    }

    // Check if user belongs to the company that owns this opportunity
    if (existing.company.users.length === 0) {
      throw new AuthorizationError('You do not have permission to update this opportunity');
    }

    const opportunity = await prisma.opportunity.update({
      where: { id },
      data: { status },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          }
        }
      }
    });

    return opportunity;
  }

  /**
   * Get applications for an opportunity
   */
  async getOpportunityApplications(id: string, userId: string) {
    // Check if opportunity exists and user has permission
    const existing = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        company: {
          include: {
            users: {
              where: { userId },
            }
          }
        }
      }
    });

    if (!existing) {
      throw new NotFoundError('Opportunity not found');
    }

    // Check if user belongs to the company that owns this opportunity
    if (existing.company.users.length === 0) {
      throw new AuthorizationError('You do not have permission to view these applications');
    }

    const applications = await prisma.teamApplication.findMany({
      where: { opportunityId: id },
      include: {
        team: {
          include: {
            members: {
              where: { status: 'active' },
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profile: {
                      select: {
                        title: true,
                        profilePhotoUrl: true,
                        yearsExperience: true,
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });

    return applications;
  }

  /**
   * Increment view count for an opportunity
   */
  async incrementViewCount(id: string): Promise<void> {
    await prisma.opportunity.update({
      where: { id },
      data: {
        viewsCount: { increment: 1 }
      }
    });
  }

  /**
   * Get featured opportunities
   */
  async getFeaturedOpportunities(limit: number = 5): Promise<Opportunity[]> {
    return prisma.opportunity.findMany({
      where: {
        featured: true,
        status: 'active',
        OR: [
          { featuredUntil: null },
          { featuredUntil: { gt: new Date() } }
        ]
      },
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
      orderBy: { boostScore: 'desc' },
      take: limit
    });
  }

  /**
   * Get filter facets for opportunities (aggregated counts)
   */
  async getFilterFacets(): Promise<{
    industries: { value: string; count: number }[];
    locations: { value: string; count: number }[];
    remotePolicies: { value: string; count: number }[];
    urgencyLevels: { value: string; count: number }[];
    seniorityLevels: { value: string; count: number }[];
    total: number;
  }> {
    // Base filter for active, non-expired opportunities
    const baseWhere = {
      status: 'active' as const,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    };

    // Run all aggregations in parallel
    const [
      industryGroups,
      locationGroups,
      remotePolicyGroups,
      urgencyGroups,
      seniorityGroups,
      total
    ] = await Promise.all([
      // Industry counts
      prisma.opportunity.groupBy({
        by: ['industry'],
        where: { ...baseWhere, industry: { not: null } },
        _count: { industry: true },
        orderBy: { _count: { industry: 'desc' } },
        take: 20
      }),
      // Location counts
      prisma.opportunity.groupBy({
        by: ['location'],
        where: { ...baseWhere, location: { not: null } },
        _count: { location: true },
        orderBy: { _count: { location: 'desc' } },
        take: 20
      }),
      // Remote policy counts
      prisma.opportunity.groupBy({
        by: ['remotePolicy'],
        where: baseWhere,
        _count: { remotePolicy: true },
        orderBy: { _count: { remotePolicy: 'desc' } }
      }),
      // Urgency counts
      prisma.opportunity.groupBy({
        by: ['urgency'],
        where: baseWhere,
        _count: { urgency: true },
        orderBy: { _count: { urgency: 'desc' } }
      }),
      // Seniority level counts
      prisma.opportunity.groupBy({
        by: ['seniorityLevel'],
        where: { ...baseWhere, seniorityLevel: { not: null } },
        _count: { seniorityLevel: true },
        orderBy: { _count: { seniorityLevel: 'desc' } }
      }),
      // Total count
      prisma.opportunity.count({ where: baseWhere })
    ]);

    return {
      industries: industryGroups
        .filter(g => g.industry)
        .map(g => ({ value: g.industry!, count: g._count.industry })),
      locations: locationGroups
        .filter(g => g.location)
        .map(g => ({ value: g.location!, count: g._count.location })),
      remotePolicies: remotePolicyGroups
        .map(g => ({ value: g.remotePolicy, count: g._count.remotePolicy })),
      urgencyLevels: urgencyGroups
        .map(g => ({ value: g.urgency, count: g._count.urgency })),
      seniorityLevels: seniorityGroups
        .filter(g => g.seniorityLevel)
        .map(g => ({ value: g.seniorityLevel!, count: g._count.seniorityLevel })),
      total
    };
  }

  /**
   * Get opportunity statistics for dashboard
   */
  async getOpportunityStats(): Promise<{
    totalActive: number;
    totalApplications: number;
    avgApplicationsPerOpportunity: number;
    byStatus: { status: string; count: number }[];
    byIndustry: { industry: string; count: number }[];
    recentActivity: { date: string; count: number }[];
  }> {
    const [
      statusCounts,
      industryCounts,
      totalApplications,
      recentOpportunities
    ] = await Promise.all([
      // Status breakdown
      prisma.opportunity.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      // Industry breakdown (top 10)
      prisma.opportunity.groupBy({
        by: ['industry'],
        where: { industry: { not: null } },
        _count: { industry: true },
        orderBy: { _count: { industry: 'desc' } },
        take: 10
      }),
      // Total applications
      prisma.teamApplication.count(),
      // Recent activity (last 30 days)
      prisma.opportunity.findMany({
        where: {
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' }
      })
    ]);

    const totalActive = statusCounts.find(s => s.status === 'active')?._count.status || 0;
    const avgApplications = totalActive > 0 ? totalApplications / totalActive : 0;

    // Group recent activity by date
    const activityByDate = recentOpportunities.reduce((acc, opp) => {
      const date = opp.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalActive,
      totalApplications,
      avgApplicationsPerOpportunity: Math.round(avgApplications * 10) / 10,
      byStatus: statusCounts.map(s => ({ status: s.status, count: s._count.status })),
      byIndustry: industryCounts
        .filter(i => i.industry)
        .map(i => ({ industry: i.industry!, count: i._count.industry })),
      recentActivity: Object.entries(activityByDate).map(([date, count]) => ({ date, count }))
    };
  }
}

export const opportunityService = new OpportunityService();
