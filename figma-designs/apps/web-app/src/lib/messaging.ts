export interface SecureMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'company_rep' | 'team_lead' | 'team_member' | 'legal_counsel' | 'platform_admin';
  recipientIds: string[];
  
  // Message content
  content: string;
  subject?: string;
  messageType: 'text' | 'document' | 'system_notification' | 'meeting_invite' | 'contract_update';
  
  // Security and privacy
  encryptionLevel: 'standard' | 'high' | 'legal';
  accessLevel: 'public' | 'parties_only' | 'legal_only' | 'confidential';
  isAnonymous: boolean;
  pseudonym?: string;
  
  // Metadata
  timestamp: string;
  readBy: MessageRead[];
  reactions: MessageReaction[];
  
  // Advanced features
  expiresAt?: string; // Self-destructing messages
  requiresAcknowledgment: boolean;
  acknowledgedBy: string[];
  
  // Threading and organization
  parentMessageId?: string;
  threadId?: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Attachments and documents
  attachments: MessageAttachment[];
  
  // Status and moderation
  status: 'sent' | 'delivered' | 'read' | 'expired' | 'deleted' | 'moderated';
  editedAt?: string;
  deletedAt?: string;
  moderationFlags: ModerationFlag[];
}

export interface Conversation {
  id: string;
  title: string;
  description?: string;
  
  // Related entities
  dealId?: string;
  teamId?: string;
  opportunityId?: string;
  dueDiligenceId?: string;
  negotiationId?: string;
  
  // Participants
  participants: ConversationParticipant[];
  
  // Security settings
  securityLevel: 'standard' | 'high' | 'maximum';
  encryptionEnabled: boolean;
  auditTrailEnabled: boolean;
  accessControls: AccessControl[];
  
  // Organization
  conversationType: 'initial_inquiry' | 'due_diligence' | 'negotiation' | 'legal_review' | 'integration_planning' | 'general';
  isArchived: boolean;
  isConfidential: boolean;
  
  // Metadata
  createdAt: string;
  createdBy: string;
  lastActivity: string;
  messageCount: number;
  
  // Advanced features
  autoDeleteAfter?: number; // days
  requiresModeration: boolean;
  allowedFileTypes: string[];
  maxFileSize: number; // bytes
  
  // Compliance and legal
  retentionPolicy: 'standard' | 'legal_hold' | 'auto_delete';
  complianceNotes: string[];
  legalReviewRequired: boolean;
}

export interface ConversationParticipant {
  userId: string;
  name: string;
  email: string;
  role: 'company_rep' | 'team_lead' | 'team_member' | 'legal_counsel' | 'platform_admin';
  company?: string;
  title?: string;
  
  // Permissions
  permissions: ParticipantPermissions;
  
  // Status
  status: 'active' | 'inactive' | 'removed' | 'pending_invite';
  joinedAt: string;
  lastSeen: string;
  
  // Preferences
  notificationPreferences: NotificationPreferences;
  displayName?: string; // For anonymity
  isAnonymous: boolean;
}

export interface ParticipantPermissions {
  canSendMessages: boolean;
  canUploadFiles: boolean;
  canInviteParticipants: boolean;
  canModerateMessages: boolean;
  canAccessLegalDocuments: boolean;
  canViewAuditTrail: boolean;
  canExportConversation: boolean;
  canDeleteMessages: boolean;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  instantNotifications: boolean;
  dailyDigest: boolean;
  urgentOnly: boolean;
  mutedUntil?: string;
}

export interface MessageRead {
  userId: string;
  readAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface MessageReaction {
  userId: string;
  reaction: 'thumbs_up' | 'thumbs_down' | 'checkmark' | 'question' | 'important';
  timestamp: string;
}

export interface MessageAttachment {
  id: string;
  filename: string;
  originalFilename: string;
  fileType: string;
  fileSize: number;
  
  // Security
  encryptedUrl: string;
  accessLevel: 'public' | 'parties_only' | 'legal_only' | 'confidential';
  virusScanned: boolean;
  scanResults?: string;
  
  // Metadata
  uploadedBy: string;
  uploadedAt: string;
  downloadCount: number;
  lastDownloaded?: string;
  
  // Document specifics
  documentType?: 'nda' | 'term_sheet' | 'contract' | 'due_diligence' | 'reference' | 'compliance' | 'other';
  version?: number;
  checksum: string;
  
