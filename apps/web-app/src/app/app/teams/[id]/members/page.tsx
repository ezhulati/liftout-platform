import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { TeamMemberManagement } from '@/components/teams/TeamMemberManagement';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface TeamMembersPageProps {
  params: {
    id: string;
  };
}

export default async function TeamMembersPage({ params }: TeamMembersPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <Link
          href={`/app/teams/${params.id}`}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Team Profile
        </Link>
        <h1 className="page-title">Team Member Management</h1>
        <p className="page-subtitle">
          Manage your team members, send invitations, and track member performance
        </p>
      </div>

      {/* Team member management component */}
      <TeamMemberManagement teamId={params.id} />
    </div>
  );
}