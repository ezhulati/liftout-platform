/**
 * Mock conversations and messages data for demo/fallback when API server is unavailable
 */

export interface MockMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface MockConversation {
  id: string;
  title: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  }[];
  lastMessage?: {
    content: string;
    timestamp: string;
    senderId: string;
  };
  unreadCount: number;
  opportunityId?: string;
  opportunityTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockConversations: MockConversation[] = [
  {
    id: 'conv_mock_001',
    title: 'Goldman Sachs - Strategic FinTech Analytics Discussion',
    participants: [
      { id: '1', name: 'Alex Chen', role: 'Team Lead' },
      { id: 'gs_001', name: 'Jennifer Walsh', role: 'VP Talent Acquisition', avatar: '/avatars/jennifer.jpg' },
      { id: 'gs_002', name: 'Michael Torres', role: 'Director of Analytics' }
    ],
    lastMessage: {
      content: 'We would love to schedule a follow-up call to discuss the team integration plan in more detail.',
      timestamp: '2025-01-30T15:30:00Z',
      senderId: 'gs_001'
    },
    unreadCount: 2,
    opportunityId: 'opp_mock_001',
    opportunityTitle: 'Strategic FinTech Analytics Team',
    createdAt: '2025-01-28T10:00:00Z',
    updatedAt: '2025-01-30T15:30:00Z'
  },
  {
    id: 'conv_mock_002',
    title: 'MedTech Innovations - Healthcare AI Interview Prep',
    participants: [
      { id: '1', name: 'Alex Chen', role: 'Team Lead' },
      { id: 'mt_001', name: 'Dr. Sarah Patel', role: 'CTO', avatar: '/avatars/sarah.jpg' }
    ],
    lastMessage: {
      content: 'Looking forward to meeting your team on February 5th. Please prepare a brief presentation on your most impactful ML project.',
      timestamp: '2025-02-01T11:00:00Z',
      senderId: 'mt_001'
    },
    unreadCount: 1,
    opportunityId: 'opp_mock_002',
    opportunityTitle: 'Healthcare AI Research Team',
    createdAt: '2025-01-26T09:00:00Z',
    updatedAt: '2025-02-01T11:00:00Z'
  },
  {
    id: 'conv_mock_003',
    title: 'Platform Introduction - Sterling Partners',
    participants: [
      { id: '1', name: 'Alex Chen', role: 'Team Lead' },
      { id: 'sp_001', name: 'Robert Chen', role: 'Managing Partner' }
    ],
    lastMessage: {
      content: 'Thank you for your interest. While your team\'s expertise is impressive, we\'re specifically looking for teams with M&A deal experience. Happy to reconnect if your focus shifts.',
      timestamp: '2025-01-29T14:00:00Z',
      senderId: 'sp_001'
    },
    unreadCount: 0,
    createdAt: '2025-01-27T16:00:00Z',
    updatedAt: '2025-01-29T14:00:00Z'
  }
];