  // Expiration
  expiresAt?: string;
  isExpired: boolean;
}

export interface ModerationFlag {
  id: string;
  flaggedBy: string;
  reason: 'inappropriate_content' | 'confidentiality_breach' | 'spam' | 'legal_concern' | 'other';
  description: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'escalated';
  reviewedBy?: string;
  reviewedAt?: string;
  resolution?: string;
}

export interface AccessControl {
  ruleId: string;
  ruleType: 'user_role' | 'company_affiliation' | 'deal_participant' | 'custom';
  allowedRoles: string[];
  allowedUsers: string[];
  restrictions: string[];
  effectiveFrom: string;
  effectiveUntil?: string;
}

export interface MessageDraft {
  id: string;
  conversationId: string;
  authorId: string;
  content: string;
  subject?: string;
  recipientIds: string[];
  attachments: MessageAttachment[];
  lastSaved: string;
  autoSaveEnabled: boolean;
}

export interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  category: 'initial_contact' | 'due_diligence' | 'negotiation' | 'legal' | 'follow_up';
  subject: string;
  content: string;
  variables: TemplateVariable[];
  isPublic: boolean;
  createdBy: string;
  usageCount: number;
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'select';
  required: boolean;
  defaultValue?: string;
  options?: string[]; // For select type
}

export interface MessageSearch {
  query: string;
  conversationIds?: string[];
  senderId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  messageType?: string;
  hasAttachments?: boolean;
  tags?: string[];
  priority?: string;
  accessLevel?: string;
}

export interface SearchResult {
  messageId: string;
  conversationId: string;
  conversationTitle: string;
  senderName: string;
  timestamp: string;
  snippet: string;
  matchScore: number;
  highlightedContent: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'message_sent' | 'message_read' | 'message_deleted' | 'file_uploaded' | 'file_downloaded' | 'participant_added' | 'participant_removed' | 'conversation_created' | 'conversation_archived' | 'settings_changed';
  entityType: 'message' | 'conversation' | 'attachment' | 'participant';
  entityId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  location?: string;
}

export interface ComplianceReport {
  id: string;
  generatedAt: string;
  generatedBy: string;
  reportType: 'audit_trail' | 'data_retention' | 'access_log' | 'security_incidents';
  
  // Scope
  conversationIds: string[];
  dateRange: {
    start: string;
    end: string;
  };
  
  // Findings
  totalMessages: number;
  totalParticipants: number;
  totalAttachments: number;
  securityIncidents: SecurityIncident[];
  complianceIssues: ComplianceIssue[];
  
  // Recommendations
  recommendations: string[];
  
  // Export
  exportFormat: 'pdf' | 'excel' | 'json';
  exportUrl?: string;
}

export interface SecurityIncident {
  id: string;
  timestamp: string;
  type: 'unauthorized_access' | 'data_breach' | 'suspicious_activity' | 'policy_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedEntities: string[];
  investigationStatus: 'open' | 'investigating' | 'resolved' | 'closed';
  assignedTo?: string;
  resolution?: string;
}

export interface ComplianceIssue {
  id: string;
  type: 'retention_policy' | 'access_control' | 'encryption' | 'audit_trail';
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendation: string;
  deadline?: string;
  status: 'open' | 'in_progress' | 'resolved';
}

// Utility functions
export function createSecureConversation(
  title: string,
  participants: ConversationParticipant[],
  securityLevel: 'standard' | 'high' | 'maximum' = 'high'
): Conversation {
  return {
    id: `conv-${Date.now()}`,
    title,
    participants,
    securityLevel,
    encryptionEnabled: securityLevel !== 'standard',
    auditTrailEnabled: true,
    conversationType: 'general',
    isArchived: false,
    isConfidential: securityLevel !== 'standard',
    createdAt: new Date().toISOString(),
    createdBy: participants[0]?.userId || '',
    lastActivity: new Date().toISOString(),
    messageCount: 0,
    requiresModeration: securityLevel === 'maximum',
    allowedFileTypes: ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.png'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    retentionPolicy: 'legal_hold',
    complianceNotes: [],
    legalReviewRequired: securityLevel === 'maximum',
    accessControls: [],
  };
}

