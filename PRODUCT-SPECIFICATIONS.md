# Liftout Product Specifications

> **Master Reference Document**
> Last Updated: December 2025

This document consolidates all specifications, features, research, and technical documentation for the Liftout platform.

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Target Users & Industries](#2-target-users--industries)
3. [User Research & Personas](#3-user-research--personas)
4. [Core Features](#4-core-features)
5. [API Reference](#5-api-reference)
6. [Design System](#6-design-system)
7. [Technical Architecture](#7-technical-architecture)
8. [Testing Workflows](#8-testing-workflows)
9. [MVP Placeholders](#9-mvp-placeholders)

---

## 1. Product Overview

### What is Liftout?

Liftout is a **team-based hiring marketplace** that connects companies seeking intact teams with teams looking to move together (a "liftout").

### What is a Liftout?

A **liftout** is hiring an entire high-performing team from another company—not just individuals who used to work together, but the whole team with their trust, chemistry, and track record intact.

**Key characteristics:**
- Team-based hiring (2+ people as a unit)
- Established relationships and proven collaboration
- Immediate productivity—skip the team formation phase
- Common in law, banking, consulting, tech, healthcare

### Value Proposition

| For Companies | For Teams |
|---------------|-----------|
| Proven chemistry | Move together |
| Day-one productivity | Strength in numbers |
| Lower risk than M&A | Navigate change with people you trust |
| Skip 12-month team formation | Better negotiation leverage |

### Research Foundation

Based on Harvard Business School research by Boris Groysberg ("Chasing Stars"):

> **Star performance is NOT as portable as commonly believed.** When star analysts moved to new firms, their performance declined sharply (46%) and for prolonged periods.

**The Exception: Liftouts** - Moving as an intact team preserves firm-specific relational capital:
- Preserved team chemistry
- Maintained relationships
- Retained firm-specific capital
- Strong leadership continuity

---

## 2. Target Users & Industries

### User Types

| Type | Description | User Type Flag |
|------|-------------|----------------|
| **Team Users** | High-performing professionals who want to move together | `userType: 'individual'` |
| **Company Users** | Organizations seeking to acquire intact teams | `userType: 'company'` |

### Target Industries

| Industry | Liftout Pattern |
|----------|----------------|
| **Law Firms** | Practice groups moving with client relationships |
| **Investment Banking** | Deal teams with sector expertise |
| **Consulting** | Practice leaders with methodology + clients |
| **Technology/AI** | Engineering teams with domain expertise |
| **Healthcare** | Research labs, surgical teams |
| **Private Equity** | Deal teams with network + track record |

### Demo Accounts

```
Team User: demo@example.com / password
Company User: company@example.com / password
```

---

## 3. User Research & Personas

### Primary Persona: Alex Chen (Team Lead)

> "I love my team. I've outgrown my company. I shouldn't have to choose."

| Attribute | Value |
|-----------|-------|
| Age | 34 |
| Title | Senior Data Scientist & Team Lead |
| Location | San Francisco, CA |
| Team Size | 4 direct reports |
| Years with Team | 3.5 years |
| Industry | Financial Services / FinTech |

#### The Problem (Current State)
- Career ceiling at stagnating company
- Limited scope for innovation
- Attrition risk from team members
- Failed alternatives: individual job offers, internal advocacy

#### The Core Tension
> "Every career framework tells me to optimize for myself. But my best work happens with this team. Why does advancing mean abandoning them?"

#### Jobs to be Done

**Functional Jobs:**
1. Find opportunities that want my entire team
2. Coordinate search without 4 separate job hunts
3. Negotiate packages that work for all team members

**Emotional Jobs:**
1. Feel loyal - "I'm not abandoning my team"
2. Feel validated - "Our chemistry is worth something"
3. Feel secure - "This won't blow up in my face"

**JTBD Statement:**
> When I realize I've outgrown my current company but don't want to leave my team behind, I want to find opportunities that want all of us so I can advance my career without sacrificing the relationships that make me effective.

#### Success Metrics

| Metric | Before | After (Ideal) |
|--------|--------|---------------|
| Base salary | $280K | $380K |
| Team average salary | $220K | $295K |
| Time to productivity | 12 months | 2 weeks |
| Team cohesion score | 94 | 94 (maintained) |

### Secondary Persona: Sarah Rodriguez (Company User)

> "I'm tired of hiring stars who flame out. I want to hire teams that already work."

| Attribute | Value |
|-----------|-------|
| Age | 42 |
| Title | VP of Talent Acquisition |
| Company | NextGen Financial (Series B, 850 employees) |
| Location | New York, NY |
| Team Size | 12 recruiters |
| Industry | Financial Services / FinTech |

#### The Problem (Current State)
- CEO mandate: Build 6-person data science team in 90 days
- Individual hiring too slow (87 days avg time-to-fill)
- Previous "star" hires underperforming
- Team formation takes 6-12 months

#### The Core Tension
> "I can find talented individuals. But I can't manufacture chemistry. You can't interview for trust."

#### Jobs to be Done

**Functional Jobs:**
1. Fill team roles in 90 days, not 12 months
2. Reduce hiring risk with verified track records
3. Get productive output without 12-month ramp-up

**Emotional Jobs:**
1. Feel confident - "This approach is defensible"
2. Feel innovative - "Ahead of the curve"
3. Feel in control - "I can hit this deadline"

**JTBD Statement:**
> When I need to build a high-performing team quickly but can't wait 12+ months for individual hires to gel, I want to acquire an intact team with proven chemistry so I can get immediate productivity and reduce the risk of hiring failures.

#### Success Metrics

| Metric | Individual Hire Path | Team Hire Path |
|--------|---------------------|----------------|
| Time to fill all roles | 6-8 months | 8 weeks |
| Time to productivity | 12+ months | 15 days |
| First project delivery | Month 18 | Month 3 |
| Cost per productive-hour Y1 | $380/hr | $210/hr |

### Jobs to be Done Framework

#### Job Prioritization (Team Users)

| Job | Importance | Satisfaction | Opportunity |
|-----|------------|--------------|-------------|
| Find opportunities for whole team | 10 | 1 | **19** |
| Keep search confidential | 9 | 3 | **15** |
| Validate team's market value | 8 | 2 | **14** |
| Negotiate as a unit | 8 | 2 | **14** |

#### Job Prioritization (Company Users)

| Job | Importance | Satisfaction | Opportunity |
|-----|------------|--------------|-------------|
| Reduce time to productivity | 10 | 2 | **18** |
| Acquire proven team chemistry | 9 | 1 | **17** |
| Reduce hiring risk | 9 | 4 | **14** |
| Fill multiple roles simultaneously | 8 | 3 | **13** |

### User Journey Phases

#### Team User Journey
1. **Awareness** (Days 1-7): Trigger → Research → First visit
2. **Consideration** (Days 7-14): Browse → Team discussion → Decision
3. **Signup** (Days 14-21): Create account → Profile → Invite team
4. **Active Usage** (Weeks 3-8): Dashboard → Browse → First EOI response
5. **Conversion** (Weeks 8-12): Interview → Negotiation → Offer acceptance

#### Company User Journey
1. **Awareness** (Days 1-5): YPO mention → Research → First visit
2. **Consideration** (Days 5-10): Browse teams → Internal pitch → Buy-in
3. **Signup** (Days 10-14): Create account → Company profile → Post opportunity
4. **Active Usage** (Weeks 2-6): Team discovery → Send EOIs → Interview teams
5. **Conversion** (Weeks 6-10): Package negotiation → Offer → Team onboarding

---

## 4. Core Features

### Team User Features

| Feature | Status | Description |
|---------|--------|-------------|
| Team Profile Creation | ✅ Complete | Create and manage team profile |
| Member Invitations | ✅ Complete | Invite colleagues via email/link |
| Opportunity Discovery | ✅ Complete | Browse and search opportunities |
| Application Submission | ✅ Complete | Express interest in opportunities |
| Application Tracking | ✅ Complete | Monitor application status |
| Messaging | ✅ Complete | Communicate with companies |
| Visibility Controls | ✅ Complete | Anonymous, selective, or public profiles |

### Company User Features

| Feature | Status | Description |
|---------|--------|-------------|
| Company Profile | ✅ Complete | Create and manage company profile |
| Opportunity Posting | ✅ Complete | Post liftout opportunities |
| Team Discovery | ✅ Complete | Search and browse available teams |
| Application Review | ✅ Complete | Review and respond to applications |
| Interview Scheduling | ✅ Complete | Schedule interviews with teams |
| Offer Management | ✅ Complete | Send and track offers |
| Messaging | ✅ Complete | Communicate with teams |

### Matching System

The AI-powered matching system scores teams against opportunities:

| Score Component | Weight |
|-----------------|--------|
| Skills Match | 35% |
| Industry Match | 25% |
| Location Match | 20% |
| Experience Match | 20% |

**Match Recommendations:**
- 85%+ = Excellent match
- 70-84% = Good match
- 50-69% = Fair match
- <50% = Weak match

---

## 5. API Reference

### Base URL
- **Production:** `https://liftout.com/api`
- **Development:** `http://localhost:3000/api`

### Authentication
All protected endpoints require NextAuth.js session cookies.

### Core Endpoints

#### Teams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams` | List public teams |
| POST | `/api/teams` | Create team |
| GET | `/api/teams/[id]` | Get team details |
| PUT | `/api/teams/[id]` | Update team |
| DELETE | `/api/teams/[id]` | Delete team |
| GET | `/api/teams/my-team` | Get user's team |

#### Opportunities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/opportunities` | List opportunities |
| POST | `/api/opportunities` | Create opportunity |
| GET | `/api/opportunities/[id]` | Get opportunity details |
| PUT | `/api/opportunities/[id]` | Update opportunity |
| DELETE | `/api/opportunities/[id]` | Delete opportunity |

#### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | List applications |
| POST | `/api/applications` | Submit application |
| GET | `/api/applications/[id]` | Get application details |
| PUT | `/api/applications/[id]/status` | Update status |
| POST | `/api/applications/[id]/interview` | Schedule interview |
| POST | `/api/applications/[id]/offer` | Send offer |
| POST | `/api/applications/[id]/withdraw` | Withdraw application |

#### Conversations & Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/conversations` | List conversations |
| POST | `/api/conversations` | Create conversation |
| GET | `/api/conversations/[id]/messages` | Get messages |
| POST | `/api/conversations/[id]/messages` | Send message |
| POST | `/api/conversations/[id]/read` | Mark as read |

#### Invitations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invites/[token]` | Get invite details |
| POST | `/api/invites/[token]` | Accept/decline invite |
| POST | `/api/teams/invitations` | Send team invite |
| POST | `/api/companies/invitations` | Send company invite |

### Error Responses

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

| Code | Meaning |
|------|---------|
| 401 | Unauthorized (not authenticated) |
| 403 | Forbidden (not authorized) |
| 404 | Not Found |
| 400 | Bad Request (validation error) |
| 500 | Internal Server Error |

---

## 6. Design System

Based on **Practical UI** principles.

### Color System (HSB Monochromatic)

#### Primary: Navy (H=220)
| Token | Usage |
|-------|-------|
| `--navy` | Primary actions, links |
| `--navy-darkest` | Headings |
| `--navy-dark` | Secondary text |
| `--navy-medium` | Non-decorative borders |
| `--navy-light` | Decorative borders |

#### Secondary: Gold (H=38)
| Token | Usage |
|-------|-------|
| `--gold` | Accents, highlights |
| `--gold-darkest` | Gold text |

#### Backgrounds
| Token | Usage |
|-------|-------|
| `--bg` | Main page background (warm cream) |
| `--bg-surface` | Cards, components |
| `--bg-elevated` | Hover states |

### Button System

```css
.btn-primary     /* Navy fill + white text - ONE per screen */
.btn-secondary   /* Navy outline - alternative actions */
.btn-tertiary    /* Underlined text - cancel, back */
.btn-ghost       /* Minimal - low priority */
```

**Rules:**
- ONE primary button per screen maximum
- Min 48px touch target
- 16px spacing between buttons
- Left-align buttons (primary first)
- Use verb + noun labels ("Save post", "Delete message")

### Typography

| Element | Font | Size |
|---------|------|------|
| Headings | Playfair Display | 2xl-4xl |
| Body | Source Sans 3 | base-lg |

### Spacing (8pt Grid)

All spacing should be multiples of 8px:
- 4px - Micro gaps
- 8px - Tight spacing
- 16px - Standard spacing
- 24px - Component gaps
- 32px - Section gaps
- 48px - Large gaps

### Practical UI Principles Applied

1. HSB Monochromatic Colors
2. Squint Test (hierarchy visible when blurred)
3. One Primary CTA per screen
4. 48px Touch Targets
5. 8pt Grid spacing
6. Labels Above Fields
7. Error Summary + Inline errors
8. Never Color Alone (icons accompany colors)
9. Verb + Noun Labels
10. Left-Aligned Buttons

---

## 7. Technical Architecture

### Monorepo Structure

```
liftout-platform/
├── apps/
│   ├── web-app/         # Next.js 14 App Router
│   ├── api-server/      # Express.js API with Socket.IO
│   └── marketing-site/  # Astro marketing site
├── packages/
│   └── database/        # Prisma schema and client
```

### Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Auth | NextAuth.js (credentials) |
| State | TanStack Query + Zustand |
| Styling | Tailwind CSS |
| Forms | React Hook Form + Zod |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Hosting | Netlify (serverless) |

### Core Database Entities

| Entity | Description |
|--------|-------------|
| User | Platform users (team or company) |
| Team | Groups of professionals |
| TeamMember | User-Team associations |
| Company | Hiring organizations |
| Opportunity | Job postings for teams |
| TeamApplication | Team applications to opportunities |
| Conversation | Message threads |
| Message | Individual messages |

### Local Development Ports

| Service | Port |
|---------|------|
| Web App | 3000 |
| API Server | 8000 |
| Marketing Site | 4321 |
| Prisma Studio | 5555 |

### Common Commands

```bash
pnpm install          # Install dependencies
pnpm run dev          # Start development
pnpm run build        # Build all apps
pnpm run lint         # Run linting
pnpm run type-check   # Type check
pnpm run test         # Run tests
pnpm run db:generate  # Generate Prisma client
pnpm run db:push      # Push schema to database
pnpm run db:studio    # Open Prisma Studio
```

### Environment Variables

#### Production (Netlify)
```
NEXTAUTH_URL=https://liftout.com
NEXTAUTH_SECRET=<secure-secret>
AUTH_TRUST_HOST=true
NEXT_PUBLIC_API_URL=https://liftout.com/api
NODE_ENV=production
DATABASE_URL=postgresql://...@neon.tech/neondb?sslmode=require
```

#### Development (.env.local)
```
DATABASE_URL="postgresql://username:password@localhost:5432/liftout"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 8. Testing Workflows

### Team User Workflow

| Phase | Test | Status |
|-------|------|--------|
| 1 | Authentication & Registration | ✅ |
| 2 | Dashboard & Quick Actions | ✅ |
| 3 | Team Profile Creation | ✅ |
| 4 | Opportunity Discovery | ✅ |
| 5 | Application Process | ✅ |
| 6 | Document Management | ✅ |

### Company User Workflow

| Phase | Test | Status |
|-------|------|--------|
| 1 | Authentication & Registration | ✅ |
| 2 | Dashboard & Analytics | ✅ |
| 3 | Opportunity Posting | ✅ |
| 4 | Team Discovery | ✅ |
| 5 | Application Review | ✅ |
| 6 | Document Management | ✅ |

### Cross-User Interactions

| Test | Status |
|------|--------|
| Application Workflow (team → company) | ✅ |
| Document Sharing | ✅ |
| Bidirectional Discovery | ✅ |
| Messaging | ✅ |

---

## 9. MVP Placeholders

Features with UI but not yet fully implemented. See `apps/web-app/MVP-PLACEHOLDERS.md` for details.

### Summary

| Component | Placeholder Count | Priority |
|-----------|-------------------|----------|
| TermSheetManager | 5 | Phase 1 |
| AnalyticsDashboard | 4 | Phase 2 |
| NegotiationDashboard | 4 | Phase 2 |
| IntegrationDashboard | 4 | Phase 3 |
| ReferenceManager | 4 | Phase 2 |
| DueDiligenceOverview | 3 | Phase 3 |
| LegalOverview | 1 | Phase 3 |

### Phase 1 (High Impact)
- PDF Export (term sheets, reports)
- Email Sending (reference requests, notifications)
- Status Updates (accept/reject term sheets)

### Phase 2 (Medium Impact)
- Calendar Integration (meeting scheduling)
- Alert Preferences (user notifications)
- Historical Data (analytics over time)

### Phase 3 (Lower Priority)
- Counter-proposal Generation (AI negotiations)
- Integration Tracking (post-hire onboarding)
- Document Management (legal storage)

---

## Document References

### Core Documentation
| Document | Location | Purpose |
|----------|----------|---------|
| CLAUDE.md | `/CLAUDE.md` | Development guidance |
| README.md | `/README.md` | Project overview & setup |
| API.md | `/apps/web-app/docs/API.md` | Full API reference |
| DESIGN-SYSTEM.md | `/apps/web-app/src/styles/DESIGN-SYSTEM.md` | UI specifications |
| MVP-PLACEHOLDERS.md | `/apps/web-app/MVP-PLACEHOLDERS.md` | Future features |
| NETLIFY_ENV_VARS.md | `/apps/web-app/NETLIFY_ENV_VARS.md` | Deployment config |

### User Research
| Document | Location | Purpose |
|----------|----------|---------|
| User Research README | `/apps/web-app/docs/user-research/README.md` | Research overview |
| Alex Chen Persona | `/apps/web-app/docs/user-research/persona-alex-chen-team-lead.md` | Team lead persona |
| Sarah Rodriguez Persona | `/apps/web-app/docs/user-research/persona-sarah-rodriguez-company.md` | Company user persona |
| Jobs to be Done | `/apps/web-app/docs/user-research/jobs-to-be-done.md` | JTBD framework |
| User Journeys | `/apps/web-app/docs/user-research/user-journeys.md` | End-to-end flows |

### Research & Background
| Document | Location | Purpose |
|----------|----------|---------|
| Chasing Stars | `/apps/web-app/Chasing Stars.md` | Groysberg research summary |
| Liftouts | `/apps/web-app/Liftouts.md` | Original concept brainstorming |

### Testing
| Document | Location | Purpose |
|----------|----------|---------|
| Test Workflows | `/apps/web-app/test-workflows.md` | E2E test checklist |
| E2E Test Results | `/apps/web-app/e2e-test-results.md` | Test execution results |

---

*This document should be updated when significant features are added or specifications change.*
