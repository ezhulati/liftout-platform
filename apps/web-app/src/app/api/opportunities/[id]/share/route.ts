import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Generate shareable link for an opportunity
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { recipients, message, method } = body; // method: 'email', 'link', 'team'

    // Get opportunity details
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        company: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    if (opportunity.status !== 'active') {
      return NextResponse.json(
        { error: 'Cannot share inactive opportunities' },
        { status: 400 }
      );
    }

    // Generate share link
    const baseUrl = process.env.NEXTAUTH_URL || 'https://liftout.com';
    const shareUrl = `${baseUrl}/app/opportunities/${id}`;

    // If sharing via email to recipients
    if (method === 'email' && recipients?.length > 0) {
      // In a real implementation, this would send emails
      // For now, we'll just log and return success
      console.log(`[Share] Opportunity ${id} shared via email to:`, recipients);

      return NextResponse.json({
        success: true,
        method: 'email',
        shareUrl,
        recipientCount: recipients.length,
        message: `Opportunity shared with ${recipients.length} recipient(s)`,
      });
    }

    // If sharing with team members
    if (method === 'team') {
      // Get user's teams
      const userTeams = await prisma.teamMember.findMany({
        where: {
          userId: session.user.id,
          status: 'active',
        },
        select: {
          team: {
            select: {
              id: true,
              name: true,
              members: {
                where: { status: 'active' },
                select: { userId: true },
              },
            },
          },
        },
      });

      // In a real implementation, this would create notifications for team members
      const teamMemberCount = userTeams.reduce(
        (count, t) => count + t.team.members.length,
        0
      );

      return NextResponse.json({
        success: true,
        method: 'team',
        shareUrl,
        teamCount: userTeams.length,
        memberCount: teamMemberCount,
        message: `Opportunity shared with ${userTeams.length} team(s)`,
      });
    }

    // Default: just return the share link
    return NextResponse.json({
      success: true,
      method: 'link',
      shareUrl,
      shareData: {
        title: `${opportunity.title} at ${opportunity.company.name}`,
        text: message || `Check out this opportunity: ${opportunity.title} at ${opportunity.company.name}`,
        url: shareUrl,
      },
    });
  } catch (error) {
    console.error('Share opportunity error:', error);
    return NextResponse.json(
      { error: 'Failed to share opportunity' },
      { status: 500 }
    );
  }
}

// GET - Get share info for an opportunity
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;

    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        company: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
      },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'https://liftout.com';
    const shareUrl = `${baseUrl}/app/opportunities/${id}`;

    return NextResponse.json({
      shareable: opportunity.status === 'active',
      shareUrl,
      title: `${opportunity.title} at ${opportunity.company.name}`,
      company: opportunity.company.name,
      logoUrl: opportunity.company.logoUrl,
    });
  } catch (error) {
    console.error('Get share info error:', error);
    return NextResponse.json(
      { error: 'Failed to get share info' },
      { status: 500 }
    );
  }
}
