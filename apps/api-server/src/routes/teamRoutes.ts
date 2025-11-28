import { Router } from 'express';
import { teamService, CreateTeamInput, UpdateTeamInput } from '../services/teamService';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/teams - List all teams
router.get('/', async (req, res, next) => {
    try {
        const { search, industry, location, minSize, maxSize, availability, minExperience, skills, minCohesion } = req.query;
        const filters = {
            search: search as string,
            industry: industry as string,
            location: location as string,
            minSize: minSize ? Number(minSize) : undefined,
            maxSize: maxSize ? Number(maxSize) : undefined,
            availabilityStatus: availability as any,
            minYearsWorkingTogether: minExperience ? Number(minExperience) : undefined,
        };
        const { page, limit } = req.query;
        const result = await teamService.listTeams(filters, page as string, limit as string);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// GET /api/teams/my-team - Get the current user's team
router.get('/my-team', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
    try {
        const team = await teamService.getTeamByUserId(req.user!.id);
        res.json(team);
    } catch (error) {
        next(error);
    }
});

// GET /api/teams/:id - Get a single team
router.get('/:id', async (req, res, next) => {
    try {
        const team = await teamService.getTeamById(req.params.id);
        res.json(team);
    } catch (error) {
        next(error);
    }
});

// POST /api/teams - Create a new team
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
    try {
        const team = await teamService.createTeam(req.body as CreateTeamInput, req.user!.id);
        res.status(201).json(team);
    } catch (error) {
        next(error);
    }
});

// PUT /api/teams/:id - Update a team
router.put('/:id', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
    try {
        const team = await teamService.updateTeam(req.params.id, req.body as UpdateTeamInput, req.user!.id);
        res.json(team);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/teams/:id - Delete a team
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
    try {
        await teamService.deleteTeam(req.params.id, req.user!.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

// POST /api/teams/:id/members - Add a member to a team
router.post('/:id/members', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
    try {
        const member = await teamService.addTeamMember(req.params.id, req.body, req.user!.id);
        res.status(201).json(member);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/teams/:id/members/:memberId - Remove a member from a team
router.delete('/:id/members/:memberId', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
    try {
        await teamService.removeTeamMember(req.params.id, req.params.memberId, req.user!.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

// POST /api/teams/verification - Submit verification documents for a team
// TODO: Re-enable when file upload middleware is configured
router.post('/verification', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
    try {
        const team = await teamService.getTeamByUserId(req.user!.id);
        if (!team) {
            throw new Error('You are not part of any team');
        }
        // File upload temporarily disabled - return error
        res.status(501).json({ error: 'File upload not yet configured' });
        return;
        // const updatedTeam = await teamService.submitVerificationDocuments(team.id, req.files as Express.Multer.File[]);
        // res.json(updatedTeam);
    } catch (error) {
        next(error);
    }
});

export default router;
