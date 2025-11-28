# Resend Email Integration Plan for Liftout

**Domain**: liftout.com
**Email Service**: Resend
**Status**: Planning Phase

---

## Overview

This plan covers integrating Resend as the email service for Liftout platform, enabling:
- Email verification for new users
- Password reset emails
- Team invitation emails
- Application status notifications
- Message notifications
- Match/opportunity alerts

---

## Phase 1: Resend Setup & Configuration

### 1.1 Resend Account Setup
- [ ] Create Resend account at https://resend.com
- [ ] Add and verify liftout.com domain
- [ ] Configure DNS records:
  - SPF record
  - DKIM record
  - DMARC record (optional but recommended)
- [ ] Generate API key for production
- [ ] Generate API key for development/staging

### 1.2 Environment Variables

Add to `.env` files:

```bash
# Resend Configuration
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM_ADDRESS="Liftout <noreply@liftout.com>"
EMAIL_REPLY_TO="support@liftout.com"

# App URLs (for email links)
NEXT_PUBLIC_APP_URL="https://app.liftout.com"
API_URL="https://api.liftout.com"
```

### 1.3 Install Resend Package

```bash
# In apps/web-app
pnpm add resend

# In apps/api-server (remove SendGrid, add Resend)
pnpm remove @sendgrid/mail
pnpm add resend
```

---

## Phase 2: Email Service Implementation

### 2.1 Create Shared Email Service

**File**: `packages/email/src/index.ts` (new package)

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

export async function sendEmail(options: EmailOptions) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM_ADDRESS!,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    reply_to: options.replyTo || process.env.EMAIL_REPLY_TO,
    tags: options.tags,
  });
}

// Export typed email functions
export * from './templates';
export * from './types';
```

### 2.2 Email Templates to Create

| Template | Purpose | Variables |
|----------|---------|-----------|
| `welcome` | New user registration | firstName, userType |
| `verify-email` | Email verification | firstName, verificationUrl, expiresIn |
| `password-reset` | Password reset | firstName, resetUrl, expiresIn |
| `team-invitation` | Invite to join team | inviterName, teamName, invitationUrl, message, expiresIn |
| `invitation-reminder` | Reminder for pending invite | teamName, invitationUrl, expiresIn |
| `application-received` | Team applied to opportunity | teamName, opportunityTitle, companyName |
| `application-status` | Status change notification | teamName, opportunityTitle, newStatus, message |
| `new-message` | New conversation message | senderName, conversationSubject, messagePreview, conversationUrl |
| `new-match` | AI match notification | teamName/companyName, matchScore, matchDetails, viewUrl |
| `interview-scheduled` | Interview confirmation | teamName, companyName, dateTime, location/link |

---

## Phase 3: Implementation Files

### 3.1 Files to Create

| File | Purpose |
|------|---------|
| `packages/email/package.json` | New email package |
| `packages/email/src/index.ts` | Main email service |
| `packages/email/src/templates/index.ts` | Template exports |
| `packages/email/src/templates/welcome.tsx` | Welcome email (React Email) |
| `packages/email/src/templates/verify-email.tsx` | Verification email |
| `packages/email/src/templates/password-reset.tsx` | Password reset email |
| `packages/email/src/templates/team-invitation.tsx` | Team invitation email |
| `packages/email/src/templates/application-status.tsx` | Application updates |
| `packages/email/src/templates/new-message.tsx` | Message notification |
| `packages/email/src/types.ts` | Type definitions |

### 3.2 Files to Modify

| File | Changes |
|------|---------|
| `apps/api-server/src/routes/auth.ts` | Add email sending for password reset, verification |
| `apps/api-server/src/routes/teams.ts` | Add email sending for invitations |
| `apps/web-app/src/lib/services/teamManagementService.ts` | Replace TODO with actual email calls |
| `apps/web-app/src/lib/email-invitations.ts` | Update to use Resend service |
| `apps/web-app/src/app/api/auth/[...nextauth]/route.ts` | Add welcome email on registration |
| `apps/web-app/src/contexts/AuthContext.tsx` | Fix sendPasswordReset function |
| `pnpm-workspace.yaml` | Add packages/email to workspace |
| `turbo.json` | Add email package to build pipeline |

---

## Phase 4: Implementation Order

### Step 1: Core Email Infrastructure (Day 1)
1. Create `packages/email` directory and package.json
2. Install dependencies (resend, @react-email/components)
3. Create base email service with sendEmail function
4. Create base email template layout
5. Add to pnpm workspace and turbo.json

### Step 2: Authentication Emails (Day 2)
1. Create verify-email template
2. Create password-reset template
3. Create welcome email template
4. Modify `/api/auth/register` to send verification email
5. Modify `/api/auth/forgot-password` to send reset email
6. Add verification token generation and validation

### Step 3: Team Invitation Emails (Day 3)
1. Create team-invitation template
2. Create invitation-reminder template
3. Modify `teamManagementService.ts` to send invitations
4. Update invitation API endpoints
5. Add reminder email scheduling (optional: use Resend's scheduling)

### Step 4: Notification Emails (Day 4)
1. Create application-status template
2. Create new-message template
3. Create new-match template
4. Create notification service for batching/preferences
5. Respect user email preferences from UserPreferences table

### Step 5: Testing & Polish (Day 5)
1. Test all email flows end-to-end
2. Check email rendering across clients
3. Verify links work correctly
4. Test unsubscribe/preference links
5. Set up Resend webhooks for delivery tracking (optional)

---

## Phase 5: Email Template Design

### Base Layout Structure

```tsx
// packages/email/src/templates/layout.tsx
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface LayoutProps {
  preview: string;
  children: React.ReactNode;
}

