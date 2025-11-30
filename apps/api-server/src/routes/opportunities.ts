import { Router } from 'express';
import { z } from 'zod';
import { OpportunityStatus, RemotePreference, UrgencyLevel, SeniorityLevel } from '@prisma/client';
import { AuthenticatedRequest, authMiddleware, requireCompanyUser } from '../middleware/auth';
import { ValidationError } from '../middleware/errorHandler';
import { opportunityService } from '../services/opportunityService';

const router = Router();

// Validation schemas
const createOpportunitySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(300),
  description: z.string().min(50, 'Description must be at least 50 characters').max(5000),
  teamSizeMin: z.number().min(1).optional(),
  teamSizeMax: z.number().min(1).optional(),
  requiredSkills: z.array(z.string()).default([]),
  preferredSkills: z.array(z.string()).default([]),
  niceToHaveSkills: z.array(z.string()).default([]),
  industry: z.string().optional(),
  department: z.string().optional(),
  seniorityLevel: z.enum(['entry', 'mid', 'senior', 'lead', 'principal']).optional(),
  location: z.string().optional(),
  multipleLocations: z.array(z.string()).default([]),
  remotePolicy: z.enum(['remote', 'hybrid', 'onsite']).default('hybrid'),
  compensationMin: z.number().min(0).optional(),
  compensationMax: z.number().min(0).optional(),
  compensationCurrency: z.string().default('USD'),
  equityOffered: z.boolean().default(false),
  equityRange: z.string().optional(),
  benefits: z.array(z.string()).default([]),
  perks: z.array(z.string()).default([]),
  urgency: z.enum(['low', 'standard', 'high', 'urgent']).default('standard'),
  startDate: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
  projectDuration: z.string().optional(),
  contractType: z.string().default('full_time'),
  reportingStructure: z.string().optional(),
  growthOpportunities: z.string().optional(),
  techStack: z.array(z.string()).default([]),
  teamStructure: z.string().optional(),
  interviewProcess: z.string().optional(),
  onboardingPlan: z.string().optional(),
  successMetrics: z.string().optional(),
  challenges: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  visibility: z.string().default('public'),
  expiresAt: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
});

const updateOpportunitySchema = createOpportunitySchema.partial().extend({
  status: z.enum(['active', 'paused', 'filled', 'expired']).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['active', 'paused', 'filled', 'expired']),
});

// GET /api/opportunities - List opportunities with filters
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const {
    page,
    limit,
    search,
    industry,
    location,
    status,
    companyId,
    minCompensation,
    maxCompensation,
    teamSizeMin,
    teamSizeMax,
    remotePolicy,
    urgency,
    seniorityLevel,
    featured,
  } = req.query;

  const filters = {
    search: search as string,
    industry: industry as string,
    location: location as string,
    status: status as OpportunityStatus | undefined,
    companyId: companyId as string,
    minCompensation: minCompensation ? Number(minCompensation) : undefined,
    maxCompensation: maxCompensation ? Number(maxCompensation) : undefined,
    teamSizeMin: teamSizeMin ? Number(teamSizeMin) : undefined,
    teamSizeMax: teamSizeMax ? Number(teamSizeMax) : undefined,
    remotePolicy: remotePolicy as RemotePreference | undefined,
    urgency: urgency as UrgencyLevel | undefined,
    seniorityLevel: seniorityLevel as SeniorityLevel | undefined,
    featured: featured === 'true',
  };

  const result = await opportunityService.listOpportunities(
    filters,
    page as string,
    limit as string
  );

  res.json({
    success: true,
    data: result
  });
});

// GET /api/opportunities/featured - Get featured opportunities
router.get('/featured', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 5;
  const opportunities = await opportunityService.getFeaturedOpportunities(limit);

  res.json({
    success: true,
    data: opportunities
  });
});

// GET /api/opportunities/facets - Get filter facets with counts
router.get('/facets', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const facets = await opportunityService.getFilterFacets();

  res.json({
    success: true,
    data: facets
  });
});

// GET /api/opportunities/stats - Get opportunity statistics
router.get('/stats', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const stats = await opportunityService.getOpportunityStats();

  res.json({
    success: true,
    data: stats
  });
});

