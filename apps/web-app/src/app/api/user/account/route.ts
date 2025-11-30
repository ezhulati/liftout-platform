import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  confirmEmail: z.string().email('Valid email is required'),
});

// DELETE - Delete user account
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to delete your account' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = deleteAccountSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { password, confirmEmail } = validationResult.data;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, passwordHash: true },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify email matches
    if (user.email.toLowerCase() !== confirmEmail.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email confirmation does not match' },
        { status: 400 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 400 }
      );
    }

    // Delete user and related data (cascading delete should handle most relations)
    // Note: You may want to soft-delete instead for compliance/audit purposes
    await prisma.$transaction(async (tx) => {
      // Delete user preferences
      await tx.userPreferences.deleteMany({
        where: { userId: session.user.id },
      }).catch(() => {}); // Ignore if doesn't exist

      // Delete profile
      await tx.individualProfile.deleteMany({
        where: { userId: session.user.id },
      }).catch(() => {});

      // Remove from team memberships
      await tx.teamMember.deleteMany({
        where: { userId: session.user.id },
      }).catch(() => {});

      // Remove company memberships
      await tx.companyUser.deleteMany({
        where: { userId: session.user.id },
      }).catch(() => {});

      // Finally delete the user
      await tx.user.delete({
        where: { id: session.user.id },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account. Please try again.' },
      { status: 500 }
    );
  }
}

// PATCH - Update account status (deactivate/reactivate)
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!['active', 'deactivated'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Use suspendedAt field to track deactivation
    // null = active, non-null = deactivated
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        suspendedAt: status === 'deactivated' ? new Date() : null,
        suspendedBy: status === 'deactivated' ? session.user.id : null,
        suspendedReason: status === 'deactivated' ? 'Self-deactivated' : null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: status === 'deactivated'
        ? 'Account deactivated successfully'
        : 'Account reactivated successfully',
    });
  } catch (error) {
    console.error('Account status update error:', error);
    return NextResponse.json(
      { error: 'Failed to update account status' },
      { status: 500 }
    );
  }
}
