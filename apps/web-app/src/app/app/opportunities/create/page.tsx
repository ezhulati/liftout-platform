import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { CreateOpportunityForm } from '@/components/opportunities/CreateOpportunityForm';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { redirect } from 'next/navigation';

export default async function CreateOpportunityPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return null;
  }

  // Only company users can create opportunities
  if (session.user.userType !== 'company') {
    redirect('/app/opportunities');
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <Link
          href="/app/opportunities"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Opportunities
        </Link>
        <h1 className="page-title">Post New Opportunity</h1>
        <p className="page-subtitle">
          Create a detailed opportunity to attract the perfect team for your project
        </p>
      </div>

      {/* Create opportunity form */}
      <div className="max-w-4xl">
        <CreateOpportunityForm />
      </div>
    </div>
  );
}