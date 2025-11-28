import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@liftout/database';
import { logger } from '../utils/logger';
import { ValidationError, AuthenticationError } from '../middleware/errorHandler';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from '@liftout/email';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  userType: z.enum(['individual', 'company'], {
    errorMap: () => ({ message: 'User type must be individual or company' }),
  }),
  agreesToTerms: z.boolean().refine(val => val === true, {
    message: 'Must agree to terms and conditions',
  }),
  invitationToken: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Helper functions
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

const getUserResponse = (user: any) => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  userType: user.userType,
  emailVerified: user.emailVerified,
  profileCompleted: user.profileCompleted,
  createdAt: user.createdAt,
});

// Generate a secure random token
const generateSecureToken = () => crypto.randomBytes(32).toString('hex');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const validatedData = registerSchema.parse(req.body);
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });
  
  if (existingUser) {
    throw new ValidationError('User with this email already exists');
  }
  
  // Hash password
  const passwordHash = await bcrypt.hash(validatedData.password, 12);

  // Generate verification token
  const verificationToken = generateSecureToken();
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Create user
  const user = await prisma.user.create({
    data: {
      email: validatedData.email,
      passwordHash,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      userType: validatedData.userType,
      verificationToken,
      verificationTokenExpires,
    },
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);

  // Send verification email (don't await to not block response)
  sendVerificationEmail({
    to: user.email,
    firstName: user.firstName,
    verificationToken,
  }).then(result => {
    if (result.success) {
      logger.info(`Verification email sent to: ${user.email}`);
    } else {
      logger.error(`Failed to send verification email to ${user.email}: ${result.error}`);
    }
  });

  // Send welcome email
  sendWelcomeEmail({
    to: user.email,
    firstName: user.firstName,
    userType: user.userType as 'individual' | 'company',
  }).then(result => {
    if (result.success) {
      logger.info(`Welcome email sent to: ${user.email}`);
    } else {
      logger.error(`Failed to send welcome email to ${user.email}: ${result.error}`);
    }
  });

  logger.info(`User registered: ${user.email}`);

  res.status(201).json({
    success: true,
    data: {
      user: getUserResponse(user),
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      verificationEmailSent: true,
    },
    message: 'Registration successful. Please check your email to verify your account.',
  });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const validatedData = loginSchema.parse(req.body);
  
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });
  
  if (!user || !user.passwordHash) {
    throw new AuthenticationError('Invalid email or password');
  }
  
  // Verify password
  const isValidPassword = await bcrypt.compare(validatedData.password, user.passwordHash);
  
  if (!isValidPassword) {
    throw new AuthenticationError('Invalid email or password');
  }
  
  // Update last active
  await prisma.user.update({
    where: { id: user.id },
    data: { lastActive: new Date() },
  });
  
  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);
  
  logger.info(`User logged in: ${user.email}`);
  
  res.json({
    success: true,
    data: {
      user: getUserResponse(user),
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    },
    message: 'Login successful',
  });
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    throw new AuthenticationError('Refresh token is required');
  }
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    
    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    
    if (!user) {
      throw new AuthenticationError('User not found');
    }
    
    // Generate new tokens
    const tokens = generateTokens(user.id);
    
    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      },
    });
  } catch (error) {
    throw new AuthenticationError('Invalid refresh token');
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  // In a production app, you might want to blacklist the token
  // For now, we'll just return success
  res.json({
    success: true,
    message: 'Logout successful',
  });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const validatedData = forgotPasswordSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });

  if (user) {
    // Generate reset token
    const resetToken = generateSecureToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    });

    // Send password reset email
    sendPasswordResetEmail({
      to: user.email,
      firstName: user.firstName,
      resetToken,
    }).then(result => {
      if (result.success) {
        logger.info(`Password reset email sent to: ${user.email}`);
      } else {
        logger.error(`Failed to send password reset email to ${user.email}: ${result.error}`);
      }
    });

    logger.info(`Password reset requested for: ${user.email}`);
  }

  // Always return success to prevent email enumeration
  res.json({
    success: true,
    message: 'If an account with that email exists, we have sent a password reset link.',
  });
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const validatedData = resetPasswordSchema.parse(req.body);

  // Find user with matching reset token
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: validatedData.token,
      passwordResetExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new AuthenticationError('Invalid or expired reset token');
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(validatedData.password, 12);

  // Update user password and clear reset token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  logger.info(`Password reset completed for user: ${user.id}`);

  res.json({
    success: true,
    message: 'Password reset successful. You can now log in with your new password.',
  });
});

// GET /api/auth/verify-email/:token
router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;

  // Find user with matching verification token
  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
      verificationTokenExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new AuthenticationError('Invalid or expired verification token');
  }

  // Update user email verification status and clear token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    },
  });

  logger.info(`Email verified for user: ${user.id}`);

  res.json({
    success: true,
    message: 'Email verification successful. Your account is now verified.',
  });
});

// POST /api/auth/resend-verification
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ValidationError('Email is required');
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user && !user.emailVerified) {
    // Generate new verification token
    const verificationToken = generateSecureToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpires,
      },
    });

    // Send verification email
    sendVerificationEmail({
      to: user.email,
      firstName: user.firstName,
      verificationToken,
    }).then(result => {
      if (result.success) {
        logger.info(`Verification email resent to: ${user.email}`);
      } else {
        logger.error(`Failed to resend verification email to ${user.email}: ${result.error}`);
      }
    });
  }

  // Always return success to prevent email enumeration
  res.json({
    success: true,
    message: 'If your email is registered and not yet verified, we have sent a new verification link.',
  });
});

export default router;