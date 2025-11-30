// Flexible timestamp type for PostgreSQL compatibility
export type FlexibleTimestamp = Date | string;

// Base types
export interface BaseDocument {
  id: string;
  createdAt: FlexibleTimestamp;
  updatedAt: FlexibleTimestamp;
}

// User types
export interface User extends BaseDocument {
  email: string;
  name: string;
  type: 'individual' | 'company';
  photoURL?: string;
  phone?: string;
  location?: string;
  industry?: string;
  companyName?: string;
  position?: string;
  verified: boolean;
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: FlexibleTimestamp;
  preferences: {
    notifications: boolean;
    marketing: boolean;
    confidentialMode: boolean;
  };
  profileData?: any; // Extended profile data for individual/company specific fields
}

// Team types
export interface Team extends BaseDocument {
  name: string;
  description: string;
  industry: string;
  size: number;
  location: string;
  leaderId: string;
  memberIds: string[];
  skills: string[];
  experience: {
    yearsWorkedTogether: number;
    previousLiftouts: number;
    successfulProjects: number;
    totalRevenue?: number;
  };
  availability: {
    status: 'available' | 'selective' | 'not_available';
    timeframe?: string;
    preferredNoticeTime?: number; // weeks
  };
  compensation: {
    currentRange: {
      min: number;
      max: number;
      currency: string;
    };
    expectations: {
      min: number;
      max: number;
      currency: string;
    };
    type: 'salary' | 'equity' | 'total_package';
  };
  visibility: 'public' | 'selective' | 'confidential';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  profileViews: number;
  expressionsOfInterest: number;
  tags: string[];
}

// Team Member types
export interface TeamMember extends BaseDocument {
  teamId: string;
  userId: string;
  role: string;
  experience: number; // years
  skills: string[];
  education?: string;
  previousCompanies?: string[];
  joinedTeamAt: FlexibleTimestamp;
  isLead: boolean;
  status: 'active' | 'inactive';
}

// Opportunity types
export interface Opportunity extends BaseDocument {
  title: string;
  description: string;
  companyId: string;
  companyName: string;
  industry: string;
  location: string;
  type: 'expansion' | 'capability_building' | 'market_entry' | 'acquisition';
  teamSize: {
    min: number;
    max: number;
  };
  skills: string[];
  experience: {
    minYears: number;
    preferredYears: number;
  };
  compensation: {
    min: number;
    max: number;
    currency: string;
    type: 'salary' | 'equity' | 'total_package';
    benefits?: string[];
  };
  timeline: {
    startDate?: FlexibleTimestamp;
    urgency: 'immediate' | 'within_month' | 'within_quarter' | 'flexible';
  };
  requirements: {
    mustHave: string[];
    niceToHave: string[];
    culturalFit: string[];
  };
  confidential: boolean;
  status: 'draft' | 'active' | 'paused' | 'closed' | 'filled';
  applicantCount: number;
  viewCount: number;
  tags: string[];
}

// Application types
export interface Application extends BaseDocument {
  opportunityId: string;
  teamId: string;
  companyId: string;
  status: 'applied' | 'reviewing' | 'interview' | 'negotiation' | 'accepted' | 'rejected' | 'withdrawn';
  coverLetter?: string;
  proposedTerms?: {
    compensation: number;
    startDate: FlexibleTimestamp;
    conditions: string[];
  };
  timeline: {
    appliedAt: FlexibleTimestamp;
    lastUpdatedAt: FlexibleTimestamp;
    interviewScheduledAt?: FlexibleTimestamp;
    decisionDeadline?: FlexibleTimestamp;
  };
  documents: {
    resumeUrl?: string;
    portfolioUrl?: string;
    referencesUrl?: string;
  };
  notes: string;
}

// Message types
export interface Conversation extends BaseDocument {
  participants: string[]; // user IDs
  type: 'team_company' | 'team_team' | 'support';
  relatedTo?: {
    type: 'opportunity' | 'application' | 'team';
    id: string;
  };
  lastMessage?: {
    content: string;
    senderId: string;
    timestamp: FlexibleTimestamp;
  };
  status: 'active' | 'archived' | 'blocked';
  metadata: {
    subject?: string;
    tags?: string[];
  };
}

export interface Message extends BaseDocument {
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
  readBy: {
    userId: string;
    readAt: FlexibleTimestamp;
  }[];
  edited: boolean;
  editedAt?: FlexibleTimestamp;
}

