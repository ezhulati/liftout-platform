'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { ExclamationTriangleIcon, ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  const getErrorMessage = (error: string | null | undefined) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      case 'Default':
      default:
        return 'An error occurred during authentication. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg py-12 px-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center">
            <span className="text-gold font-heading font-bold text-xl">L</span>
          </div>
          <span className="font-heading font-bold text-2xl text-navy tracking-tight">Liftout</span>
        </Link>

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-error-light mb-6">
            <ExclamationTriangleIcon className="h-7 w-7 text-error" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-3">
            Authentication Error
          </h2>
          <p className="text-text-secondary mb-8">
            {getErrorMessage(error)}
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/auth/signin"
            className="btn-primary w-full min-h-12 flex items-center justify-center gap-2"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Try again
          </Link>

          <Link
            href="/"
            className="btn-outline w-full min-h-12 flex items-center justify-center gap-2"
          >
            <HomeIcon className="w-5 h-5" />
            Go home
          </Link>
        </div>

        {error && (
          <p className="mt-6 text-sm text-text-tertiary text-center">
            Error code: {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="loading-spinner" />
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
