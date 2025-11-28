import { prisma } from '../lib/prisma';
import { Conversation, Message, ConversationParticipant, MessageType, ConversationStatus } from '@prisma/client';
import { getPaginationParams } from '../lib/utils';
import { NotFoundError, AuthorizationError, ValidationError } from '../middleware/errorHandler';

// Types
export interface CreateConversationInput {
  teamId?: string;
  companyId?: string;
  opportunityId?: string;
  subject?: string;
  participantIds: string[];
  initialMessage?: {
    content: string;
    messageType?: MessageType;
  };
}

export interface SendMessageInput {
  content: string;
  messageType?: MessageType;
  replyToId?: string;
  attachments?: Array<{
    url: string;
    filename: string;
    fileType: string;
    fileSize: number;
  }>;
  metadata?: Record<string, any>;
}

export interface UpdateConversationInput {
  subject?: string;
  status?: ConversationStatus;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class MessagingService {
  /**
   * Check if user can access a conversation
   */
  async canAccessConversation(conversationId: string, userId: string): Promise<boolean> {
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });

    return participant !== null && participant.leftAt === null;
  }

  /**
   * Get participant role in a conversation
   */
  async getParticipantRole(conversationId: string, userId: string): Promise<string | null> {
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });

    return participant?.role || null;
  }

  /**
   * Create a new conversation
   */
  async createConversation(
    data: CreateConversationInput,
    creatorId: string
  ): Promise<Conversation> {
    // Ensure creator is in participants list
    const participantIds = [...new Set([creatorId, ...data.participantIds])];

    if (participantIds.length < 2) {
      throw new ValidationError('A conversation requires at least 2 participants');
    }

    // Verify all participants exist
    const users = await prisma.user.findMany({
      where: { id: { in: participantIds } },
    });

    if (users.length !== participantIds.length) {
      throw new ValidationError('One or more participant IDs are invalid');
    }

    // Create conversation with participants
    const conversation = await prisma.conversation.create({
      data: {
        teamId: data.teamId,
        companyId: data.companyId,
        opportunityId: data.opportunityId,
        subject: data.subject,
        status: 'active',
        participants: {
          create: participantIds.map((userId) => ({
            userId,
            role: userId === creatorId ? 'creator' : 'participant',
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profile: {
                  select: {
                    profilePhotoUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Send initial message if provided
    if (data.initialMessage) {
      await this.sendMessage(
        conversation.id,
        {
          content: data.initialMessage.content,
          messageType: data.initialMessage.messageType || 'text',
        },
        creatorId
      );
    }

    return conversation;
  }

  /**
   * Get a conversation by ID
   */
  async getConversationById(id: string, userId: string): Promise<Conversation> {
    // Check access
    const canAccess = await this.canAccessConversation(id, userId);
    if (!canAccess) {
      throw new AuthorizationError('You do not have access to this conversation');
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: {
          where: { leftAt: null },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profile: {
                  select: {
                    profilePhotoUrl: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { sentAt: 'desc' },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    return conversation;
  }

  /**
   * Get all conversations for a user
   */
  async getUserConversations(
    userId: string,
    page?: string | number,
    limit?: string | number
  ): Promise<PaginatedResult<Conversation>> {
    const { page: pageNum, limit: limitNum, skip, take } = getPaginationParams(page, limit);

    // Get conversation IDs where user is an active participant
    const participations = await prisma.conversationParticipant.findMany({
      where: {
        userId,
        leftAt: null,
      },
      select: { conversationId: true },
    });

    const conversationIds = participations.map((p) => p.conversationId);

    const where = {
      id: { in: conversationIds },
      status: { not: 'blocked' as ConversationStatus },
    };

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        include: {
          participants: {
            where: { leftAt: null },
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  profile: {
                    select: {
                      profilePhotoUrl: true,
                    },
                  },
                },
              },
            },
          },
          messages: {
            take: 1,
            orderBy: { sentAt: 'desc' },
            include: {
              sender: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        skip,
        take,
        orderBy: [
          { lastMessageAt: { sort: 'desc', nulls: 'last' } },
          { createdAt: 'desc' },
        ],
      }),
      prisma.conversation.count({ where }),
    ]);

    return {
      data: conversations,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Update a conversation
   */
  async updateConversation(
    id: string,
    data: UpdateConversationInput,
    userId: string
  ): Promise<Conversation> {
    const canAccess = await this.canAccessConversation(id, userId);
    if (!canAccess) {
      throw new AuthorizationError('You do not have access to this conversation');
    }

    const conversation = await prisma.conversation.update({
      where: { id },
      data: {
        ...(data.subject !== undefined && { subject: data.subject }),
        ...(data.status && { status: data.status }),
      },
      include: {
        participants: {
          where: { leftAt: null },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return conversation;
  }

  /**
   * Archive a conversation for a user
   */
  async archiveConversation(id: string, userId: string): Promise<void> {
    const canAccess = await this.canAccessConversation(id, userId);
    if (!canAccess) {
      throw new AuthorizationError('You do not have access to this conversation');
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const archivedBy = (conversation.archivedBy as string[]) || [];
    if (!archivedBy.includes(userId)) {
      archivedBy.push(userId);
    }

    await prisma.conversation.update({
      where: { id },
      data: { archivedBy },
    });
  }

  /**
   * Send a message in a conversation
   */
  async sendMessage(
    conversationId: string,
    data: SendMessageInput,
    senderId: string
  ): Promise<Message> {
    // Check access
    const canAccess = await this.canAccessConversation(conversationId, senderId);
    if (!canAccess) {
      throw new AuthorizationError('You do not have access to this conversation');
    }

    // Check conversation status
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    if (conversation.status === 'blocked') {
      throw new ValidationError('Cannot send messages in a blocked conversation');
    }

    // Get sender type
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      select: { userType: true },
    });

    // Validate replyToId if provided
    if (data.replyToId) {
      const replyTo = await prisma.message.findUnique({
        where: { id: data.replyToId },
      });
      if (!replyTo || replyTo.conversationId !== conversationId) {
        throw new ValidationError('Invalid reply message ID');
      }
    }

    // Create message
    // Note: EntityType enum has team/company/opportunity - use 'team' for individual users
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        senderType: sender?.userType === 'company' ? 'company' : 'team',
        content: data.content,
        messageType: data.messageType || 'text',
        replyToId: data.replyToId,
        attachments: data.attachments || [],
        metadata: data.metadata || {},
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profile: {
              select: {
                profilePhotoUrl: true,
              },
            },
          },
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    // Update conversation metadata
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        messageCount: { increment: 1 },
      },
    });

    // Update unread counts for other participants
    const participants = await prisma.conversationParticipant.findMany({
      where: {
        conversationId,
        userId: { not: senderId },
        leftAt: null,
      },
    });

    // Increment unread count for each participant (stored in conversation.unreadCounts JSON)
    const unreadCounts = (conversation.unreadCounts as Record<string, number>) || {};
    for (const participant of participants) {
      unreadCounts[participant.userId] = (unreadCounts[participant.userId] || 0) + 1;
    }

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { unreadCounts },
    });

    return message;
  }

  /**
   * Get messages for a conversation
   */
  async getConversationMessages(
    conversationId: string,
    userId: string,
    page?: string | number,
    limit?: string | number
  ): Promise<PaginatedResult<Message>> {
    // Check access
    const canAccess = await this.canAccessConversation(conversationId, userId);
    if (!canAccess) {
      throw new AuthorizationError('You do not have access to this conversation');
    }

    const { page: pageNum, limit: limitNum, skip, take } = getPaginationParams(page, limit);

    const where = {
      conversationId,
      deletedAt: null,
    };

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profile: {
                select: {
                  profilePhotoUrl: true,
                },
              },
            },
          },
          replyTo: {
            select: {
              id: true,
              content: true,
              sender: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        skip,
        take,
        orderBy: { sentAt: 'desc' },
      }),
      prisma.message.count({ where }),
    ]);

    // Reverse to get chronological order
    messages.reverse();

    return {
      data: messages,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  /**
   * Edit a message
   */
  async editMessage(
    messageId: string,
    content: string,
    userId: string
  ): Promise<Message> {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundError('Message not found');
    }

    if (message.senderId !== userId) {
      throw new AuthorizationError('You can only edit your own messages');
    }

    // Check if message can be edited (within 24 hours)
    const hoursSinceSent = (Date.now() - message.sentAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceSent > 24) {
      throw new ValidationError('Messages can only be edited within 24 hours of sending');
    }

    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        content,
        editedAt: new Date(),
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return updatedMessage;
  }

  /**
   * Delete a message (soft delete)
   */
  async deleteMessage(messageId: string, userId: string): Promise<void> {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundError('Message not found');
    }

    if (message.senderId !== userId) {
      throw new AuthorizationError('You can only delete your own messages');
    }

    await prisma.message.update({
      where: { id: messageId },
      data: {
        deletedAt: new Date(),
        content: '[Message deleted]',
      },
    });
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    const canAccess = await this.canAccessConversation(conversationId, userId);
    if (!canAccess) {
      throw new AuthorizationError('You do not have access to this conversation');
    }

    // Update participant's last read time
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    // Reset unread count for this user
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (conversation) {
      const unreadCounts = (conversation.unreadCounts as Record<string, number>) || {};
      unreadCounts[userId] = 0;

      await prisma.conversation.update({
        where: { id: conversationId },
        data: { unreadCounts },
      });
    }

    // Mark all unread messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Add a participant to a conversation
   */
  async addParticipant(
    conversationId: string,
    newUserId: string,
    addedByUserId: string
  ): Promise<ConversationParticipant> {
    const canAccess = await this.canAccessConversation(conversationId, addedByUserId);
    if (!canAccess) {
      throw new AuthorizationError('You do not have access to this conversation');
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: newUserId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if already a participant
    const existingParticipant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: newUserId,
        },
      },
    });

    if (existingParticipant && !existingParticipant.leftAt) {
      throw new ValidationError('User is already a participant in this conversation');
    }

    // Re-add if they had left, or create new
    if (existingParticipant) {
      return prisma.conversationParticipant.update({
        where: {
          conversationId_userId: {
            conversationId,
            userId: newUserId,
          },
        },
        data: {
          leftAt: null,
          joinedAt: new Date(),
        },
      });
    }

    const participant = await prisma.conversationParticipant.create({
      data: {
        conversationId,
        userId: newUserId,
        role: 'participant',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Add system message
    await this.sendMessage(
      conversationId,
      {
        content: `${user.firstName} ${user.lastName} was added to the conversation`,
        messageType: 'system',
      },
      addedByUserId
    );

    return participant;
  }

  /**
   * Remove a participant from a conversation
   */
  async removeParticipant(
    conversationId: string,
    removeUserId: string,
    removedByUserId: string
  ): Promise<void> {
    const canAccess = await this.canAccessConversation(conversationId, removedByUserId);
    if (!canAccess) {
      throw new AuthorizationError('You do not have access to this conversation');
    }

    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: removeUserId,
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!participant || participant.leftAt) {
      throw new NotFoundError('User is not a participant in this conversation');
    }

    // Mark as left
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId: removeUserId,
        },
      },
      data: {
        leftAt: new Date(),
      },
    });

    // Add system message
    const actionText = removeUserId === removedByUserId ? 'left' : 'was removed from';
    await this.sendMessage(
      conversationId,
      {
        content: `${participant.user.firstName} ${participant.user.lastName} ${actionText} the conversation`,
        messageType: 'system',
      },
      removedByUserId
    );
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    // Get all conversations the user is in
    const participations = await prisma.conversationParticipant.findMany({
      where: {
        userId,
        leftAt: null,
      },
      select: { conversationId: true },
    });

    const conversationIds = participations.map((p) => p.conversationId);

    // Get all conversations with unread counts
    const conversations = await prisma.conversation.findMany({
      where: {
        id: { in: conversationIds },
      },
      select: {
        unreadCounts: true,
      },
    });

    // Sum up unread counts for this user
    let totalUnread = 0;
    for (const conv of conversations) {
      const counts = conv.unreadCounts as Record<string, number>;
      totalUnread += counts[userId] || 0;
    }

    return totalUnread;
  }
}

export const messagingService = new MessagingService();
