import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { TeamsList } from '@/components/teams/TeamsList';

export default async function TeamsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return null;
  }

  const isCompanyUser = session.user.userType === 'company';

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">
            {isCompanyUser ? 'Browse Teams' : 'My Team Profile'}
          </h1>
          <p className="page-subtitle">
            {isCompanyUser 
              ? 'Discover high-performing teams available for liftout opportunities'
              : 'Manage your team profile and explore new liftout opportunities'
            }
          </p>
        </div>
        {!isCompanyUser && (
          <Link
            href="/app/teams/create"
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Update Profile
          </Link>
        )}
      </div>

      {/* Teams list */}
      <TeamsList userType={session.user.userType} />
    </div>
  );
}