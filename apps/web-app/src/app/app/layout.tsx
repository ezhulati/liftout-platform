'use client';

import { AppSidebar } from '@/components/app/AppSidebar';
import { AppHeader } from '@/components/app/AppHeader';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { DEMO_DATA, getDemoDataForUser } from '@/lib/demo-accounts';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Fullscreen routes that don't show sidebar/header
  const isFullscreenRoute = pathname?.startsWith('/app/onboarding');
  const isOnboardingRoute = pathname?.startsWith('/app/onboarding');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // NOTE: Onboarding redirect is handled by OnboardingContext in the onboarding page itself
  // We removed the redirect here to prevent redirect loops between layout and onboarding page

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session?.user) {
    return null;
  }

  // Create userData from session for demo users
  const user = session.user;
  const demoData = getDemoDataForUser(user.email);
  const userData = demoData ? {
    id: user.id,
    email: user.email,
    firstName: user.firstName || user.name?.split(' ')[0] || 'User',
    lastName: user.lastName || user.name?.split(' ')[1] || '',
    type: user.userType as 'individual' | 'company',
    userType: user.userType,
    verified: user.profileCompleted ?? false,
    profileCompleted: user.profileCompleted ?? false,
    status: 'active' as const,
    preferences: {
      notifications: true,
      marketing: false,
      confidentialMode: false,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...demoData.profile,
  } : {
    id: user.id,
    email: user.email,
    name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
    firstName: user.firstName || user.name?.split(' ')[0] || 'User',
    lastName: user.lastName || user.name?.split(' ')[1] || '',
    type: (user.userType || 'individual') as 'individual' | 'company',
    userType: user.userType || 'individual',
    verified: user.profileCompleted ?? false,
    profileCompleted: user.profileCompleted ?? false,
    status: 'active' as const,
    preferences: {
      notifications: true,
      marketing: false,
      confidentialMode: false,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Fullscreen routes render without sidebar/header
  if (isFullscreenRoute) {
    return (
      <div className="min-h-screen bg-bg">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <AppSidebar />
      <div className="lg:pl-64">
        <AppHeader user={userData} />
        <main id="main-content" tabIndex={-1} className="py-6 outline-none relative z-0">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}