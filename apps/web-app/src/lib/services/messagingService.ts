import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  startAfter,
  Timestamp,
  writeBatch,
  increment,
  arrayUnion,
  onSnapshot,
  QuerySnapshot,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { documentService } from './documentService';
import type { 
  Conversation, 
  SecureMessage, 
  ConversationParticipant,
  MessageAttachment,
  MessageDraft,
  AuditLogEntry,
  ComplianceReport 
} from '@/lib/messaging';

const CONVERSATIONS_COLLECTION = 'conversations';
const MESSAGES_COLLECTION = 'messages';
const MESSAGE_DRAFTS_COLLECTION = 'message_drafts';
const AUDIT_LOGS_COLLECTION = 'audit_logs';

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
    try {
      const conversationData: Partial<Conversation> = {
        title,
        participants,
        securityLevel: options.securityLevel || 'high',
        encryptionEnabled: (options.securityLevel || 'high') !== 'standard',
        auditTrailEnabled: true,
        conversationType: options.conversationType || 'general',
        isArchived: false,
        isConfidential: options.isConfidential || false,
        createdAt: new Date().toISOString(),
        createdBy: participants[0]?.userId || '',
        lastActivity: new Date().toISOString(),
        messageCount: 0,
        requiresModeration: options.requiresModeration || (options.securityLevel === 'maximum'),
        allowedFileTypes: ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.png'],
        maxFileSize: 25 * 1024 * 1024, // 25MB
        retentionPolicy: options.securityLevel === 'maximum' ? 'legal_hold' : 'standard',
        complianceNotes: [],
        legalReviewRequired: options.securityLevel === 'maximum',
        accessControls: [],
        dealId: options.dealId,
        teamId: options.teamId,
        opportunityId: options.opportunityId,
      };

      const docRef = await addDoc(collection(db, CONVERSATIONS_COLLECTION), {
        ...conversationData,
        createdAt: Timestamp.now(),
        lastActivity: Timestamp.now(),
      });

      // Log conversation creation
      await this.logAuditEvent({
        userId: participants[0]?.userId || '',
        userName: participants[0]?.name || '',
        action: 'conversation_created',
        entityType: 'conversation',
        entityId: docRef.id,
        details: { title, participantCount: participants.length, securityLevel: options.securityLevel },
      });

      return docRef.id;
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
    try {
      // Get conversation to validate security requirements
      const conversation = await this.getConversationById(conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      // Validate sender is participant
      const isParticipant = conversation.participants.some(p => p.userId === senderId);
      if (!isParticipant) {
        throw new Error('Sender is not a participant in this conversation');
      }

      // Get sender info
      const sender = conversation.participants.find(p => p.userId === senderId);
      if (!sender) {
        throw new Error('Sender not found');
      }

      // Validate permissions
      if (!sender.permissions.canSendMessages) {
        throw new Error('Sender does not have permission to send messages');
      }

      // Get attachments if provided
      let attachments: MessageAttachment[] = [];
      if (options.attachmentIds?.length) {
        attachments = await this.getMessageAttachments(options.attachmentIds);
      }

      // Validate file uploads if present
      if (attachments.length && !sender.permissions.canUploadFiles) {
        throw new Error('Sender does not have permission to upload files');
      }

      // Determine encryption level based on conversation security
      const encryptionLevel = options.encryptionLevel || 
        (conversation.securityLevel === 'maximum' ? 'legal' : 
         conversation.securityLevel === 'high' ? 'high' : 'standard');

      const messageData: Partial<SecureMessage> = {
        conversationId,
        senderId,
        senderName: sender.name,
        senderRole: sender.role,
        recipientIds: conversation.participants.filter(p => p.userId !== senderId).map(p => p.userId),
        content,
        subject: options.subject,
        messageType: options.messageType || 'text',
        encryptionLevel,
        accessLevel: options.accessLevel || 'parties_only',
        isAnonymous: sender.isAnonymous,
        pseudonym: sender.displayName,
        timestamp: new Date().toISOString(),
        readBy: [],
        reactions: [],
        expiresAt: options.expiresAt?.toISOString(),
        requiresAcknowledgment: options.requiresAcknowledgment || false,
        acknowledgedBy: [],
        parentMessageId: options.parentMessageId,
        tags: options.tags || [],
        priority: options.priority || 'medium',
        attachments,
        status: 'sent',
        moderationFlags: [],
      };

      // Add message to Firestore
      const messageRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
        ...messageData,
        timestamp: Timestamp.now(),
        expiresAt: options.expiresAt ? Timestamp.fromDate(options.expiresAt) : null,
      });

      // Update conversation last activity and message count
      const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
      await updateDoc(conversationRef, {
        lastActivity: Timestamp.now(),
        messageCount: increment(1),
      });

      // Log message sent
      await this.logAuditEvent({
        userId: senderId,
        userName: sender.name,
        action: 'message_sent',
        entityType: 'message',
        entityId: messageRef.id,
        details: { 
          conversationId, 
          messageType: options.messageType,
          hasAttachments: attachments.length > 0,
          encryptionLevel 
        },
      });

      // TODO: Send real-time notifications to participants

      return messageRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  // Get conversation by ID
  async getConversationById(conversationId: string): Promise<Conversation | null> {
    try {
      const docRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          lastActivity: data.lastActivity?.toDate().toISOString(),
        } as Conversation;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting conversation:', error);
      throw new Error('Failed to get conversation');
    }
  }

  // Get conversations for a user
  async getUserConversations(userId: string, limit = 50): Promise<Conversation[]> {
    try {
      const q = query(
        collection(db, CONVERSATIONS_COLLECTION),
        where('participants', 'array-contains', { userId }),
        orderBy('lastActivity', 'desc'),
        firestoreLimit(limit)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          lastActivity: data.lastActivity?.toDate().toISOString(),
        } as Conversation;
      });
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
    try {
      // Verify user has access to conversation
      const conversation = await this.getConversationById(conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      const isParticipant = conversation.participants.some(p => p.userId === userId);
      if (!isParticipant) {
        throw new Error('User is not a participant in this conversation');
      }

      let q = query(
        collection(db, MESSAGES_COLLECTION),
        where('conversationId', '==', conversationId),
        orderBy('timestamp', 'desc'),
        firestoreLimit(options.limit || 50)
      );

      if (options.startAfter) {
        const startAfterDoc = await getDoc(doc(db, MESSAGES_COLLECTION, options.startAfter));
        if (startAfterDoc.exists()) {
          q = query(q, startAfter(startAfterDoc));
        }
      }

      const querySnapshot = await getDocs(q);
      const messages = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate().toISOString(),
          expiresAt: data.expiresAt?.toDate().toISOString(),
        } as SecureMessage;
      }).filter(message => {
        // Filter out deleted messages unless specifically requested
        if (!options.includeDeleted && message.status === 'deleted') {
          return false;
        }
        
        // Filter out expired messages
        if (message.expiresAt && new Date(message.expiresAt) < new Date()) {
          return false;
        }
        
        return true;
      });

      // Mark messages as delivered if they haven't been read yet
      await this.markMessagesAsDelivered(messages.filter(m => m.senderId !== userId), userId);

      return messages.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error getting conversation messages:', error);
      throw new Error('Failed to get conversation messages');
    }
  }

  // Mark messages as read
  async markMessagesAsRead(messageIds: string[], userId: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      const timestamp = Timestamp.now();

      for (const messageId of messageIds) {
        const messageRef = doc(db, MESSAGES_COLLECTION, messageId);
        batch.update(messageRef, {
          readBy: arrayUnion({
            userId,
            readAt: timestamp,
            ipAddress: '127.0.0.1', // Would get real IP
            userAgent: 'Mozilla/5.0...', // Would get real user agent
          }),
          status: 'read',
        });
      }

      await batch.commit();

      // Log read activity
      await this.logAuditEvent({
        userId,
        userName: '', // Would get from user service
        action: 'message_read',
        entityType: 'message',
        entityId: messageIds.join(','),
        details: { messageCount: messageIds.length },
      });
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
    try {
      // Get user's accessible conversations first
      const userConversations = await this.getUserConversations(userId);
      const conversationIds = options.conversationId 
        ? [options.conversationId]
        : userConversations.map(c => c.id);

      // Build Firestore query (limited text search capabilities)
      let q = collection(db, MESSAGES_COLLECTION);
      const constraints = [];

      if (conversationIds.length > 0) {
        constraints.push(where('conversationId', 'in', conversationIds.slice(0, 10))); // Firestore limit
      }

      if (options.senderId) {
        constraints.push(where('senderId', '==', options.senderId));
      }

      if (options.messageType) {
        constraints.push(where('messageType', '==', options.messageType));
      }

      if (options.priority) {
        constraints.push(where('priority', '==', options.priority));
      }

      if (options.hasAttachments !== undefined) {
        // Would need to structure data differently for this query
      }

      if (options.tags?.length) {
        constraints.push(where('tags', 'array-contains-any', options.tags));
      }

      constraints.push(orderBy('timestamp', 'desc'));
      constraints.push(firestoreLimit(options.limit || 50));

      const finalQuery = query(q as any, ...constraints);
      const querySnapshot = await getDocs(finalQuery);
      
      const messages = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate().toISOString(),
        } as SecureMessage;
      });

      // Client-side text search (in production, would use proper search service)
      const filteredMessages = query.trim() 
        ? messages.filter(message => 
            message.content.toLowerCase().includes(query.toLowerCase()) ||
            message.subject?.toLowerCase().includes(query.toLowerCase())
          )
        : messages;

      return filteredMessages;
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
    try {
      const draftData = {
        conversationId,
        authorId,
        content,
        subject: options.subject,
        recipientIds: options.recipientIds || [],
        attachments: [], // Would populate from attachment IDs
        lastSaved: Timestamp.now(),
        autoSaveEnabled: true,
      };

      // Check if draft already exists
      const existingDraftQuery = query(
        collection(db, MESSAGE_DRAFTS_COLLECTION),
        where('conversationId', '==', conversationId),
        where('authorId', '==', authorId)
      );

      const existingDrafts = await getDocs(existingDraftQuery);
      
      if (!existingDrafts.empty) {
        // Update existing draft
        const draftRef = existingDrafts.docs[0].ref;
        await updateDoc(draftRef, draftData);
        return draftRef.id;
      } else {
        // Create new draft
        const draftRef = await addDoc(collection(db, MESSAGE_DRAFTS_COLLECTION), draftData);
        return draftRef.id;
      }
    } catch (error) {
      console.error('Error saving message draft:', error);
      throw new Error('Failed to save message draft');
    }
  }

  // Subscribe to conversation updates (real-time)
  subscribeToConversation(
    conversationId: string,
    callback: (messages: SecureMessage[]) => void
  ): () => void {
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'desc'),
      firestoreLimit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate().toISOString(),
        } as SecureMessage;
      }).reverse();

      callback(messages);
    });
  }

  // Private helper methods
  private async getMessageAttachments(attachmentIds: string[]): Promise<MessageAttachment[]> {
    const attachments: MessageAttachment[] = [];
    
    for (const attachmentId of attachmentIds) {
      try {
        const document = await documentService.getSecureDocument(attachmentId, 'system'); // System access for message attachment
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
            expiresAt: document.expiresAt?.toISOString(),
            isExpired: document.isExpired,
          });
        }
      } catch (error) {
        console.error(`Error getting attachment ${attachmentId}:`, error);
      }
    }
    
    return attachments;
  }

  private async markMessagesAsDelivered(messages: SecureMessage[], userId: string): Promise<void> {
    if (messages.length === 0) return;

    try {
      const batch = writeBatch(db);
      const timestamp = Timestamp.now();

      for (const message of messages) {
        if (message.status === 'sent') {
          const messageRef = doc(db, MESSAGES_COLLECTION, message.id);
          batch.update(messageRef, {
            status: 'delivered',
          });
        }
      }

      await batch.commit();
    } catch (error) {
      console.error('Error marking messages as delivered:', error);
    }
  }

  private async logAuditEvent(event: Omit<AuditLogEntry, 'id' | 'timestamp' | 'ipAddress' | 'userAgent' | 'location'>): Promise<void> {
    try {
      const auditEntry = {
        ...event,
        timestamp: Timestamp.now(),
        ipAddress: '127.0.0.1', // Would get real IP
        userAgent: 'Mozilla/5.0...', // Would get real user agent
        location: 'Unknown', // Would get from IP geolocation
      };

      await addDoc(collection(db, AUDIT_LOGS_COLLECTION), auditEntry);
    } catch (error) {
      console.error('Error logging audit event:', error);
    }
  }
}

export const messagingService = new MessagingService();