// Shared team data for demo purposes
// In production, this would be replaced with database queries

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  experience: number;
  skills: string[];
}

export interface Team {
  id: string;
  name: string;
  description: string;
  size: number;
  yearsWorking: number;
  cohesionScore: number;
  successfulProjects: number;
  clientSatisfaction: number;
  openToLiftout: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members: TeamMember[];
  achievements: string[];
  industry: string;
  location: string;
  availability: string;
  compensation: {
    range: string;
    equity: boolean;
    benefits: string;
  };
}

// In-memory storage for demo (in production, use database)
export const teams: Team[] = [
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

export function getTeamById(id: string): Team | undefined {
  return teams.find(team => team.id === id);
}

export function getAllTeams(): Team[] {
  return [...teams];
}

export function addTeam(team: Team): void {
  teams.push(team);
}

export function updateTeam(id: string, updates: Partial<Team>): Team | undefined {
  const index = teams.findIndex(team => team.id === id);
  if (index === -1) {
    return undefined;
  }

  teams[index] = {
    ...teams[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return teams[index];
}

export function deleteTeam(id: string): boolean {
  const index = teams.findIndex(team => team.id === id);
  if (index === -1) {
    return false;
  }

  teams.splice(index, 1);
  return true;
}
