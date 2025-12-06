import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { EditTeamForm } from '@/components/teams/EditTeamForm';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface EditTeamPageProps {
  params: {
    id: string;
  };
}

export default async function EditTeamPage({ params }: EditTeamPageProps) {
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
        <h1 className="text-2xl font-bold text-text-primary">Edit team</h1>
        <p className="text-text-secondary mt-1">Update team details.</p>
      </div>

      {/* Edit team form */}
      <div className="max-w-4xl">
        <EditTeamForm teamId={params.id} />
      </div>
    </div>
  );
}