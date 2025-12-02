// Shared team data for demo purposes
// In production, this would be replaced with database queries

export interface TeamMember {
  id: string;
  userId?: string;
  name: string;
  role: string;
  experience: number;
  skills: string[];
  photoUrl?: string;
  title?: string;
  bio?: string;
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
        userId: 'demo-user-alex',
        name: 'Alex Chen',
        role: 'Tech Lead',
        experience: 10,
        skills: ['Machine Learning', 'Python', 'SQL', 'Team Leadership', 'Financial Modeling'],
        photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        title: 'Senior Data Scientist & Team Lead',
        bio: 'Passionate technologist with 10+ years leading high-performing data science and engineering teams.',
      },
      {
        id: 'member_2',
        userId: 'demo-user-sarah',
        name: 'Sarah Martinez',
        role: 'Senior Data Scientist',
        experience: 7,
        skills: ['NLP', 'Deep Learning', 'PyTorch', 'Python', 'Statistical Analysis'],
        photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
        title: 'Senior Data Scientist',
        bio: 'Data scientist with deep expertise in NLP and predictive modeling. Stanford PhD in Statistics.',
      },
      {
        id: 'member_3',
        userId: 'demo-user-marcus',
        name: 'Marcus Johnson',
        role: 'ML Engineer',
        experience: 6,
        skills: ['MLOps', 'Kubernetes', 'AWS', 'TensorFlow', 'Data Engineering'],
        photoUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
        title: 'Machine Learning Engineer',
        bio: 'Full-stack ML engineer focused on taking models from research to production.',
      },
      {
        id: 'member_4',
        userId: 'demo-user-priya',
        name: 'Priya Patel',
        role: 'Data Analyst',
        experience: 4,
        skills: ['SQL', 'Tableau', 'Python', 'Business Intelligence', 'Data Visualization'],
        photoUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
        title: 'Senior Data Analyst',
        bio: 'Data analyst passionate about translating complex data into actionable business insights.',
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
  },
  {
    id: 'team_demo_002',
    name: 'Mobile First Team',
    description: 'Intact mobile development team with proven track record in consumer and enterprise applications across iOS and Android platforms.',
    size: 4,
    yearsWorking: 4,
    cohesionScore: 92,
    successfulProjects: 18,
    clientSatisfaction: 94,
    openToLiftout: true,
    createdBy: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    members: [
      {
        id: 'member_5',
        name: 'David Kim',
        role: 'Mobile Lead',
        experience: 8,
        skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Team Leadership'],
      },
      {
        id: 'member_6',
        name: 'Lisa Thompson',
        role: 'iOS Developer',
        experience: 6,
        skills: ['Swift', 'SwiftUI', 'Objective-C', 'Core Data'],
      },
      {
        id: 'member_7',
        name: 'James Wilson',
        role: 'Android Developer',
        experience: 5,
        skills: ['Kotlin', 'Jetpack Compose', 'Java', 'Firebase'],
      },
      {
        id: 'member_8',
        name: 'Emily Rodriguez',
        role: 'UX Designer',
        experience: 4,
        skills: ['Figma', 'Mobile UX', 'Prototyping', 'User Research'],
      }
    ],
    achievements: [
      'Shipped 3 apps with 1M+ downloads each',
      'Reduced app crash rate by 80%',
      '4.7+ star ratings across all published apps'
    ],
    industry: 'Technology',
    location: 'Austin, TX',
    availability: 'Open to strategic opportunities',
    compensation: {
      range: '$160k-$240k',
      equity: true,
      benefits: 'Full package'
    }
  },
  {
    id: 'team_demo_003',
    name: 'AI Strategy Group',
    description: 'Elite machine learning team that has successfully implemented AI solutions across healthcare, finance, and retail industries.',
    size: 6,
    yearsWorking: 5,
    cohesionScore: 96,
    successfulProjects: 31,
    clientSatisfaction: 98,
    openToLiftout: true,
    createdBy: '3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    members: [
      {
        id: 'member_9',
        name: 'Dr. Michael Chen',
        role: 'AI Research Lead',
        experience: 12,
        skills: ['Deep Learning', 'Computer Vision', 'Research', 'Python', 'PyTorch'],
      },
      {
        id: 'member_10',
        name: 'Jennifer Park',
        role: 'ML Engineer',
        experience: 7,
        skills: ['TensorFlow', 'MLOps', 'AWS SageMaker', 'Kubernetes'],
      },
      {
        id: 'member_11',
        name: 'Robert Taylor',
        role: 'Data Engineer',
        experience: 8,
        skills: ['Spark', 'Airflow', 'Snowflake', 'dbt', 'Python'],
      },
      {
        id: 'member_12',
        name: 'Amanda Foster',
        role: 'NLP Specialist',
        experience: 6,
        skills: ['Transformers', 'BERT', 'LLMs', 'Text Mining', 'Python'],
      },
      {
        id: 'member_13',
        name: 'Kevin Brown',
        role: 'Computer Vision Engineer',
        experience: 5,
        skills: ['OpenCV', 'YOLO', 'Image Processing', 'Edge AI'],
      },
      {
        id: 'member_14',
        name: 'Rachel Green',
        role: 'Product Manager',
        experience: 6,
        skills: ['AI Product Strategy', 'Roadmapping', 'Stakeholder Management'],
      }
    ],
    achievements: [
      'Published 5 papers in top-tier ML conferences',
      'Built AI system processing 10M+ medical images',
      '3 successful liftouts as a team'
    ],
    industry: 'Healthcare Technology',
    location: 'Boston, MA',
    availability: 'Open to strategic opportunities',
    compensation: {
      range: '$200k-$350k',
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