// Due Diligence types
export interface DueDiligenceCase extends BaseDocument {
  teamId: string;
  companyId: string;
  opportunityId: string;
  status: 'initiated' | 'in_progress' | 'completed' | 'failed';
  checklist: {
    item: string;
    status: 'pending' | 'completed' | 'failed';
    completedAt?: FlexibleTimestamp;
    notes?: string;
    assignedTo?: string;
  }[];
  references: {
    contactName: string;
    contactEmail: string;
    relationship: string;
    status: 'pending' | 'contacted' | 'completed';
    feedback?: string;
    rating?: number;
  }[];
  documents: {
    name: string;
    url: string;
    type: string;
    uploadedAt: FlexibleTimestamp;
    uploadedBy: string;
  }[];
  timeline: {
    startDate: FlexibleTimestamp;
    expectedEndDate: FlexibleTimestamp;
    actualEndDate?: FlexibleTimestamp;
  };
  findings: {
    summary: string;
    risks: string[];
    recommendations: string[];
    rating: number; // 1-10
  };
}

// Analytics types
export interface Analytics extends BaseDocument {
  entityType: 'team' | 'company' | 'platform';
  entityId: string;
  period: {
    startDate: FlexibleTimestamp;
    endDate: FlexibleTimestamp;
    type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  };
  metrics: {
    [key: string]: number | string | boolean;
  };
  insights: string[];
  recommendations: string[];
}

// Notification types
export interface Notification extends BaseDocument {
  userId: string;
  type: 'application' | 'message' | 'opportunity' | 'system' | 'reminder';
  title: string;
  content: string;
  relatedTo?: {
    type: 'opportunity' | 'application' | 'team' | 'conversation';
    id: string;
  };
  status: 'unread' | 'read';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  expiresAt?: FlexibleTimestamp;
}

// Company Profile types
export interface CompanyProfile extends BaseDocument {
  userId: string; // company user ID
  name: string;
  description: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  location: string;
  website?: string;
  founded?: number;
  culture: {
    values: string[];
    workStyle: string[];
    benefits: string[];
  };
  verification: {
    status: 'pending' | 'verified' | 'rejected';
    documents: string[];
    verifiedAt?: FlexibleTimestamp;
  };
  stats: {
    successfulLiftouts: number;
    activeOpportunities: number;
    averageRating: number;
    totalHires: number;
  };
  preferences: {
    teamSizes: number[];
    industries: string[];
    locations: string[];
    budgetRange: {
      min: number;
      max: number;
      currency: string;
    };
  };
}

// Market Intelligence types
export interface MarketData extends BaseDocument {
  industry: string;
  location: string;
  period: {
    startDate: FlexibleTimestamp;
    endDate: FlexibleTimestamp;
  };
  metrics: {
    demandScore: number;
    supplyScore: number;
    competitionLevel: number;
    averageCompensation: number;
    timeToHire: number;
    successRate: number;
  };
  trends: {
    name: string;
    direction: 'up' | 'down' | 'stable';
    impact: 'high' | 'medium' | 'low';
    description: string;
  }[];
  competitors: {
    name: string;
    activeLiftouts: number;
    successRate: number;
    averageCompensation: number;
  }[];
}

// Create Opportunity Data type for creating new opportunities
export interface CreateOpportunityData {
  title: string;
  description: string;
  companyId: string;
  companyName: string;
  industry: string;
  location: string;
  type: 'expansion' | 'capability_building' | 'market_entry' | 'acquisition';
  teamSize: {
    min: number;
    max: number;
  };
  skills: string[];
  experience: {
    minYears: number;
    preferredYears: number;
  };
  compensation: {
    min: number;
    max: number;
    currency: string;
    type: 'salary' | 'equity' | 'total_package';
    benefits?: string[];
  };
  timeline: {
    startDate?: FlexibleTimestamp;
    urgency: 'immediate' | 'within_month' | 'within_quarter' | 'flexible';
  };
  requirements: {
    mustHave: string[];
    niceToHave: string[];
    dealBreakers: string[];
  };
  confidential: boolean;
  status: 'draft' | 'active' | 'paused' | 'closed' | 'filled';
  tags: string[];
}

// Opportunity Filters for searching
export interface OpportunityFilters {
  companyId?: string;
  industry?: string[];
  location?: string[];
  type?: ('expansion' | 'capability_building' | 'market_entry' | 'acquisition')[];
  teamSize?: {
    min?: number;
    max?: number;
  };
  compensation?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  urgency?: ('immediate' | 'within_month' | 'within_quarter' | 'flexible')[];
  skills?: string[];
  status?: ('draft' | 'active' | 'paused' | 'closed' | 'filled')[];
  confidential?: boolean;
  limit?: number;
}

// Collection names as constants
export const COLLECTIONS = {
  USERS: 'users',
  TEAMS: 'teams',
  TEAM_MEMBERS: 'teamMembers',
  OPPORTUNITIES: 'opportunities',
  APPLICATIONS: 'applications',
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
  DUE_DILIGENCE: 'dueDiligence',
  ANALYTICS: 'analytics',
  NOTIFICATIONS: 'notifications',
  COMPANY_PROFILES: 'companyProfiles',
  MARKET_DATA: 'marketData',
} as const;