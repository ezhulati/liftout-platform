/**
 * Demo conversations and messages for showcasing the messaging feature
 * These are shown to demo users who don't have real API access
 */

import { Conversation, Message, Participant } from '@/hooks/useConversations';

// Demo user IDs (matching demo accounts)
const DEMO_TEAM_USER_ID = 'demo-team-user';
const DEMO_COMPANY_USER_ID = 'demo-company-user';

// Demo participants
const demoTeamUser: Participant = {
  id: 'participant-1',
  userId: DEMO_TEAM_USER_ID,
  role: 'team_lead',
  joinedAt: '2024-01-15T10:00:00Z',
  leftAt: null,
  lastReadAt: new Date().toISOString(),
  user: {
    id: DEMO_TEAM_USER_ID,
    firstName: 'Alex',
    lastName: 'Chen',
    profile: {
      title: 'Team Lead - Analytics',
      profilePhotoUrl: undefined,
    },
  },
};

const demoCompanyUser: Participant = {
  id: 'participant-2',
  userId: DEMO_COMPANY_USER_ID,
  role: 'company_rep',
  joinedAt: '2024-01-15T10:00:00Z',
  leftAt: null,
  lastReadAt: '2024-01-20T14:30:00Z',
  user: {
    id: DEMO_COMPANY_USER_ID,
    firstName: 'Sarah',
    lastName: 'Mitchell',
    profile: {
      title: 'VP of Talent Acquisition',
      profilePhotoUrl: undefined,
    },
  },
};

