import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import { sendPasswordResetEmail } from '@/lib/email';

// Validation schemas
const requestResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const confirmResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// In-memory token store for demo (in production, use database or Redis)
const resetTokens = new Map<string, { email: string; expires: Date }>();

// POST - Request password reset
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if this is a reset confirmation (has token) or reset request (has email only)
    if (body.token) {
      // This is a password reset confirmation
      const validationResult = confirmResetSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          { error: validationResult.error.errors[0].message },
          { status: 400 }
        );
      }

      const { token, password } = validationResult.data;

      // Validate token
      const tokenData = resetTokens.get(token);
      if (!tokenData) {
        return NextResponse.json(
          { error: 'Invalid or expired reset token' },
          { status: 400 }
        );
      }

      if (new Date() > tokenData.expires) {
        resetTokens.delete(token);
        return NextResponse.json(
          { error: 'Reset token has expired' },
          { status: 400 }
        );
      }

      // Find user and update password
      const user = await prisma.user.findUnique({
        where: { email: tokenData.email },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(password, 12);

      // Update user's password
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      });

      // Remove used token
      resetTokens.delete(token);

      return NextResponse.json({
        success: true,
        message: 'Password has been reset successfully',
      });
    } else {
      // This is a password reset request
      const validationResult = requestResetSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          { error: validationResult.error.errors[0].message },
          { status: 400 }
        );
      }

      const { email } = validationResult.data;

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      // Always return success to prevent email enumeration
      // But only create token if user exists
      if (user) {
        // Generate reset token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Store token
        resetTokens.set(token, { email: email.toLowerCase(), expires });

        // Send password reset email
        const emailResult = await sendPasswordResetEmail({
          to: user.email,
          recipientName: user.firstName || 'there',
          resetToken: token,
        });

        if (!emailResult.success) {
          console.error('Failed to send password reset email:', emailResult.error);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
    }
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}

// GET - Validate reset token
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      );
    }

    const tokenData = resetTokens.get(token);

    if (!tokenData) {
      return NextResponse.json(
        { valid: false, error: 'Invalid reset token' },
        { status: 400 }
      );
    }

    if (new Date() > tokenData.expires) {
      resetTokens.delete(token);
      return NextResponse.json(
        { valid: false, error: 'Reset token has expired' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      email: tokenData.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'), // Mask email
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate token' },
      { status: 500 }
    );
  }
}
