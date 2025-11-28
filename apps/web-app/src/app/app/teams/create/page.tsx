import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { CreateTeamForm } from '@/components/teams/CreateTeamForm';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default async function CreateTeamPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <Link
          href="/app/teams"
          className="inline-flex items-center text-sm font-medium text-text-tertiary hover:text-text-secondary mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Teams
        </Link>
        <h1 className="page-title">Create New Team</h1>
        <p className="page-subtitle">
          Build your dream team and start collaborating on amazing projects
        </p>
      </div>

      {/* Create team form */}
      <div className="max-w-2xl">
        <CreateTeamForm />
      </div>
    </div>
  );
}