export const mockMessages: Record<string, MockMessage[]> = {
  'conv_mock_001': [
    {
      id: 'msg_001_1',
      conversationId: 'conv_mock_001',
      senderId: '1',
      senderName: 'Alex Chen',
      content: 'Thank you for considering our team for this opportunity. We\'re very excited about the prospect of joining Goldman Sachs.',
      timestamp: '2025-01-28T10:05:00Z',
      read: true
    },
    {
      id: 'msg_001_2',
      conversationId: 'conv_mock_001',
      senderId: 'gs_001',
      senderName: 'Jennifer Walsh',
      content: 'Hi Alex, thanks for your application. Your team\'s track record is impressive. Could you tell us more about your experience with real-time trading systems?',
      timestamp: '2025-01-28T14:30:00Z',
      read: true
    },
    {
      id: 'msg_001_3',
      conversationId: 'conv_mock_001',
      senderId: '1',
      senderName: 'Alex Chen',
      content: 'Absolutely! We\'ve built several real-time analytics pipelines processing 1M+ events per second. Our most recent project reduced trading signal latency by 40%.',
      timestamp: '2025-01-29T09:00:00Z',
      read: true
    },
    {
      id: 'msg_001_4',
      conversationId: 'conv_mock_001',
      senderId: 'gs_002',
      senderName: 'Michael Torres',
      content: 'That\'s exactly the kind of experience we\'re looking for. I\'d love to hear more about the technical architecture.',
      timestamp: '2025-01-29T16:00:00Z',
      read: true
    },
    {
      id: 'msg_001_5',
      conversationId: 'conv_mock_001',
      senderId: 'gs_001',
      senderName: 'Jennifer Walsh',
      content: 'We would love to schedule a follow-up call to discuss the team integration plan in more detail.',
      timestamp: '2025-01-30T15:30:00Z',
      read: false
    }
  ],
  'conv_mock_002': [
    {
      id: 'msg_002_1',
      conversationId: 'conv_mock_002',
      senderId: 'mt_001',
      senderName: 'Dr. Sarah Patel',
      content: 'Hi Alex, I\'ve reviewed your team\'s application. While your background is in fintech, I see strong transferable ML skills. Would your team be open to healthcare applications?',
      timestamp: '2025-01-26T09:15:00Z',
      read: true
    },
    {
      id: 'msg_002_2',
      conversationId: 'conv_mock_002',
      senderId: '1',
      senderName: 'Alex Chen',
      content: 'Absolutely, Dr. Patel. Healthcare AI is a field we\'ve been wanting to explore. The challenge of improving patient outcomes with technology is very motivating for our team.',
      timestamp: '2025-01-26T11:00:00Z',
      read: true
    },
    {
      id: 'msg_002_3',
      conversationId: 'conv_mock_002',
      senderId: 'mt_001',
      senderName: 'Dr. Sarah Patel',
      content: 'Great to hear! I\'d like to schedule an interview with our leadership team. How does February 5th at 3pm EST work for your team?',
      timestamp: '2025-01-28T10:00:00Z',
      read: true
    },
    {
      id: 'msg_002_4',
      conversationId: 'conv_mock_002',
      senderId: '1',
      senderName: 'Alex Chen',
      content: 'February 5th works perfectly for us. We\'ll make sure the whole team is available.',
      timestamp: '2025-01-28T14:00:00Z',
      read: true
    },
    {
      id: 'msg_002_5',
      conversationId: 'conv_mock_002',
      senderId: 'mt_001',
      senderName: 'Dr. Sarah Patel',
      content: 'Looking forward to meeting your team on February 5th. Please prepare a brief presentation on your most impactful ML project.',
      timestamp: '2025-02-01T11:00:00Z',
      read: false
    }
  ],
  'conv_mock_003': [
    {
      id: 'msg_003_1',
      conversationId: 'conv_mock_003',
      senderId: '1',
      senderName: 'Alex Chen',
      content: 'Hello Mr. Chen, our team noticed your M&A advisory opportunity. While we\'re primarily data science focused, we\'ve supported due diligence efforts with predictive analytics.',
      timestamp: '2025-01-27T16:05:00Z',
      read: true
    },
    {
      id: 'msg_003_2',
      conversationId: 'conv_mock_003',
      senderId: 'sp_001',
      senderName: 'Robert Chen',
      content: 'Thank you for your interest. While your team\'s expertise is impressive, we\'re specifically looking for teams with M&A deal experience. Happy to reconnect if your focus shifts.',
      timestamp: '2025-01-29T14:00:00Z',
      read: true
    }
  ]
};

// In-memory storage
let conversations = [...mockConversations];
let messages = { ...mockMessages };

/**
 * Get all conversations for a user
 */
export function getMockConversations(userId: string): MockConversation[] {
  return conversations.filter(conv =>
    conv.participants.some(p => p.id === userId)
  );
}

/**
 * Get a single conversation by ID
 */
export function getMockConversationById(id: string): MockConversation | null {
  return conversations.find(conv => conv.id === id) || null;
}

/**
 * Get messages for a conversation
 */
export function getMockMessages(conversationId: string): MockMessage[] {
  return messages[conversationId] || [];
}

/**
 * Create a new conversation
 */
export function createMockConversation(data: {
  title: string;
  participants: MockConversation['participants'];
  opportunityId?: string;
  opportunityTitle?: string;
}): MockConversation {
  const newConv: MockConversation = {
    id: `conv_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: data.title,
    participants: data.participants,
    unreadCount: 0,
    opportunityId: data.opportunityId,
    opportunityTitle: data.opportunityTitle,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  conversations.push(newConv);
  messages[newConv.id] = [];
  return newConv;
}

/**
 * Add a message to a conversation
 */
export function addMockMessage(data: {
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
}): MockMessage | null {
  const conversation = conversations.find(c => c.id === data.conversationId);
  if (!conversation) return null;

  const newMessage: MockMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    conversationId: data.conversationId,
    senderId: data.senderId,
    senderName: data.senderName,
    content: data.content,
    timestamp: new Date().toISOString(),
    read: false
  };

  if (!messages[data.conversationId]) {
    messages[data.conversationId] = [];
  }
  messages[data.conversationId].push(newMessage);

  // Update conversation
  const convIndex = conversations.findIndex(c => c.id === data.conversationId);
  if (convIndex !== -1) {
    conversations[convIndex].lastMessage = {
      content: data.content,
      timestamp: newMessage.timestamp,
      senderId: data.senderId
    };
    conversations[convIndex].updatedAt = newMessage.timestamp;
  }

  return newMessage;
}

/**
 * Mark messages as read
 */
export function markMessagesAsRead(conversationId: string, userId: string): void {
  if (messages[conversationId]) {
    messages[conversationId] = messages[conversationId].map(msg => ({
      ...msg,
      read: msg.senderId !== userId ? true : msg.read
    }));
  }

  const convIndex = conversations.findIndex(c => c.id === conversationId);
  if (convIndex !== -1) {
    conversations[convIndex].unreadCount = 0;
  }
}

/**
 * Reset conversations to initial mock data
 */
export function resetMockConversations(): void {
  conversations = [...mockConversations];
  messages = { ...mockMessages };
}