// GET /api/opportunities/company - Get opportunities for user's company
router.get('/company', authMiddleware, requireCompanyUser, async (req: AuthenticatedRequest, res) => {
  if (!req.user?.companyId) {
    throw new ValidationError('User is not associated with a company');
  }

  const { page, limit } = req.query;
  const result = await opportunityService.getCompanyOpportunities(
    req.user.companyId,
    page as string,
    limit as string
  );

  res.json({
    success: true,
    data: result
  });
});

// POST /api/opportunities - Create new opportunity
router.post('/', authMiddleware, requireCompanyUser, async (req: AuthenticatedRequest, res) => {
  if (!req.user?.companyId) {
    throw new ValidationError('User is not associated with a company');
  }

  const validatedData = createOpportunitySchema.parse(req.body);

  // Validate compensation range
  if (validatedData.compensationMin && validatedData.compensationMax) {
    if (validatedData.compensationMax < validatedData.compensationMin) {
      throw new ValidationError('Maximum compensation must be greater than or equal to minimum compensation');
    }
  }

  // Validate team size range
  if (validatedData.teamSizeMin && validatedData.teamSizeMax) {
    if (validatedData.teamSizeMax < validatedData.teamSizeMin) {
      throw new ValidationError('Maximum team size must be greater than or equal to minimum team size');
    }
  }

  const opportunity = await opportunityService.createOpportunity(
    validatedData,
    req.user.id,
    req.user.companyId
  );

  res.status(201).json({
    success: true,
    data: opportunity,
    message: 'Opportunity created successfully'
  });
});

// GET /api/opportunities/:id - Get opportunity details
router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const opportunity = await opportunityService.getOpportunityById(id);

  // Increment view count (fire and forget)
  opportunityService.incrementViewCount(id).catch(() => {
    // Ignore errors from view count increment
  });

  res.json({
    success: true,
    data: opportunity
  });
});

// PUT /api/opportunities/:id - Update opportunity
router.put('/:id', authMiddleware, requireCompanyUser, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const validatedData = updateOpportunitySchema.parse(req.body);

  // Validate compensation range
  if (validatedData.compensationMin && validatedData.compensationMax) {
    if (validatedData.compensationMax < validatedData.compensationMin) {
      throw new ValidationError('Maximum compensation must be greater than or equal to minimum compensation');
    }
  }

  // Validate team size range
  if (validatedData.teamSizeMin && validatedData.teamSizeMax) {
    if (validatedData.teamSizeMax < validatedData.teamSizeMin) {
      throw new ValidationError('Maximum team size must be greater than or equal to minimum team size');
    }
  }

  const opportunity = await opportunityService.updateOpportunity(
    id,
    validatedData,
    req.user!.id
  );

  res.json({
    success: true,
    data: opportunity,
    message: 'Opportunity updated successfully'
  });
});

// DELETE /api/opportunities/:id - Delete opportunity (soft delete)
router.delete('/:id', authMiddleware, requireCompanyUser, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  await opportunityService.deleteOpportunity(id, req.user!.id);

  res.json({
    success: true,
    message: 'Opportunity deleted successfully'
  });
});

// GET /api/opportunities/:id/applications - Get applications for opportunity
router.get('/:id/applications', authMiddleware, requireCompanyUser, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const applications = await opportunityService.getOpportunityApplications(id, req.user!.id);

  res.json({
    success: true,
    data: applications
  });
});

// PATCH /api/opportunities/:id/status - Update opportunity status
router.patch('/:id/status', authMiddleware, requireCompanyUser, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { status } = updateStatusSchema.parse(req.body);

  const opportunity = await opportunityService.updateOpportunityStatus(
    id,
    status,
    req.user!.id
  );

  res.json({
    success: true,
    data: opportunity,
    message: `Opportunity status updated to ${status}`
  });
});

// POST /api/opportunities/:id/view - Increment view count
router.post('/:id/view', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  await opportunityService.incrementViewCount(id);

  res.json({
    success: true,
    message: 'View count incremented'
  });
});

export default router;
