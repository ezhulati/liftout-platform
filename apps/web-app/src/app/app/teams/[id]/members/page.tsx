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
      <div>
        <Link
          href={`/app/teams/${params.id}`}
          className="inline-flex items-center text-sm font-medium text-text-tertiary hover:text-text-secondary mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Team Profile
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">Team members</h1>
        <p className="text-text-secondary mt-1">Manage team membership.</p>
      </div>

      {/* Team member management component */}
      <TeamMemberManagement teamId={params.id} />
    </div>
  );
}