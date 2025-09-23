import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

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
    mentions?: string[]; // User IDs mentioned in message
    parentMessageId?: string; // For replies
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
  members: string[]; // User IDs with access
  lastMessage?: {
    content: string;
    senderName: string;
    timestamp: Date;
  };
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
  targetAudience: 'all' | 'admins' | 'leaders' | string[]; // 'all', role names, or specific user IDs
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

class TeamCommunicationService {
  private readonly MESSAGES_COLLECTION = 'team_messages';
  private readonly CHANNELS_COLLECTION = 'team_channels';
  private readonly ANNOUNCEMENTS_COLLECTION = 'team_announcements';

  /**
   * Channel Management
   */
  
  async createChannel(channelData: Omit<TeamChannel, 'id' | 'createdAt' | 'updatedAt' | 'messageCount'>): Promise<string> {
    try {
      const channel: Omit<TeamChannel, 'id'> = {
        ...channelData,
        createdAt: new Date(),
        updatedAt: new Date(),
        messageCount: 0
      };

      const docRef = await addDoc(collection(db, this.CHANNELS_COLLECTION), {
        ...channel,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating channel:', error);
      throw error;
    }
  }

  async getTeamChannels(teamId: string): Promise<TeamChannel[]> {
    try {
      const q = query(
        collection(db, this.CHANNELS_COLLECTION),
        where('teamId', '==', teamId),
        where('isArchived', '==', false),
        orderBy('type'),
        orderBy('name')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamChannel[];
    } catch (error) {
      console.error('Error getting channels:', error);
      throw error;
    }
  }

  async getUserChannels(teamId: string, userId: string): Promise<TeamChannel[]> {
    try {
      const channels = await this.getTeamChannels(teamId);
      
      // Filter channels user has access to
      return channels.filter(channel => 
        !channel.isPrivate || 
        channel.members.includes(userId) ||
        channel.createdBy === userId
      );
    } catch (error) {
      console.error('Error getting user channels:', error);
      throw error;
    }
  }

  async updateChannel(channelId: string, updates: Partial<TeamChannel>): Promise<void> {
    try {
      const channelRef = doc(db, this.CHANNELS_COLLECTION, channelId);
      await updateDoc(channelRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating channel:', error);
      throw error;
    }
  }

  async addChannelMember(channelId: string, userId: string): Promise<void> {
    try {
      const channelRef = doc(db, this.CHANNELS_COLLECTION, channelId);
      const channelDoc = await getDoc(channelRef);
      
      if (!channelDoc.exists()) {
        throw new Error('Channel not found');
      }

      const channel = channelDoc.data() as TeamChannel;
      const updatedMembers = [...new Set([...channel.members, userId])];

      await updateDoc(channelRef, {
        members: updatedMembers,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding channel member:', error);
      throw error;
    }
  }

  async removeChannelMember(channelId: string, userId: string): Promise<void> {
    try {
      const channelRef = doc(db, this.CHANNELS_COLLECTION, channelId);
      const channelDoc = await getDoc(channelRef);
      
      if (!channelDoc.exists()) {
        throw new Error('Channel not found');
      }

      const channel = channelDoc.data() as TeamChannel;
      const updatedMembers = channel.members.filter(id => id !== userId);

      await updateDoc(channelRef, {
        members: updatedMembers,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error removing channel member:', error);
      throw error;
    }
  }

  /**
   * Message Management
   */

  async sendMessage(messageData: Omit<TeamMessage, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const message: Omit<TeamMessage, 'id'> = {
        ...messageData,
        status: 'sent',
        createdAt: new Date(),
        updatedAt: new Date(),
        reactions: []
      };

      const docRef = await addDoc(collection(db, this.MESSAGES_COLLECTION), {
        ...message,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Update channel's last message and message count
      await this.updateChannelLastMessage(messageData.channelId, {
        content: messageData.content,
        senderName: messageData.senderName,
        timestamp: new Date()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getChannelMessages(
    channelId: string, 
    limitCount: number = 50,
    startAfterDoc?: any
  ): Promise<TeamMessage[]> {
    try {
      let q = query(
        collection(db, this.MESSAGES_COLLECTION),
        where('channelId', '==', channelId),
        where('isDeleted', '!=', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }

      const snapshot = await getDocs(q);
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamMessage[];

      return messages.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  async editMessage(messageId: string, newContent: string, userId: string): Promise<void> {
    try {
      const messageRef = doc(db, this.MESSAGES_COLLECTION, messageId);
      const messageDoc = await getDoc(messageRef);

      if (!messageDoc.exists()) {
        throw new Error('Message not found');
      }

      const message = messageDoc.data() as TeamMessage;
      
      if (message.senderId !== userId) {
        throw new Error('You can only edit your own messages');
      }

      await updateDoc(messageRef, {
        content: newContent,
        'metadata.isEdited': true,
        'metadata.editedAt': serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    try {
      const messageRef = doc(db, this.MESSAGES_COLLECTION, messageId);
      const messageDoc = await getDoc(messageRef);

      if (!messageDoc.exists()) {
        throw new Error('Message not found');
      }

      const message = messageDoc.data() as TeamMessage;
      
      if (message.senderId !== userId) {
        throw new Error('You can only delete your own messages');
      }

      await updateDoc(messageRef, {
        isDeleted: true,
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  async addReaction(messageId: string, emoji: string, userId: string, userName: string): Promise<void> {
    try {
      const messageRef = doc(db, this.MESSAGES_COLLECTION, messageId);
      const messageDoc = await getDoc(messageRef);

      if (!messageDoc.exists()) {
        throw new Error('Message not found');
      }

      const message = messageDoc.data() as TeamMessage;
      const reactions = message.reactions || [];
      
      // Check if user already reacted with this emoji
      const existingReaction = reactions.find(r => r.userId === userId && r.emoji === emoji);
      
      if (existingReaction) {
        // Remove reaction
        const updatedReactions = reactions.filter(r => !(r.userId === userId && r.emoji === emoji));
        await updateDoc(messageRef, {
          reactions: updatedReactions,
          updatedAt: serverTimestamp()
        });
      } else {
        // Add reaction
        const newReaction: MessageReaction = {
          emoji,
          userId,
          userName,
          createdAt: new Date()
        };
        
        await updateDoc(messageRef, {
          reactions: [...reactions, newReaction],
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  }

  private async updateChannelLastMessage(
    channelId: string, 
    lastMessage: TeamChannel['lastMessage']
  ): Promise<void> {
    try {
      const channelRef = doc(db, this.CHANNELS_COLLECTION, channelId);
      const channelDoc = await getDoc(channelRef);
      
      if (channelDoc.exists()) {
        const channel = channelDoc.data() as TeamChannel;
        await updateDoc(channelRef, {
          lastMessage: lastMessage,
          messageCount: (channel.messageCount || 0) + 1,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating channel last message:', error);
    }
  }

  /**
   * Announcements
   */

  async createAnnouncement(announcementData: Omit<TeamAnnouncement, 'id' | 'createdAt' | 'updatedAt' | 'readBy'>): Promise<string> {
    try {
      const announcement: Omit<TeamAnnouncement, 'id'> = {
        ...announcementData,
        createdAt: new Date(),
        updatedAt: new Date(),
        readBy: []
      };

      const docRef = await addDoc(collection(db, this.ANNOUNCEMENTS_COLLECTION), {
        ...announcement,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  }

  async getTeamAnnouncements(teamId: string): Promise<TeamAnnouncement[]> {
    try {
      const q = query(
        collection(db, this.ANNOUNCEMENTS_COLLECTION),
        where('teamId', '==', teamId),
        orderBy('isPinned', 'desc'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamAnnouncement[];
    } catch (error) {
      console.error('Error getting announcements:', error);
      throw error;
    }
  }

  async markAnnouncementAsRead(announcementId: string, userId: string): Promise<void> {
    try {
      const announcementRef = doc(db, this.ANNOUNCEMENTS_COLLECTION, announcementId);
      const announcementDoc = await getDoc(announcementRef);

      if (!announcementDoc.exists()) {
        throw new Error('Announcement not found');
      }

      const announcement = announcementDoc.data() as TeamAnnouncement;
      const readBy = announcement.readBy || [];
      
      // Check if already read
      if (readBy.some(r => r.userId === userId)) {
        return;
      }

      const newReadEntry = {
        userId,
        readAt: new Date()
      };

      await updateDoc(announcementRef, {
        readBy: [...readBy, newReadEntry],
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking announcement as read:', error);
      throw error;
    }
  }

  /**
   * Real-time subscriptions
   */

  subscribeToChannelMessages(
    channelId: string, 
    callback: (messages: TeamMessage[]) => void,
    limitCount: number = 50
  ): () => void {
    const q = query(
      collection(db, this.MESSAGES_COLLECTION),
      where('channelId', '==', channelId),
      where('isDeleted', '!=', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamMessage[];
      
      callback(messages.reverse());
    });
  }

  subscribeToTeamChannels(
    teamId: string,
    callback: (channels: TeamChannel[]) => void
  ): () => void {
    const q = query(
      collection(db, this.CHANNELS_COLLECTION),
      where('teamId', '==', teamId),
      where('isArchived', '==', false)
    );

    return onSnapshot(q, (snapshot) => {
      const channels = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamChannel[];
      
      callback(channels);
    });
  }

  /**
   * Search functionality
   */

  async searchMessages(
    teamId: string, 
    searchTerm: string, 
    channelId?: string
  ): Promise<TeamMessage[]> {
    try {
      let q = query(
        collection(db, this.MESSAGES_COLLECTION),
        where('teamId', '==', teamId),
        where('isDeleted', '!=', true)
      );

      if (channelId) {
        q = query(q, where('channelId', '==', channelId));
      }

      const snapshot = await getDocs(q);
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamMessage[];

      // Client-side filtering for content search
      return messages.filter(message => 
        message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.senderName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  }
}

export const teamCommunicationService = new TeamCommunicationService();