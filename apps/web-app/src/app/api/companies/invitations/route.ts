import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

// Demo user detection helper
const isDemoUser = (email: string | null | undefined): boolean => {
  return email === 'demo@example.com' || email === 'company@example.com';
};

// Demo invitations for testing
const DEMO_COMPANY_INVITATIONS = [
  {
    id: 'demo-company-inv-001',
    companyId: 'demo-company-001',
    companyName: 'Acme Corporation',
    inviterEmail: 'company@example.com',
    inviterName: 'Jane Smith',
    inviteeEmail: 'rep@example.com',
    role: 'admin',
    status: 'pending',
    message: 'Join us on Liftout to help find top talent!',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

// GET /api/companies/invitations - Get company invitations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    // Demo user handling
    if (isDemoUser(session.user.email)) {
      if (companyId) {
        return NextResponse.json({
          invitations: DEMO_COMPANY_INVITATIONS.filter(inv => inv.companyId === companyId),
        });
      }
      // Return user's pending invitations
      return NextResponse.json({
        invitations: DEMO_COMPANY_INVITATIONS.filter(
          inv => inv.inviteeEmail === session.user?.email && inv.status === 'pending'
        ),
      });
    }

    const userId = (session.user as any).id;

    if (companyId) {
      // Verify user has permission to view this company's invitations
      const companyUser = await prisma.companyUser.findFirst({
        where: {
          companyId,
          userId,
        },
      });

      if (!companyUser || (companyUser.role !== 'admin' && companyUser.role !== 'owner')) {
        return NextResponse.json(
          { error: 'You do not have permission to view invitations' },
          { status: 403 }
        );
      }

      // Get all pending invitations for this company
      const invitations = await prisma.companyUser.findMany({
        where: {
          companyId,
          invitationToken: { not: null },
        },
        include: {
          company: {
            select: { name: true },
          },
          user: {
            select: { firstName: true, lastName: true, email: true },
          },
        },
      });

      return NextResponse.json({
        invitations: invitations.map(inv => ({
          id: inv.id,
          companyId: inv.companyId,
          companyName: inv.company.name,
          inviteeEmail: inv.user?.email,
          role: inv.role,
          status: inv.invitationExpiresAt && new Date() > inv.invitationExpiresAt ? 'expired' : 'pending',
          expiresAt: inv.invitationExpiresAt?.toISOString(),
          createdAt: inv.createdAt.toISOString(),
        })),
      });
    }

    // Get user's pending company invitations
    const userInvitations = await prisma.companyUser.findMany({
      where: {
        userId,
        invitationToken: { not: null },
        OR: [
          { invitationExpiresAt: null },
          { invitationExpiresAt: { gt: new Date() } },
        ],
      },
      include: {
        company: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({
      invitations: userInvitations.map(inv => ({
        id: inv.id,
        companyId: inv.companyId,
        companyName: inv.company.name,
        role: inv.role,
        status: 'pending',
        expiresAt: inv.invitationExpiresAt?.toISOString(),
        createdAt: inv.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching company invitations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    );
  }
}

// POST /api/companies/invitations - Send company invitation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { companyId, companyName, inviteeEmail, role, message } = body;

    // Validation
    if (!companyId || !inviteeEmail || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: companyId, inviteeEmail, role' },
        { status: 400 }
      );
    }

    if (!['member', 'admin', 'recruiter'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be member, admin, or recruiter' },
        { status: 400 }
      );
    }

    // Demo user handling
    if (isDemoUser(session.user.email)) {
      console.log('[Demo] Company invitation sent to', inviteeEmail);
      const token = `demo-token-${Date.now()}`;
      return NextResponse.json({
        success: true,
        invitationId: `demo-company-inv-${Date.now()}`,
        inviteLink: `/invites/${token}`,
        message: 'Invitation sent successfully (demo mode)',
      });
    }

    const userId = (session.user as any).id;

    // Verify user has permission to invite to this company
    const companyUser = await prisma.companyUser.findFirst({
      where: {
        companyId,
        userId,
      },
    });

    if (!companyUser || (companyUser.role !== 'admin' && companyUser.role !== 'owner')) {
      return NextResponse.json(
        { error: 'Only company admins can send invitations' },
        { status: 403 }
      );
    }

    // Check if user is already a member
    const existingUser = await prisma.user.findUnique({
      where: { email: inviteeEmail },
    });

    if (existingUser) {
      const existingMember = await prisma.companyUser.findFirst({
        where: {
          companyId,
          userId: existingUser.id,
        },
      });

      if (existingMember && !existingMember.invitationToken) {
        return NextResponse.json(
          { error: 'This user is already a member of the company' },
          { status: 400 }
        );
      }
    }

    // Generate invitation token
    const invitationToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create or update company user invitation
    let invitation;
    if (existingUser) {
      const existingInvitation = await prisma.companyUser.findFirst({
        where: {
          companyId,
          userId: existingUser.id,
        },
      });

      if (existingInvitation) {
        invitation = await prisma.companyUser.update({
          where: { id: existingInvitation.id },
          data: {
            invitationToken,
            invitationExpiresAt: expiresAt,
            invitedBy: userId,
            role,
          },
        });
      } else {
        invitation = await prisma.companyUser.create({
          data: {
            companyId,
            userId: existingUser.id,
            role,
            invitationToken,
            invitationExpiresAt: expiresAt,
            invitedBy: userId,
          },
        });
      }
    } else {
      // User doesn't exist yet - they need to sign up first
      // For now, return success with a note that user needs to create account
      // The invite link will prompt them to sign up
      return NextResponse.json({
        success: true,
        invitationId: `pending-${invitationToken}`,
        inviteLink: `/auth/signup?invite=${invitationToken}&email=${encodeURIComponent(inviteeEmail)}&type=company`,
        message: 'User not yet registered. They will be invited when they sign up with this link.',
        requiresSignup: true,
      });
    }

    // Build invite link (email sending requires Resend API key in production)
    const inviteLink = `/invites/${invitationToken}`;
    console.log(`[Company Invitation] To: ${inviteeEmail}, Link: ${inviteLink}`);

    return NextResponse.json({
      success: true,
      invitationId: invitation.id,
      inviteLink,
      message: 'Invitation created successfully',
    });
  } catch (error) {
    console.error('Error sending company invitation:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    );
  }
}
