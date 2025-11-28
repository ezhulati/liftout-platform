import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getTeamById, updateTeam, deleteTeam } from '../_data';

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

  const teamId = params.id;

  try {
    // Get existing team
    const existingTeam = getTeamById(teamId);

    if (!existingTeam) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Check ownership - only team owner can update
    if (existingTeam.createdBy !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden - only team owner can update' }, { status: 403 });
    }

    const body = await request.json();

    // Update team
    const updatedTeam = updateTeam(teamId, {
      name: body.name || existingTeam.name,
      description: body.description || existingTeam.description,
      members: body.members || existingTeam.members,
      size: body.members?.length || existingTeam.size,
      achievements: body.achievements || existingTeam.achievements,
      industry: body.industry || existingTeam.industry,
      location: body.location || existingTeam.location,
      availability: body.availability || existingTeam.availability,
      compensation: body.compensation || existingTeam.compensation,
      openToLiftout: body.openToLiftout ?? existingTeam.openToLiftout,
    });

    if (!updatedTeam) {
      return NextResponse.json({ error: 'Failed to update team' }, { status: 500 });
    }

    return NextResponse.json({ team: updatedTeam });
  } catch (error) {
    console.error('Error updating team:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const teamId = params.id;

  try {
    // Get existing team
    const existingTeam = getTeamById(teamId);

    if (!existingTeam) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Check ownership - only team owner can delete
    if (existingTeam.createdBy !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden - only team owner can delete' }, { status: 403 });
    }

    // Delete team
    const deleted = deleteTeam(teamId);

    if (!deleted) {
      return NextResponse.json({ error: 'Failed to delete team' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
