'use client';

import { DocumentsList } from '@/components/documents/DocumentsList';
import { useSession } from 'next-auth/react';

export default function DocumentsPage() {
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
        <h1 className="page-title">Document Management</h1>
        <p className="page-subtitle">
          Securely share and manage documents for liftout transactions and due diligence
        </p>
      </div>

      {/* Documents List */}
      <DocumentsList />
    </div>
  );
}