import { Button, Section, Text, Hr } from '@react-email/components';
import * as React from 'react';
import { EmailLayout, styles } from './layout';

interface WelcomeTemplateProps {
  firstName: string;
  userType: 'individual' | 'company';
  dashboardUrl: string;
}

export function WelcomeTemplate({
  firstName = 'there',
  userType = 'individual',
  dashboardUrl = 'https://liftout.com/app/dashboard',
}: WelcomeTemplateProps) {
  const isCompany = userType === 'company';

  return (
    <EmailLayout
      preview={`Welcome to Liftout - Let's get you started!`}
    >
      <Text style={styles.heading}>
        Welcome to Liftout, {firstName}! 🎉
      </Text>

      <Text style={styles.paragraph}>
        You've joined the world's first marketplace dedicated to team-based
        hiring. {isCompany
          ? "We're excited to help you find talented, proven teams."
          : "We're excited to help you and your team find amazing opportunities."}
      </Text>

      <Hr style={styles.hr} />

      {isCompany ? (
        <>
          <Text style={{ ...styles.paragraph, fontWeight: '600' }}>
            Here's how to get started:
          </Text>

          <Section style={{ paddingLeft: '8px' }}>
            <Text style={{ ...styles.paragraph, margin: '12px 0' }}>
              <strong>1. Complete your company profile</strong>
              <br />
              <span style={{ color: styles.colors.textMuted }}>
                Add your company culture, benefits, and what makes you unique
              </span>
            </Text>
            <Text style={{ ...styles.paragraph, margin: '12px 0' }}>
              <strong>2. Post your first opportunity</strong>
              <br />
              <span style={{ color: styles.colors.textMuted }}>
                Describe the team you're looking for and what they'll work on
              </span>
            </Text>
            <Text style={{ ...styles.paragraph, margin: '12px 0' }}>
              <strong>3. Browse talented teams</strong>
              <br />
              <span style={{ color: styles.colors.textMuted }}>
                Discover proven teams with established track records
              </span>
            </Text>
            <Text style={{ ...styles.paragraph, margin: '12px 0' }}>
              <strong>4. Connect and interview</strong>
              <br />
              <span style={{ color: styles.colors.textMuted }}>
                Reach out to teams that match your needs
              </span>
            </Text>
          </Section>
        </>
      ) : (
        <>
          <Text style={{ ...styles.paragraph, fontWeight: '600' }}>
            Here's how to get started:
          </Text>

          <Section style={{ paddingLeft: '8px' }}>
            <Text style={{ ...styles.paragraph, margin: '12px 0' }}>
              <strong>1. Complete your profile</strong>
              <br />
              <span style={{ color: styles.colors.textMuted }}>
                Add your skills, experience, and what you're looking for
              </span>
            </Text>
            <Text style={{ ...styles.paragraph, margin: '12px 0' }}>
              <strong>2. Create or join a team</strong>
              <br />
              <span style={{ color: styles.colors.textMuted }}>
                Form a team with colleagues you work well with
              </span>
            </Text>
            <Text style={{ ...styles.paragraph, margin: '12px 0' }}>
              <strong>3. Build your team profile</strong>
              <br />
              <span style={{ color: styles.colors.textMuted }}>
                Showcase your collective achievements and skills
              </span>
            </Text>
            <Text style={{ ...styles.paragraph, margin: '12px 0' }}>
              <strong>4. Discover opportunities</strong>
              <br />
              <span style={{ color: styles.colors.textMuted }}>
                Find companies looking for teams like yours
              </span>
            </Text>
          </Section>
        </>
      )}

      <Section style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button href={dashboardUrl} style={styles.button}>
          Go to Your Dashboard
        </Button>
      </Section>

      <Section style={styles.card}>
        <Text style={{ ...styles.paragraph, margin: 0 }}>
          <strong>Need help?</strong> Our team is here to support you. Reply to
          this email or visit our{' '}
          <a href="https://liftout.com/help" style={styles.link}>
            Help Center
          </a>{' '}
          for guides and FAQs.
        </Text>
      </Section>

      <Text style={styles.paragraph}>
        We're glad you're here!
        <br />
        <br />
        <strong>The Liftout Team</strong>
      </Text>
    </EmailLayout>
  );
}

export default WelcomeTemplate;
