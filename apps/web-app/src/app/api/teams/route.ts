import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// In-memory storage for demo (in production, use database)
let teams: any[] = [
  {
    id: 'team_demo_001',
    name: 'TechFlow Data Science Team',
    description: 'Elite data science team with proven track record in fintech analytics and machine learning solutions.',
    size: 4,
    yearsWorking: 3.5,
    cohesionScore: 94,
    successfulProjects: 23,
    clientSatisfaction: 96,
    openToLiftout: true,
    createdBy: '1', // demo user
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    members: [
      {
        id: 'member_1',
        name: 'Alex Chen',
        role: 'Team Lead & Senior Data Scientist',
        experience: 8,
        skills: ['Machine Learning', 'Python', 'SQL', 'Team Leadership', 'Financial Modeling']
      },
      {
        id: 'member_2', 
        name: 'Sarah Kim',
        role: 'Senior ML Engineer',
        experience: 6,
        skills: ['Deep Learning', 'Python', 'TensorFlow', 'Model Deployment']
      },
      {
        id: 'member_3',
        name: 'Michael Rodriguez',
        role: 'Data Engineer',
        experience: 5,
        skills: ['SQL', 'Apache Spark', 'Data Pipelines', 'AWS']
      },
      {
        id: 'member_4',
        name: 'Emily Zhang',
        role: 'Business Analyst',
        experience: 4,
        skills: ['Business Intelligence', 'Analytics', 'Tableau', 'SQL']
      }
    ],
    achievements: [
      'Led team that reduced fraud detection false positives by 35%',
      'Built predictive models generating $2.1M annual savings',
      'Mentored 12+ junior data scientists across 3 years'
    ],
    industry: 'Financial Services',
    location: 'San Francisco, CA',
    availability: 'Open to strategic opportunities',
    compensation: {
      range: '$180k-$280k',
      equity: true,
      benefits: 'Full package'
    }
  }
];

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

  try {
    const body = await request.json();
    const { name, description, members, industry, location, compensation } = body;
    
    // Enhanced validation
    if (!name || name.trim().length < 5) {
      return NextResponse.json({ 
        error: 'Team name must be at least 5 characters' 
      }, { status: 400 });
    }

    if (!description || description.trim().length < 50) {
      return NextResponse.json({ 
        error: 'Team description must be at least 50 characters' 
      }, { status: 400 });
    }

    if (!members || !Array.isArray(members) || members.length < 2) {
      return NextResponse.json({ 
        error: 'Team must have at least 2 members' 
      }, { status: 400 });
    }

    if (!industry || !location) {
      return NextResponse.json({ 
        error: 'Industry and location are required' 
      }, { status: 400 });
    }

    // Validate members
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      if (!member.name || member.name.trim().length < 2) {
        return NextResponse.json({ 
          error: `Member ${i + 1} name is required (minimum 2 characters)` 
        }, { status: 400 });
      }
      if (!member.role || member.role.trim().length < 2) {
        return NextResponse.json({ 
          error: `Member ${i + 1} role is required (minimum 2 characters)` 
        }, { status: 400 });
      }
      if (typeof member.experience !== 'number' || member.experience < 0 || member.experience > 50) {
        return NextResponse.json({ 
          error: `Member ${i + 1} experience must be between 0 and 50 years` 
        }, { status: 400 });
      }
      if (!member.skills || !Array.isArray(member.skills) || member.skills.length === 0) {
        return NextResponse.json({ 
          error: `Member ${i + 1} must have at least one skill` 
        }, { status: 400 });
      }
    }

    // Validate compensation
    if (!compensation || !compensation.range) {
      return NextResponse.json({ 
        error: 'Compensation range is required' 
      }, { status: 400 });
    }

    // Calculate team metrics
    const avgExperience = members.reduce((sum, member) => sum + member.experience, 0) / members.length;
    const totalSkills = [...new Set(members.flatMap(member => member.skills))].length;
    
    // Calculate initial cohesion score based on team composition
    const experienceVariance = members.reduce((sum, member) => 
      sum + Math.pow(member.experience - avgExperience, 2), 0) / members.length;
    const experienceConsistency = Math.max(0, 100 - (experienceVariance * 2));
    const skillDiversity = Math.min(100, totalSkills * 5);
    const initialCohesionScore = Math.round((experienceConsistency + skillDiversity) / 2);

    // Add unique IDs to members
    const membersWithIds = members.map((member, index) => ({
      ...member,
      id: `member_${Date.now()}_${index}`,
      name: member.name.trim(),
      role: member.role.trim(),
      skills: member.skills.map((skill: string) => skill.trim()).filter((skill: string) => skill.length > 0)
    }));

    const newTeam = {
      id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      description: description.trim(),
      size: members.length,
      yearsWorking: 0,
      cohesionScore: initialCohesionScore,
      successfulProjects: 0,
      clientSatisfaction: 0,
      openToLiftout: true,
      createdBy: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: membersWithIds,
      achievements: [],
      industry: industry.trim(),
      location: location.trim(),
      availability: 'Open to strategic opportunities',
      compensation: {
        range: compensation.range.trim(),
        equity: Boolean(compensation.equity),
        benefits: compensation.benefits ? compensation.benefits.trim() : 'Standard'
      }
    };

    teams.push(newTeam);
    
    return NextResponse.json({ 
      team: newTeam,
      message: 'Team profile created successfully' 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Team creation error:', error);
    return NextResponse.json({ 
      error: 'Invalid request data' 
    }, { status: 400 });
  }
}