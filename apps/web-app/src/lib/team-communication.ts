export type MessageType = 'text' | 'file' | 'system' | 'announcement';
export type MessageStatus = 'sent' | 'delivered' | 'read';
export type ChannelType = 'general' | 'announcements' | 'private' | 'project';

export interface TeamMessage {
  id?: string;
  channelId: string;
  teamId: string;
  senderId: string;
  senderName: string;
  senderRole?: string;
  type: MessageType;
  content: string;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    downloadUrl?: string;
    mentions?: string[];
    parentMessageId?: string;
    isEdited?: boolean;
    editedAt?: Date;
  };
  status: MessageStatus;
  reactions?: MessageReaction[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  isDeleted?: boolean;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface TeamChannel {
  id?: string;
  teamId: string;
  name: string;
  description?: string;
  type: ChannelType;
  isPrivate: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  members: string[];
  lastMessage?: { content: string; senderName: string; timestamp: Date };
  messageCount: number;
  isArchived: boolean;
  settings: {
    allowReactions: boolean;
    allowFileSharing: boolean;
    allowMentions: boolean;
    restrictToAdmins: boolean;
  };
}

export interface TeamAnnouncement {
  id?: string;
  teamId: string;
  channelId?: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  createdBy: string;
  createdByName: string;
  targetAudience: 'all' | 'admins' | 'leaders' | string[];
  isPinned: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  readBy: { userId: string; readAt: Date }[];
}

export interface ChatParticipant {
  userId: string;
  userName: string;
  role: string;
  lastSeen: Date;
  isOnline: boolean;
  isTyping: boolean;
  unreadCount: number;
}

const isDemoEntity = (id: string): boolean => {
  return id?.includes('demo') || id === 'demo@example.com' || id === 'company@example.com';
};

const DEMO_CHANNELS: TeamChannel[] = [
  {
    id: 'demo-channel-001',
    teamId: 'demo-team-001',
    name: 'General',
    description: 'General team discussion',
    type: 'general',
    isPrivate: false,
    createdBy: 'demo@example.com',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    members: ['demo@example.com'],
    lastMessage: { content: 'Welcome to the team!', senderName: 'Alex Chen', timestamp: new Date() },
    messageCount: 45,
    isArchived: false,
    settings: { allowReactions: true, allowFileSharing: true, allowMentions: true, restrictToAdmins: false },
  },
];

const DEMO_MESSAGES: TeamMessage[] = [
  {
    id: 'demo-msg-001',
    channelId: 'demo-channel-001',
    teamId: 'demo-team-001',
    senderId: 'demo@example.com',
    senderName: 'Alex Chen',
    type: 'text',
    content: 'Welcome to the team communication channel!',
    status: 'read',
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000),
    reactions: [],
  },
];

