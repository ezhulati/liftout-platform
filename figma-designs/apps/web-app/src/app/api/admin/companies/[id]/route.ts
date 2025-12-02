import { NextRequest, NextResponse } from 'next/server';
import { withAdminAccess, withAdminAction, AdminUser } from '@/lib/admin-middleware';
import { getCompanyById, updateCompany, softDeleteCompany } from '@/lib/services/adminService';
import { AdminActionType } from '@/lib/services/auditService';

export const dynamic = 'force-dynamic';

// GET /api/admin/companies/[id] - Get company details
export const GET = withAdminAccess(
  async (req: NextRequest, admin: AdminUser, params?: Record<string, string>) => {
    try {
      const companyId = params?.id;
      if (!companyId) {
        return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
      }

      const company = await getCompanyById(companyId);
      return NextResponse.json({ company });
    } catch (error) {
      console.error('Get company error:', error);
      if (error instanceof Error && error.message === 'Company not found') {
        return NextResponse.json({ error: 'Company not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
    }
  }
);

// PUT /api/admin/companies/[id] - Update company
export const PUT = withAdminAction(
  'company.update' as AdminActionType,
  async (req, _res) => {
    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    const id = segments[segments.length - 1];
    return { targetType: 'company', targetId: id };
  }
)(async (req: NextRequest, admin: AdminUser, params?: Record<string, string>) => {
  try {
    const companyId = params?.id;
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
    }

    const body = await req.json();
    const { name, description, industry, verificationStatus } = body;

    const company = await updateCompany(companyId, { name, description, industry, verificationStatus }, admin.id);
    return NextResponse.json({ company });
  } catch (error) {
    console.error('Update company error:', error);
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
});

// DELETE /api/admin/companies/[id] - Soft delete company
export const DELETE = withAdminAction(
  'company.delete' as AdminActionType,
  async (req, _res) => {
    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    const id = segments[segments.length - 1];
    return { targetType: 'company', targetId: id };
  }
)(async (req: NextRequest, admin: AdminUser, params?: Record<string, string>) => {
  try {
    const companyId = params?.id;
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
    }

    await softDeleteCompany(companyId, admin.id);
    return NextResponse.json({ success: true, message: 'Company deleted' });
  } catch (error) {
    console.error('Delete company error:', error);
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
  }
});
