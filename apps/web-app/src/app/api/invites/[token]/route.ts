import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Demo invitation data for testing
const DEMO_INVITATIONS: Record<string, {
  id: string;
  teamId: string;
  teamName: string;
  inviterName: string;
  inviterEmail: string;
  inviteeEmail: string;
  role: string;
  message?: string;
  expiresAt: Date;
  status: string;
}> = {
  'demo-invite-123': {
    id: 'demo-invite-123',
    teamId: 'demo-team-001',
    teamName: 'TechFlow Data Science Team',
    inviterName: 'Alex Chen',
    inviterEmail: 'demo@example.com',
    inviteeEmail: 'invited@example.com',
    role: 'member',
    message: "We'd love to have you join our data science team!",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'pending',
  },
  'demo-company-invite': {
    id: 'demo-company-invite',
    teamId: 'demo-company-001',
    teamName: 'Acme Corporation',
    inviterName: 'Jane Smith',
    inviterEmail: 'company@example.com',
    inviteeEmail: 'rep@example.com',
    role: 'admin',
    message: 'Join our company team on Liftout!',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'pending',
  },
};

// GET /api/invites/[token] - Get invitation details by token (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Handle demo invitations
    if (token.startsWith('demo-')) {
      const demoInvite = DEMO_INVITATIONS[token];
      if (demoInvite) {
        return NextResponse.json({
          success: true,
          invitation: {
            id: demoInvite.id,
            teamName: demoInvite.teamName,
            inviterName: demoInvite.inviterName,
            inviteeEmail: demoInvite.inviteeEmail,
            role: demoInvite.role,
            message: demoInvite.message,
            expiresAt: demoInvite.expiresAt.toISOString(),
            status: demoInvite.status,
            type: token.includes('company') ? 'company' : 'team',
          },
        });
      }
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Look up invitation by token in database
    // Check TeamMember for team invitations
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        invitationToken: token,
        status: 'pending',
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (teamMember) {
      // Check if expired
      if (teamMember.invitationExpiresAt && new Date() > teamMember.invitationExpiresAt) {
        return NextResponse.json(
          { error: 'This invitation has expired' },
          { status: 410 }
        );
      }

      // Get inviter info
      let inviterName = 'Team Member';
      if (teamMember.invitedBy) {
        const inviter = await prisma.user.findUnique({
          where: { id: teamMember.invitedBy },
          select: { firstName: true, lastName: true, email: true },
        });
        inviterName = inviter ? `${inviter.firstName || ''} ${inviter.lastName || ''}`.trim() || inviter.email || 'Team Member' : 'Team Member';
      }

      return NextResponse.json({
        success: true,
        invitation: {
          id: teamMember.id,
          teamId: teamMember.teamId,
          teamName: teamMember.team.name,
          inviterName,
          inviteeEmail: teamMember.user?.email,
          role: teamMember.isLead ? 'leader' : teamMember.isAdmin ? 'admin' : 'member',
          expiresAt: teamMember.invitationExpiresAt?.toISOString(),
          status: teamMember.status,
          type: 'team',
        },
      });
    }

    // Check CompanyUser for company invitations
    const companyUser = await prisma.companyUser.findFirst({
      where: {
        invitationToken: token,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (companyUser) {
      // Check if expired
      if (companyUser.invitationExpiresAt && new Date() > companyUser.invitationExpiresAt) {
        return NextResponse.json(
          { error: 'This invitation has expired' },
          { status: 410 }
        );
      }

      // Get inviter info
      let inviterName = 'Company Admin';
      if (companyUser.invitedBy) {
        const inviter = await prisma.user.findUnique({
          where: { id: companyUser.invitedBy },
          select: { firstName: true, lastName: true, email: true },
        });
        inviterName = inviter ? `${inviter.firstName || ''} ${inviter.lastName || ''}`.trim() || inviter.email || 'Company Admin' : 'Company Admin';
      }

      return NextResponse.json({
        success: true,
        invitation: {
          id: companyUser.id,
          companyId: companyUser.companyId,
          teamName: companyUser.company.name, // Using teamName for consistency
          inviterName,
          inviteeEmail: companyUser.user?.email,
          role: companyUser.role,
          expiresAt: companyUser.invitationExpiresAt?.toISOString(),
          status: 'pending',
          type: 'company',
        },
      });
    }

    return NextResponse.json(
      { error: 'Invitation not found or already used' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitation details' },
      { status: 500 }
    );
  }
}

// POST /api/invites/[token] - Accept or decline invitation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { token } = await params;
    const body = await request.json();
    const { action } = body;

    if (!action || !['accept', 'decline'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be accept or decline' },
        { status: 400 }
      );
    }

    // Handle demo invitations
    if (token.startsWith('demo-')) {
      console.log(`[Demo] ${action}ing invitation ${token}`);
      return NextResponse.json({
        success: true,
        message: `Invitation ${action}ed successfully (demo mode)`,
        redirectTo: action === 'accept' ? '/app/dashboard' : '/app/dashboard',
      });
    }

    // User must be logged in to accept/decline
    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: 'Authentication required',
          requiresAuth: true,
          redirectTo: `/auth/signin?callbackUrl=/invites/${token}`,
        },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    // Check TeamMember invitations
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        invitationToken: token,
        status: 'pending',
      },
      include: {
        team: true,
      },
    });

    if (teamMember) {
      if (teamMember.invitationExpiresAt && new Date() > teamMember.invitationExpiresAt) {
        return NextResponse.json(
          { error: 'This invitation has expired' },
          { status: 410 }
        );
      }

      if (action === 'accept') {
        // Update team member to active
        await prisma.teamMember.update({
          where: { id: teamMember.id },
          data: {
            status: 'active',
            userId: userId,
            joinedAt: new Date(),
            invitationToken: null, // Clear token after use
          },
        });

        return NextResponse.json({
          success: true,
          message: `You've joined ${teamMember.team.name}!`,
          redirectTo: `/app/teams/${teamMember.teamId}`,
        });
      } else {
        // Decline - delete the pending member record
        await prisma.teamMember.delete({
          where: { id: teamMember.id },
        });

        return NextResponse.json({
          success: true,
          message: 'Invitation declined',
          redirectTo: '/app/dashboard',
        });
      }
    }

    // Check CompanyUser invitations
    const companyUser = await prisma.companyUser.findFirst({
      where: {
        invitationToken: token,
      },
    });

    if (companyUser) {
      if (companyUser.invitationExpiresAt && new Date() > companyUser.invitationExpiresAt) {
        return NextResponse.json(
          { error: 'This invitation has expired' },
          { status: 410 }
        );
      }

      if (action === 'accept') {
        // Update company user
        await prisma.companyUser.update({
          where: { id: companyUser.id },
          data: {
            userId: userId,
            invitationToken: null,
          },
        });

        // Update user type to company
        await prisma.user.update({
          where: { id: userId },
          data: { userType: 'company' },
        });

        return NextResponse.json({
          success: true,
          message: 'You\'ve joined the company!',
          redirectTo: '/app/company',
        });
      } else {
        await prisma.companyUser.delete({
          where: { id: companyUser.id },
        });

        return NextResponse.json({
          success: true,
          message: 'Invitation declined',
          redirectTo: '/app/dashboard',
        });
      }
    }

    return NextResponse.json(
      { error: 'Invitation not found or already used' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error processing invitation:', error);
    return NextResponse.json(
      { error: 'Failed to process invitation' },
      { status: 500 }
    );
  }
}
