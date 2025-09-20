'use client';

import { useState, useEffect } from 'react';
import { 
  Conversation, 
  SecureMessage,
  mockConversations,
  mockMessages
} from '@/lib/messaging';
import {
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  PaperClipIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface MessageCenterProps {
  userId?: string;
}

export function MessageCenter({ userId }: MessageCenterProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<SecureMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setConversations(mockConversations);
      setMessages(mockMessages);
      setSelectedConversation(mockConversations[0]);
      setIsLoading(false);
    }, 500);
  }, [userId]);

  if (isLoading) {
    return (
      <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
    );
  }

  const getSecurityIcon = (level: string) => {
    switch (level) {
      case 'maximum':
        return <ShieldCheckIcon className="h-4 w-4 text-red-500" />;
      case 'high':
        return <LockClosedIcon className="h-4 w-4 text-yellow-500" />;
      default:
        return <ChatBubbleLeftRightIcon className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSecurityBadge = (level: string) => {
    const colors = {
      maximum: 'bg-red-100 text-red-800',
      high: 'bg-yellow-100 text-yellow-800',
      standard: 'bg-blue-100 text-blue-800',
    };
    return colors[level as keyof typeof colors] || colors.standard;
  };

  const getMessageStatus = (message: SecureMessage) => {
    if (message.status === 'read') return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
    if (message.status === 'delivered') return <CheckCircleIcon className="h-4 w-4 text-gray-400" />;
    if (message.requiresAcknowledgment && !message.acknowledgedBy.length) {
      return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
    }
    return <ClockIcon className="h-4 w-4 text-gray-400" />;
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const conversationMessages = selectedConversation 
    ? messages.filter(msg => msg.conversationId === selectedConversation.id)
    : [];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="h-screen flex bg-white">
      {/* Conversation List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Secure Messages</h2>
            <button className="btn-sm bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center">
              <PlusIcon className="h-4 w-4 mr-1" />
              New
            </button>
          </div>
          
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedConversation?.id === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {getSecurityIcon(conversation.securityLevel)}
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.title}
                    </h3>
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-2">
                    {conversation.participants.map(p => p.name).join(', ')}
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSecurityBadge(conversation.securityLevel)}`}>
                      {conversation.securityLevel.toUpperCase()}
                    </span>
                    
                    {conversation.isConfidential && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        CONFIDENTIAL
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-gray-400">
                  {formatTime(conversation.lastActivity)}
                </div>
              </div>
              
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {conversation.messageCount} messages
                </span>
                <span className="text-xs text-gray-500">
                  {conversation.conversationType.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message View */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Conversation Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    {getSecurityIcon(selectedConversation.securityLevel)}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedConversation.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSecurityBadge(selectedConversation.securityLevel)}`}>
                      {selectedConversation.securityLevel.toUpperCase()} SECURITY
                    </span>
                    
                    {selectedConversation.encryptionEnabled && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <LockClosedIcon className="h-3 w-3 mr-1" />
                        ENCRYPTED
                      </span>
                    )}
                    
                    <span className="text-xs text-gray-500">
                      {selectedConversation.participants.length} participants
                    </span>
                  </div>
                </div>
                
                <button className="text-gray-400 hover:text-gray-600">
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
              </div>

              {selectedConversation.legalReviewRequired && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Legal Review Required:</strong> All messages in this conversation are subject to legal review and compliance monitoring.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversationMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === userId 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">
                        {message.senderName}
                      </span>
                      <div className="flex items-center space-x-1">
                        {message.encryptionLevel === 'legal' && (
                          <LockClosedIcon className="h-3 w-3 text-red-400" />
                        )}
                        {getMessageStatus(message)}
                      </div>
                    </div>
                    
                    {message.subject && (
                      <div className="text-xs font-semibold mb-2 opacity-75">
                        {message.subject}
                      </div>
                    )}
                    
                    <p className="text-sm">{message.content}</p>
                    
                    {message.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center space-x-2 text-xs">
                            <PaperClipIcon className="h-3 w-3" />
                            <span className="truncate">{attachment.filename}</span>
                            {attachment.documentType === 'nda' && (
                              <span className="px-1 py-0.5 bg-red-200 text-red-800 rounded text-xs">
                                NDA
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-75">
                        {formatTime(message.timestamp)}
                      </span>
                      
                      {message.priority === 'urgent' && (
                        <span className="text-xs px-1 py-0.5 bg-red-200 text-red-800 rounded">
                          URGENT
                        </span>
                      )}
                    </div>

                    {message.requiresAcknowledgment && !message.acknowledgedBy.includes(userId || '') && message.senderId !== userId && (
                      <button className="mt-2 text-xs underline">
                        Acknowledge Message
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your secure message..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <PaperClipIcon className="h-5 w-5" />
                  </button>
                  <button 
                    className="btn-sm bg-blue-600 text-white hover:bg-blue-700"
                    disabled={!newMessage.trim()}
                  >
                    Send
                  </button>
                </div>
              </div>
              
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>End-to-end encrypted</span>
                  {selectedConversation.auditTrailEnabled && (
                    <span>Audit trail enabled</span>
                  )}
                </div>
                <span>
                  {selectedConversation.retentionPolicy === 'legal_hold' ? 'Legal hold' : 'Auto-delete'}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
              <p className="mt-1 text-sm text-gray-500">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}