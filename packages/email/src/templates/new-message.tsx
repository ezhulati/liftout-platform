import { Button, Section, Text } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, styles } from './layout';

interface NewMessageTemplateProps {
  senderName: string;
  conversationSubject: string;
  messagePreview: string;
  conversationUrl: string;
}

export function NewMessageTemplate({
  senderName = 'Sarah',
  conversationSubject = 'About the Engineering Team opportunity',
  messagePreview = 'Hi, I wanted to follow up on our conversation about...',
  conversationUrl = 'https://liftout.com/app/messages?id=xxx',
}: NewMessageTemplateProps) {
  // Truncate message preview if too long
  const truncatedPreview =
    messagePreview.length > 200
      ? messagePreview.substring(0, 200) + '...'
      : messagePreview;

  return (
    <EmailLayout preview={`New message from ${senderName}: ${conversationSubject}`}>
      <Text style={styles.heading}>New message from {senderName}</Text>

      <Text style={{ ...styles.mutedText, margin: '0 0 16px' }}>
        Re: {conversationSubject}
      </Text>

      <Section
        style={{
          ...styles.card,
          borderLeft: `4px solid ${styles.colors.primary}`,
        }}
      >
        <Text style={{ ...styles.paragraph, margin: 0 }}>{truncatedPreview}</Text>
      </Section>

      <Section style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button href={conversationUrl} style={styles.button}>
          View Conversation
        </Button>
      </Section>

      <Text style={styles.mutedText}>
        You're receiving this email because you have a conversation on Liftout.
        You can manage your notification preferences in your{' '}
        <a
          href="https://liftout.com/app/settings/notifications"
          style={styles.link}
        >
          account settings
        </a>
        .
      </Text>
    </EmailLayout>
  );
}

export default NewMessageTemplate;
