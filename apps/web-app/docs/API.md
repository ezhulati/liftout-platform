# Liftout API Reference

## Overview

The Liftout API is a RESTful API built with Next.js API Routes. All endpoints are prefixed with `/api`.

**Base URL:** `https://liftout.netlify.app/api` (production) or `http://localhost:3000/api` (development)

## Authentication

Most API endpoints require authentication via NextAuth.js session cookies. Include credentials in requests:

```typescript
fetch('/api/endpoint', {
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' }
});
```

### Demo Credentials
- **Team User:** `demo@example.com` / `password`
- **Company User:** `company@example.com` / `password`

---

## Health & Monitoring

### GET /api/health
Check application health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "checks": [
    { "name": "database", "status": "pass", "message": "Connected (12ms)" },
    { "name": "memory", "status": "pass", "message": "Heap: 150MB / 512MB" }
  ],
  "metrics": {
    "totalRequests": 1250,
    "avgResponseTime": 45,
    "slowRequests": 3
  },
  "version": "1.0.0",
  "environment": "production",
  "uptime": 86400
}
```

---

## Authentication

### POST /api/auth/[...nextauth]
NextAuth.js authentication endpoint. Handles sign in, sign out, and session management.

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "individual" | "company"
}
```

### POST /api/auth/password-reset
Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

---

## Teams

### GET /api/teams
List all public teams.

**Query Parameters:**
- `limit` (number): Max results (default: 20)
- `offset` (number): Skip results
- `industry` (string): Filter by industry
- `location` (string): Filter by location

**Response:**
```json
{
  "teams": [...],
  "total": 50,
  "hasMore": true
}
```

### POST /api/teams
Create a new team.

**Request Body:**
```json
{
  "name": "Team Name",
  "description": "Team description",
  "industry": "Technology",
  "specialization": "Software Development",
  "location": "New York, NY",
  "remoteStatus": "hybrid",
  "size": 5
}
```

### GET /api/teams/[id]
Get team details by ID.

### PUT /api/teams/[id]
Update team details.

### DELETE /api/teams/[id]
Delete a team (team lead only).

### GET /api/teams/user-teams
Get teams for the authenticated user.

### GET /api/teams/my-team
Get the primary team for the authenticated user.

### POST /api/teams/verification
Request team verification.

---

## Team Invitations

### GET /api/teams/invitations
Get pending invitations for the authenticated user.

### POST /api/teams/invitations
Send a team invitation.

**Request Body:**
```json
{
  "teamId": "team-123",
  "inviteeEmail": "invitee@example.com",
  "role": "member",
  "message": "Join our team!"
}
```

### POST /api/teams/invitations/[id]
Accept or decline an invitation.

**Request Body:**
```json
{
  "action": "accept" | "decline",
  "userEmail": "invitee@example.com"
}
```

### DELETE /api/teams/invitations/[id]
Revoke an invitation.

---

## Opportunities

### GET /api/opportunities
List all active opportunities.

**Query Parameters:**
- `limit` (number): Max results (default: 20)
- `offset` (number): Skip results
- `industry` (string): Filter by industry
- `location` (string): Filter by location
- `remotePolicy` (string): Filter by remote policy

### POST /api/opportunities
Create a new opportunity (company users only).

**Request Body:**
```json
{
  "title": "Senior Engineering Team",
  "description": "Looking for an experienced engineering team...",
  "industry": "Technology",
  "location": "San Francisco, CA",
  "remotePolicy": "hybrid",
  "teamSizeMin": 3,
  "teamSizeMax": 8,
  "compensationMin": 150000,
  "compensationMax": 250000,
  "requiredSkills": ["React", "Node.js"],
  "preferredSkills": ["TypeScript", "AWS"]
}
```

### GET /api/opportunities/[id]
Get opportunity details by ID.

### PUT /api/opportunities/[id]
Update opportunity details.

### DELETE /api/opportunities/[id]
Delete an opportunity.

---

## Applications

### GET /api/applications
List applications.

