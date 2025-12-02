'use client';

import { DocumentShare } from '@/components/documents/DocumentShare';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

interface DocumentSharePageProps {
  params: {
    id: string;
  };
}

export default function DocumentSharePage({ params }: DocumentSharePageProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <Link
          href="/app/documents"
          className="inline-flex items-center text-sm font-medium text-text-tertiary hover:text-text-secondary mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Documents
        </Link>
        <h1 className="page-title">Share Document</h1>
        <p className="page-subtitle">
          Configure access controls and sharing settings for secure document distribution
        </p>
      </div>

      {/* Share Form */}
      <div className="flex justify-center">
        <DocumentShare documentId={params.id} />
      </div>
    </div>
  );
}