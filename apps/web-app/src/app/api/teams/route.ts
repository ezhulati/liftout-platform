import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { teams, addTeam, type Team } from './_data';

// Demo user detection helper
const isDemoUser = (email: string | null | undefined): boolean => {
  return email === 'demo@example.com' || email === 'company@example.com';
};

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get query parameters
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const industry = searchParams.get('industry');
  const location = searchParams.get('location');
  const minSize = searchParams.get('minSize');
  const maxSize = searchParams.get('maxSize');
  const availability = searchParams.get('availability');
  const minExperience = searchParams.get('minExperience');
  const skills = searchParams.get('skills')?.split(',').filter(Boolean) || [];
  const minCohesion = searchParams.get('minCohesion');
  
  let filteredTeams = [...teams];
  
  // Filter for teams open to liftout opportunities (companies should only see available teams)
  if (session.user.userType === 'company') {
    filteredTeams = filteredTeams.filter(team => team.openToLiftout);
  }
  
  // Text search across name, description, skills, and achievements
  if (search && search.trim()) {
    const searchLower = search.toLowerCase().trim();
    filteredTeams = filteredTeams.filter(team => 
      team.name.toLowerCase().includes(searchLower) ||
      team.description.toLowerCase().includes(searchLower) ||
      team.achievements.some((achievement: string) => achievement.toLowerCase().includes(searchLower)) ||
      team.members.some((member: any) => 
        member.name.toLowerCase().includes(searchLower) ||
        member.role.toLowerCase().includes(searchLower) ||
        member.skills.some((skill: string) => skill.toLowerCase().includes(searchLower))
      )
    );
  }
  
  // Industry filter
  if (industry) {
    filteredTeams = filteredTeams.filter(team => 
      team.industry.toLowerCase().includes(industry.toLowerCase())
    );
  }
  
  // Location filter
  if (location) {
    filteredTeams = filteredTeams.filter(team =>
      team.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  // Team size range filter
  if (minSize) {
    const min = parseInt(minSize);
    filteredTeams = filteredTeams.filter(team => team.size >= min);
  }
  
  if (maxSize) {
    const max = parseInt(maxSize);
    filteredTeams = filteredTeams.filter(team => team.size <= max);
  }
  
  // Availability filter
  if (availability === 'available') {
    filteredTeams = filteredTeams.filter(team => team.openToLiftout);
  }
  
  // Minimum experience filter (average team experience)
  if (minExperience) {
    const minExp = parseInt(minExperience);
    filteredTeams = filteredTeams.filter(team => {
      const avgExperience = team.members.reduce((sum: number, member: any) => sum + member.experience, 0) / team.members.length;
      return avgExperience >= minExp;
    });
  }
  
  // Skills filter
  if (skills.length > 0) {
    filteredTeams = filteredTeams.filter(team => {
      const teamSkills = team.members.flatMap((member: any) => member.skills).join(' ').toLowerCase();
      return skills.some(skill => teamSkills.includes(skill.toLowerCase()));
    });
  }
  
  // Minimum cohesion score filter
  if (minCohesion) {
    const minCohesionScore = parseInt(minCohesion);
    filteredTeams = filteredTeams.filter(team => team.cohesionScore >= minCohesionScore);
  }

  return NextResponse.json({ 
    teams: filteredTeams,
    total: filteredTeams.length,
    filters: {
      industries: [...new Set(teams.map(team => team.industry))].sort(),
      locations: [...new Set(teams.map(team => team.location))].sort(),
      sizes: [...new Set(teams.map(team => team.size))].sort((a, b) => a - b)
    }
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Demo user handling - simulate success
  if (isDemoUser(session.user.email)) {
    const body = await request.json();
    const mockTeam = {
      id: `demo-team-${Date.now()}`,
      name: body.name || 'Demo Team',
      description: body.description || 'Demo team description',
      size: body.size || 2,
      yearsWorkingTogether: body.yearsWorkingTogether || 1,
      openToLiftout: true,
      createdBy: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      industry: body.industry || '',
      location: body.location || '',
    };
    console.log('[Demo] Team created:', mockTeam.id);
    return NextResponse.json({ team: mockTeam, message: 'Team profile created successfully' }, { status: 201 });
  }

  try {
    const body = await request.json();
    const { name, description, industry, location, yearsWorkingTogether, size } = body;

    // Validation
    if (!name || name.trim().length < 3) {
      return NextResponse.json({
        error: 'Team name must be at least 3 characters'
      }, { status: 400 });
    }

    if (!description || description.trim().length < 20) {
      return NextResponse.json({
        error: 'Team description must be at least 20 characters'
      }, { status: 400 });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();

    // Create team in database with creator as first member
    const team = await prisma.team.create({
      data: {
        name: name.trim(),
        slug,
        description: description.trim(),
        industry: industry?.trim() || null,
        location: location?.trim() || null,
        yearsWorkingTogether: yearsWorkingTogether || null,
        size: size || 1,
        availabilityStatus: 'available',
        remoteStatus: 'hybrid',
        visibility: 'public',
        // Use creator relation to connect to user
        creator: {
          connect: { id: session.user.id },
        },
        // Add creator as team lead
        members: {
          create: {
            userId: session.user.id,
            role: 'Team Lead',
            isAdmin: true,
            isLead: true,
            status: 'active',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Also add to in-memory for demo browsing
    const memoryTeam = {
      id: team.id,
      name: team.name,
      description: team.description || '',
      size: team.size,
      yearsWorking: Number(team.yearsWorkingTogether) || 0,
      cohesionScore: 75,
      successfulProjects: 0,
      clientSatisfaction: 0,
      openToLiftout: true,
      createdBy: session.user.id,
      createdAt: team.createdAt.toISOString(),
      updatedAt: team.updatedAt.toISOString(),
      members: team.members.map(m => ({
        id: m.id,
        name: `${m.user.firstName} ${m.user.lastName}`,
        role: m.role || 'Member',
        experience: 0,
        skills: [],
      })),
      achievements: [],
      industry: team.industry || '',
      location: team.location || '',
      availability: 'Open to strategic opportunities',
      compensation: { range: '', equity: false, benefits: '' },
    };
    addTeam(memoryTeam as Team);

    return NextResponse.json({
      team: {
        id: team.id,
        name: team.name,
        description: team.description,
        industry: team.industry,
        location: team.location,
        size: team.size,
        yearsWorkingTogether: team.yearsWorkingTogether,
        members: team.members,
      },
      message: 'Team profile created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Team creation error:', error);
    return NextResponse.json({
      error: 'Failed to create team. Please try again.'
    }, { status: 500 });
  }
}