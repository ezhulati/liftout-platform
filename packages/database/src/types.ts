import type { 
  User, 
  Team, 
  Company, 
  Opportunity, 
  TeamApplication,
  ExpressionOfInterest,
  Conversation,
  Message,
  Notification,
  TeamMember,
  CompanyUser,
  IndividualProfile,
  ConversationParticipant
} from '@prisma/client';

// Extended types with relations
export interface UserWithProfile extends User {
  profile?: IndividualProfile | null;
  teamMemberships?: TeamMemberWithTeam[];
  companyMemberships?: CompanyUserWithCompany[];
}

export interface TeamWithMembers extends Team {
  members: TeamMemberWithUser[];
  applications?: TeamApplicationWithOpportunity[];
}

export interface CompanyWithUsers extends Company {
  users: CompanyUserWithUser[];
  opportunities?: OpportunityWithApplications[];
}

export interface OpportunityWithDetails extends Opportunity {
  company: Company;
  applications: TeamApplicationWithTeam[];
}

export interface TeamMemberWithUser extends TeamMember {
  user: User;
}

export interface TeamMemberWithTeam extends TeamMember {
  team: Team;
}

export interface CompanyUserWithUser extends CompanyUser {
  user: User;
}

export interface CompanyUserWithCompany extends CompanyUser {
  company: Company;
}

export interface TeamApplicationWithTeam extends TeamApplication {
  team: TeamWithMembers;
}

export interface TeamApplicationWithOpportunity extends TeamApplication {
  opportunity: OpportunityWithDetails;
}

export interface OpportunityWithApplications extends Opportunity {
  applications: TeamApplicationWithTeam[];
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
  participants: ConversationParticipantWithUser[];
}

export interface ConversationParticipantWithUser extends ConversationParticipant {
  user: User;
}

export interface MessageWithSender extends Message {
  sender?: User | null;
}

// Search result types
export interface TeamSearchResult {
  id: string;
  name: string;
  description?: string | null;
  industry?: string | null;
  size: number;
  location?: string | null;
  availabilityStatus: string;
  skills: string[];
  matchScore?: number;
}

export interface OpportunitySearchResult {
  id: string;
  title: string;
  description: string;
  company: {
    id: string;
    name: string;
    logo?: string | null;
  };
  location?: string | null;
  compensationMin?: number | null;
  compensationMax?: number | null;
  requiredSkills: string[];
  matchScore?: number;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Matching algorithm types
export interface MatchingFactors {
  skillCompatibility: number;
  locationMatch: number;
  experienceLevel: number;
  culturalFit: number;
  compensationAlignment: number;
  availabilityMatch: number;
}

export interface TeamOpportunityMatch {
  teamId: string;
  opportunityId: string;
  score: number;
  factors: MatchingFactors;
  recommendations: string[];
}

// Analytics types
export interface UserAnalytics {
  profileViews: number;
  applications: number;
  connections: number;
  responseRate: number;
}

export interface TeamAnalytics extends UserAnalytics {
  teamId: string;
  matchQuality: number;
  applicationSuccessRate: number;
}

export interface CompanyAnalytics {
  companyId: string;
  opportunitiesPosted: number;
  applicationsReceived: number;
  hiresCompleted: number;
  averageTimeToHire: number;
}

// Subscription and billing types
export interface SubscriptionUsage {
  connectionsUsed: number;
  connectionsLimit: number;
  opportunitiesPosted: number;
  opportunitiesLimit: number;
  teamsCreated: number;
  teamsLimit: number;
}

export interface SubscriptionLimits {
  connections: number;
  opportunities: number;
  teams: number;
  advancedSearch: boolean;
  analytics: boolean;
  prioritySupport: boolean;
}

// File upload types
export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

// Notification types
export interface NotificationData {
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// Search filter types
export interface SearchFilters {
  industry?: string[];
  location?: string;
  remotePolicy?: string[];
  teamSize?: {
    min?: number;
    max?: number;
  };
  compensation?: {
    min?: number;
    max?: number;
  };
  skills?: string[];
  availability?: string[];
  companySize?: string[];
}

// Export Prisma types
export type {
  User,
  Team,
  Company,
  Opportunity,
  TeamApplication,
  ExpressionOfInterest,
  Conversation,
  Message,
  Notification,
  TeamMember,
  CompanyUser,
  UserSkill,
  Skill,
  Subscription,
  Transaction,
  ProfileView,
  SavedItem,
  IndividualProfile,
  ConversationParticipant
} from '@prisma/client';