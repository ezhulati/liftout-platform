# MVP Placeholder Features

This document tracks features that have UI components but are not yet fully implemented. These are intentional placeholders for future development phases.

> **Last Updated:** December 2025
> **Status:** All core flows (team applications, company reviews, messaging, invites) are fully functional.

---

## 1. Term Sheet Management

**File:** `src/components/negotiations/TermSheetManager.tsx`

| Line | Button | Current Behavior | Required Implementation |
|------|--------|------------------|------------------------|
| 110 | Edit term sheet | Shows toast | Create TermSheetEditor modal, wire to API |
| 351 | Accept term sheet | Shows toast | API call to update status, trigger notifications |
| 354 | Request changes | Shows toast | Change request workflow with form |
| 357 | Generate counter-proposal | Shows toast | AI/logic for counter-proposal generation |
| 360 | Export PDF | Shows toast | PDF generation (use react-pdf or server-side) |

**Dependencies:**
- `/api/negotiations/[id]/termsheet` (needs creation)
- PDF generation library
- Email notifications for status changes

---

## 2. Analytics Dashboard

**File:** `src/components/analytics/AnalyticsDashboard.tsx`

| Line | Button | Current Behavior | Required Implementation |
|------|--------|------------------|------------------------|
| 453 | Export Report | Shows toast | CSV/PDF export functionality |
| 456 | Send Meeting Invitation | Shows toast | Calendar integration (Google/Outlook) |
| 459 | Save Alert Preferences | Shows toast | Persist to UserPreferences table |
| 462 | Load Historical Data | Shows toast | Fetch historical analytics from API |

**Dependencies:**
- Export utilities (CSV, PDF)
- Calendar API integration
- Historical data aggregation queries

---

## 3. Negotiation Dashboard

**File:** `src/components/negotiations/NegotiationDashboard.tsx`

| Line | Button | Current Behavior | Required Implementation |
|------|--------|------------------|------------------------|
| 342 | Load term sheet | Shows toast | Fetch term sheet data from API |
| 345 | Send meeting invitation | Shows toast | Calendar integration |
| 348 | Generate status report | Shows toast | Report generation logic |
| 351 | Update timeline | Shows toast | Timeline management UI + API |

**Dependencies:**
- Calendar integration
- Report generation
- Timeline data model

---

## 4. Integration Dashboard

**File:** `src/components/integration/IntegrationDashboard.tsx`

| Line | Button | Current Behavior | Required Implementation |
|------|--------|------------------|------------------------|
| 507 | Schedule check-in | Shows toast | Calendar/scheduling integration |
| 510 | Generate report | Shows toast | Report generation (integration progress) |
| 513 | Load analytics | Shows toast | Analytics data fetching |
| 516 | Update milestones | Shows toast | Milestone CRUD operations |

**Dependencies:**
- Milestone data model in Prisma
- Integration progress tracking
- Calendar integration

---

## 5. Due Diligence - Reference Manager

**File:** `src/components/due-diligence/ReferenceManager.tsx`

| Line | Button | Current Behavior | Required Implementation |
|------|--------|------------------|------------------------|
| 301 | Send reference request | Shows toast | Email sending to reference contact |
| 306 | Follow up | Shows toast | Follow-up email automation |
| 311 | Mark verified | Shows toast | Status update API call |
| 315 | Edit contact | Shows toast | Contact edit modal/form |

**Dependencies:**
- Email service integration (SendGrid/Resend)
- Reference verification workflow
- Contact management UI

---

## 6. Due Diligence - Overview

**File:** `src/components/due-diligence/DueDiligenceOverview.tsx`

| Line | Button | Current Behavior | Required Implementation |
|------|--------|------------------|------------------------|
| 305 | View detailed checklist | Shows toast | Navigation to detailed checklist view |
| 308 | Generate report | Shows toast | Due diligence report generation |
| 311 | Schedule meeting | Shows toast | Calendar integration |

**Dependencies:**
- Checklist detail page/modal
- Report generation
- Calendar integration

---

## 7. Legal Overview

**File:** `src/components/legal/LegalOverview.tsx`

| Line | Button | Current Behavior | Required Implementation |
|------|--------|------------------|------------------------|
| 187 | Load all documents | Shows toast | Fetch/paginate legal documents |

**Dependencies:**
- Document storage integration
- Pagination for large document sets

---

## Implementation Priority

### Phase 1 (High Impact)
1. **PDF Export** - Term sheets, reports (common request)
2. **Email Sending** - Reference requests, notifications
3. **Status Updates** - Accept/reject term sheets

### Phase 2 (Medium Impact)
1. **Calendar Integration** - Meeting scheduling
2. **Alert Preferences** - User notification settings
3. **Historical Data** - Analytics over time

### Phase 3 (Lower Priority)
1. **Counter-proposal Generation** - AI-assisted negotiations
2. **Integration Tracking** - Post-hire onboarding
3. **Document Management** - Legal document storage

---

## How to Implement

When implementing a placeholder:

1. **Create the API route** if needed
2. **Replace the toast** with actual functionality:
   ```tsx
   // Before
   onClick={() => toast.success('Feature coming soon')}

   // After
   onClick={() => handleActualFeature()}
   ```
3. **Add loading states** for async operations
4. **Add error handling** with user-friendly messages
5. **Update this document** to mark as complete

---

## Completed Features

Features that were placeholders but are now fully implemented:

- [x] Message Team button (Dec 2025)
- [x] Edit Opportunity button (Dec 2025)
- [x] Delete Team modal integration (Dec 2025)
- [x] Delete Company modal integration (Dec 2025)
- [x] Invite Company Member integration (Dec 2025)
