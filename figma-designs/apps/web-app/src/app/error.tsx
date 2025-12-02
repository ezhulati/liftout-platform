'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-surface flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-error mb-6" />
        <h1 className="text-2xl font-bold text-text-primary mb-4">
          Something went wrong
        </h1>
        <p className="text-text-secondary mb-8">
          We apologize for the inconvenience. Please try again or contact support if the problem persists.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="btn-primary min-h-12"
          >
            Try again
          </button>
          <Link href="/" className="btn-outline min-h-12">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
