import { Router } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest, authMiddleware } from '../middleware/auth';
import { searchService } from '../services/searchService';

const router = Router();

// Validation schemas
const searchQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required').max(200),
  type: z.enum(['opportunity', 'team', 'company', 'all']).optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  remotePolicy: z.enum(['remote', 'hybrid', 'onsite']).optional(),
  minCompensation: z.coerce.number().min(0).optional(),
  maxCompensation: z.coerce.number().min(0).optional(),
  teamSizeMin: z.coerce.number().min(1).optional(),
  teamSizeMax: z.coerce.number().min(1).optional(),
  skills: z.string().optional(), // comma-separated skills
  limit: z.coerce.number().min(1).max(50).optional(),
});

// GET /api/search - Unified search endpoint
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const parsed = searchQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid search parameters',
      details: parsed.error.errors
    });
  }

  const {
    q: query,
    type,
    industry,
    location,
    remotePolicy,
    minCompensation,
    maxCompensation,
    teamSizeMin,
    teamSizeMax,
    skills,
    limit
  } = parsed.data;

  const filters = {
    type: type as 'opportunity' | 'team' | 'company' | 'all' | undefined,
    industry,
    location,
    remotePolicy,
    minCompensation,
    maxCompensation,
    teamSize: (teamSizeMin || teamSizeMax) ? {
      min: teamSizeMin,
      max: teamSizeMax
    } : undefined,
    skills: skills?.split(',').map(s => s.trim()).filter(Boolean)
  };

  const limits = limit ? {
    opportunities: limit,
    teams: limit,
    companies: Math.ceil(limit / 2)
  } : undefined;

  const results = await searchService.unifiedSearch(query, filters, limits);

  // Record search for analytics (fire and forget)
  searchService.recordSearch(query, req.user?.id, results.total).catch(() => {});

  res.json({
    success: true,
    data: results
  });
});

// GET /api/search/opportunities - Search opportunities only
router.get('/opportunities', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const parsed = searchQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid search parameters',
      details: parsed.error.errors
    });
  }

  const { q: query, industry, location, remotePolicy, minCompensation, maxCompensation, teamSizeMin, teamSizeMax, skills, limit } = parsed.data;

  const filters = {
    industry,
    location,
    remotePolicy,
    minCompensation,
    maxCompensation,
    teamSize: (teamSizeMin || teamSizeMax) ? { min: teamSizeMin, max: teamSizeMax } : undefined,
    skills: skills?.split(',').map(s => s.trim()).filter(Boolean)
  };

  const results = await searchService.searchOpportunities(query, filters, limit || 20);

  res.json({
    success: true,
    data: {
      query,
      total: results.length,
      results
    }
  });
});

// GET /api/search/teams - Search teams only
router.get('/teams', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const parsed = searchQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid search parameters',
      details: parsed.error.errors
    });
  }

  const { q: query, industry, location, teamSizeMin, teamSizeMax, skills, limit } = parsed.data;

  const filters = {
    industry,
    location,
    teamSize: (teamSizeMin || teamSizeMax) ? { min: teamSizeMin, max: teamSizeMax } : undefined,
    skills: skills?.split(',').map(s => s.trim()).filter(Boolean)
  };

  const results = await searchService.searchTeams(query, filters, limit || 20);

  res.json({
    success: true,
    data: {
      query,
      total: results.length,
      results
    }
  });
});

// GET /api/search/companies - Search companies only
router.get('/companies', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const parsed = searchQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid search parameters',
      details: parsed.error.errors
    });
  }

  const { q: query, industry, location, limit } = parsed.data;

  const filters = { industry, location };
  const results = await searchService.searchCompanies(query, filters, limit || 10);

  res.json({
    success: true,
    data: {
      query,
      total: results.length,
      results
    }
  });
});

// GET /api/search/suggestions - Autocomplete suggestions
router.get('/suggestions', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const query = req.query.q as string;

  if (!query || query.length < 2) {
    return res.json({
      success: true,
      data: { suggestions: [] }
    });
  }

  const limit = req.query.limit ? Math.min(Number(req.query.limit), 20) : 10;
  const suggestions = await searchService.getSuggestions(query, limit);

  res.json({
    success: true,
    data: { suggestions }
  });
});

// GET /api/search/popular - Popular/trending searches
router.get('/popular', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const limit = req.query.limit ? Math.min(Number(req.query.limit), 20) : 10;
  const popular = await searchService.getPopularSearches(limit);

  res.json({
    success: true,
    data: { popular }
  });
});

export default router;
