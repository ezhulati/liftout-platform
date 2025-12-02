'use client';

import { DocumentViewer } from '@/components/documents/DocumentViewer';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

interface DocumentViewPageProps {
  params: {
    id: string;
  };
}

export default function DocumentViewPage({ params }: DocumentViewPageProps) {
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
        <h1 className="page-title">Document Details</h1>
        <p className="page-subtitle">
          View document information and access controls
        </p>
      </div>

      {/* Document Viewer */}
      <DocumentViewer documentId={params.id} />
    </div>
  );
}