class TeamCommunicationService {
  async createChannel(channelData: Omit<TeamChannel, 'id' | 'createdAt' | 'updatedAt' | 'messageCount'>): Promise<string> {
    if (isDemoEntity(channelData.teamId)) {
      console.log(`[Demo] Creating channel: ${channelData.name}`);
      return `demo-channel-${Date.now()}`;
    }

    try {
      const response = await fetch('/api/teams/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(channelData),
      });
      if (!response.ok) throw new Error('Failed to create channel');
      const result = await response.json();
      return result.channelId || result.data?.channelId || '';
    } catch (error) {
      console.error('Error creating channel:', error);
      throw error;
    }
  }

  async getTeamChannels(teamId: string): Promise<TeamChannel[]> {
    if (isDemoEntity(teamId)) {
      return DEMO_CHANNELS.filter(c => c.teamId === teamId || teamId.includes('demo'));
    }

    try {
      const response = await fetch(`/api/teams/${teamId}/channels`);
      if (!response.ok) return [];
      const result = await response.json();
      return result.channels || result.data || [];
    } catch (error) {
      console.error('Error getting channels:', error);
      return [];
    }
  }

  async getUserChannels(teamId: string, userId: string): Promise<TeamChannel[]> {
    const channels = await this.getTeamChannels(teamId);
    return channels.filter(channel => !channel.isPrivate || channel.members.includes(userId) || channel.createdBy === userId);
  }

  async updateChannel(channelId: string, updates: Partial<TeamChannel>): Promise<void> {
    if (channelId.startsWith('demo-')) {
      console.log(`[Demo] Updating channel: ${channelId}`);
      return;
    }

    try {
      const response = await fetch(`/api/teams/channels/${channelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update channel');
    } catch (error) {
      console.error('Error updating channel:', error);
      throw error;
    }
  }

  async addChannelMember(channelId: string, userId: string): Promise<void> {
    if (channelId.startsWith('demo-')) {
      console.log(`[Demo] Adding member ${userId} to channel`);
      return;
    }

    try {
      const response = await fetch(`/api/teams/channels/${channelId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to add channel member');
    } catch (error) {
      console.error('Error adding channel member:', error);
      throw error;
    }
  }

  async removeChannelMember(channelId: string, userId: string): Promise<void> {
    if (channelId.startsWith('demo-')) {
      console.log(`[Demo] Removing member ${userId} from channel`);
      return;
    }

    try {
      const response = await fetch(`/api/teams/channels/${channelId}/members/${userId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to remove channel member');
    } catch (error) {
      console.error('Error removing channel member:', error);
      throw error;
    }
  }

  async sendMessage(messageData: Omit<TeamMessage, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (isDemoEntity(messageData.teamId)) {
      console.log(`[Demo] Sending message in channel ${messageData.channelId}`);
      return `demo-msg-${Date.now()}`;
    }

    try {
      const response = await fetch('/api/teams/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });
      if (!response.ok) throw new Error('Failed to send message');
      const result = await response.json();
      return result.messageId || result.data?.messageId || '';
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getChannelMessages(channelId: string, limitCount: number = 50): Promise<TeamMessage[]> {
    if (channelId.startsWith('demo-')) {
      return DEMO_MESSAGES.filter(m => m.channelId === channelId).slice(-limitCount);
    }

    try {
      const response = await fetch(`/api/teams/channels/${channelId}/messages?limit=${limitCount}`);
      if (!response.ok) return [];
      const result = await response.json();
      return result.messages || result.data || [];
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  async editMessage(messageId: string, newContent: string, userId: string): Promise<void> {
    if (messageId.startsWith('demo-')) {
      console.log(`[Demo] Editing message ${messageId}`);
      return;
    }

    try {
      const response = await fetch(`/api/teams/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent, userId }),
      });
      if (!response.ok) throw new Error('Failed to edit message');
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    if (messageId.startsWith('demo-')) {
      console.log(`[Demo] Deleting message ${messageId}`);
      return;
    }

    try {
      const response = await fetch(`/api/teams/messages/${messageId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to delete message');
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  async addReaction(messageId: string, emoji: string, userId: string, userName: string): Promise<void> {
    if (messageId.startsWith('demo-')) {
      console.log(`[Demo] Adding reaction ${emoji} to message ${messageId}`);
      return;
    }

    try {
      const response = await fetch(`/api/teams/messages/${messageId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji, userId, userName }),
      });
      if (!response.ok) throw new Error('Failed to add reaction');
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  }

  async createAnnouncement(announcementData: Omit<TeamAnnouncement, 'id' | 'createdAt' | 'updatedAt' | 'readBy'>): Promise<string> {
    if (isDemoEntity(announcementData.teamId)) {
      console.log(`[Demo] Creating announcement: ${announcementData.title}`);
      return `demo-announcement-${Date.now()}`;
    }

    try {
      const response = await fetch('/api/teams/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcementData),
      });
      if (!response.ok) throw new Error('Failed to create announcement');
      const result = await response.json();
      return result.announcementId || result.data?.announcementId || '';
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  }

  async getTeamAnnouncements(teamId: string): Promise<TeamAnnouncement[]> {
    if (isDemoEntity(teamId)) {
      return [];
    }

    try {
      const response = await fetch(`/api/teams/${teamId}/announcements`);
      if (!response.ok) return [];
      const result = await response.json();
      return result.announcements || result.data || [];
    } catch (error) {
      console.error('Error getting announcements:', error);
      return [];
    }
  }

  async markAnnouncementAsRead(announcementId: string, userId: string): Promise<void> {
    if (announcementId.startsWith('demo-')) {
      console.log(`[Demo] Marking announcement ${announcementId} as read`);
      return;
    }

    try {
      const response = await fetch(`/api/teams/announcements/${announcementId}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to mark announcement as read');
    } catch (error) {
      console.error('Error marking announcement as read:', error);
      throw error;
    }
  }

  subscribeToChannelMessages(channelId: string, callback: (messages: TeamMessage[]) => void, limitCount: number = 50): () => void {
    // For demo, return a no-op unsubscribe
    if (channelId.startsWith('demo-')) {
      callback(DEMO_MESSAGES.filter(m => m.channelId === channelId).slice(-limitCount));
      return () => {};
    }
    // Real-time subscriptions would use WebSocket or SSE in production
    console.log('Real-time subscriptions not implemented - use polling instead');
    return () => {};
  }

  subscribeToTeamChannels(teamId: string, callback: (channels: TeamChannel[]) => void): () => void {
    if (isDemoEntity(teamId)) {
      callback(DEMO_CHANNELS.filter(c => c.teamId === teamId || teamId.includes('demo')));
      return () => {};
    }
    console.log('Real-time subscriptions not implemented - use polling instead');
    return () => {};
  }

  async searchMessages(teamId: string, searchTerm: string, channelId?: string): Promise<TeamMessage[]> {
    if (isDemoEntity(teamId)) {
      return DEMO_MESSAGES.filter(m => m.content.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    try {
      const params = new URLSearchParams({ q: searchTerm });
      if (channelId) params.set('channelId', channelId);
      const response = await fetch(`/api/teams/${teamId}/messages/search?${params}`);
      if (!response.ok) return [];
      const result = await response.json();
      return result.messages || result.data || [];
    } catch (error) {
      console.error('Error searching messages:', error);
      return [];
    }
  }
}

export const teamCommunicationService = new TeamCommunicationService();
