import { prisma } from '@liftout/database';
import { Team, TeamMember, TeamAvailabilityStatus, RemotePreference, TeamVisibility, MemberStatus } from '@prisma/client';
import { getPaginationParams } from '@liftout/database/src/utils';
import { NotFoundError, AuthorizationError } from '../middleware/errorHandler';

// Types
export interface TeamFilters {
  search?: string;
  industry?: string;
  location?: string;
  availabilityStatus?: TeamAvailabilityStatus;
  minSize?: number;
  maxSize?: number;
  remoteStatus?: RemotePreference;
  minYearsWorkingTogether?: number;
}

export interface CreateTeamInput {
  name: string;
  description: string;
  industry?: string;
  specialization?: string;
  size: number;
  location?: string;
  remoteStatus?: RemotePreference;
  availabilityStatus?: TeamAvailabilityStatus;
  yearsWorkingTogether?: number;
  teamCulture?: string;
  workingStyle?: string;
  communicationStyle?: string;
  notableAchievements?: string;
  portfolioUrl?: string;
  isAnonymous?: boolean;
  visibility?: TeamVisibility;
  salaryExpectationMin?: number;
  salaryExpectationMax?: number;
  salaryCurrency?: string;
  availabilityDate?: Date;
  members: CreateTeamMemberInput[];
}

export interface CreateTeamMemberInput {
    userId: string;
    role: string;
    specialization?: string;
    seniorityLevel?: any;
    isAdmin?: boolean;
    isLead?: boolean;
    status?: MemberStatus;
}

export interface UpdateTeamInput extends Partial<CreateTeamInput> {}

export interface PaginatedTeamsResult {
  teams: Team[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class TeamService {
  /**
   * List teams with filtering and pagination
   */
  async listTeams(
    filters: TeamFilters = {},
    page?: string | number,
    limit?: string | number
  ): Promise<PaginatedTeamsResult> {
    const { page: pageNum, limit: limitNum, skip, take } = getPaginationParams(page, limit);

    const where: any = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { specialization: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.industry) {
      where.industry = { contains: filters.industry, mode: 'insensitive' };
    }

    if (filters.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }

    if (filters.availabilityStatus) {
      where.availabilityStatus = filters.availabilityStatus;
    }

    if (filters.minSize) {
      where.size = { ...where.size, gte: +filters.minSize };
    }

    if (filters.maxSize) {
      where.size = { ...where.size, lte: +filters.maxSize };
    }

    if (filters.remoteStatus) {
      where.remoteStatus = filters.remoteStatus;
    }

    if (filters.minYearsWorkingTogether) {
      where.yearsWorkingTogether = { gte: +filters.minYearsWorkingTogether };
    }

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        include: {
          members: {
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
                    },
                  },
                },
              },
            },
          },
          _count: {
            select: { applications: true },
          },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.team.count({ where }),
    ]);

    return {
      teams,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Get a single team by ID
   */
  async getTeamById(id: string): Promise<Team | null> {
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profile: true,
              },
            },
          },
        },
        applications: {
          include: {
            opportunity: {
              select: {
                id: true,
                title: true,
                company: {
                  select: {
                    id: true,
                    name: true,
                    logoUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!team) {
      throw new NotFoundError('Team not found');
    }

    return team;
  }

  /**
   * Get a team by user ID
   */
  async getTeamByUserId(userId: string): Promise<Team | null> {
    const teamMember = await prisma.teamMember.findFirst({
        where: { userId },
        include: {
            team: {
                include: {
                    members: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    profile: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!teamMember) {
        throw new NotFoundError('User is not part of any team');
    }

    return teamMember.team;
  }

  /**
   * Create a new team
   */
  async createTeam(data: CreateTeamInput, userId: string): Promise<Team> {
    const { members, ...teamData } = data;

    const team = await prisma.team.create({
      data: {
        ...teamData,
        createdBy: userId,
        members: {
          create: members.map((member) => ({
            ...member,
            userId: member.userId,
          })),
        },
      },
      include: {
        members: true,
      },
    });

    return team;
  }

  /**
   * Update an existing team
   */
  async updateTeam(id: string, data: UpdateTeamInput, userId: string): Promise<Team> {
    const existingTeam = await prisma.team.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!existingTeam) {
      throw new NotFoundError('Team not found');
    }

    const member = existingTeam.members.find(
      (m) => m.userId === userId && m.isAdmin
    );

    if (!member) {
      throw new AuthorizationError('You do not have permission to update this team');
    }

    const { members, ...teamData } = data;

    const team = await prisma.team.update({
      where: { id },
      data: {
        ...teamData,
      },
      include: {
        members: true,
      },
    });

    return team;
  }

  /**
   * Delete a team
   */
  async deleteTeam(id: string, userId: string): Promise<void> {
    const existingTeam = await prisma.team.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!existingTeam) {
      throw new NotFoundError('Team not found');
    }

    const member = existingTeam.members.find(
      (m) => m.userId === userId && m.isAdmin
    );

    if (!member) {
      throw new AuthorizationError('You do not have permission to delete this team');
    }

    await prisma.team.delete({ where: { id } });
  }

  /**
   * Add a member to a team
   */
  async addTeamMember(teamId: string, data: CreateTeamMemberInput, userId: string): Promise<TeamMember> {
    const existingTeam = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    });

    if (!existingTeam) {
      throw new NotFoundError('Team not found');
    }

    const member = existingTeam.members.find(
      (m) => m.userId === userId && m.isAdmin
    );

    if (!member) {
      throw new AuthorizationError('You do not have permission to add members to this team');
    }

    const newMember = await prisma.teamMember.create({
      data: {
        teamId,
        ...data,
      },
    });

    return newMember;
  }

  /**
   * Remove a member from a team
   */
  async removeTeamMember(teamId: string, memberId: string, userId: string): Promise<void> {
    const existingTeam = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    });

    if (!existingTeam) {
      throw new NotFoundError('Team not found');
    }

    const member = existingTeam.members.find(
      (m) => m.userId === userId && m.isAdmin
    );

    if (!member) {
      throw new AuthorizationError('You do not have permission to remove members from this team');
    }
    
    if (memberId === userId) {
        throw new AuthorizationError('You cannot remove yourself from the team');
    }

    await prisma.teamMember.delete({
      where: { id: memberId },
    });
  }

  /**
   * Submit verification documents for a team
   * TODO: Implement when verificationDocs field is added to schema
   */
  async submitVerificationDocuments(teamId: string, files: Express.Multer.File[]): Promise<Team> {
    // Feature not yet implemented - schema needs verificationDocs field
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new Error('Team not found');
    }

    return team;
  }
}

export const teamService = new TeamService();
