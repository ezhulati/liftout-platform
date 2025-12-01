import { Button, Section, Text, Hr } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, styles } from './layout';

interface OfferMadeTemplateProps {
  teamName: string;
  opportunityTitle: string;
  companyName: string;
  compensation?: string;
  startDate?: string;
  equity?: string;
  terms?: string;
  applicationUrl: string;
}

export function OfferMadeTemplate({
  teamName = 'Engineering Team',
  opportunityTitle = 'Senior Engineering Team',
  companyName = 'TechCorp',
  compensation,
  startDate,
  equity,
  terms,
  applicationUrl = 'https://liftout.com/app/applications',
}: OfferMadeTemplateProps) {
  return (
    <EmailLayout
      preview={`Offer received from ${companyName} for ${opportunityTitle}`}
    >
      <Text style={{ ...styles.heading, textAlign: 'center' }}>
        🎉 You've Received an Offer!
      </Text>

      <Section
        style={{
          ...styles.card,
          borderLeft: `4px solid #10b981`,
        }}
      >
        <Text style={{ ...styles.paragraph, margin: '0 0 8px' }}>
          <strong>{opportunityTitle}</strong>
        </Text>
        <Text style={{ ...styles.mutedText, margin: 0 }}>
          at {companyName}
        </Text>
      </Section>

      <Text style={styles.paragraph}>
        Hi {teamName},
      </Text>

      <Text style={styles.paragraph}>
        Great news! {companyName} has extended an offer to your team for the{' '}
        <strong>{opportunityTitle}</strong> opportunity. This is an exciting step
        in your liftout journey!
      </Text>

      {(compensation || startDate || equity) && (
        <>
          <Hr style={styles.hr} />
          <Text style={{ ...styles.paragraph, fontWeight: '600' }}>
            Offer Details:
          </Text>
          <Section style={styles.card}>
            {compensation && (
              <Text style={{ ...styles.paragraph, margin: '0 0 8px' }}>
                <strong>Compensation:</strong> {compensation}
              </Text>
            )}
            {startDate && (
              <Text style={{ ...styles.paragraph, margin: '0 0 8px' }}>
                <strong>Proposed Start Date:</strong> {startDate}
              </Text>
            )}
            {equity && (
              <Text style={{ ...styles.paragraph, margin: '0 0 8px' }}>
                <strong>Equity:</strong> {equity}
              </Text>
            )}
          </Section>
        </>
      )}

      {terms && (
        <>
          <Text style={{ ...styles.paragraph, fontWeight: '600' }}>
            Additional Terms:
          </Text>
          <Section style={styles.card}>
            <Text style={{ ...styles.paragraph, margin: 0 }}>
              {terms}
            </Text>
          </Section>
        </>
      )}

      <Text style={styles.paragraph}>
        Please review the offer details carefully. You can accept or decline
        this offer through your dashboard.
      </Text>

      <Section style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button href={applicationUrl} style={styles.button}>
          Review & Respond to Offer
        </Button>
      </Section>

      <Text style={styles.mutedText}>
        If you have any questions about the offer, you can message {companyName}{' '}
        directly through the platform.
      </Text>
    </EmailLayout>
  );
}

export default OfferMadeTemplate;
