import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
    // Fetch from the main teams endpoint
    const teamsResponse = await fetch(`${request.nextUrl.origin}/api/teams`, {
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    });
    
    if (!teamsResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
    }
    
    const { teams } = await teamsResponse.json();
    const team = teams.find((t: any) => t.id === teamId);
    
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }
    
    // Check if user has permission to view this team
    if (session.user.userType === 'individual' && team.createdBy !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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