**Query Parameters:**
- `teamId` (string): Filter by team
- `opportunityId` (string): Filter by opportunity
- `status` (string): Filter by status

### POST /api/applications
Submit a new application.

**Request Body:**
```json
{
  "teamId": "team-123",
  "opportunityId": "opp-456",
  "coverLetter": "We are excited to apply...",
  "proposedCompensation": 200000
}
```

### GET /api/applications/[id]
Get application details.

### PUT /api/applications/[id]/status
Update application status.

**Request Body:**
```json
{
  "status": "reviewing" | "interviewing" | "accepted" | "rejected",
  "message": "Optional message to applicant"
}
```

### POST /api/applications/[id]/interview
Schedule an interview.

**Request Body:**
```json
{
  "scheduledAt": "2024-01-20T14:00:00Z",
  "duration": 60,
  "interviewType": "video",
  "meetingUrl": "https://zoom.us/..."
}
```

### POST /api/applications/[id]/offer
Send an offer.

**Request Body:**
```json
{
  "compensationAmount": 200000,
  "startDate": "2024-02-01",
  "message": "We're excited to offer..."
}
```

### POST /api/applications/[id]/withdraw
Withdraw an application.

### GET /api/applications/user
Get applications for the authenticated user.

---

## Expression of Interest (EOI)

### POST /api/applications/eoi
Create an expression of interest.

**Request Body:**
```json
{
  "targetType": "team" | "opportunity",
  "targetId": "target-123",
  "message": "We're interested in discussing..."
}
```

### POST /api/applications/eoi/[eoiId]/respond
Respond to an EOI.

**Request Body:**
```json
{
  "response": "accept" | "decline",
  "message": "Thank you for your interest..."
}
```

### GET /api/applications/eoi/team/[teamId]
Get EOIs received by a team.

### GET /api/applications/eoi/company/[companyId]
Get EOIs sent by a company.

---

## Matching

### GET /api/matching/teams
Find matching teams for an opportunity.

**Query Parameters:**
- `opportunityId` (string, required): Opportunity ID
- `minScore` (number): Minimum match score (default: 50)
- `limit` (number): Max results (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "opportunity": { "id": "...", "title": "...", "company": "..." },
    "matches": [
      {
        "team": { "id": "...", "name": "...", "skills": [...] },
        "score": {
          "total": 85,
          "breakdown": {
            "skillsMatch": 90,
            "industryMatch": 80,
            "locationMatch": 75
          },
          "recommendation": "excellent",
          "strengths": ["Strong skills alignment"],
          "concerns": []
        }
      }
    ],
    "total": 15
  }
}
```

### GET /api/matching/opportunities
Find matching opportunities for a team.

**Query Parameters:**
- `teamId` (string, required): Team ID
- `minScore` (number): Minimum match score (default: 50)
- `limit` (number): Max results (default: 20)

---

## Conversations & Messages

### GET /api/conversations
List conversations for the authenticated user.

### POST /api/conversations
Create a new conversation.

**Request Body:**
```json
{
  "participantIds": ["user-123", "user-456"],
  "subject": "Regarding your application",
  "initialMessage": "Hello..."
}
```

### GET /api/conversations/[id]
Get conversation details.

### DELETE /api/conversations/[id]
Delete a conversation.

### GET /api/conversations/[id]/messages
Get messages in a conversation.

### POST /api/conversations/[id]/messages
Send a message.

**Request Body:**
```json
{
  "content": "Message content",
  "attachments": []
}
```

### POST /api/conversations/[id]/read
Mark conversation as read.

### GET /api/conversations/unread
Get unread message count.

---

## User Profile

### GET /api/user/profile
Get authenticated user's profile.

### PUT /api/user/profile
Update user profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "location": "New York, NY",
  "industry": "Technology",
  "headline": "Senior Software Engineer"
}
```

### GET /api/user/settings
Get user settings.

### PUT /api/user/settings
Update user settings.

**Request Body:**
```json
{
  "notifications": {
    "email": true,
    "push": false
  },
  "privacy": {
    "profileVisibility": "public",
    "showEmail": false
  }
}
```

