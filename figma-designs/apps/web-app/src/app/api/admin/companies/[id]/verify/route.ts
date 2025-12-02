import { NextRequest, NextResponse } from 'next/server';
import { withAdminAction, AdminUser } from '@/lib/admin-middleware';
import { verifyCompany, rejectCompanyVerification } from '@/lib/services/adminService';
import { AdminActionType } from '@/lib/services/auditService';

export const dynamic = 'force-dynamic';

// POST /api/admin/companies/[id]/verify - Verify company
export const POST = withAdminAction(
  'company.verify' as AdminActionType,
  async (req, _res) => {
    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    const id = segments[segments.length - 2];
    return { targetType: 'company', targetId: id };
  }
)(async (req: NextRequest, admin: AdminUser, params?: Record<string, string>) => {
  try {
    const companyId = params?.id;
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
    }

    await verifyCompany(companyId, admin.id);
    return NextResponse.json({ success: true, message: 'Company verified' });
  } catch (error) {
    console.error('Verify company error:', error);
    return NextResponse.json({ error: 'Failed to verify company' }, { status: 500 });
  }
});

// DELETE /api/admin/companies/[id]/verify - Reject verification
export const DELETE = withAdminAction(
  'company.reject' as AdminActionType,
  async (req, _res) => {
    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    const id = segments[segments.length - 2];
    return { targetType: 'company', targetId: id };
  }
)(async (req: NextRequest, admin: AdminUser, params?: Record<string, string>) => {
  try {
    const companyId = params?.id;
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const { reason } = body;

    await rejectCompanyVerification(companyId, admin.id, reason);
    return NextResponse.json({ success: true, message: 'Company verification rejected' });
  } catch (error) {
    console.error('Reject company verification error:', error);
    return NextResponse.json({ error: 'Failed to reject verification' }, { status: 500 });
  }
});
