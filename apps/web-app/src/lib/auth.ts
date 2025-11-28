import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'liftout-dev-jwt-secret-key-2024';

// Build providers array conditionally based on available environment variables
const providers: any[] = [
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      try {
        // Look up user in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            profile: true,
            companyMemberships: {
              include: { company: true },
            },
          },
          // Select 2FA fields for admin users
        });

        if (!user) {
          console.log('User not found:', credentials.email);
          return null;
        }

        // Check password (for seeded demo users, password is hashed)
        const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash || '');

        if (!isValidPassword) {
          console.log('Invalid password for:', credentials.email);
          return null;
        }

        // Generate an access token for the API server
        const accessToken = jwt.sign(
          { userId: user.id, email: user.email, userType: user.userType },
          JWT_SECRET,
          { expiresIn: '30d' }
        );

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          emailVerified: user.emailVerified ? new Date() : null,
          image: user.profile?.profilePhotoUrl || null,
          accessToken,
          // 2FA fields for admin users
          twoFactorEnabled: user.twoFactorEnabled,
          // twoFactorVerified is set to false initially - gets updated after 2FA verification
          twoFactorVerified: false,
        };
      } catch (error) {
        console.error('Auth error:', error);
        return null;
      }
    },
  }),
];

// Add Google provider only if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    })
  );
}

// Add LinkedIn provider only if credentials are available
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  providers.push(
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'r_liteprofile r_emailaddress',
        },
      },
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET || 'secure-production-secret-key-for-liftout-platform-2024',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.userType = user.userType;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.emailVerified = user.emailVerified;
        token.accessToken = user.accessToken;
        // 2FA fields for admin users
        token.twoFactorEnabled = user.twoFactorEnabled;
        token.twoFactorVerified = user.twoFactorVerified;
      }
      // Handle session updates (for 2FA verification)
      if (trigger === 'update' && session) {
        if (session.twoFactorVerified !== undefined) {
          token.twoFactorVerified = session.twoFactorVerified;
        }
        if (session.twoFactorEnabled !== undefined) {
          token.twoFactorEnabled = session.twoFactorEnabled;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.userType = token.userType as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.emailVerified = token.emailVerified as Date | null;
      }
      // Add accessToken to session for API calls
      (session as any).accessToken = token.accessToken;
      return session;
    },
    async signIn({ user }) {
      return !!user;
    },
    async redirect({ url, baseUrl }) {
      const prodBaseUrl = process.env.NODE_ENV === 'production'
        ? 'https://liftout.netlify.app'
        : baseUrl;

      // Handle error pages
      if (url.includes('/auth/error') || url.includes('/api/auth/error')) {
        return url;
      }

      // Allow onboarding redirects (for new signups including OAuth)
      if (url.includes('/app/onboarding')) {
        if (url.startsWith('/')) return `${prodBaseUrl}${url}`;
        return url;
      }

      // Default signin redirect goes to dashboard (returning users)
      if (url.includes('/auth/signin') || url === baseUrl || url === prodBaseUrl) {
        return `${prodBaseUrl}/app/dashboard`;
      }

      // Handle relative paths
      if (url.startsWith('/')) return `${prodBaseUrl}${url}`;

      // Handle same-origin URLs
      try {
        const urlObj = new URL(url);
        const baseUrlObj = new URL(prodBaseUrl);
        if (urlObj.origin === baseUrlObj.origin) return url;
      } catch (e) {
        // Invalid URL, return base
      }

      return prodBaseUrl;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  events: {
    async signIn({ user }) {
      // Update last active timestamp
      if (user?.id) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { lastActive: new Date() },
          });
        } catch (error) {
          console.error('Failed to update lastActive:', error);
        }
      }
    },
  },
};

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      firstName: string;
      lastName: string;
      userType: string;
      emailVerified: Date | null;
      image?: string | null;
    };
    accessToken?: string;
  }

  interface User {
    firstName: string;
    lastName: string;
    userType: string;
    emailVerified: Date | null;
    accessToken?: string;
    twoFactorEnabled?: boolean;
    twoFactorVerified?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    userType?: string;
    firstName?: string;
    lastName?: string;
    emailVerified?: Date | null;
    twoFactorEnabled?: boolean;
    twoFactorVerified?: boolean;
  }
}
