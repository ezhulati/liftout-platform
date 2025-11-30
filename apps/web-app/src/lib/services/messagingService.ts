import { documentService } from './documentService';
import type {
  Conversation,
  SecureMessage,
  ConversationParticipant,
  MessageAttachment,
} from '@/lib/messaging';

// Demo data for testing
const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: 'demo-conv-001',
    title: 'Acquisition Discussion - Tech Innovations Team',
    participants: [
      {
        userId: 'demo-user-001',
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'team_lead',
        permissions: {
          canSendMessages: true,
          canUploadFiles: true,
          canInviteParticipants: true,
          canModerateMessages: false,
          canAccessLegalDocuments: false,
          canViewAuditTrail: false,
          canExportConversation: false,
          canDeleteMessages: false,
        },
        status: 'active',
        joinedAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        notificationPreferences: {
          emailNotifications: true,
          instantNotifications: true,
          dailyDigest: false,
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
    isConfidential: false,
    createdAt: new Date().toISOString(),
    createdBy: 'demo-user-001',
    lastActivity: new Date().toISOString(),
    messageCount: 5,
    requiresModeration: false,
    allowedFileTypes: ['.pdf', '.doc', '.docx'],
    maxFileSize: 25 * 1024 * 1024,
    retentionPolicy: 'standard',
    complianceNotes: [],
    legalReviewRequired: false,
    accessControls: [],
  },
];

const DEMO_MESSAGES: SecureMessage[] = [
  {
    id: 'demo-msg-001',
    conversationId: 'demo-conv-001',
    senderId: 'demo-user-001',
    senderName: 'Demo User',
    senderRole: 'team_lead',
    recipientIds: ['company-user-001'],
    content: 'Thank you for your interest in our team. We are excited to discuss this opportunity.',
    messageType: 'text',
    encryptionLevel: 'high',
    accessLevel: 'parties_only',
    isAnonymous: false,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    readBy: [],
    reactions: [],
    requiresAcknowledgment: false,
    acknowledgedBy: [],
    tags: [],
    priority: 'medium',
    attachments: [],
    status: 'read',
    moderationFlags: [],
  },
  {
    id: 'demo-msg-002',
    conversationId: 'demo-conv-001',
    senderId: 'company-user-001',
    senderName: 'Company Representative',
    senderRole: 'company_rep',
    recipientIds: ['demo-user-001'],
    content: 'We would like to schedule a call to discuss the next steps. Are you available next week?',
    messageType: 'text',
    encryptionLevel: 'high',
    accessLevel: 'parties_only',
    isAnonymous: false,
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    readBy: [],
    reactions: [],
    requiresAcknowledgment: false,
    acknowledgedBy: [],
    tags: [],
    priority: 'medium',
    attachments: [],
    status: 'delivered',
    moderationFlags: [],
  },
];

// Helper to check if this is a demo user/entity
const isDemoEntity = (id: string): boolean => {
  if (!id) return false;
  return id.includes('demo') ||
         id === 'demo@example.com' ||
         id === 'company@example.com' ||
         id.startsWith('demo-');
};

export interface MessageSearchOptions {
  conversationId?: string;
  senderId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  messageType?: string;
  hasAttachments?: boolean;
  tags?: string[];
  priority?: string;
  limit?: number;
}

export class MessagingService {
  // Create a new secure conversation
  async createConversation(
    title: string,
    participants: ConversationParticipant[],
    options: {
      securityLevel?: 'standard' | 'high' | 'maximum';
      conversationType?: Conversation['conversationType'];
      dealId?: string;
      teamId?: string;
      opportunityId?: string;
      isConfidential?: boolean;
      requiresModeration?: boolean;
    } = {}
  ): Promise<string> {
    // Handle demo users - simulate successful conversation creation
    const hasDemoParticipant = participants.some(p => isDemoEntity(p.userId));
    if (hasDemoParticipant || isDemoEntity(options.teamId || '')) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const demoConvId = `demo-conv-${Date.now()}`;
      console.log(`[Demo] Created conversation: ${title} (${demoConvId})`);
      return demoConvId;
    }

    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          participants,
          ...options,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }

      const result = await response.json();
      return result.conversation?.id || result.data?.id || '';
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw new Error('Failed to create conversation');
    }
  }

  // Send a secure message
  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    options: {
      subject?: string;
      messageType?: SecureMessage['messageType'];
      priority?: SecureMessage['priority'];
      encryptionLevel?: SecureMessage['encryptionLevel'];
      accessLevel?: SecureMessage['accessLevel'];
      requiresAcknowledgment?: boolean;
      attachmentIds?: string[];
      tags?: string[];
      expiresAt?: Date;
      parentMessageId?: string;
    } = {}
  ): Promise<string> {
    // Handle demo users - simulate successful message send
    if (isDemoEntity(senderId) || conversationId.startsWith('demo-conv-')) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const demoMsgId = `demo-msg-${Date.now()}`;
      console.log(`[Demo] Sent message in conversation ${conversationId} (${demoMsgId})`);
      return demoMsgId;
    }

    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          ...options,
          expiresAt: options.expiresAt?.toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      const result = await response.json();
      return result.message?.id || result.data?.id || '';
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  // Get conversation by ID
  async getConversationById(conversationId: string): Promise<Conversation | null> {
    // Handle demo conversations
    if (isDemoEntity(conversationId)) {
      return DEMO_CONVERSATIONS.find(c => c.id === conversationId) || DEMO_CONVERSATIONS[0];
    }

    try {
      const response = await fetch(`/api/conversations/${conversationId}`);

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to get conversation');
      }

      const result = await response.json();
      return result.conversation || result.data || null;
    } catch (error) {
      console.error('Error getting conversation:', error);
      throw new Error('Failed to get conversation');
    }
  }

  // Get conversations for a user
  async getUserConversations(userId: string, limit = 50): Promise<Conversation[]> {
    // Handle demo users
    if (isDemoEntity(userId)) {
      return DEMO_CONVERSATIONS;
    }

    try {
      const response = await fetch(`/api/conversations?limit=${limit}`);

      if (!response.ok) {
        throw new Error('Failed to get user conversations');
      }

      const result = await response.json();
      return result.conversations || result.data?.conversations || [];
    } catch (error) {
      console.error('Error getting user conversations:', error);
      throw new Error('Failed to get user conversations');
    }
  }

  // Get messages for a conversation
  async getConversationMessages(
    conversationId: string,
    userId: string,
    options: {
      limit?: number;
      startAfter?: string;
      includeDeleted?: boolean;
    } = {}
  ): Promise<SecureMessage[]> {
    // Handle demo conversations
    if (isDemoEntity(conversationId) || isDemoEntity(userId)) {
      return DEMO_MESSAGES.filter(m => m.conversationId === conversationId || conversationId.startsWith('demo-'));
    }

    try {
      const params = new URLSearchParams();
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.startAfter) params.append('startAfter', options.startAfter);
      if (options.includeDeleted) params.append('includeDeleted', 'true');

      const response = await fetch(`/api/conversations/${conversationId}/messages?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to get conversation messages');
      }

      const result = await response.json();
      return result.messages || result.data?.messages || [];
    } catch (error) {
      console.error('Error getting conversation messages:', error);
      throw new Error('Failed to get conversation messages');
    }
  }

  // Mark messages as read
  async markMessagesAsRead(messageIds: string[], userId: string): Promise<void> {
    // Handle demo messages
    if (isDemoEntity(userId) || messageIds.some(id => isDemoEntity(id))) {
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log(`[Demo] Marked ${messageIds.length} messages as read`);
      return;
    }

    try {
      const response = await fetch('/api/conversations/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark messages as read');
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw new Error('Failed to mark messages as read');
    }
  }

  // Search messages
  async searchMessages(
    userId: string,
    searchQuery: string,
    options: MessageSearchOptions = {}
  ): Promise<SecureMessage[]> {
    // Handle demo users
    if (isDemoEntity(userId)) {
      const filtered = DEMO_MESSAGES.filter(m =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subject?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return filtered.slice(0, options.limit || 50);
    }

    try {
      const params = new URLSearchParams();
      params.append('q', searchQuery);
      if (options.conversationId) params.append('conversationId', options.conversationId);
      if (options.senderId) params.append('senderId', options.senderId);
      if (options.messageType) params.append('messageType', options.messageType);
      if (options.priority) params.append('priority', options.priority);
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.tags?.length) params.append('tags', options.tags.join(','));

      const response = await fetch(`/api/conversations/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to search messages');
      }

      const result = await response.json();
      return result.messages || result.data?.messages || [];
    } catch (error) {
      console.error('Error searching messages:', error);
      throw new Error('Failed to search messages');
    }
  }

  // Save message draft
  async saveMessageDraft(
    conversationId: string,
    authorId: string,
    content: string,
    options: {
      subject?: string;
      recipientIds?: string[];
      attachmentIds?: string[];
    } = {}
  ): Promise<string> {
    // Handle demo users
    if (isDemoEntity(authorId) || isDemoEntity(conversationId)) {
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log(`[Demo] Saved draft for conversation ${conversationId}`);
      return `demo-draft-${Date.now()}`;
    }

    try {
      const response = await fetch(`/api/conversations/${conversationId}/drafts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          ...options,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save message draft');
      }

      const result = await response.json();
      return result.draft?.id || result.data?.id || '';
    } catch (error) {
      console.error('Error saving message draft:', error);
      throw new Error('Failed to save message draft');
    }
  }

  // Subscribe to conversation updates (real-time)
  // Note: This would need WebSocket or SSE implementation on the server
  subscribeToConversation(
    conversationId: string,
    callback: (messages: SecureMessage[]) => void
  ): () => void {
    // For demo, just return the messages once
    if (isDemoEntity(conversationId)) {
      setTimeout(() => {
        callback(DEMO_MESSAGES.filter(m => m.conversationId === conversationId));
      }, 100);
      return () => {};
    }

    // In production, this would use WebSocket or polling
    let intervalId: NodeJS.Timeout | null = null;
    let lastMessageId: string | undefined;

    const poll = async () => {
      try {
        const messages = await this.getConversationMessages(conversationId, 'system', {
          limit: 50,
          startAfter: lastMessageId,
        });

        if (messages.length > 0) {
          lastMessageId = messages[messages.length - 1].id;
          callback(messages);
        }
      } catch (error) {
        console.error('Error polling for messages:', error);
      }
    };

    // Poll every 5 seconds
    intervalId = setInterval(poll, 5000);
    poll(); // Initial fetch

    // Return unsubscribe function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }

  // Add participant to conversation
  async addParticipant(
    conversationId: string,
    participant: ConversationParticipant
  ): Promise<void> {
    // Handle demo conversations
    if (isDemoEntity(conversationId)) {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`[Demo] Added participant to conversation ${conversationId}`);
      return;
    }

    try {
      const response = await fetch(`/api/conversations/${conversationId}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(participant),
      });

      if (!response.ok) {
        throw new Error('Failed to add participant');
      }
    } catch (error) {
      console.error('Error adding participant:', error);
      throw new Error('Failed to add participant');
    }
  }

  // Remove participant from conversation
  async removeParticipant(
    conversationId: string,
    userId: string
  ): Promise<void> {
    // Handle demo conversations
    if (isDemoEntity(conversationId) || isDemoEntity(userId)) {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`[Demo] Removed participant ${userId} from conversation ${conversationId}`);
      return;
    }

    try {
      const response = await fetch(`/api/conversations/${conversationId}/participants/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove participant');
      }
    } catch (error) {
      console.error('Error removing participant:', error);
      throw new Error('Failed to remove participant');
    }
  }

  // Archive conversation
  async archiveConversation(conversationId: string): Promise<void> {
    // Handle demo conversations
    if (isDemoEntity(conversationId)) {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`[Demo] Archived conversation ${conversationId}`);
      return;
    }

    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to archive conversation');
      }
    } catch (error) {
      console.error('Error archiving conversation:', error);
      throw new Error('Failed to archive conversation');
    }
  }

  // Get unread message count
  async getUnreadCount(userId: string): Promise<number> {
    // Handle demo users
    if (isDemoEntity(userId)) {
      return 2;
    }

    try {
      const response = await fetch('/api/conversations/unread');

      if (!response.ok) {
        throw new Error('Failed to get unread count');
      }

      const result = await response.json();
      return result.count || result.data?.count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Private helper methods
  private async getMessageAttachments(attachmentIds: string[]): Promise<MessageAttachment[]> {
    const attachments: MessageAttachment[] = [];

    for (const attachmentId of attachmentIds) {
      try {
        const document = await documentService.getSecureDocument(attachmentId, 'system');
        if (document) {
          attachments.push({
            id: document.id!,
            filename: document.filename,
            originalFilename: document.originalFilename,
            fileType: document.fileType,
            fileSize: document.fileSize,
            encryptedUrl: document.encryptedUrl,
            accessLevel: document.accessLevel,
            virusScanned: document.virusScanned,
            scanResults: document.scanResults,
            uploadedBy: document.uploadedBy,
            uploadedAt: document.uploadedAt,
            downloadCount: document.downloadCount,
            lastDownloaded: document.lastDownloaded,
            documentType: document.documentType,
            version: document.version,
            checksum: document.checksum,
            expiresAt: document.expiresAt && typeof document.expiresAt === 'object' && 'toDate' in document.expiresAt ? (document.expiresAt as { toDate: () => Date }).toDate().toISOString() : document.expiresAt as string | undefined,
            isExpired: document.isExpired,
          });
        }
      } catch (error) {
        console.error(`Error getting attachment ${attachmentId}:`, error);
      }
    }

    return attachments;
  }
}

export const messagingService = new MessagingService();
