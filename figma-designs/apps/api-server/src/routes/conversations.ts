import { Router } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest, authMiddleware } from '../middleware/auth';
import { messagingService } from '../services/messagingService';

const router = Router();

// Validation schemas
const createConversationSchema = z.object({
  teamId: z.string().uuid().optional(),
  companyId: z.string().uuid().optional(),
  opportunityId: z.string().uuid().optional(),
  subject: z.string().max(200).optional(),
  participantIds: z.array(z.string().uuid()).min(1),
  initialMessage: z.object({
    content: z.string().min(1).max(10000),
    messageType: z.enum(['text', 'file', 'system', 'video_invite']).default('text'),
  }).optional(),
});

const sendMessageSchema = z.object({
  content: z.string().min(1).max(10000),
  messageType: z.enum(['text', 'file', 'system', 'video_invite']).default('text'),
  replyToId: z.string().uuid().optional(),
  attachments: z.array(z.object({
    url: z.string().url(),
    filename: z.string(),
    fileType: z.string(),
    fileSize: z.number(),
  })).optional(),
  metadata: z.record(z.any()).optional(),
});

const updateConversationSchema = z.object({
  subject: z.string().max(200).optional(),
  status: z.enum(['active', 'archived', 'blocked']).optional(),
});

const editMessageSchema = z.object({
  content: z.string().min(1).max(10000),
});

const addParticipantSchema = z.object({
  userId: z.string().uuid(),
});

// ==========================================
// Conversation Routes
// ==========================================

// GET /api/conversations - List user's conversations
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { page, limit } = req.query;

  const result = await messagingService.getUserConversations(
    req.user!.id,
    page as string,
    limit as string
  );

  res.json({
    success: true,
    data: result,
  });
});

// GET /api/conversations/unread - Get unread count
router.get('/unread', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const count = await messagingService.getUnreadCount(req.user!.id);

  res.json({
    success: true,
    data: { unreadCount: count },
  });
});

// POST /api/conversations - Create a new conversation
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const validatedData = createConversationSchema.parse(req.body);

  const conversation = await messagingService.createConversation(
    validatedData,
    req.user!.id
  );

  // Emit socket event for new conversation
  const io = req.app.get('io');
  if (io) {
    // Notify all participants about the new conversation
    validatedData.participantIds.forEach((participantId) => {
      io.to(`user:${participantId}`).emit('new_conversation', {
        conversation,
      });
    });
  }

  res.status(201).json({
    success: true,
    data: conversation,
    message: 'Conversation created successfully',
  });
});

// GET /api/conversations/:id - Get conversation details
router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  const conversation = await messagingService.getConversationById(id, req.user!.id);

  res.json({
    success: true,
    data: conversation,
  });
});

// PUT /api/conversations/:id - Update conversation
router.put('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const validatedData = updateConversationSchema.parse(req.body);

  const conversation = await messagingService.updateConversation(
    id,
    validatedData,
    req.user!.id
  );

  // Emit socket event for conversation update
  const io = req.app.get('io');
  if (io) {
    io.to(`conversation:${id}`).emit('conversation_updated', { conversation });
  }

  res.json({
    success: true,
    data: conversation,
    message: 'Conversation updated successfully',
  });
});

// DELETE /api/conversations/:id - Archive conversation
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  await messagingService.archiveConversation(id, req.user!.id);

  res.json({
    success: true,
    message: 'Conversation archived successfully',
  });
});

// ==========================================
// Message Routes
// ==========================================

// GET /api/conversations/:id/messages - Get messages
router.get('/:id/messages', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { page, limit } = req.query;

  const result = await messagingService.getConversationMessages(
    id,
    req.user!.id,
    page as string,
    limit as string
  );

  res.json({
    success: true,
    data: result,
  });
});

// POST /api/conversations/:id/messages - Send a message
router.post('/:id/messages', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const validatedData = sendMessageSchema.parse(req.body);

  const message = await messagingService.sendMessage(
    id,
    validatedData,
    req.user!.id
  );

  // Emit socket event for new message
  const io = req.app.get('io');
  if (io) {
    io.to(`conversation:${id}`).emit('new_message', {
      message,
      conversationId: id,
    });
  }

  res.status(201).json({
    success: true,
    data: message,
    message: 'Message sent successfully',
  });
});

// PUT /api/conversations/:id/messages/:messageId - Edit a message
router.put('/:id/messages/:messageId', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { id, messageId } = req.params;
  const { content } = editMessageSchema.parse(req.body);

  const message = await messagingService.editMessage(messageId, content, req.user!.id);

  // Emit socket event for message update
  const io = req.app.get('io');
  if (io) {
    io.to(`conversation:${id}`).emit('message_updated', {
      message,
      conversationId: id,
    });
  }

  res.json({
    success: true,
    data: message,
    message: 'Message updated successfully',
  });
});

// DELETE /api/conversations/:id/messages/:messageId - Delete a message
router.delete('/:id/messages/:messageId', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { id, messageId } = req.params;

  await messagingService.deleteMessage(messageId, req.user!.id);

  // Emit socket event for message deletion
  const io = req.app.get('io');
  if (io) {
    io.to(`conversation:${id}`).emit('message_deleted', {
      messageId,
      conversationId: id,
    });
  }

  res.json({
    success: true,
    message: 'Message deleted successfully',
  });
});

// POST /api/conversations/:id/read - Mark messages as read
router.post('/:id/read', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  await messagingService.markMessagesAsRead(id, req.user!.id);

  // Emit socket event for read receipt
  const io = req.app.get('io');
  if (io) {
    // Get user info for the read receipt
    io.to(`conversation:${id}`).emit('messages_read', {
      conversationId: id,
      userId: req.user!.id,
      readAt: new Date().toISOString(),
    });
  }

  res.json({
    success: true,
    message: 'Messages marked as read',
  });
});

// ==========================================
// Participant Routes
// ==========================================

// POST /api/conversations/:id/participants - Add participant
router.post('/:id/participants', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { userId } = addParticipantSchema.parse(req.body);

  const participant = await messagingService.addParticipant(id, userId, req.user!.id);

  // Emit socket event for participant joining
  const io = req.app.get('io');
  if (io) {
    io.to(`conversation:${id}`).emit('participant_joined', {
      conversationId: id,
      participant,
    });
    // Also notify the new participant
    io.to(`user:${userId}`).emit('added_to_conversation', {
      conversationId: id,
    });
  }

  res.status(201).json({
    success: true,
    data: participant,
    message: 'Participant added successfully',
  });
});

// DELETE /api/conversations/:id/participants/:userId - Remove participant
router.delete('/:id/participants/:userId', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { id, userId } = req.params;

  await messagingService.removeParticipant(id, userId, req.user!.id);

  // Emit socket event for participant leaving
  const io = req.app.get('io');
  if (io) {
    io.to(`conversation:${id}`).emit('participant_left', {
      conversationId: id,
      userId,
    });
  }

  res.json({
    success: true,
    message: 'Participant removed successfully',
  });
});

export default router;
