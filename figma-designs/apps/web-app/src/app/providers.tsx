'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { SocketProvider } from '@/contexts/SocketContext';
import { LiveRegionProvider } from '@/components/ui';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SettingsProvider>
            <OnboardingProvider>
              <SocketProvider>
              <LiveRegionProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                    ariaProps: {
                      role: 'status',
                      'aria-live': 'polite',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                    ariaProps: {
                      role: 'alert',
                      'aria-live': 'assertive',
                    },
                  },
                }}
              />
              {/* <ReactQueryDevtools initialIsOpen={false} /> */}
              </LiveRegionProvider>
              </SocketProvider>
            </OnboardingProvider>
          </SettingsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}