import { NextResponse } from 'next/server';
import { withAdminAccess } from '@/lib/admin-middleware';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const GET = withAdminAccess(async () => {
  try {
    const [pendingFlags, pendingTeamVerifications, pendingCompanyVerifications] = await Promise.all([
      prisma.moderationFlag.count({ where: { status: 'pending' } }),
      prisma.team.count({ where: { verificationStatus: 'pending' } }),
      prisma.company.count({ where: { verificationStatus: 'pending' } }),
    ]);

    const count = pendingFlags + pendingTeamVerifications + pendingCompanyVerifications;

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Pending count error:', error);
    return NextResponse.json({ count: 0 });
  }
});
