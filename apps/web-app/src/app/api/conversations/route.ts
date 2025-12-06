import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canViewTeam, isVerifiedCompanyUser } from '@/lib/visibility';

// GET /api/conversations - List user's conversations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get conversations where user is a participant
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id,
            leftAt: null,
          },
        },
        status: 'active',
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
          },
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    });

    // Transform for frontend - matching Conversation interface
    const transformedConversations = conversations.map((conv) => ({
      id: conv.id,
      teamId: conv.teamId,
      companyId: conv.companyId,
      opportunityId: conv.opportunityId,
      subject: conv.subject || 'New Conversation',
      status: conv.status,
      isAnonymous: conv.isAnonymous,
      lastMessageAt: conv.lastMessageAt?.toISOString(),
      messageCount: conv.messageCount,
      unreadCounts: {}, // Would need to calculate based on lastReadAt
      createdAt: conv.createdAt.toISOString(),
      updatedAt: conv.updatedAt.toISOString(),
      participants: conv.participants.map((p, index) => {
        // Anonymize other participants if conversation is anonymous
        // (current user can see their own name)
        const isCurrentUser = p.userId === session.user.id;
        const shouldAnonymize = conv.isAnonymous && !isCurrentUser;

        return {
          id: p.id,
          userId: shouldAnonymize ? `anonymous-${index}` : p.userId,
          role: p.role,
          joinedAt: p.joinedAt.toISOString(),
          leftAt: p.leftAt?.toISOString() || null,
          lastReadAt: p.lastReadAt?.toISOString() || null,
          user: {
            id: shouldAnonymize ? `anonymous-${index}` : p.user.id,
            firstName: shouldAnonymize ? 'Anonymous' : (p.user.firstName || ''),
            lastName: shouldAnonymize ? `User ${index + 1}` : (p.user.lastName || ''),
          },
        };
      }),
    }));

    // Parse pagination params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    return NextResponse.json({
      data: {
        data: transformedConversations,
        pagination: {
          page,
          limit,
          total: transformedConversations.length,
          pages: Math.ceil(transformedConversations.length / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations', details: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subject, participantIds, opportunityId, teamId, companyId, isAnonymous, acceptNDA } = body;

    // Check if company user is verified before allowing contact with teams
    if (session.user.userType === 'company' && teamId) {
      const companyUser = await prisma.companyUser.findFirst({
        where: { userId: session.user.id },
        include: { company: true },
      });

      if (!companyUser?.company) {
        return NextResponse.json(
          { error: 'Company profile not found. Please complete your company profile first.' },
          { status: 403 }
        );
      }

      if (companyUser.company.verificationStatus !== 'verified') {
        return NextResponse.json(
          {
            error: 'Company verification required',
            message: 'Your company must be verified before contacting teams. Please complete verification in your company profile.',
            verificationStatus: companyUser.company.verificationStatus,
          },
          { status: 403 }
        );
      }

      // Check visibility permissions for the team
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        select: {
          id: true,
          visibility: true,
          isAnonymous: true,
          createdBy: true,
          blockedCompanies: true,
        },
      });

      if (team) {
        const visibilityCheck = await canViewTeam(
          team,
          session.user.id,
          'company'
        );

        if (!visibilityCheck.canView) {
          return NextResponse.json(
            { error: visibilityCheck.reason || 'You cannot contact this team.' },
            { status: 403 }
          );
        }
      }
    }

    // Check if team has anonymous visibility (inherit for the conversation)
    let shouldBeAnonymous = isAnonymous || false;
    let requiresNDA = false;
    if (teamId) {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        select: { visibility: true, isAnonymous: true },
      });
      if (team?.visibility === 'anonymous' || team?.isAnonymous) {
        shouldBeAnonymous = true;
        requiresNDA = true;
      }
    }

    // For anonymous teams, require NDA acceptance
    if (requiresNDA && !acceptNDA) {
      return NextResponse.json(
        {
          error: 'NDA acceptance required',
          message: 'You must accept the confidentiality agreement before contacting anonymous teams.',
          requiresNDA: true,
        },
        { status: 400 }
      );
    }

    // Build NDA acceptance data if required
    const participantRoles = requiresNDA && acceptNDA
      ? {
          ndaAcceptedBy: [session.user.id],
          ndaAcceptedAt: {
            [session.user.id]: new Date().toISOString(),
          },
        }
      : {};

    // Create conversation
    const conversation = await prisma.conversation.create({
      data: {
        subject: subject || 'New Conversation',
        opportunityId,
        teamId,
        companyId,
        isAnonymous: shouldBeAnonymous,
        participantRoles,
        participants: {
          create: [
            { userId: session.user.id, role: 'owner' },
            ...(participantIds || []).map((id: string) => ({
              userId: id,
              role: 'participant',
            })),
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        subject: conversation.subject,
        participants: conversation.participants.map((p) => ({
          id: p.user.id,
          name: `${p.user.firstName || ''} ${p.user.lastName || ''}`.trim() || p.user.email,
          role: p.role,
        })),
        createdAt: conversation.createdAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation', details: String(error) },
      { status: 500 }
    );
  }
}
