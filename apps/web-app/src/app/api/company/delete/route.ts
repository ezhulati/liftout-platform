import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Request company deletion (soft delete or archive)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { confirmName, reason, deleteType = 'archive' } = body;

    // Get user's company and verify admin status
    const companyUser = await prisma.companyUser.findFirst({
      where: {
        userId: session.user.id,
        role: 'admin', // Only admins can delete
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            opportunities: {
              where: { status: 'active' },
              select: { id: true },
            },
          },
        },
      },
    });

    if (!companyUser) {
      return NextResponse.json(
        { error: 'Not authorized. Only company admins can delete the company.' },
        { status: 403 }
      );
    }

    const company = companyUser.company;

    // Verify name confirmation
    if (confirmName !== company.name) {
      return NextResponse.json(
        { error: 'Company name confirmation does not match' },
        { status: 400 }
      );
    }

    // Check for active opportunities
    if (company.opportunities.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete company with active opportunities',
          activeOpportunities: company.opportunities.length,
          message: 'Please close or archive all active opportunities first',
        },
        { status: 400 }
      );
    }

    // Demo user handling
    const userEmail = session.user.email;
    if (userEmail === 'company@example.com' || userEmail === 'demo@example.com') {
      console.log('[Demo] Company deletion simulated for:', company.name);
      return NextResponse.json({
        success: true,
        message: 'Company deletion simulated (demo mode)',
        companyId: company.id,
      });
    }

    if (deleteType === 'permanent') {
      // Permanent deletion - use transaction
      await prisma.$transaction(async (tx) => {
        // Delete company users
        await tx.companyUser.deleteMany({
          where: { companyId: company.id },
        });

        // Close/archive opportunities (soft delete)
        await tx.opportunity.updateMany({
          where: { companyId: company.id },
          data: { status: 'expired' },
        });

        // Delete the company (locations stored as JSON)
        await tx.company.delete({
          where: { id: company.id },
        });
      });

      return NextResponse.json({
        success: true,
        message: 'Company permanently deleted',
        companyId: company.id,
      });
    } else {
      // Archive (soft delete) - use soft delete fields on Company model
      await prisma.company.update({
        where: { id: company.id },
        data: {
          verificationStatus: 'pending', // Reset verification
          deletedAt: new Date(),
          deletedBy: session.user.id,
        },
      });

      // Close all opportunities
      await prisma.opportunity.updateMany({
        where: { companyId: company.id },
        data: { status: 'paused' },
      });

      return NextResponse.json({
        success: true,
        message: 'Company archived successfully',
        companyId: company.id,
        canRestore: true,
      });
    }
  } catch (error) {
    console.error('Delete company error:', error);
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    );
  }
}

// GET - Check deletion eligibility
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user's company
    const companyUser = await prisma.companyUser.findFirst({
      where: { userId: session.user.id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                opportunities: true,
                users: true,
              },
            },
            opportunities: {
              where: { status: 'active' },
              select: { id: true, title: true },
            },
          },
        },
      },
    });

    if (!companyUser) {
      return NextResponse.json(
        { error: 'Not associated with a company' },
        { status: 404 }
      );
    }

    const company = companyUser.company;
    const isAdmin = companyUser.role === 'admin';
    const hasActiveOpportunities = company.opportunities.length > 0;

    return NextResponse.json({
      canDelete: isAdmin && !hasActiveOpportunities,
      isAdmin,
      companyName: company.name,
      activeOpportunities: company.opportunities,
      totalOpportunities: company._count.opportunities,
      totalUsers: company._count.users,
      blockers: [
        ...(!isAdmin ? ['You must be a company admin to delete the company'] : []),
        ...(hasActiveOpportunities
          ? [`${company.opportunities.length} active opportunities must be closed first`]
          : []),
      ],
    });
  } catch (error) {
    console.error('Check deletion eligibility error:', error);
    return NextResponse.json(
      { error: 'Failed to check deletion eligibility' },
      { status: 500 }
    );
  }
}
