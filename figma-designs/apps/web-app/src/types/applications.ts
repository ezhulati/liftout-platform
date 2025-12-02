export interface Application {
  id: string;
  opportunityId: string;
  teamId: string;
  applicantUserId: string;
  status: 'pending' | 'under_review' | 'interview_scheduled' | 'accepted' | 'rejected' | 'withdrawn';
  submittedAt: Date;
  updatedAt: Date;
  
  // Application content
  coverLetter: string;
  teamMotivation: string;
  availabilityTimeline: string;
  compensationExpectations?: {
    min: number;
    max: number;
    currency: string;
    negotiable: boolean;
  };
  
  // Documents and attachments
  documents: ApplicationDocument[];
  
  // Communication history
  messages?: ApplicationMessage[];
  
  // Company response
  companyNotes?: string;
  interviewDetails?: {
    scheduledDate: Date;
    format: 'video' | 'in_person' | 'phone';
    participants: string[];
    notes?: string;
  };
  
  // Metadata
  viewedByCompany: boolean;
  viewedAt?: Date;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: 'portfolio' | 'resume' | 'case_study' | 'reference' | 'other';
  url: string;
  uploadedAt: Date;
  size: number;
  mimeType: string;
}

export interface ApplicationMessage {
  id: string;
  senderId: string;
  senderType: 'team' | 'company';
  content: string;
  sentAt: Date;
  read: boolean;
}

export interface CreateApplicationData {
  opportunityId: string;
  teamId: string;
  coverLetter: string;
  teamMotivation: string;
  availabilityTimeline: string;
  compensationExpectations?: {
    min: number;
    max: number;
    currency: string;
    negotiable: boolean;
  };
  documents?: File[];
}

export interface ApplicationFilters {
  status?: Application['status'];
  opportunityId?: string;
  teamId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ApplicationStats {
  total: number;
  pending: number;
  underReview: number;
  interviewScheduled: number;
  accepted: number;
  rejected: number;
}