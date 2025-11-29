import { Router } from 'express';
import { z } from 'zod';
import { ApplicationStatus } from '@prisma/client';
import { AuthenticatedRequest, authMiddleware, requireCompanyUser } from '../middleware/auth';
import { applicationService } from '../services/applicationService';

const router = Router();

// Validation schemas
const createApplicationSchema = z.object({
  teamId: z.string().uuid(),
  opportunityId: z.string().uuid(),
  coverLetter: z.string().max(5000).optional(),
  proposedCompensation: z.number().min(0).optional(),
  proposedEquity: z.string().optional(),
  availabilityDate: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
  customProposal: z.string().max(10000).optional(),
  teamFitExplanation: z.string().max(5000).optional(),
  questionsForCompany: z.string().max(2000).optional(),
  attachments: z.array(z.string().url()).default([]),
});

const updateStatusSchema = z.object({
  status: z.enum(['reviewing', 'interviewing', 'accepted', 'rejected']),
  rejectionReason: z.string().max(2000).optional(),
  responseMessage: z.string().max(2000).optional(),
  recruiterNotes: z.string().max(5000).optional(),
  hiringManagerNotes: z.string().max(5000).optional(),
  responseDeadline: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
});

const scheduleInterviewSchema = z.object({
  scheduledAt: z.string().datetime().transform(val => new Date(val)),
  format: z.enum(['video', 'in_person', 'phone']),
  duration: z.number().min(15).max(480), // 15 min to 8 hours
  participants: z.array(z.string()).optional(),
  notes: z.string().max(2000).optional(),
  location: z.string().optional(),
  meetingLink: z.string().url().optional(),
});

const interviewFeedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  strengths: z.array(z.string()),
  concerns: z.array(z.string()),
  recommendation: z.enum(['proceed', 'hold', 'reject']),
  notes: z.string().max(5000).optional(),
  interviewerName: z.string(),
});

const offerDetailsSchema = z.object({
  compensation: z.number().min(0),
  equityOffer: z.string().optional(),
  benefits: z.array(z.string()).optional(),
  startDate: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
  signingBonus: z.number().min(0).optional(),
  additionalTerms: z.string().max(5000).optional(),
  expirationDate: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
});

const createEOISchema = z.object({
  fromType: z.enum(['team', 'company']),
  toType: z.enum(['team', 'opportunity']),
  toId: z.string().uuid(),
  message: z.string().max(2000).optional(),
  interestLevel: z.enum(['low', 'medium', 'high']).default('medium'),
  specificRole: z.string().optional(),
  timeline: z.string().optional(),
  budgetRange: z.string().optional(),
});

const respondToEOISchema = z.object({
  response: z.enum(['accepted', 'declined']),
});

// ==========================================
// Team Application Routes
// ==========================================

// POST /api/applications - Submit a new application
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const validatedData = createApplicationSchema.parse(req.body);

  const application = await applicationService.createApplication(
    validatedData,
    req.user!.id
  );

  res.status(201).json({
    success: true,
    data: application,
    message: 'Application submitted successfully',
  });
});

// GET /api/applications - List applications
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { page, limit, status, teamId, opportunityId } = req.query;

  // If teamId is provided, get applications for that team
  if (teamId) {
    const result = await applicationService.getApplicationsByTeam(
      teamId as string,
      req.user!.id,
      { status: status as ApplicationStatus | undefined },
      page as string,
      limit as string
    );

    return res.json({
      success: true,
      data: result,
    });
  }

  // If opportunityId is provided, get applications for that opportunity
  if (opportunityId) {
    const result = await applicationService.getApplicationsByOpportunity(
      opportunityId as string,
      req.user!.id,
      { status: status as ApplicationStatus | undefined },
      page as string,
      limit as string
    );

    return res.json({
      success: true,
      data: result,
    });
  }

  // Otherwise, return error - must specify either teamId or opportunityId
  return res.status(400).json({
    success: false,
    error: 'Must specify either teamId or opportunityId',
  });
});

// GET /api/applications/stats - Get application statistics
router.get('/stats', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const stats = await applicationService.getApplicationStats(req.user!.id);

  res.json({
    success: true,
    data: stats,
  });
});

// GET /api/applications/:id - Get application details
router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const application = await applicationService.getApplicationById(id, req.user!.id);

  res.json({
    success: true,
    data: application,
  });
});

// POST /api/applications/:id/withdraw - Withdraw application
router.post('/:id/withdraw', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  await applicationService.withdrawApplication(id, req.user!.id);

  res.json({
    success: true,
    message: 'Application withdrawn successfully',
  });
});

// POST /api/applications/:id/status - Update application status (company action)
router.post('/:id/status', authMiddleware, requireCompanyUser, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const validatedData = updateStatusSchema.parse(req.body);

  const application = await applicationService.updateApplicationStatus(
    id,
    validatedData,
    req.user!.id
  );

  res.json({
    success: true,
    data: application,
    message: `Application status updated to ${validatedData.status}`,
  });
});

// POST /api/applications/:id/interview - Schedule interview
router.post('/:id/interview', authMiddleware, requireCompanyUser, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const validatedData = scheduleInterviewSchema.parse(req.body);

  const application = await applicationService.scheduleInterview(
    id,
    validatedData,
    req.user!.id
  );

  res.json({
    success: true,
    data: application,
    message: 'Interview scheduled successfully',
  });
});

// POST /api/applications/:id/interview/feedback - Add interview feedback
router.post('/:id/interview/feedback', authMiddleware, requireCompanyUser, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const validatedData = interviewFeedbackSchema.parse(req.body);

  const application = await applicationService.addInterviewFeedback(
    id,
    validatedData,
    req.user!.id
  );

  res.json({
    success: true,
    data: application,
    message: 'Interview feedback added successfully',
  });
});

// POST /api/applications/:id/offer - Make offer to team
router.post('/:id/offer', authMiddleware, requireCompanyUser, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const validatedData = offerDetailsSchema.parse(req.body);

  const application = await applicationService.makeOffer(
    id,
    validatedData,
    req.user!.id
  );

  res.json({
    success: true,
    data: application,
    message: 'Offer made successfully',
  });
});

// ==========================================
// Expression of Interest Routes
// ==========================================

// POST /api/interests - Create expression of interest
router.post('/interests', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const validatedData = createEOISchema.parse(req.body);

  const eoi = await applicationService.createExpressionOfInterest(
    validatedData,
    req.user!.id
  );

  res.status(201).json({
    success: true,
    data: eoi,
    message: 'Expression of interest sent successfully',
  });
});

// GET /api/interests - List expressions of interest
router.get('/interests', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { page, limit, type } = req.query;

  const result = await applicationService.getExpressionsOfInterest(
    req.user!.id,
    (type as 'sent' | 'received') || 'received',
    page as string,
    limit as string
  );

  res.json({
    success: true,
    data: result,
  });
});

// POST /api/interests/:id/respond - Respond to expression of interest
router.post('/interests/:id/respond', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { response } = respondToEOISchema.parse(req.body);

  const eoi = await applicationService.respondToExpressionOfInterest(
    id,
    response,
    req.user!.id
  );

  res.json({
    success: true,
    data: eoi,
    message: `Expression of interest ${response}`,
  });
});

export default router;
