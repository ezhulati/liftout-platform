import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { teams, addTeam, type Team } from './_data';
import {
  isVerifiedCompanyUser,
  isCompanyBlocked,
  anonymizeTeamData,
  getVisibilitySettings,
  type TeamData,
} from '@/lib/visibility';

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

  // Determine visibility access based on user type and company verification
  const isCompanyUser = session.user.userType === 'company';
  let canViewAnonymous = false;
  let viewerCompanyId: string | undefined;

  if (isCompanyUser) {
    const verification = await isVerifiedCompanyUser(session.user.id);
    canViewAnonymous = verification.isVerified;
    viewerCompanyId = verification.companyId;
  }

  // Determine which visibility modes to include
  const visibilityFilter: ('public' | 'anonymous')[] = canViewAnonymous
    ? ['public', 'anonymous']
    : ['public'];

  // Fetch real teams from database
  let dbTeams: Team[] = [];
  try {
    const realTeams = await prisma.team.findMany({
      where: {
        visibility: { in: visibilityFilter },
        availabilityStatus: 'available',
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profile: {
                  select: {
                    title: true,
                    yearsExperience: true,
                    profilePhotoUrl: true,
                  },
                },
              },
            },
          },
        },
      },
      take: 50,
    });

    // Filter out teams that have blocked the viewer's company
    const teamsToProcess = viewerCompanyId
      ? realTeams.filter(team => !isCompanyBlocked(team, viewerCompanyId))
      : realTeams;

    dbTeams = teamsToProcess.map(team => {
      // Build base team data
      let teamData: any = {
        id: team.id,
        name: team.name,
        description: team.description || '',
        size: team.size || team.members.length,
        yearsWorking: Number(team.yearsWorkingTogether) || 0,
        cohesionScore: 85, // Default score
        successfulProjects: 0,
        clientSatisfaction: 90,
        openToLiftout: team.availabilityStatus === 'available',
        createdBy: team.createdBy,
        createdAt: team.createdAt.toISOString(),
        updatedAt: team.updatedAt.toISOString(),
        visibility: team.visibility,
        isAnonymous: team.isAnonymous,
        members: team.members.map(m => ({
          id: m.id,
          userId: m.userId,
          name: `${m.user.firstName} ${m.user.lastName}`.trim() || 'Team Member',
          role: m.role || 'Member',
          experience: m.user.profile?.yearsExperience || 0,
          skills: [],
          title: m.user.profile?.title || undefined,
          avatar: m.user.profile?.profilePhotoUrl || null,
          yearsExperience: m.user.profile?.yearsExperience || 0,
          isLead: false,
        })),
        achievements: [],
        industry: team.industry || '',
        location: team.location || '',
        availability: 'Open to strategic opportunities',
        compensation: { range: '', equity: false, benefits: '' },
      };

      // Apply anonymization for anonymous teams when viewing as company
      if (team.visibility === 'anonymous' || team.isAnonymous) {
        teamData = anonymizeTeamData(teamData as TeamData);
      }

      return teamData;
    });
  } catch (error) {
    console.error('Error fetching teams from database:', error);
  }

  // Merge database teams with demo teams (demo teams first for discovery)
  let filteredTeams = [...teams, ...dbTeams.filter(dt => !teams.find(t => t.id === dt.id))];
  
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

  // Demo users can create real teams (marked as demo)
  const isDemo = isDemoUser(session.user.email);

  try {
    const body = await request.json();
    const {
      name,
      description,
      industry,
      location,
      yearsWorkingTogether,
      size,
      visibility = 'public',
      isAnonymous = false,
      hideCurrentEmployer = false,
      allowDiscovery = true,
    } = body;

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

    // Validate visibility
    if (!['public', 'private', 'anonymous'].includes(visibility)) {
      return NextResponse.json({
        error: 'Invalid visibility. Must be public, private, or anonymous'
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
        visibility: visibility,
        isAnonymous: isAnonymous || visibility === 'anonymous',
        isDemo: isDemo,
        metadata: {
          visibilitySettings: {
            hideCurrentEmployer,
            allowDiscovery,
          },
        },
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