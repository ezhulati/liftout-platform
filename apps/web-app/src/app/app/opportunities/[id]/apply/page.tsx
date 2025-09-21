import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
// import { CreateApplicationForm } from '@/components/applications/CreateApplicationForm';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { redirect } from 'next/navigation';

interface ApplyToOpportunityPageProps {
  params: {
    id: string;
  };
}

export default async function ApplyToOpportunityPage({ params }: ApplyToOpportunityPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return null;
  }

  // Only team users can apply to opportunities
  if (session.user.userType !== 'individual') {
    redirect('/app/opportunities');
  }

  // In a real app, we'd fetch the opportunity details here
  // For demo purposes, we'll use mock data
  const opportunityTitle = 'Strategic FinTech Analytics Team';
  const companyName = 'Goldman Sachs Technology';

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <Link
          href={`/app/opportunities/${params.id}`}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Opportunity
        </Link>
        <h1 className="page-title">Apply for Liftout Opportunity</h1>
        <p className="page-subtitle">
          Submit your team's expression of interest for this strategic liftout opportunity
        </p>
      </div>

      {/* Application form */}
      <div className="max-w-4xl">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Application Form</h3>
          <p className="text-gray-500">Application form is being developed. Please check back soon.</p>
          <div className="mt-6">
            <Link href="/app/opportunities" className="btn-primary">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Opportunities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}