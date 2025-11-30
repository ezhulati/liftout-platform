import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// POST /api/gdpr/delete - Request account deletion
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { confirmText } = body;

    // Verify confirmation text
    if (confirmText !== 'DELETE') {
      return NextResponse.json(
        { error: 'Invalid confirmation' },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Start deletion process in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Delete user's notifications
      await tx.notification.deleteMany({
        where: { userId }
      });

      // 2. Delete user's saved items
      await tx.savedItem.deleteMany({
        where: { userId }
      });

      // 3. Delete user's profile views (as viewer)
      await tx.profileView.deleteMany({
        where: { viewerId: userId }
      });

      // 4. Anonymize profile views (where user was viewed)
      await tx.profileView.updateMany({
        where: { viewedId: userId },
        data: { viewerId: null }
      });

      // 5. Delete user's skills
      await tx.userSkill.deleteMany({
        where: { userId }
      });

      // 6. Anonymize messages (don't delete, just anonymize sender)
      await tx.message.updateMany({
        where: { senderId: userId },
        data: {
          content: '[Message from deleted user]',
          senderId: userId // Keep for reference but content is anonymized
        }
      });

      // 7. Remove from conversation participants
      await tx.conversationParticipant.deleteMany({
        where: { userId }
      });

      // 8. Delete expressions of interest
      await tx.expressionOfInterest.deleteMany({
        where: { fromId: userId }
      });

      // 9. Update applications - anonymize but keep for company records
      await tx.teamApplication.updateMany({
        where: { appliedBy: userId },
        data: {
          status: 'rejected', // Mark as rejected/cancelled
          coverLetter: '[Application from deleted user]',
          customProposal: null,
          teamFitExplanation: null,
          questionsForCompany: null,
        }
      });

      // 10. Remove user from teams
      await tx.teamMember.deleteMany({
        where: { userId }
      });

      // 11. Delete user's subscriptions
      await tx.subscription.deleteMany({
        where: { userId }
      });

      // 12. Delete user's individual profile
      await tx.individualProfile.deleteMany({
        where: { userId }
      });

      // 13. If user is a company user, handle company associations
      await tx.companyUser.deleteMany({
        where: { userId }
      });

      // 14. Handle impersonation sessions
      await tx.impersonationSession.deleteMany({
        where: {
          OR: [
            { adminId: userId },
            { targetUserId: userId }
          ]
        }
      });

      // 15. Finally, delete or anonymize the user record
      // Option 1: Hard delete (fully GDPR compliant)
      // await tx.user.delete({ where: { id: userId } });

      // Option 2: Soft delete with anonymization (keeps record for auditing)
      // First, delete or anonymize the individual profile if exists
      await tx.individualProfile.updateMany({
        where: { userId },
        data: {
          title: null,
          location: null,
          bio: null,
          linkedinUrl: null,
          githubUrl: null,
          portfolioUrl: null,
          profilePhotoUrl: null,
          resumeUrl: null,
          currentEmployer: null,
          currentTitle: null,
          skillsSummary: null,
          achievements: null,
        }
      });

      // Then update the user record
      await tx.user.update({
        where: { id: userId },
        data: {
          email: `deleted-${userId}@deleted.liftout.io`,
          firstName: 'Deleted',
          lastName: 'User',
          passwordHash: null, // Clear password hash
          deletedAt: new Date(),
          // Clear sensitive data
          twoFactorSecret: null,
          twoFactorEnabled: false,
          backupCodes: Prisma.JsonNull,
          verificationToken: null,
          passwordResetToken: null,
        }
      });
    });

    // Log the deletion for compliance
    console.log(`User account deleted: ${userId} at ${new Date().toISOString()}`);

    // TODO: Send confirmation email to user's original email
    // This would require storing the email temporarily before deletion

    return NextResponse.json({
      success: true,
      message: 'Account deletion initiated. Your data will be removed within 30 days.',
      deletedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}

// GET /api/gdpr/delete - Check deletion status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        deletedAt: true,
        email: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if account is deleted (email starts with 'deleted-')
    const isDeleted = user.email.startsWith('deleted-') || user.deletedAt !== null;

    return NextResponse.json({
      deletedAt: user.deletedAt,
      isDeleted,
    });
  } catch (error) {
    console.error('Error checking deletion status:', error);
    return NextResponse.json(
      { error: 'Failed to check deletion status' },
      { status: 500 }
    );
  }
}