export function validateMessageSecurity(message: SecureMessage, conversation: Conversation): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check encryption requirements
  if (conversation.securityLevel === 'maximum' && message.encryptionLevel !== 'legal') {
    errors.push('Maximum security conversations require legal-grade encryption');
  }

  // Check access levels
  if (message.accessLevel === 'legal_only' && !message.senderId.includes('legal')) {
    warnings.push('Non-legal user sending legal-only message');
  }

  // Check content for sensitive information
  const sensitivePatterns = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN pattern
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card pattern
    /\$[\d,]+\b/, // Money amounts
  ];

  sensitivePatterns.forEach(pattern => {
    if (pattern.test(message.content)) {
      warnings.push('Message contains potentially sensitive information');
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function generateComplianceReport(
  conversations: Conversation[],
  messages: SecureMessage[],
  auditLogs: AuditLogEntry[]
): ComplianceReport {
  const securityIncidents: SecurityIncident[] = [];
  const complianceIssues: ComplianceIssue[] = [];

  // Analyze audit logs for suspicious activity
  const suspiciousActivities = auditLogs.filter(log => 
    log.action === 'message_deleted' || 
    (log.action === 'file_downloaded' && log.details.downloadCount > 10)
  );

  suspiciousActivities.forEach(activity => {
    securityIncidents.push({
      id: `incident-${Date.now()}`,
      timestamp: activity.timestamp,
      type: 'suspicious_activity',
      severity: 'medium',
      description: `Unusual activity detected: ${activity.action}`,
      affectedEntities: [activity.entityId],
      investigationStatus: 'open',
    });
  });

  // Check for retention policy compliance
  const oldMessages = messages.filter(msg => {
    const messageAge = Date.now() - new Date(msg.timestamp).getTime();
    return messageAge > (365 * 24 * 60 * 60 * 1000); // 1 year
  });

  if (oldMessages.length > 0) {
    complianceIssues.push({
      id: `compliance-${Date.now()}`,
      type: 'retention_policy',
      severity: 'medium',
      description: `${oldMessages.length} messages exceed retention policy`,
      recommendation: 'Review and archive or delete old messages per retention policy',
      status: 'open',
    });
  }

  return {
    id: `report-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    generatedBy: 'system',
    reportType: 'audit_trail',
    conversationIds: conversations.map(c => c.id),
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString(),
    },
    totalMessages: messages.length,
    totalParticipants: Array.from(new Set(conversations.flatMap(c => c.participants.map(p => p.userId)))).length,
    totalAttachments: messages.reduce((acc, msg) => acc + msg.attachments.length, 0),
    securityIncidents,
    complianceIssues,
    recommendations: [
      'Implement regular security training for all users',
      'Review and update access controls quarterly',
      'Enable two-factor authentication for all participants',
    ],
    exportFormat: 'pdf',
  };
}

// Mock data for demonstration
export const mockConversations: Conversation[] = [
  {
    id: 'conv-liftout-001',
    title: 'Goldman Sachs Analytics Team - Initial Discussion',
    description: 'Confidential discussions regarding potential team acquisition',
    dealId: 'deal-001',
    teamId: 'team-goldman-analytics',
    opportunityId: 'opp-medtech-ai',
    participants: [
      {
        userId: 'user-jennifer-walsh',
        name: 'Jennifer Walsh',
        email: 'j.walsh@medtech.com',
        role: 'company_rep',
        company: 'MedTech Innovations',
        title: 'VP of Talent Acquisition',
        permissions: {
          canSendMessages: true,
          canUploadFiles: true,
          canInviteParticipants: true,
          canModerateMessages: false,
          canAccessLegalDocuments: true,
          canViewAuditTrail: true,
          canExportConversation: true,
          canDeleteMessages: false,
        },
        status: 'active',
        joinedAt: '2024-09-20T00:00:00Z',
        lastSeen: '2024-09-25T14:30:00Z',
        notificationPreferences: {
          emailNotifications: true,
          instantNotifications: true,
          dailyDigest: false,
          urgentOnly: false,
        },
        isAnonymous: false,
      },
      {
        userId: 'user-alex-thompson',
        name: 'Alex Thompson',
        email: 'alex.thompson@gs.com',
        role: 'team_lead',
        company: 'Goldman Sachs',
        title: 'Team Lead - Strategic Analytics',
        permissions: {
          canSendMessages: true,
          canUploadFiles: true,
          canInviteParticipants: false,
          canModerateMessages: false,
          canAccessLegalDocuments: true,
          canViewAuditTrail: false,
          canExportConversation: false,
          canDeleteMessages: false,
        },
        status: 'active',
        joinedAt: '2024-09-20T00:00:00Z',
        lastSeen: '2024-09-25T16:45:00Z',
        notificationPreferences: {
          emailNotifications: true,
          instantNotifications: true,
          dailyDigest: true,
          urgentOnly: false,
        },
        isAnonymous: false,
      },
    ],
    securityLevel: 'high',
    encryptionEnabled: true,
    auditTrailEnabled: true,
    conversationType: 'negotiation',
    isArchived: false,
    isConfidential: true,
    createdAt: '2024-09-20T00:00:00Z',
    createdBy: 'user-jennifer-walsh',
    lastActivity: '2024-09-25T16:45:00Z',
    messageCount: 23,
    requiresModeration: false,
    allowedFileTypes: ['.pdf', '.doc', '.docx', '.txt'],
    maxFileSize: 25 * 1024 * 1024, // 25MB
    retentionPolicy: 'legal_hold',
    complianceNotes: ['Subject to M&A confidentiality requirements'],
    legalReviewRequired: true,
    accessControls: [
      {
        ruleId: 'rule-001',
        ruleType: 'deal_participant',
        allowedRoles: ['company_rep', 'team_lead', 'legal_counsel'],
        allowedUsers: [],
        restrictions: ['No external sharing', 'No screenshots'],
        effectiveFrom: '2024-09-20T00:00:00Z',
      },
    ],
  },
];

export const mockMessages: SecureMessage[] = [
  {
    id: 'msg-001',
    conversationId: 'conv-liftout-001',
    senderId: 'user-jennifer-walsh',
    senderName: 'Jennifer Walsh',
    senderRole: 'company_rep',
    recipientIds: ['user-alex-thompson'],
    content: 'Hi Alex, thank you for your interest in exploring opportunities with MedTech Innovations. I\'d like to schedule a confidential discussion about a potential strategic opportunity that aligns perfectly with your team\'s expertise in quantitative analytics and healthcare AI.',
    subject: 'Confidential Opportunity Discussion',
    messageType: 'text',
    encryptionLevel: 'high',
    accessLevel: 'parties_only',
    isAnonymous: false,
    timestamp: '2024-09-20T10:00:00Z',
    readBy: [
      {
        userId: 'user-alex-thompson',
        readAt: '2024-09-20T14:30:00Z',
      },
    ],
    reactions: [
      {
        userId: 'user-alex-thompson',
        reaction: 'thumbs_up',
        timestamp: '2024-09-20T14:31:00Z',
      },
    ],
    requiresAcknowledgment: true,
    acknowledgedBy: ['user-alex-thompson'],
    tags: ['initial_contact', 'confidential'],
    priority: 'high',
    attachments: [],
    status: 'read',
    moderationFlags: [],
  },
  {
    id: 'msg-002',
    conversationId: 'conv-liftout-001',
    senderId: 'user-alex-thompson',
    senderName: 'Alex Thompson',
    senderRole: 'team_lead',
    recipientIds: ['user-jennifer-walsh'],
    content: 'Thank you for reaching out, Jennifer. I\'m intrigued by the potential opportunity. My team has extensive experience in quantitative risk management and we\'ve been exploring applications in healthcare AI. I\'d be happy to discuss this further under appropriate confidentiality protections.',
    messageType: 'text',
    encryptionLevel: 'high',
    accessLevel: 'parties_only',
    isAnonymous: false,
    timestamp: '2024-09-20T15:15:00Z',
    readBy: [
      {
        userId: 'user-jennifer-walsh',
        readAt: '2024-09-20T16:00:00Z',
      },
    ],
    reactions: [],
    requiresAcknowledgment: false,
    acknowledgedBy: [],
    tags: ['response', 'interest_expressed'],
    priority: 'medium',
    attachments: [],
    status: 'read',
    moderationFlags: [],
  },
  {
    id: 'msg-003',
    conversationId: 'conv-liftout-001',
    senderId: 'user-jennifer-walsh',
    senderName: 'Jennifer Walsh',
    senderRole: 'company_rep',
    recipientIds: ['user-alex-thompson'],
    content: 'Excellent! I\'ve attached our mutual NDA for your review. Once executed, we can discuss the specific opportunity which involves building a healthcare AI division focused on medical imaging and diagnostic algorithms. The role would involve leading a team of 4-6 quantitative analysts with significant equity participation.',
    messageType: 'document',
    encryptionLevel: 'legal',
    accessLevel: 'legal_only',
    isAnonymous: false,
    timestamp: '2024-09-21T09:30:00Z',
    readBy: [
      {
        userId: 'user-alex-thompson',
        readAt: '2024-09-21T11:45:00Z',
      },
    ],
    reactions: [],
    requiresAcknowledgment: true,
    acknowledgedBy: ['user-alex-thompson'],
    tags: ['nda', 'legal_document', 'opportunity_details'],
    priority: 'high',
    attachments: [
      {
        id: 'att-001',
        filename: 'medtech_mutual_nda_v2.pdf',
        originalFilename: 'MedTech Innovations - Mutual NDA v2.1.pdf',
        fileType: 'application/pdf',
        fileSize: 245760,
        encryptedUrl: 'https://secure.liftout.com/documents/encrypted/att-001',
        accessLevel: 'legal_only',
        virusScanned: true,
        uploadedBy: 'user-jennifer-walsh',
        uploadedAt: '2024-09-21T09:30:00Z',
        downloadCount: 1,
        lastDownloaded: '2024-09-21T11:45:00Z',
        documentType: 'nda',
        version: 2,
        checksum: 'sha256:a1b2c3d4e5f6...',
        isExpired: false,
      },
    ],
    status: 'read',
    moderationFlags: [],
  },
];