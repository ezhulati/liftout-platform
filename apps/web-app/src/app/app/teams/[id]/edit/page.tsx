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
      <div className="page-header">
        <Link
          href={`/app/teams/${params.id}`}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Team Profile
        </Link>
        <h1 className="page-title">Edit Team Profile</h1>
        <p className="page-subtitle">
          Update your team information, members, and liftout preferences
        </p>
      </div>

      {/* Edit team form */}
      <div className="max-w-4xl">
        <EditTeamForm teamId={params.id} />
      </div>
    </div>
  );
}