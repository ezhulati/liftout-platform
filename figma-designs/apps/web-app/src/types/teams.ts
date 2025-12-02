export interface TeamMember {
  id: string;
  userId: string;
  role: 'lead' | 'senior' | 'mid' | 'junior';
  title: string;
  name: string;
  email: string;
  linkedinUrl?: string;
  yearsExperience: number;
  specializations: string[];
  joinedTeamDate: Date;
  previousRoles?: {
    title: string;
    company: string;
    duration: string;
  }[];
  achievements?: string[];
  verified: boolean;
  profileImageUrl?: string;
}

export interface TeamVerification {
  status: 'pending' | 'in_progress' | 'verified' | 'rejected';
  verifiedAt?: Date;
  verifiedBy?: string;
  documents: {
    type: 'employment_verification' | 'performance_review' | 'client_testimonial' | 'project_portfolio' | 'references';
    url: string;
    uploadedAt: Date;
    verified: boolean;
  }[];
  backgroundChecks: {
    memberId: string;
    status: 'pending' | 'clear' | 'flagged';
    completedAt?: Date;
    provider?: string;
  }[];
  references: {
    name: string;
    title: string;
    company: string;
    email: string;
    phone?: string;
    relationship: 'former_manager' | 'client' | 'peer' | 'direct_report';
    contactedAt?: Date;
    responseStatus: 'pending' | 'positive' | 'neutral' | 'negative' | 'no_response';
    notes?: string;
  }[];
}

export interface TeamPerformanceMetrics {
  projectsCompleted: number;
  successRate: number; // percentage
  averageProjectValue: number;
  clientRetentionRate: number;
  timeToDelivery: number; // average days
  qualityScore: number; // 1-10 scale
  clientSatisfactionScore: number; // 1-10 scale
  revenueGenerated: number;
  costEfficiency: number;
  innovationIndex: number; // 1-10 scale
}

export interface TeamDynamics {
  yearsWorkingTogether: number;
  cohesionScore: number; // 1-10 scale
  communicationStyle: 'formal' | 'informal' | 'mixed';
  decisionMakingStyle: 'consensus' | 'hierarchical' | 'collaborative';
  workingTimeZones: string[];
  preferredWorkArrangement: 'remote' | 'hybrid' | 'in_person' | 'flexible';
  conflictResolutionHistory: 'excellent' | 'good' | 'average' | 'needs_improvement';
  leadershipStructure: 'single_leader' | 'co_leaders' | 'rotating' | 'distributed';
  cultureAlignment: string[];
}

export interface LiftoutHistory {
  previousLiftouts: {
    fromCompany: string;
    toCompany: string;
    date: Date;
    duration: string; // how long they stayed
    successRating: number; // 1-10
    reasonForLeaving?: string;
    compensation: {
      individual: boolean;
      amount?: number;
      currency: string;
    };
  }[];
  liftoutReadiness: 'immediate' | 'within_3_months' | 'within_6_months' | 'not_ready';
  noticePeriod: string;
  nonCompeteRestrictions?: {
    hasRestrictions: boolean;
    industries?: string[];
    geographic?: string[];
    duration?: string;
    details?: string;
  };
}

export interface CompensationExpectations {
  type: 'individual' | 'collective';
  structure: 'salary_only' | 'salary_plus_equity' | 'total_package';
  currency: string;
  ranges: {
    memberId: string;
    minSalary: number;
    maxSalary: number;
    equityExpectation?: number; // percentage
    bonusExpectation?: number;
    benefits?: string[];
  }[];
  totalTeamValue: {
    min: number;
    max: number;
  };
  negotiable: boolean;
  additionalRequirements?: string[];
}

export interface TeamProfile {
  id: string;
  name: string;
  description: string;
  industry: string[];
  specializations: string[];
  size: number;
  location: {
    primary: string;
    secondary?: string[];
    remote: boolean;
  };
  
  // Team composition
  members: TeamMember[];
  leaderId: string;
  
  // Performance and track record
  establishedDate: Date;
  performanceMetrics: TeamPerformanceMetrics;
  portfolioItems: {
    title: string;
    description: string;
    client?: string;
    value?: number;
    duration: string;
    outcomes: string[];
    technologies?: string[];
    imageUrl?: string;
  }[];
  
  // Team dynamics and culture
  dynamics: TeamDynamics;
  values: string[];
  workingMethodology: string[];
  
  // Verification and credibility
  verification: TeamVerification;
  testimonials: {
    id: string;
    clientName: string;
    clientTitle: string;
    clientCompany: string;
    content: string;
    rating: number;
    date: Date;
    verified: boolean;
  }[];
  
  // Liftout specific
  liftoutHistory: LiftoutHistory;
  availability: {
    status: 'available' | 'selective' | 'not_available';
    timeline: string;
    preferences: {
      industryPreferences: string[];
      companySize: 'startup' | 'scale_up' | 'enterprise' | 'any';
      geographicPreferences: string[];
      roleType: 'permanent' | 'contract' | 'either';
    };
  };
  
  // Financial
  compensationExpectations: CompensationExpectations;
  
  // Visibility and matching
  visibility: 'public' | 'selective' | 'private';
  tags: string[];
  featured: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  viewCount: number;
  expressionsOfInterest: number;
  activeOpportunities: number;
}

export interface CreateTeamData {
  name: string;
  description: string;
  industry: string[];
  specializations: string[];
  members: Omit<TeamMember, 'id' | 'verified'>[];
  dynamics: Partial<TeamDynamics>;
  values: string[];
  workingMethodology: string[];
  portfolioItems: TeamProfile['portfolioItems'];
  availability: TeamProfile['availability'];
  compensationExpectations: CompensationExpectations;
  visibility: TeamProfile['visibility'];
}

export interface TeamFilters {
  industry?: string[];
  specializations?: string[];
  location?: string;
  remote?: boolean;
  teamSize?: {
    min: number;
    max: number;
  };
  experience?: {
    min: number;
    max: number;
  };
  availability?: TeamProfile['availability']['status'];
  verified?: boolean;
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  liftoutReadiness?: LiftoutHistory['liftoutReadiness'];
}

export interface TeamSearchResult {
  teams: TeamProfile[];
  total: number;
  filters: {
    industries: { value: string; count: number }[];
    specializations: { value: string; count: number }[];
    locations: { value: string; count: number }[];
    experienceLevels: { value: string; count: number }[];
  };
}