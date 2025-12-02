import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest, requireCompanyUser } from '../middleware/auth';

const router = Router();

// GET /api/companies/me
router.get('/me', requireCompanyUser, async (req: AuthenticatedRequest, res) => {
  const companyMembership = await prisma.companyUser.findFirst({
    where: { userId: req.user!.id },
    include: {
      company: {
        include: {
          opportunities: {
            where: { status: 'active' },
            take: 5,
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: { opportunities: true }
          }
        }
      }
    }
  });

  res.json({
    success: true,
    data: companyMembership?.company || null
  });
});

// POST /api/companies
router.post('/', requireCompanyUser, async (req: AuthenticatedRequest, res) => {
  // Implementation for creating company profile
  res.json({ success: true, message: 'Company creation endpoint' });
});

// PUT /api/companies/:id
router.put('/:id', requireCompanyUser, async (req: AuthenticatedRequest, res) => {
  // Implementation for updating company profile
  res.json({ success: true, message: 'Company update endpoint' });
});

export default router;