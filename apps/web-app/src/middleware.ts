import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/error',
  '/api/auth',
];

// Routes only accessible to individual users (team members/leaders)
const individualOnlyRoutes = [
  '/app/teams/create',
  '/app/teams/edit',
  '/app/teams/manage',
  '/app/applications',
];

// Routes only accessible to company users
const companyOnlyRoutes = [
  '/app/opportunities/create',
  '/app/company',
];

// Protected routes that require authentication but are accessible to both user types
const protectedRoutes = [
  '/app/dashboard',
  '/app/profile',
  '/app/onboarding',
  '/app/settings',
  '/app/ai-matching',
  '/app/analytics',
  '/app/discovery',
  '/app/search',
  '/app/matching',
  '/app/market-intelligence',
  '/app/due-diligence',
  '/app/negotiations',
  '/app/integration',
  '/app/legal',
  '/app/messages',
  '/app/documents',
  '/app/culture',
  '/app/teams', // Viewing teams (both types can see)
  '/app/opportunities', // Viewing opportunities (both types can see)
];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname === route || pathname.startsWith(route));
}

function isIndividualOnlyRoute(pathname: string): boolean {
  return individualOnlyRoutes.some(route => pathname.startsWith(route));
}

function isCompanyOnlyRoute(pathname: string): boolean {
  return companyOnlyRoutes.some(route => pathname.startsWith(route));
}

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Allow public routes
    if (isPublicRoute(pathname)) {
      return NextResponse.next();
    }

    // Require authentication for protected routes
    if (!token) {
      const signInUrl = new URL('/auth/signin', req.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Get user type from token
    const userType = token.userType as 'individual' | 'company' | undefined;

    // Check individual-only routes
    if (isIndividualOnlyRoute(pathname)) {
      if (userType !== 'individual') {
        // Redirect company users to their appropriate section
        return NextResponse.redirect(new URL('/app/opportunities', req.url));
      }
    }

    // Check company-only routes
    if (isCompanyOnlyRoute(pathname)) {
      if (userType !== 'company') {
        // Redirect individual users to their appropriate section
        return NextResponse.redirect(new URL('/app/teams', req.url));
      }
    }

    // For protected routes accessible to both types, ensure user has a type set
    // Skip this check for the onboarding page to avoid redirect loop
    if (isProtectedRoute(pathname) && !userType && pathname !== '/app/onboarding') {
      // Redirect to onboarding if user doesn't have a type set
      return NextResponse.redirect(new URL('/app/onboarding', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Always allow public routes
        if (isPublicRoute(pathname)) {
          return true;
        }

        // Require token for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};