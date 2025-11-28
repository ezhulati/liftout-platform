import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getTeamById } from '../_data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const teamId = params.id;

  try {
    const team = getTeamById(teamId);

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Company users can view all teams that are open to liftout
    // Individual users can only view their own teams
    const isCompanyUser = session.user.userType === 'company';
    const isTeamOwner = team.createdBy === session.user.id;

    if (!isCompanyUser && !isTeamOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Company users can only see teams open to liftout (unless it's their own)
    if (isCompanyUser && !team.openToLiftout && !isTeamOwner) {
      return NextResponse.json({ error: 'Team not available' }, { status: 403 });
    }

    return NextResponse.json({ team });
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // For the demo version, return not implemented
  // In a full implementation, this would update the database/data store
  return NextResponse.json({ 
    error: 'Team updates are temporarily disabled in this demo. Use the main team creation flow for now.' 
  }, { status: 501 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // For the demo version, return not implemented
  // In a full implementation, this would delete from the database/data store
  return NextResponse.json({ 
    error: 'Team deletion is temporarily disabled in this demo. Use the main team management interface.' 
  }, { status: 501 });
}