### PUT /api/user/password
Change password.

**Request Body:**
```json
{
  "currentPassword": "current",
  "newPassword": "newpassword"
}
```

### DELETE /api/user/account
Delete user account.

---

## Documents

### GET /api/documents
List documents for the authenticated user.

### POST /api/documents
Upload a document.

**Request Body:** `multipart/form-data`
- `file`: File to upload
- `type`: Document type (resume, portfolio, etc.)
- `name`: Document name

### GET /api/documents/[id]
Get document details.

### DELETE /api/documents/[id]
Delete a document.

### GET /api/documents/[id]/versions
Get document version history.

---

## Search

### GET /api/search
Global search across teams and opportunities.

**Query Parameters:**
- `q` (string, required): Search query
- `type` (string): Filter by type (teams, opportunities, all)
- `limit` (number): Max results

### GET /api/search/suggestions
Get search suggestions.

### GET /api/search/popular
Get popular search terms.

---

## Notifications

### GET /api/notifications
Get notifications for the authenticated user.

**Query Parameters:**
- `unreadOnly` (boolean): Filter to unread only
- `limit` (number): Max results

### POST /api/notifications/read
Mark notifications as read.

**Request Body:**
```json
{
  "notificationIds": ["notif-1", "notif-2"]
}
```

---

## Push Notifications

### POST /api/push/subscribe
Subscribe to push notifications.

**Request Body:**
```json
{
  "subscription": {
    "endpoint": "https://...",
    "keys": { "p256dh": "...", "auth": "..." }
  }
}
```

### POST /api/push/unsubscribe
Unsubscribe from push notifications.

---

## GDPR & Privacy

### POST /api/gdpr/export
Request data export.

**Response:**
```json
{
  "success": true,
  "downloadUrl": "https://...",
  "expiresAt": "2024-01-16T10:00:00Z"
}
```

### POST /api/gdpr/delete
Request account deletion.

---

## Calendar Integration

### GET /api/calendar/interview/[id]
Get calendar event for an interview.

**Response:** iCalendar (.ics) file

---

## Stripe Payments

### POST /api/stripe/checkout
Create a checkout session.

**Request Body:**
```json
{
  "plan": "pro" | "enterprise",
  "billingCycle": "monthly" | "yearly"
}
```

### POST /api/stripe/portal
Create customer portal session.

### POST /api/stripe/webhook
Stripe webhook endpoint (called by Stripe).

---

## Admin Endpoints

All admin endpoints require admin authentication and 2FA verification.

### GET /api/admin/dashboard
Admin dashboard statistics.

### GET /api/admin/users
List all users.

### GET /api/admin/users/[id]
Get user details.

### POST /api/admin/users/[id]/suspend
Suspend a user.

### POST /api/admin/users/[id]/ban
Ban a user.

### GET /api/admin/teams
List all teams.

### POST /api/admin/teams/[id]/verify
Verify a team.

### GET /api/admin/companies
List all companies.

### POST /api/admin/companies/[id]/verify
Verify a company.

### GET /api/admin/applications
List all applications.

### GET /api/admin/analytics
Platform analytics data.

### GET /api/admin/audit
Audit log.

### GET /api/admin/billing
Billing overview.

### GET /api/admin/moderation/flagged
Flagged content requiring moderation.

### POST /api/admin/2fa/setup
Initialize 2FA setup.

### POST /api/admin/2fa/verify
Verify 2FA code.

---

## Error Responses

All endpoints return errors in a consistent format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized)
- `404` - Not Found
- `400` - Bad Request (validation error)
- `500` - Internal Server Error

---

## Rate Limiting

API requests are rate limited to 100 requests per minute per IP address.

**Headers:**
- `X-RateLimit-Limit`: Maximum requests per window
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Window reset timestamp

When rate limited, the API returns `429 Too Many Requests`.

---

## Changelog

### v1.0.0 (Current)
- Initial API release
- Full team and opportunity management
- Matching system with scoring
- Real-time messaging
- Admin panel APIs