// Demo conversations
export const demoConversations: Conversation[] = [
  {
    id: 'conv-demo-1',
    teamId: 'team-demo-1',
    companyId: 'company-demo-1',
    opportunityId: 'opp-demo-1',
    subject: 'Strategic Analytics Team - Goldman Sachs Opportunity',
    status: 'active',
    isAnonymous: false,
    lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    messageCount: 12,
    unreadCounts: {
      [DEMO_TEAM_USER_ID]: 2,
      [DEMO_COMPANY_USER_ID]: 0,
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    participants: [demoTeamUser, demoCompanyUser],
  },
  {
    id: 'conv-demo-2',
    teamId: 'team-demo-1',
    companyId: 'company-demo-2',
    subject: 'MedTech Innovations - Healthcare AI Team Discussion',
    status: 'active',
    isAnonymous: false,
    lastMessageAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    messageCount: 8,
    unreadCounts: {
      [DEMO_TEAM_USER_ID]: 0,
      [DEMO_COMPANY_USER_ID]: 0,
    },
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    participants: [
      demoTeamUser,
      {
        ...demoCompanyUser,
        id: 'participant-3',
        user: {
          id: 'company-user-2',
          firstName: 'Michael',
          lastName: 'Rodriguez',
          profile: {
            title: 'Chief People Officer',
            profilePhotoUrl: undefined,
          },
        },
      },
    ],
  },
  {
    id: 'conv-demo-3',
    subject: 'Confidential - Fortune 500 European Expansion',
    status: 'active',
    isAnonymous: true,
    lastMessageAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    messageCount: 5,
    unreadCounts: {
      [DEMO_TEAM_USER_ID]: 0,
      [DEMO_COMPANY_USER_ID]: 0,
    },
    createdAt: '2024-01-08T09:00:00Z',
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    participants: [
      demoTeamUser,
      {
        ...demoCompanyUser,
        id: 'participant-4',
        user: {
          id: 'company-user-3',
          firstName: 'Confidential',
          lastName: 'Recruiter',
          profile: {
            title: 'Executive Search',
            profilePhotoUrl: undefined,
          },
        },
      },
    ],
  },
];

// Demo messages for conversation 1 (Goldman Sachs)
export const demoMessagesConv1: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-demo-1',
    senderId: DEMO_COMPANY_USER_ID,
    content: "Hi Alex, I'm Sarah from Goldman Sachs. We've been reviewing your team's profile and are very impressed with your analytics capabilities. Would love to discuss the Strategic FinTech Analytics opportunity with you.",
    messageType: 'text',
    attachments: [],
    sentAt: '2024-01-15T10:05:00Z',
    editedAt: null,
    deletedAt: null,
    sender: demoCompanyUser.user,
  },
  {
    id: 'msg-2',
    conversationId: 'conv-demo-1',
    senderId: DEMO_TEAM_USER_ID,
    content: "Hi Sarah, thank you for reaching out! We've actually been following Goldman's digital transformation initiatives and this opportunity aligns well with our expertise. Our team has 5 years of experience working together on quantitative finance projects.",
    messageType: 'text',
    attachments: [],
    sentAt: '2024-01-15T11:30:00Z',
    editedAt: null,
    deletedAt: null,
    sender: demoTeamUser.user,
  },
  {
    id: 'msg-3',
    conversationId: 'conv-demo-1',
    senderId: DEMO_COMPANY_USER_ID,
    content: "That's exactly what we're looking for. The team would report to our Chief Analytics Officer and work on predictive models for market risk. Can you tell me more about your team's experience with real-time data processing?",
    messageType: 'text',
    attachments: [],
    sentAt: '2024-01-15T14:00:00Z',
    editedAt: null,
    deletedAt: null,
    sender: demoCompanyUser.user,
  },
  {
    id: 'msg-4',
    conversationId: 'conv-demo-1',
    senderId: DEMO_TEAM_USER_ID,
    content: "We've built several real-time analytics pipelines processing millions of events per second. Our tech stack includes Apache Kafka, Spark Streaming, and custom ML models deployed on Kubernetes. I can share some case studies if that would be helpful.",
    messageType: 'text',
    attachments: [],
    sentAt: '2024-01-15T15:45:00Z',
    editedAt: null,
    deletedAt: null,
    sender: demoTeamUser.user,
  },
  {
    id: 'msg-5',
    conversationId: 'conv-demo-1',
    senderId: DEMO_COMPANY_USER_ID,
    content: "Yes, please share those case studies. Also, I wanted to mention that we're looking at compensation in the $180k-$250k range per team member, plus equity. We're flexible on remote work - hybrid arrangements are possible.",
    messageType: 'text',
    attachments: [],
    sentAt: '2024-01-16T09:00:00Z',
    editedAt: null,
    deletedAt: null,
    sender: demoCompanyUser.user,
  },
  {
    id: 'msg-6',
    conversationId: 'conv-demo-1',
    senderId: DEMO_TEAM_USER_ID,
    content: "That compensation range works well for our team. I've uploaded our portfolio document which includes three relevant case studies. When would be a good time for an initial team call?",
    messageType: 'text',
    attachments: [
      {
        id: 'attach-1',
        filename: 'Team_Portfolio_2024.pdf',
        fileType: 'application/pdf',
        fileSize: 2500000,
        url: '#',
        documentType: 'portfolio',
      },
    ],
    sentAt: '2024-01-16T10:30:00Z',
    editedAt: null,
    deletedAt: null,
    sender: demoTeamUser.user,
  },
  {
    id: 'msg-7',
    conversationId: 'conv-demo-1',
    senderId: DEMO_COMPANY_USER_ID,
    content: "Perfect, I've reviewed the portfolio - very impressive work on the fraud detection system. How about next Tuesday at 2pm EST for a video call? I'll have our CAO and a technical lead join.",
    messageType: 'text',
    attachments: [],
    sentAt: '2024-01-17T11:00:00Z',
    editedAt: null,
    deletedAt: null,
    sender: demoCompanyUser.user,
  },
  {
    id: 'msg-8',
    conversationId: 'conv-demo-1',
    senderId: DEMO_TEAM_USER_ID,
    content: "Tuesday at 2pm EST works great. All four team members will be available. Should we prepare anything specific for the call?",
    messageType: 'text',
    attachments: [],
    sentAt: '2024-01-17T14:15:00Z',
    editedAt: null,
    deletedAt: null,
    sender: demoTeamUser.user,
  },
  {
    id: 'msg-9',
    conversationId: 'conv-demo-1',
    senderId: DEMO_COMPANY_USER_ID,
    content: "A brief presentation on your most complex project would be great - maybe 15-20 minutes. We'll discuss the role in detail and answer any questions your team has. I'll send calendar invites shortly.",
    messageType: 'text',
    attachments: [],
    sentAt: '2024-01-18T09:30:00Z',
    editedAt: null,
    deletedAt: null,
    sender: demoCompanyUser.user,
  },
  {
    id: 'msg-10',
    conversationId: 'conv-demo-1',
    senderId: DEMO_TEAM_USER_ID,
    content: "Sounds perfect. We'll prepare a presentation on our real-time risk analytics platform. Looking forward to the call!",
    messageType: 'text',
    attachments: [],
    sentAt: '2024-01-18T10:00:00Z',
    editedAt: null,
    deletedAt: null,
    sender: demoTeamUser.user,
  },
  {
    id: 'msg-11',
    conversationId: 'conv-demo-1',
    senderId: DEMO_COMPANY_USER_ID,
    content: "Great! Just sent the calendar invite. Also, I wanted to let you know that we're moving quickly on this - we'd like to make a decision within 3 weeks. Is that timeline workable for your team?",
    messageType: 'text',
    attachments: [],
    sentAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    editedAt: null,
    deletedAt: null,
    sender: demoCompanyUser.user,
  },
  {
    id: 'msg-12',
    conversationId: 'conv-demo-1',
    senderId: DEMO_COMPANY_USER_ID,
    content: "Also, before the call, could you confirm everyone's availability for a potential start date in March? We want to ensure we can align on timing.",
    messageType: 'text',
    attachments: [],
    sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    editedAt: null,
    deletedAt: null,
    sender: demoCompanyUser.user,
  },
];

