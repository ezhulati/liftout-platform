import { NextAuthOptions } from 'next-auth';
// import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';
// import { prisma } from '@liftout/database';
// import bcrypt from 'bcryptjs';

// Mock prisma for demo
const prisma = null as any;

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

      // Mock user for demo purposes
      if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
        return {
          id: '1',
          email: 'demo@example.com',
          name: 'Alex Chen',
          firstName: 'Alex',
          lastName: 'Chen',
          userType: 'individual',
          emailVerified: new Date(),
          image: null,
        };
      }

      if (credentials.email === 'company@example.com' && credentials.password === 'demo123') {
        return {
          id: '2',
          email: 'company@example.com',
          name: 'Sarah Rodriguez',
          firstName: 'Sarah',
          lastName: 'Rodriguez',
          userType: 'company',
          emailVerified: new Date(),
          image: null,
        };
      }

      return null;
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
  // adapter: PrismaAdapter(prisma), // Commented out for demo
  providers,
  secret: process.env.NEXTAUTH_SECRET || 'secure-production-secret-key-for-liftout-platform-2024',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Enable debug mode in production to help diagnose issues
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.userType = user.userType;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.emailVerified = user.emailVerified;
      }

      // Handle OAuth providers (commented out for demo)
      // if (account?.provider === 'google' || account?.provider === 'linkedin') {
      //   // Update user info from OAuth provider
      //   if (user?.email) {
      //     const dbUser = await prisma.user.findUnique({
      //       where: { email: user.email },
      //     });
      //     if (dbUser) {
      //       token.userType = dbUser.userType;
      //       token.firstName = dbUser.firstName;
      //       token.lastName = dbUser.lastName;
      //     }
      //   }
      // }

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
      return session;
    },
    async signIn({ user, account, profile }) {
      // OAuth sign-ins commented out for demo
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Handle production domain
      const prodBaseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://liftout.netlify.app' 
        : baseUrl;
      
      // Prevent infinite redirects on error pages
      if (url.includes('/auth/error') || url.includes('/api/auth/error')) {
        return url;
      }
      
      // Redirect to dashboard after successful login
      if (url.includes('/auth/signin') || url === baseUrl || url === prodBaseUrl) {
        return `${prodBaseUrl}/app/dashboard`;
      }
      
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${prodBaseUrl}${url}`;
      
      // Allows callback URLs on the same origin
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
  // events: {
  //   async signIn({ user, account, isNewUser }) {
  //     // Update last active timestamp
  //     if (user.email) {
  //       await prisma.user.update({
  //         where: { email: user.email },
  //         data: { lastActive: new Date() },
  //       });
  //     }
  //   },
  // },
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
  }

  interface User {
    firstName: string;
    lastName: string;
    userType: string;
    emailVerified: Date | null;
  }
}