export function EmailLayout({ preview, children }: LayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Img
            src="https://liftout.com/logo.png"
            width="120"
            height="36"
            alt="Liftout"
            style={logo}
          />

          {/* Content */}
          <Section style={content}>
            {children}
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Liftout - The Team Hiring Marketplace
            </Text>
            <Link href="https://liftout.com/privacy" style={footerLink}>
              Privacy Policy
            </Link>
            {' | '}
            <Link href="https://liftout.com/unsubscribe" style={footerLink}>
              Unsubscribe
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
```

### Brand Colors

```typescript
export const colors = {
  primary: '#3b82f6',      // Blue-500
  primaryDark: '#2563eb',  // Blue-600
  secondary: '#14b8a6',    // Teal-500
  text: '#1f2937',         // Gray-800
  textMuted: '#6b7280',    // Gray-500
  background: '#f9fafb',   // Gray-50
  white: '#ffffff',
  border: '#e5e7eb',       // Gray-200
};
```

---

## Phase 6: API Endpoints to Add/Modify

### New Endpoints

```typescript
// POST /api/email/verify - Resend verification email
// POST /api/email/unsubscribe - Handle unsubscribe
// GET /api/email/preferences - Get email preferences
// PUT /api/email/preferences - Update email preferences
```

### Modified Endpoints

```typescript
// POST /api/auth/register - Add verification email sending
// POST /api/auth/forgot-password - Add reset email sending
// POST /api/teams/invitations - Add invitation email sending
// PATCH /api/applications/:id/status - Add status notification email
// POST /api/conversations/:id/messages - Add new message notification (batched)
```

---

## Phase 7: Database Considerations

### Token Storage

Email verification and password reset tokens are already in the schema:
- `User.emailVerified` - Boolean flag
- Need to add: `User.verificationToken`, `User.verificationTokenExpires`
- Already have: Reset token handling in auth routes

### Add to Prisma Schema

```prisma
model User {
  // ... existing fields
  verificationToken        String?
  verificationTokenExpires DateTime?
  passwordResetToken       String?
  passwordResetExpires     DateTime?
}
```

---

## Phase 8: Resend Specific Features

### Webhooks (Optional but Recommended)

Set up webhooks for:
- `email.delivered` - Track successful delivery
- `email.bounced` - Handle bounced emails
- `email.complained` - Handle spam complaints

### Rate Limiting

Resend limits:
- Free tier: 100 emails/day, 3,000/month
- Pro tier: Unlimited

Plan for batching notification emails if needed.

### Domain Verification

Required DNS records for liftout.com:
```
# SPF
TXT @ "v=spf1 include:_spf.resend.com ~all"

# DKIM (Resend provides specific values)
CNAME resend._domainkey -> [provided by Resend]

# DMARC (recommended)
TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:dmarc@liftout.com"
```

---

## Phase 9: Testing Strategy

### Development Testing
- Use Resend's test API key
- All emails go to verified addresses only in test mode
- Use preview feature for template testing

### Email Preview
- Set up React Email preview server
- Review templates before deployment

### Production Testing
- Send test emails to team addresses first
- Verify SPF/DKIM/DMARC passing
- Check spam scores

---

## Phase 10: Deployment Checklist

### Before Launch
- [ ] Domain verified in Resend
- [ ] DNS records propagated (SPF, DKIM)
- [ ] Production API key in environment
- [ ] All templates tested
- [ ] Unsubscribe flow working
- [ ] Email preferences respected
- [ ] Error handling for failed sends
- [ ] Logging for email events

### Environment Variables Needed

**Netlify (web-app)**:
```
RESEND_API_KEY=re_xxxx
NEXT_PUBLIC_APP_URL=https://app.liftout.com
```

**API Server**:
```
RESEND_API_KEY=re_xxxx
API_URL=https://api.liftout.com
EMAIL_FROM_ADDRESS=Liftout <noreply@liftout.com>
EMAIL_REPLY_TO=support@liftout.com
```

---

## Estimated Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Setup | 2-4 hours | Domain access, Resend account |
| Phase 2-3: Implementation | 2-3 days | Phase 1 complete |
| Phase 4: Integration | 1-2 days | Phase 2-3 complete |
| Phase 5: Templates | 1 day | Parallel with Phase 4 |
| Phase 6-7: API & DB | 1 day | Phase 2-3 complete |
| Phase 8-9: Testing | 1 day | All phases complete |
| Phase 10: Deployment | 2-4 hours | Testing complete |

**Total Estimate: 5-7 days**

---

## Success Criteria

1. New users receive verification emails within 30 seconds
2. Password reset emails delivered within 30 seconds
3. Team invitations sent immediately on invite
4. Application status updates sent within 1 minute
5. Message notifications batched (5-minute delay for grouping)
6. 99%+ email delivery rate
7. Less than 0.1% spam complaint rate
8. All emails pass SPF/DKIM/DMARC checks

---

## Next Steps

1. **Approve this plan** or request modifications
2. **Create Resend account** and verify liftout.com domain
3. **Start Phase 1** implementation
4. Begin template design in parallel
