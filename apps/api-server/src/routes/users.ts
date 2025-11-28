import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/auth';
import { NotFoundError, ValidationError } from '../middleware/errorHandler';

const router = Router();

// Validation schemas
const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  title: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  yearsExperience: z.number().min(0).optional(),
  availabilityStatus: z.enum(['available', 'open_to_opportunities', 'not_available']).optional(),
  salaryExpectationMin: z.number().min(0).optional(),
  salaryExpectationMax: z.number().min(0).optional(),
  remotePreference: z.enum(['remote', 'hybrid', 'onsite']).optional(),
});

// GET /api/users/me
router.get('/me', async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: {
      profile: true,
      teamMemberships: {
        include: { team: true }
      },
      companyMemberships: {
        include: { company: true }
      },
      subscriptions: {
        where: { status: 'active' }
      }
    }
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        emailVerified: user.emailVerified,
        profileCompleted: user.profileCompleted,
        lastActive: user.lastActive,
        createdAt: user.createdAt,
      },
      profile: user.profile,
      teams: user.teamMemberships.map(tm => tm.team),
      companies: user.companyMemberships.map(cm => cm.company),
      subscription: user.subscriptions[0] || null,
    }
  });
});

// PUT /api/users/me
router.put('/me', async (req: AuthenticatedRequest, res) => {
  const validatedData = updateProfileSchema.parse(req.body);
  
  const { firstName, lastName, ...profileData } = validatedData;
  
  // Update user basic info
  const updateUserData: any = {};
  if (firstName) updateUserData.firstName = firstName;
  if (lastName) updateUserData.lastName = lastName;
  
  // Update user and profile in transaction
  const result = await prisma.$transaction(async (tx) => {
    // Update user
    const user = await tx.user.update({
      where: { id: req.user!.id },
      data: updateUserData,
    });
    
    // Update or create profile for individual users
    if (req.user!.userType === 'individual' && Object.keys(profileData).length > 0) {
      const profile = await tx.individualProfile.upsert({
        where: { userId: req.user!.id },
        update: profileData,
        create: {
          userId: req.user!.id,
          ...profileData,
        },
      });
      
      return { user, profile };
    }
    
    return { user, profile: null };
  });
  
  res.json({
    success: true,
    data: result,
    message: 'Profile updated successfully',
  });
});

// GET /api/users/:id/public
router.get('/:id/public', async (req, res) => {
  const { id } = req.params;
  
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      skills: {
        include: { skill: true }
      }
    }
  });
  
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  // Return only public information
  res.json({
    success: true,
    data: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      title: user.profile?.title,
      location: user.profile?.location,
      bio: user.profile?.bio,
      yearsExperience: user.profile?.yearsExperience,
      profilePhotoUrl: user.profile?.profilePhotoUrl,
      skills: user.skills.map(us => ({
        name: us.skill.name,
        category: us.skill.category,
        proficiency: us.proficiencyLevel,
        yearsExperience: us.yearsExperience,
      })),
      verificationStatus: {
        email: user.emailVerified,
        phone: user.phoneVerified,
      },
    }
  });
});

// POST /api/users/me/skills
router.post('/me/skills', async (req: AuthenticatedRequest, res) => {
  const { skillId, proficiencyLevel, yearsExperience } = req.body;
  
  if (!skillId || !proficiencyLevel) {
    throw new ValidationError('Skill ID and proficiency level are required');
  }
  
  // Check if skill exists
  const skill = await prisma.skill.findUnique({
    where: { id: skillId }
  });
  
  if (!skill) {
    throw new NotFoundError('Skill not found');
  }
  
  // Add skill to user
  const userSkill = await prisma.userSkill.upsert({
    where: {
      userId_skillId: {
        userId: req.user!.id,
        skillId: skillId,
      }
    },
    update: {
      proficiencyLevel,
      yearsExperience,
    },
    create: {
      userId: req.user!.id,
      skillId,
      proficiencyLevel,
      yearsExperience,
    },
    include: {
      skill: true
    }
  });
  
  res.json({
    success: true,
    data: userSkill,
    message: 'Skill added successfully',
  });
});

// DELETE /api/users/me/skills/:skillId
router.delete('/me/skills/:skillId', async (req: AuthenticatedRequest, res) => {
  const { skillId } = req.params;
  
  await prisma.userSkill.delete({
    where: {
      userId_skillId: {
        userId: req.user!.id,
        skillId: parseInt(skillId),
      }
    }
  });
  
  res.json({
    success: true,
    message: 'Skill removed successfully',
  });
});

export default router;