'use client';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [pendingActionsCount, setPendingActionsCount] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    // Check if user is an admin
    if (status === 'authenticated' && session?.user?.userType !== 'admin') {
      router.push('/');
      return;
    }
  }, [status, session, router]);

  // Fetch pending actions count
  useEffect(() => {
    async function fetchPendingCount() {
      try {
        const response = await fetch('/api/admin/moderation/pending-count');
        if (response.ok) {
          const data = await response.json();
          setPendingActionsCount(data.count || 0);
        }
      } catch (error) {
        // Silently fail - this is just for the badge
      }
    }

    if (status === 'authenticated' && session?.user?.userType === 'admin') {
      fetchPendingCount();
      // Refresh every 30 seconds
      const interval = setInterval(fetchPendingCount, 30000);
      return () => clearInterval(interval);
    }
  }, [status, session]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          <p className="text-gray-400 text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated or non-admin - show nothing while redirecting
  if (status === 'unauthenticated' || session?.user?.userType !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          <p className="text-gray-400 text-sm">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader pendingActionsCount={pendingActionsCount} />
        <main id="main-content" tabIndex={-1} className="py-6 outline-none">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