// Demo messages for conversation 2 (MedTech)
export const demoMessagesConv2: Message[] = [
  {
    id: 'msg-conv2-1',
    conversationId: 'conv-demo-2',
    senderId: 'company-user-2',
    content: "Hello! I'm Michael from MedTech Innovations. We're building out our AI/ML capabilities and your team's background in healthcare data caught our attention.",
    messageType: 'text',
    attachments: [],
    sentAt: '2024-01-10T14:05:00Z',
    editedAt: null,
    deletedAt: null,
    sender: {
      id: 'company-user-2',
      firstName: 'Michael',
      lastName: 'Rodriguez',
      profile: {
        profilePhotoUrl: undefined,
      },
    },
  },
  {
    id: 'msg-conv2-2',
    conversationId: 'conv-demo-2',
    senderId: DEMO_TEAM_USER_ID,
    content: "Hi Michael! Thanks for reaching out. Healthcare AI is definitely our sweet spot - we've worked on diagnostic imaging and patient outcome prediction models. Tell me more about what you're building.",
    messageType: 'text',
    attachments: [],
    sentAt: '2024-01-10T15:30:00Z',
    editedAt: null,
    deletedAt: null,
    sender: demoTeamUser.user,
  },
  {
    id: 'msg-conv2-3',
    conversationId: 'conv-demo-2',
    senderId: 'company-user-2',
    content: "We're developing a platform for early disease detection using medical imaging. The total compensation package is $200k-$300k including equity. We're also offering relocation assistance to our Boston HQ.",
    messageType: 'text',
    attachments: [],
    sentAt: '2024-01-11T10:00:00Z',
    editedAt: null,
    deletedAt: null,
    sender: {
      id: 'company-user-2',
      firstName: 'Michael',
      lastName: 'Rodriguez',
      profile: {
        profilePhotoUrl: undefined,
      },
    },
  },
];

// Demo messages for conversation 3 (Confidential)
export const demoMessagesConv3: Message[] = [
  {
    id: 'msg-conv3-1',
    conversationId: 'conv-demo-3',
    senderId: 'company-user-3',
    content: "This is a confidential inquiry regarding a strategic expansion opportunity in Europe. We're looking for an experienced analytics team to lead our new Frankfurt office.",
    messageType: 'text',
    attachments: [],
    sentAt: '2024-01-08T09:05:00Z',
    editedAt: null,
    deletedAt: null,
    sender: {
      id: 'company-user-3',
      firstName: 'Confidential',
      lastName: 'Recruiter',
      profile: {
        profilePhotoUrl: undefined,
      },
    },
  },
  {
    id: 'msg-conv3-2',
    conversationId: 'conv-demo-3',
    senderId: DEMO_TEAM_USER_ID,
    content: "Thank you for considering our team. International relocation is something we've discussed and would be open to. Can you share more details about the role and company once we sign an NDA?",
    messageType: 'text',
    attachments: [],
    sentAt: '2024-01-08T11:30:00Z',
    editedAt: null,
    deletedAt: null,
    sender: demoTeamUser.user,
  },
];

// Map of conversation ID to messages
export const demoMessagesByConversation: Record<string, Message[]> = {
  'conv-demo-1': demoMessagesConv1,
  'conv-demo-2': demoMessagesConv2,
  'conv-demo-3': demoMessagesConv3,
};

// Helper to get demo conversations for a specific user type
export function getDemoConversationsForUser(userType: 'team' | 'company'): Conversation[] {
  return demoConversations;
}

// Helper to get demo messages for a conversation
export function getDemoMessages(conversationId: string): Message[] {
  return demoMessagesByConversation[conversationId] || [];
}

// Helper to add a new demo message (stored in memory for the session)
let sessionMessages: Record<string, Message[]> = {};

export function addDemoMessage(conversationId: string, message: Omit<Message, 'id' | 'sentAt'>): Message {
  const newMessage: Message = {
    ...message,
    id: `msg-demo-${Date.now()}`,
    sentAt: new Date().toISOString(),
  };

  if (!sessionMessages[conversationId]) {
    sessionMessages[conversationId] = [...(demoMessagesByConversation[conversationId] || [])];
  }
  sessionMessages[conversationId].push(newMessage);

  return newMessage;
}

export function getMessagesWithSession(conversationId: string): Message[] {
  if (sessionMessages[conversationId]) {
    return sessionMessages[conversationId];
  }
  return demoMessagesByConversation[conversationId] || [];
}

// Reset session messages (useful for testing)
export function resetSessionMessages() {
  sessionMessages = {};
}
