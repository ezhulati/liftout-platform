import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@liftout/database';
import { AuthenticatedRequest } from '../middleware/auth';
import { NotFoundError, ValidationError, AuthorizationError } from '../middleware/errorHandler';
import { getPaginationParams } from '@liftout/database/src/utils';
import { sendTeamInvitationEmail } from '@liftout/email';
import { logger } from '../utils/logger';

const router = Router();

// Validation schemas
const createTeamSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().optional(),
  industry: z.string().optional(),
  specialization: z.string().optional(),
  size: z.number().min(1).max(100),
  location: z.string().optional(),
  remoteStatus: z.enum(['remote', 'hybrid', 'onsite']).default('hybrid'),
  visibility: z.enum(['public', 'private', 'anonymous']).default('public'),
  salaryExpectationMin: z.number().min(0).optional(),
  salaryExpectationMax: z.number().min(0).optional(),
});

const updateTeamSchema = createTeamSchema.partial();

const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.string().min(1),
  specialization: z.string().optional(),
  seniorityLevel: z.enum(['entry', 'mid', 'senior', 'lead', 'principal']).default('mid'),
  personalMessage: z.string().optional(),
});

// GET /api/teams
router.get('/', async (req, res) => {
  const { page, limit, skip, take } = getPaginationParams(
    req.query.page as string | undefined,
    req.query.limit as string | undefined
  );
  
  const where: any = {
    visibility: 'public',
    availabilityStatus: { not: 'not_available' }
  };
  
  // Apply filters
  if (req.query.industry) {
    where.industry = req.query.industry;
  }
  
  if (req.query.location) {
    where.location = { contains: req.query.location as string, mode: 'insensitive' };
  }
  
  if (req.query.size) {
    const sizeRange = (req.query.size as string).split('-');
    if (sizeRange.length === 2) {
      where.size = {
        gte: parseInt(sizeRange[0]),
        lte: parseInt(sizeRange[1])
      };
    }
  }
  
  const [teams, total] = await Promise.all([
    prisma.team.findMany({
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
                profile: {
                  select: {
                    title: true,
                    profilePhotoUrl: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: { applications: true }
        }
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.team.count({ where })
  ]);
  
  res.json({
    success: true,
    data: {
      teams,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// POST /api/teams
router.post('/', async (req: AuthenticatedRequest, res) => {
  if (req.user?.userType !== 'individual') {
    throw new AuthorizationError('Only individual users can create teams');
  }
  
  const validatedData = createTeamSchema.parse(req.body);
  
  // Generate slug from name
  const baseSlug = validatedData.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
  
  let slug = baseSlug;
  let counter = 1;
  
  // Ensure unique slug
  while (await prisma.team.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  const team = await prisma.team.create({
    data: {
      ...validatedData,
      slug,
      createdBy: req.user.id,
      members: {
        create: {
          userId: req.user.id,
          role: 'Team Lead',
          seniorityLevel: 'lead',
          isAdmin: true,
          isLead: true,
          status: 'active',
        }
      }
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profile: {
                select: {
                  title: true,
                  profilePhotoUrl: true
                }
              }
            }
          }
        }
      }
    }
  });
  
  res.status(201).json({
    success: true,
    data: team,
    message: 'Team created successfully'
  });
});

// GET /api/teams/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  const team = await prisma.team.findUnique({
    where: { id },
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
                  yearsExperience: true
                }
              },
              skills: {
                include: { skill: true }
              }
            }
          }
        }
      },
      applications: {
        include: {
          opportunity: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                  logoUrl: true
                }
              }
            }
          }
        },
        orderBy: { appliedAt: 'desc' }
      },
      creator: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    }
  });
  
  if (!team) {
    throw new NotFoundError('Team not found');
  }
  
  // Check if team is private and user has access
  if (team.visibility === 'private') {
    // Implementation depends on your access control logic
  }
  
  res.json({
    success: true,
    data: team
  });
});

// PUT /api/teams/:id
router.put('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const validatedData = updateTeamSchema.parse(req.body);
  
  // Check if user is team admin
  const teamMember = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId: id,
        userId: req.user!.id
      }
    }
  });
  
  if (!teamMember?.isAdmin) {
    throw new AuthorizationError('Only team admins can update team details');
  }
  
  const team = await prisma.team.update({
    where: { id },
    data: validatedData,
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
                  profilePhotoUrl: true
                }
              }
            }
          }
        }
      }
    }
  });
  
  res.json({
    success: true,
    data: team,
    message: 'Team updated successfully'
  });
});

// POST /api/teams/:id/members
router.post('/:id/members', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const validatedData = inviteMemberSchema.parse(req.body);

  // Get team info and check if user is team admin
  const [team, teamMember] = await Promise.all([
    prisma.team.findUnique({
      where: { id },
      select: { id: true, name: true }
    }),
    prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: id,
          userId: req.user!.id
        }
      }
    })
  ]);

  if (!team) {
    throw new NotFoundError('Team not found');
  }

  if (!teamMember?.isAdmin) {
    throw new AuthorizationError('Only team admins can invite members');
  }

  // Check if user exists
  const invitedUser = await prisma.user.findUnique({
    where: { email: validatedData.email }
  });

  if (!invitedUser) {
    throw new NotFoundError('User with this email not found');
  }

  // Check if user is already a member
  const existingMember = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId: id,
        userId: invitedUser.id
      }
    }
  });

  if (existingMember) {
    throw new ValidationError('User is already a team member');
  }

  // Create invitation
  const invitation = await prisma.teamMember.create({
    data: {
      teamId: id,
      userId: invitedUser.id,
      role: validatedData.role,
      specialization: validatedData.specialization,
      seniorityLevel: validatedData.seniorityLevel,
      status: 'pending',
      invitedBy: req.user!.id,
      invitedAt: new Date(),
      invitationExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      }
    }
  });

  // Send invitation email (don't await to not block response)
  const inviterName = `${req.user!.firstName} ${req.user!.lastName}`;
  sendTeamInvitationEmail({
    to: invitedUser.email,
    firstName: invitedUser.firstName,
    teamName: team.name,
    inviterName,
    role: validatedData.role,
    personalMessage: validatedData.personalMessage,
  }).then(result => {
    if (result.success) {
      logger.info(`Team invitation email sent to: ${invitedUser.email} for team: ${team.name}`);
    } else {
      logger.error(`Failed to send team invitation email to ${invitedUser.email}: ${result.error}`);
    }
  });

  res.status(201).json({
    success: true,
    data: invitation,
    message: 'Team invitation sent successfully'
  });
});

// GET /api/teams/:id/applications
router.get('/:id/applications', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  
  // Check if user is team member
  const teamMember = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId: id,
        userId: req.user!.id
      }
    }
  });
  
  if (!teamMember) {
    throw new AuthorizationError('Access denied');
  }
  
  const applications = await prisma.teamApplication.findMany({
    where: { teamId: id },
    include: {
      opportunity: {
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
              industry: true
            }
          }
        }
      }
    },
    orderBy: { appliedAt: 'desc' }
  });
  
  res.json({
    success: true,
    data: applications
  });
});

export default router;