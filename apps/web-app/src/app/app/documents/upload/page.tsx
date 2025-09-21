'use client';

import { DocumentUpload } from '@/components/documents/DocumentUpload';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

export default function DocumentUploadPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Documents
        </Link>
        <h1 className="page-title">Upload Document</h1>
        <p className="page-subtitle">
          Share documents securely for liftout discussions and due diligence
        </p>
      </div>

      {/* Upload Form */}
      <DocumentUpload />
    </div>
  );
}