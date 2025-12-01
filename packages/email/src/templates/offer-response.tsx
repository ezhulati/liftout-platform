import { Button, Section, Text, Hr } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, styles } from './layout';

interface OfferResponseTemplateProps {
  teamName: string;
  opportunityTitle: string;
  companyName: string;
  accepted: boolean;
  message?: string;
  applicationUrl: string;
}

export function OfferResponseTemplate({
  teamName = 'Engineering Team',
  opportunityTitle = 'Senior Engineering Team',
  companyName = 'TechCorp',
  accepted = true,
  message,
  applicationUrl = 'https://liftout.com/app/applications',
}: OfferResponseTemplateProps) {
  return (
    <EmailLayout
      preview={`${teamName} has ${accepted ? 'accepted' : 'declined'} your offer for ${opportunityTitle}`}
    >
      <Text style={{ ...styles.heading, textAlign: 'center' }}>
        {accepted ? '🎉 Offer Accepted!' : '📋 Offer Update'}
      </Text>

      <Section
        style={{
          ...styles.card,
          borderLeft: `4px solid ${accepted ? '#10b981' : '#6b7280'}`,
        }}
      >
        <Text style={{ ...styles.paragraph, margin: '0 0 8px' }}>
          <strong>{opportunityTitle}</strong>
        </Text>
        <Text style={{ ...styles.mutedText, margin: 0 }}>
          Team: {teamName}
        </Text>
      </Section>

      <Text style={styles.paragraph}>
        Hi {companyName} team,
      </Text>

      {accepted ? (
        <>
          <Text style={styles.paragraph}>
            Exciting news! <strong>{teamName}</strong> has accepted your offer
            for the <strong>{opportunityTitle}</strong> opportunity!
          </Text>
          <Text style={styles.paragraph}>
            This is a significant milestone - you're one step closer to bringing
            this talented team on board. The next steps will involve:
          </Text>
          <Section style={styles.card}>
            <Text style={{ ...styles.paragraph, margin: '0 0 8px' }}>
              1. <strong>Finalize terms</strong> - Review and sign agreements
            </Text>
            <Text style={{ ...styles.paragraph, margin: '0 0 8px' }}>
              2. <strong>Coordinate transition</strong> - Plan onboarding timeline
            </Text>
            <Text style={{ ...styles.paragraph, margin: 0 }}>
              3. <strong>Begin onboarding</strong> - Welcome the team!
            </Text>
          </Section>
        </>
      ) : (
        <Text style={styles.paragraph}>
          We wanted to let you know that <strong>{teamName}</strong> has decided
          to decline your offer for the <strong>{opportunityTitle}</strong>{' '}
          opportunity. While this particular match didn't work out, there are
          many other talented teams on Liftout.
        </Text>
      )}

      {message && (
        <>
          <Hr style={styles.hr} />
          <Text style={{ ...styles.paragraph, fontWeight: '600' }}>
            Message from {teamName}:
          </Text>
          <Section style={styles.card}>
            <Text style={{ ...styles.paragraph, fontStyle: 'italic', margin: 0 }}>
              "{message}"
            </Text>
          </Section>
        </>
      )}

      <Section style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button href={applicationUrl} style={styles.button}>
          {accepted ? 'View Next Steps' : 'View Application'}
        </Button>
      </Section>

      {!accepted && (
        <Text style={styles.mutedText}>
          Don't be discouraged! Keep exploring teams on Liftout to find the
          perfect match for your opportunity.
        </Text>
      )}
    </EmailLayout>
  );
}

export default OfferResponseTemplate;
