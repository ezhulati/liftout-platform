# End-to-End User Flows

> Step-by-step journeys for every user type in the Liftout platform

---

## Related Documents

- **[Onboarding & Posting Flows](./onboarding-and-posting-flows.md)** — Detailed onboarding screens and team posting logic (SOURCE OF TRUTH)
- **[User Actions Complete List](./user-actions-complete-list.md)** — Every possible action by user type with permissions matrix

---

## Key Flow Principles

> **IMPORTANT**: The detailed screen mockups and state definitions are in
> [onboarding-and-posting-flows.md](./onboarding-and-posting-flows.md).
> This document provides the narrative user journeys.

### Team Side
1. **Onboarding requires team creation** — Team leads must create a team profile during onboarding (not optional)
2. **Teams start in DRAFT status** — Not visible to companies until posted
3. **All members must join before posting** — Team cannot be posted until all invited members have joined and completed profiles
4. **Explicit "Post Team" action** — Team lead must explicitly post the team to make it visible

### Company Side
1. **Onboarding requires company creation** — Company users must create a company profile during onboarding
2. **Opportunity posting is encouraged** — Prompted during onboarding but not required
3. **Can browse teams immediately** — After onboarding, can browse and reach out to teams

---

## Table of Contents

1. [Alex Chen — Team Lead (Creates Team)](#1-alex-chen--team-lead-creates-team)
2. [Sarah Martinez — Team Member (Joins Team)](#2-sarah-martinez--team-member-joins-team)
3. [Marcus Johnson — Team Member (Joins Team)](#3-marcus-johnson--team-member-joins-team)
4. [Priya Patel — Team Member (Joins Team)](#4-priya-patel--team-member-joins-team)
5. [Sarah Rodriguez — Company User (Hires Team)](#5-sarah-rodriguez--company-user-hires-team)
6. [Team ↔ Company Interaction Flow](#6-team--company-interaction-flow)
7. [Complete Timeline View](#7-complete-timeline-view)

---

## 1. Alex Chen — Team Lead (Creates Team)

### Phase 1: Discovery & Research (Pre-Platform)

```
WEEK 1-2: AWARENESS
───────────────────────────────────────────────────────────────────

Day 1: Sarah Martinez forwards article about law firm group laterals
       └─ Alex reads: "Wait, this is a thing?"

Day 2: Alex Googles "team-based hiring" "group lateral moves tech"
       └─ Finds HBR article by Boris Groysberg
       └─ Reads about 46% performance decline for solo movers

Day 3: Deep dive into Groysberg's "Chasing Stars" research
       └─ Realizes: "Stars need their constellation"

Day 5: Searches "team hiring platform"
       └─ Finds Liftout.com

Day 6: Browses Liftout landing page (not logged in)
       └─ Reads "What is a Liftout?" page
       └─ Sees 2024-2025 examples (Microsoft/Inflection, law firms)
       └─ Key message lands: "Your employer never sees you"

Day 7: Browses available opportunities (anonymous)
       └─ Sees "Lead FinTech Analytics Division" posting
       └─ Thinks: "This could be us"

───────────────────────────────────────────────────────────────────
```

### Phase 2: Account Creation

```
WEEK 3: SIGNUP
───────────────────────────────────────────────────────────────────

Action 1: Click "Get Started" or "Sign Up"
          └─ URL: /auth/signup

Action 2: Choose user type
          ┌─────────────────────────────────────────┐
          │  How do you want to use Liftout?        │
          │                                         │
          │  ○ I'm part of a team looking to move   │  ← Alex selects
          │  ○ I'm a company looking to hire teams  │
          └─────────────────────────────────────────┘

Action 3: Enter basic information
          ┌─────────────────────────────────────────┐
          │  Email: demo@example.com                │
          │  Password: ••••••••                     │
          │  First Name: Alex                       │
          │  Last Name: Chen                        │
          └─────────────────────────────────────────┘

Action 4: Email verification
          └─ Check inbox for verification link
          └─ Click link → Email verified

Action 5: Redirect to onboarding
          └─ URL: /app/onboarding

───────────────────────────────────────────────────────────────────
```

### Phase 3: Individual Profile Setup

```
ONBOARDING STEP 1: PERSONAL PROFILE
───────────────────────────────────────────────────────────────────

Screen 1: Basic Info
          ┌─────────────────────────────────────────┐
          │  📷 Upload profile photo                │
          │  [randomuser.me/portraits/men/32.jpg]   │
          │                                         │
          │  Title: Senior Data Scientist & Team Lead│
          │  Location: San Francisco, CA            │
          │  LinkedIn: linkedin.com/in/alexchen     │
          └─────────────────────────────────────────┘
          └─ Click "Continue"

Screen 2: Experience
          ┌─────────────────────────────────────────┐
          │  Current Employer: TechFlow Analytics   │
          │  Current Title: VP of Data Science      │
          │  Years of Experience: 10                │
          │                                         │
          │  Bio:                                   │
          │  "Passionate technologist with 10+      │
          │   years leading high-performing data    │
          │   science and engineering teams."       │
          └─────────────────────────────────────────┘
          └─ Click "Continue"

Screen 3: Skills
          ┌─────────────────────────────────────────┐
          │  Select your key skills:                │
          │                                         │
          │  ☑ Machine Learning                     │
          │  ☑ Python                               │
          │  ☑ SQL                                  │
          │  ☑ Team Leadership                      │
          │  ☐ JavaScript                           │
          │  ☐ AWS                                  │
          └─────────────────────────────────────────┘
          └─ Click "Continue"

Screen 4: Preferences
          ┌─────────────────────────────────────────┐
          │  Availability: Open to opportunities    │
          │  Remote Preference: Hybrid              │
          │  Willing to Relocate: Yes               │
          └─────────────────────────────────────────┘
          └─ Click "Complete Profile"

───────────────────────────────────────────────────────────────────
```

### Phase 4: Team Creation (MANDATORY)

```
ONBOARDING STEP 2: CREATE OR JOIN TEAM (REQUIRED)
───────────────────────────────────────────────────────────────────

NOTE: This step is MANDATORY for team users. Cannot be skipped.

Screen 1: Team Decision
          ┌─────────────────────────────────────────┐
          │  Now let's set up your team             │
          │                                         │
          │  Are you starting a new team or joining │
          │  an existing one?                       │
          │                                         │
          │  [Create a New Team]  ← Alex clicks     │
          │  [I Have an Invite Code]                │
          └─────────────────────────────────────────┘

NOTE: There is NO "Skip" option. Team creation is required.

Screen 2: Team Basic Info
          ┌─────────────────────────────────────────┐
          │  Team Name: TechFlow Data Science Team  │
          │                                         │
          │  Industry: Financial Services           │
          │  Specialization: Data Science & ML      │
          │  Team Size: 4                           │
          │  Location: San Francisco, CA            │
          └─────────────────────────────────────────┘
          └─ Click "Continue"

Screen 3: Team Details
          ┌─────────────────────────────────────────┐
          │  Years Working Together: 3.5            │
          │  Remote Status: Hybrid                  │
          │                                         │
          │  Description:                           │
          │  "Elite data science team with 3.5      │
          │   years working together, specializing  │
          │   in fintech analytics and ML."         │
          │                                         │
          │  Team Culture:                          │
          │  "Collaborative, data-driven, focused   │
          │   on continuous learning."              │
          │                                         │
          │  Working Style:                         │
          │  "Agile with 2-week sprints. Daily      │
          │   standups, weekly retrospectives."     │
          └─────────────────────────────────────────┘
          └─ Click "Continue"

Screen 4: Compensation Expectations
          ┌─────────────────────────────────────────┐
          │  Salary Range (per team member):        │
          │  Min: $180,000  Max: $280,000           │
          │                                         │
          │  ☑ Open to relocation                   │
          │  ☑ Require remote work option           │
          └─────────────────────────────────────────┘
          └─ Click "Continue"

Screen 5: Visibility Settings
          ┌─────────────────────────────────────────┐
          │  Who can see your team?                 │
          │                                         │
          │  ○ Public - All companies               │
          │  ● Selective - Approved companies only  │  ← Alex selects
          │  ○ Anonymous - Hidden identity          │
          │                                         │
          │  Block specific companies:              │
          │  [TechFlow Analytics    ] [+ Add]       │
          │  [DataCorp              ] [+ Add]       │
          └─────────────────────────────────────────┘
          └─ Click "Create Team"

RESULT: Team created with Alex as Lead and Admin
        └─ Team slug: techflow-data-science
        └─ Team status: DRAFT (not visible to companies)
        └─ Cannot be posted until all members join

IMPORTANT: Team is in DRAFT status. It will NOT appear in company
searches until Alex explicitly posts it AND all members have joined.

───────────────────────────────────────────────────────────────────
```

### Phase 5: Invite Team Members (ENCOURAGED)

```
TEAM SETUP: INVITE MEMBERS
───────────────────────────────────────────────────────────────────

After team creation, Alex sees an encouragement prompt:

┌─────────────────────────────────────────────────────────────────┐
│  🎉 Team Created Successfully!                                  │
│                                                                 │
│  Your team "TechFlow Data Science Team" is ready.               │
│                                                                 │
│  NEXT STEPS TO GET NOTICED BY COMPANIES:                        │
│                                                                 │
│  1. ○ Invite your team members                                  │
│  2. ○ Wait for all members to join and complete profiles        │
│  3. ○ Post your team to make it visible to companies            │
│                                                                 │
│  Current Status: DRAFT (not visible to companies)               │
│                                                                 │
│  [Invite Team Members Now]  [I'll Do This Later]                │
└─────────────────────────────────────────────────────────────────┘

Screen: Team Dashboard → Members Tab
        URL: /app/teams/techflow-data-science/members

Action 1: Click "Invite Members"
          ┌─────────────────────────────────────────┐
          │  Invite Team Members                    │
          │                                         │
          │  Email: sarah.martinez@example.com      │
          │  Role: Senior Data Scientist            │
          │  [Send Invite]                          │
          │                                         │
          │  ─────────────────────────────────────  │
          │                                         │
          │  Email: marcus.johnson@example.com      │
          │  Role: ML Engineer                      │
          │  [Send Invite]                          │
          │                                         │
          │  ─────────────────────────────────────  │
          │                                         │
          │  Email: priya.patel@example.com         │
          │  Role: Data Analyst                     │
          │  [Send Invite]                          │
          └─────────────────────────────────────────┘

Action 2: System sends invitation emails
          └─ Each email contains unique invite token
          └─ Invite expires in 7 days

Action 3: Alex follows up on Slack/WhatsApp
          └─ "Hey, I just sent you an invite to Liftout.
              Check your email and sign up!"

TEAM STATUS DASHBOARD:
┌────────────────────────────────────────────────────────────┐
│  TechFlow Data Science Team                                │
│                                                            │
│  STATUS: DRAFT (not visible to companies)                  │
│                                                            │
│  MEMBERS                                                   │
│  ────────────────────────────────────────────────────────  │
│  Alex Chen (Lead)      ✅ Active                           │
│  Sarah Martinez        ⏳ Invited (pending)                │
│  Marcus Johnson        ⏳ Invited (pending)                │
│  Priya Patel          ⏳ Invited (pending)                 │
│                                                            │
│  POSTING REQUIREMENTS                                      │
│  ────────────────────────────────────────────────────────  │
│  ❌ All members must join (0/3 pending joined)             │
│  ❌ All member profiles must be complete                   │
│  ✅ Team profile is complete                               │
│                                                            │
│  [Post Team] ← DISABLED until requirements met             │
└────────────────────────────────────────────────────────────┘

───────────────────────────────────────────────────────────────────
```

### Phase 6: Wait for Team & Browse Opportunities

```
WHILE WAITING: ALEX EXPLORES
───────────────────────────────────────────────────────────────────

Action 1: Browse Opportunities
          └─ URL: /app/opportunities
          └─ Filter by: Industry = FinTech, Remote = Yes
          └─ Sees 8 potential matches

Action 2: View Opportunity Details
          ┌─────────────────────────────────────────┐
          │  Lead FinTech Analytics Division        │
          │  NextGen Financial | New York, NY       │
          │  Remote: Hybrid OK                      │
          │                                         │
          │  Looking for: 4-6 person data team      │
          │  Salary Range: $180K - $400K            │
          │  Equity: Yes                            │
          │                                         │
          │  Match Score: 88%                       │
          │                                         │
          │  [Save] [Express Interest] (disabled -  │
          │         team incomplete)                │
          └─────────────────────────────────────────┘

Action 3: Save Interesting Opportunities
          └─ Saves 3 opportunities to "Saved" list
          └─ Can't express interest until team is complete

Action 4: Check Team Status Daily
          └─ URL: /app/teams/techflow-data-science
          └─ Waiting for Sarah, Marcus, Priya to accept

───────────────────────────────────────────────────────────────────
```

### Phase 7: Team Complete → POST TEAM

```
TEAM COMPLETION (After all members join)
───────────────────────────────────────────────────────────────────

Notification: "🎉 Your team is now ready to post!"
              └─ All 4 members have accepted and completed profiles

TEAM STATUS DASHBOARD (Updated):
┌────────────────────────────────────────────────────────────┐
│  TechFlow Data Science Team                                │
│                                                            │
│  STATUS: READY TO POST                                     │
│                                                            │
│  MEMBERS                                                   │
│  ────────────────────────────────────────────────────────  │
│  Alex Chen (Lead)      ✅ Active, Profile Complete         │
│  Sarah Martinez        ✅ Active, Profile Complete         │
│  Marcus Johnson        ✅ Active, Profile Complete         │
│  Priya Patel          ✅ Active, Profile Complete          │
│                                                            │
│  POSTING REQUIREMENTS                                      │
│  ────────────────────────────────────────────────────────  │
│  ✅ All members have joined                                │
│  ✅ All member profiles are complete                       │
│  ✅ Team profile is complete                               │
│                                                            │
│  ALL REQUIREMENTS MET! 🎉                                  │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  [🚀 Post Team - Make Visible to Companies]         │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
│  Cohesion Score: 94/100                                    │
└────────────────────────────────────────────────────────────┘

Action 1: Review Team Profile Before Posting
          └─ URL: /app/teams/techflow-data-science
          └─ Verify all information is correct
          └─ Check cohesion score: 94/100
          └─ Review blocked companies list

Action 2: POST TEAM (Critical Action)
          └─ Click "Post Team - Make Visible to Companies"
          ┌─────────────────────────────────────────┐
          │  Post Your Team?                        │
          │                                         │
          │  By posting, your team will be visible  │
          │  to companies searching for teams.      │
          │                                         │
          │  Visibility: Selective                  │
          │  (Only approved companies can see)      │
          │                                         │
          │  Blocked Companies:                     │
          │  • TechFlow Analytics                   │
          │  • DataCorp                             │
          │                                         │
          │  You can unpost your team at any time.  │
          │                                         │
          │  [Cancel] [Post Team]                   │
          └─────────────────────────────────────────┘

RESULT: Team status changes from "READY TO POST" → "POSTED"
        └─ Team now appears in company search results
        └─ Team can now express interest in opportunities
        └─ Companies can reach out to the team

TEAM STATUS: POSTED
┌────────────────────────────────────────────────────────────┐
│  TechFlow Data Science Team                                │
│                                                            │
│  STATUS: POSTED ✅                                         │
│  Visible to: Selective (approved companies only)           │
│                                                            │
│  [Unpost Team] [Edit Visibility] [Edit Blocked Companies]  │
└────────────────────────────────────────────────────────────┘

Action 3: Set Team Availability (optional refinement)
          ┌─────────────────────────────────────────┐
          │  Team Availability                      │
          │                                         │
          │  ○ Not Actively Looking                 │
          │  ● Available - Actively exploring       │  ← Select
          │  ○ Urgently Available                   │
          └─────────────────────────────────────────┘

Action 4: Express Interest in Saved Opportunities
          └─ Go to saved opportunities
          └─ Click "Express Interest" on NextGen posting
          ┌─────────────────────────────────────────┐
          │  Express Interest                       │
          │                                         │
          │  Message to NextGen Financial:          │
          │  "Our team has 3.5 years of experience  │
          │   in fintech analytics. We've built    │
          │   production ML systems processing     │
          │   10M+ predictions daily. We'd love    │
          │   to discuss how we can help build     │
          │   your analytics division."            │
          │                                         │
          │  [Send Expression of Interest]          │
          └─────────────────────────────────────────┘

RESULT: EOI sent to NextGen Financial
        └─ Status: Awaiting company response
        └─ Alex receives confirmation email

───────────────────────────────────────────────────────────────────
```

### Phase 8: Company Engagement

```
ENGAGEMENT FLOW (After company responds)
───────────────────────────────────────────────────────────────────

Notification: "NextGen Financial wants to connect!"
              └─ Email + in-app notification

Action 1: View Company Message
          └─ URL: /app/conversations
          ┌─────────────────────────────────────────┐
          │  NextGen Financial                      │
          │  Sarah Rodriguez, VP of Talent          │
          │                                         │
          │  "Hi Alex, your team's profile is       │
          │   impressive. We're building an         │
          │   analytics division from scratch and   │
          │   your experience is exactly what we    │
          │   need. Would your team be available    │
          │   for an initial call this week?"       │
          │                                         │
          │  [Reply]                                │
          └─────────────────────────────────────────┘

Action 2: Consult Team (outside platform)
          └─ Alex messages team on Slack: "NextGen responded.
              They want to talk. Everyone still in?"
          └─ All confirm: "Yes, let's do it"

Action 3: Reply to Company
          ┌─────────────────────────────────────────┐
          │  "Hi Sarah, thank you for reaching out. │
          │   Yes, we're very interested. Our team  │
          │   is available Thursday or Friday       │
          │   afternoon PST. Would a 30-minute      │
          │   video call work? All four of us can   │
          │   join if helpful."                     │
          │                                         │
          │  [Send]                                 │
          └─────────────────────────────────────────┘

Action 4: Schedule Interview
          └─ Company sends calendar invite
          └─ Alex shares with team
          └─ Interview set for Friday 2pm PST

───────────────────────────────────────────────────────────────────
```

### Phase 9: Interview Process

```
INTERVIEW FLOW
───────────────────────────────────────────────────────────────────

Interview 1: Initial Team Call (30 min)
             └─ Alex introduces team
             └─ Sarah Rodriguez explains NextGen's needs
             └─ Basic fit assessment

Interview 2: Technical Deep Dive (60 min)
             └─ Each team member presents their work
             └─ Alex: Leadership approach
             └─ Sarah: NLP pipeline demo
             └─ Marcus: Infrastructure architecture
             └─ Priya: Business impact dashboards

Interview 3: Executive Meeting (60 min)
             └─ Team meets CTO and CFO
             └─ Discussion of mandate, reporting, resources
             └─ Alex asks about team integrity commitment

Interview 4: Culture & Logistics (45 min)
             └─ HR discussion
             └─ Remote work policies
             └─ Parental leave (Marcus asks)
             └─ Management track (Priya asks)

POST-INTERVIEW: Update Status on Platform
                └─ URL: /app/applications
                └─ Status: "Interview Stage - Final Round"

───────────────────────────────────────────────────────────────────
```

### Phase 10: Offer & Negotiation

```
OFFER STAGE
───────────────────────────────────────────────────────────────────

Notification: "NextGen Financial has extended an offer!"
              └─ Email + in-app notification

Action 1: View Offer Details
          └─ URL: /app/applications/nextgen-offer
          ┌─────────────────────────────────────────┐
          │  OFFER: NextGen Financial               │
          │                                         │
          │  Alex Chen                              │
          │  Title: VP of Analytics                 │
          │  Salary: $380,000                       │
          │  Equity: $96K/year (4-year vest)        │
          │  Signing Bonus: $25,000                 │
          │                                         │
          │  Sarah Martinez                         │
          │  Title: Principal Data Scientist        │
          │  Salary: $320,000                       │
          │  Equity: $72K/year (4-year vest)        │
          │  Signing Bonus: $15,000                 │
          │                                         │
          │  Marcus Johnson                         │
          │  Title: Principal ML Engineer           │
          │  Salary: $290,000                       │
          │  Equity: $48K/year (4-year vest)        │
          │  Signing Bonus: $7,000                  │
          │  Note: 16 weeks parental leave confirmed│
          │                                         │
          │  Priya Patel                            │
          │  Title: Lead Analytics Manager          │
          │  Salary: $200,000                       │
          │  Equity: $24K/year (4-year vest)        │
          │  Signing Bonus: $3,000                  │
          │  Note: Management path confirmed        │
          │                                         │
          │  Start Date: March 1, 2025              │
          │  Location: Remote (Bay Area base)       │
          │                                         │
          │  [Accept] [Negotiate] [Decline]         │
          └─────────────────────────────────────────┘

Action 2: Team Discussion (outside platform)
          └─ Alex shares offer with team
          └─ Everyone reviews their individual terms
          └─ Team agrees: "This meets our requirements"

Action 3: Accept Offer
          └─ Click "Accept"
          ┌─────────────────────────────────────────┐
          │  Confirm Acceptance                     │
          │                                         │
          │  By accepting, all team members agree   │
          │  to the offer terms. Each member will   │
          │  receive individual offer letters.      │
          │                                         │
          │  ☑ I confirm all team members agree     │
          │                                         │
          │  [Confirm Acceptance]                   │
          └─────────────────────────────────────────┘

Action 4: Sign Offer Letters
          └─ Each team member receives DocuSign
          └─ All 4 sign within 48 hours

RESULT: Offer accepted!
        └─ Status: "Offer Accepted - Start March 1"
        └─ Celebration message from platform 🎉

───────────────────────────────────────────────────────────────────
```

### Phase 11: Transition & Resignation

```
TRANSITION FLOW
───────────────────────────────────────────────────────────────────

Action 1: Coordinate Resignation Timing
          └─ Team agrees: All resign on same day
          └─ Target: February 1 (4 weeks notice)

Action 2: Submit Resignations
          └─ Alex resigns first (as leader)
          └─ Sarah, Marcus, Priya follow within hours
          └─ TechFlow HR realizes it's a team move

Action 3: Work Notice Period
          └─ Professional handoff
          └─ Document knowledge transfer
          └─ No burning bridges

Action 4: Update Platform Status
          └─ Status: "Transition - Starting March 1"
          └─ Team profile hidden from new opportunities

Action 5: Start at NextGen
          └─ March 1: First day
          └─ Team arrives together
          └─ Integration begins

POST-START: Platform Follow-up
            └─ 30-day check-in survey
            └─ 90-day success tracking
            └─ Option to become case study

───────────────────────────────────────────────────────────────────
```

---

## 2. Sarah Martinez — Team Member (Joins Team)

### Phase 1: Receive Invitation

```
INVITATION RECEIVED
───────────────────────────────────────────────────────────────────

Email Received:
┌─────────────────────────────────────────────────────────────────┐
│  Subject: Alex Chen invited you to join TechFlow Data Science   │
│                                                                 │
│  Hi Sarah,                                                      │
│                                                                 │
│  Alex Chen has invited you to join the TechFlow Data Science    │
│  Team on Liftout, a platform for teams exploring opportunities  │
│  together.                                                      │
│                                                                 │
│  Team: TechFlow Data Science Team                               │
│  Your Role: Senior Data Scientist                               │
│                                                                 │
│  [Accept Invitation]                                            │
│                                                                 │
│  This invitation expires in 7 days.                             │
└─────────────────────────────────────────────────────────────────┘

Sarah's reaction: Texts Alex "Got it, signing up now"

───────────────────────────────────────────────────────────────────
```

### Phase 2: Account Creation

```
SIGNUP VIA INVITATION
───────────────────────────────────────────────────────────────────

Action 1: Click "Accept Invitation" in email
          └─ URL: /auth/signup?invite=abc123token

Action 2: Create Account (pre-filled from invite)
          ┌─────────────────────────────────────────┐
          │  Join TechFlow Data Science Team        │
          │                                         │
          │  Email: sarah.martinez@example.com      │  ← Pre-filled
          │  Password: ••••••••                     │
          │  Confirm Password: ••••••••             │
          │  First Name: Sarah                      │
          │  Last Name: Martinez                    │
          │                                         │
          │  [Create Account & Join Team]           │
          └─────────────────────────────────────────┘

Action 3: Email Verification
          └─ Check inbox, click verification link
          └─ Account verified

Action 4: Redirect to Profile Setup
          └─ URL: /app/onboarding
          └─ Note: Sarah is joining existing team, not creating one

───────────────────────────────────────────────────────────────────
```

### Phase 3: Profile Setup

```
PROFILE COMPLETION
───────────────────────────────────────────────────────────────────

Screen 1: Basic Info
          ┌─────────────────────────────────────────┐
          │  📷 Upload profile photo                │
          │  [randomuser.me/portraits/women/44.jpg] │
          │                                         │
          │  Title: Senior Data Scientist           │
          │  Location: San Francisco, CA            │
          │  LinkedIn: linkedin.com/in/sarahmartinez│
          └─────────────────────────────────────────┘
          └─ Click "Continue"

Screen 2: Experience
          ┌─────────────────────────────────────────┐
          │  Current Employer: TechFlow Analytics   │
          │  Current Title: Senior Data Scientist   │
          │  Years of Experience: 7                 │
          │                                         │
          │  Bio:                                   │
          │  "Data scientist with deep expertise in │
          │   NLP and predictive modeling. Stanford │
          │   PhD in Statistics."                   │
          └─────────────────────────────────────────┘
          └─ Click "Continue"

Screen 3: Skills
          ┌─────────────────────────────────────────┐
          │  Select your key skills:                │
          │                                         │
          │  ☑ NLP                                  │
          │  ☑ Deep Learning                        │
          │  ☑ PyTorch                              │
          │  ☑ Python                               │
          │  ☑ Statistical Analysis                 │
          └─────────────────────────────────────────┘
          └─ Click "Continue"

Screen 4: Preferences
          ┌─────────────────────────────────────────┐
          │  Availability: Open to opportunities    │
          │  Remote Preference: Remote Required     │  ← Key constraint
          │  Willing to Relocate: No                │  ← Can't relocate
          │                                         │
          │  Note (optional):                       │
          │  "Family obligations require Bay Area   │
          │   base. Full remote or hybrid OK."      │
          └─────────────────────────────────────────┘
          └─ Click "Complete Profile"

───────────────────────────────────────────────────────────────────
```

### Phase 4: Confirm Team Membership

```
TEAM MEMBERSHIP CONFIRMATION
───────────────────────────────────────────────────────────────────

Screen: Team Confirmation
        ┌─────────────────────────────────────────┐
        │  Confirm Team Membership                │
        │                                         │
        │  Team: TechFlow Data Science Team       │
        │  Your Role: Senior Data Scientist       │
        │  Team Lead: Alex Chen                   │
        │                                         │
        │  By confirming, you agree to:           │
        │  • Be listed as part of this team       │
        │  • Have your profile visible to         │
        │    companies interested in the team     │
        │  • Coordinate with your team on         │
        │    opportunities                        │
        │                                         │
        │  [Confirm Membership]                   │
        └─────────────────────────────────────────┘

Action: Click "Confirm Membership"

RESULT: Sarah is now an active team member
        └─ Team status updates
        └─ Alex receives notification: "Sarah joined!"

───────────────────────────────────────────────────────────────────
```

### Phase 5: Add Team-Specific Details

```
TEAM CONTRIBUTION DETAILS
───────────────────────────────────────────────────────────────────

Screen: Your Role on This Team
        ┌─────────────────────────────────────────┐
        │  Tell companies about your contribution │
        │                                         │
        │  Role: Senior Data Scientist            │
        │  Seniority: Senior                      │
        │                                         │
        │  Key Skills for This Team:              │
        │  [NLP] [Deep Learning] [PyTorch] [+]    │
        │                                         │
        │  Your Contribution:                     │
        │  "Leads NLP and unstructured data       │
        │   initiatives. Published 3 papers with  │
        │   team at NeurIPS/ICML. Brings academic │
        │   rigor to production ML work."         │
        │                                         │
        │  [Save]                                 │
        └─────────────────────────────────────────┘

───────────────────────────────────────────────────────────────────
```

### Phase 6: Ongoing Participation

```
SARAH'S ONGOING ACTIVITIES
───────────────────────────────────────────────────────────────────

Activity 1: View Team Profile
            └─ URL: /app/teams/techflow-data-science
            └─ See team status, other members, opportunities

Activity 2: Receive Match Notifications
            └─ "New opportunity matches your team: AI Research Lead"
            └─ Review opportunities, provide feedback to Alex

Activity 3: Participate in Conversations
            └─ When companies engage, Sarah can see messages
            └─ Can add comments/context for Alex to share

Activity 4: Interview Preparation
            └─ Review company info before calls
            └─ Prepare her technical presentation section

Activity 5: Review & Accept Offer
            └─ When offer comes, Sarah reviews her portion
            └─ Signs her individual offer letter

Activity 6: Update Constraints
            └─ If anything changes (e.g., parents' health)
            └─ Update profile, notify team

───────────────────────────────────────────────────────────────────
```

---

## 3. Marcus Johnson — Team Member (Joins Team)

### Phase 1: Receive Invitation

```
INVITATION RECEIVED
───────────────────────────────────────────────────────────────────

Email Received:
┌─────────────────────────────────────────────────────────────────┐
│  Subject: Alex Chen invited you to join TechFlow Data Science   │
│                                                                 │
│  Hi Marcus,                                                     │
│                                                                 │
│  Alex Chen has invited you to join the TechFlow Data Science    │
│  Team on Liftout...                                             │
│                                                                 │
│  [Accept Invitation]                                            │
└─────────────────────────────────────────────────────────────────┘

Marcus's reaction:
  └─ Hesitant—baby coming, timing feels risky
  └─ Calls Alex: "Can we talk about this?"

───────────────────────────────────────────────────────────────────
```

### Phase 2: Pre-Signup Conversation (Off-Platform)

```
MARCUS'S HESITATION
───────────────────────────────────────────────────────────────────

Marcus's concerns (shared with Alex):
  1. "Lisa's pregnant. Is this the right time?"
  2. "What if the new job doesn't have good parental leave?"
  3. "What if I have to back out and I tank the team's chances?"
  4. "That GitHub thing from 2019—will it hurt us?"

Alex's reassurances:
  1. "We'll make parental leave a team requirement"
  2. "We'll confirm policy before accepting any offer"
  3. "If you need to back out, we figure it out together"
  4. "If it comes up, we address it as a team"

Marcus's decision: "OK, I'm in. But I need flexibility."

───────────────────────────────────────────────────────────────────
```

### Phase 3: Account Creation

```
SIGNUP (Same flow as Sarah)
───────────────────────────────────────────────────────────────────

Action 1: Click "Accept Invitation" in email
          └─ URL: /auth/signup?invite=xyz789token

Action 2: Create Account
          ┌─────────────────────────────────────────┐
          │  Email: marcus.johnson@example.com      │
          │  Password: ••••••••                     │
          │  First Name: Marcus                     │
          │  Last Name: Johnson                     │
          │                                         │
          │  [Create Account & Join Team]           │
          └─────────────────────────────────────────┘

Action 3: Email Verification → Verified

───────────────────────────────────────────────────────────────────
```

### Phase 4: Profile Setup (With Constraints)

```
PROFILE COMPLETION
───────────────────────────────────────────────────────────────────

Screen 1: Basic Info
          ┌─────────────────────────────────────────┐
          │  📷 Upload profile photo                │
          │  [randomuser.me/portraits/men/75.jpg]   │
          │                                         │
          │  Title: Machine Learning Engineer       │
          │  Location: Oakland, CA                  │
          │  LinkedIn: linkedin.com/in/marcusjohnson│
          └─────────────────────────────────────────┘

Screen 2: Experience
          ┌─────────────────────────────────────────┐
          │  Current Employer: TechFlow Analytics   │
          │  Current Title: ML Engineer             │
          │  Years of Experience: 6                 │
          │                                         │
          │  Bio:                                   │
          │  "Full-stack ML engineer focused on     │
          │   taking models from research to        │
          │   production."                          │
          └─────────────────────────────────────────┘

Screen 3: Skills
          ┌─────────────────────────────────────────┐
          │  ☑ MLOps                                │
          │  ☑ Kubernetes                           │
          │  ☑ AWS                                  │
          │  ☑ TensorFlow                           │
          │  ☑ Data Engineering                     │
          └─────────────────────────────────────────┘

Screen 4: Preferences
          ┌─────────────────────────────────────────┐
          │  Availability: Open to opportunities    │
          │  Remote Preference: Remote Required     │  ← Can't relocate
          │  Willing to Relocate: No                │  ← Wife's job
          │                                         │
          │  Special Circumstances (optional):      │
          │  "Expecting first child April 2025.     │
          │   Need confirmation of 12+ weeks        │  ← Key constraint
          │   parental leave before accepting       │
          │   any offer."                           │
          └─────────────────────────────────────────┘

───────────────────────────────────────────────────────────────────
```

### Phase 5: Team Membership & Contribution

```
TEAM DETAILS
───────────────────────────────────────────────────────────────────

Screen: Your Role on This Team
        ┌─────────────────────────────────────────┐
        │  Role: ML Engineer                      │
        │  Seniority: Senior                      │
        │                                         │
        │  Key Skills for This Team:              │
        │  [MLOps] [Kubernetes] [AWS] [TensorFlow]│
        │                                         │
        │  Your Contribution:                     │
        │  "Owns ML infrastructure and deployment │
        │   pipelines. Built production systems   │
        │   processing 10M+ predictions daily     │
        │   with 99.9% uptime."                   │
        │                                         │
        │  [Save]                                 │
        └─────────────────────────────────────────┘

RESULT: Marcus is now an active team member
        └─ Alex receives notification: "Marcus joined!"
        └─ Team now 3/4 complete

───────────────────────────────────────────────────────────────────
```

### Phase 6: Marcus's Unique Participation

```
MARCUS'S ONGOING ACTIVITIES
───────────────────────────────────────────────────────────────────

Activity 1: Flag Parental Leave as Deal-Breaker
            └─ In team discussions (off-platform)
            └─ Alex adds to team requirements

Activity 2: Prepare for Background Check
            └─ Proactively discloses GitHub 2019 incident
            └─ Team agrees on response if asked

Activity 3: Monitor Timeline Carefully
            └─ Baby due April 15
            └─ Must close by March 1 or delay to summer
            └─ Communicates timeline to Alex regularly

Activity 4: Cold Feet Moment (Week 6)
            └─ Seriously considers backing out
            └─ Conversation with Alex keeps him in
            └─ Documents concerns in case they recur

Activity 5: Verify Parental Leave in Offer
            └─ When NextGen offers, Marcus checks:
               └─ 16 weeks paid? ✅
               └─ Start date before baby? ✅
               └─ Remote flexibility post-baby? ✅
            └─ Signs offer letter

───────────────────────────────────────────────────────────────────
```

---

## 4. Priya Patel — Team Member (Joins Team)

### Phase 1: Receive Invitation

```
INVITATION RECEIVED
───────────────────────────────────────────────────────────────────

Email Received:
┌─────────────────────────────────────────────────────────────────┐
│  Subject: Alex Chen invited you to join TechFlow Data Science   │
│                                                                 │
│  Hi Priya,                                                      │
│                                                                 │
│  Alex Chen has invited you to join the TechFlow Data Science    │
│  Team on Liftout...                                             │
│                                                                 │
│  [Accept Invitation]                                            │
└─────────────────────────────────────────────────────────────────┘

Priya's reaction:
  └─ "Wait, they want ME too?!"
  └─ Texts Sarah: "Did you get this too? Is this real?"
  └─ Sarah: "Yes! We're all doing it. Sign up!"

───────────────────────────────────────────────────────────────────
```

### Phase 2: Account Creation

```
SIGNUP (Same flow)
───────────────────────────────────────────────────────────────────

Action 1: Click "Accept Invitation"
          └─ URL: /auth/signup?invite=def456token

Action 2: Create Account
          ┌─────────────────────────────────────────┐
          │  Email: priya.patel@example.com         │
          │  Password: ••••••••                     │
          │  First Name: Priya                      │
          │  Last Name: Patel                       │
          │                                         │
          │  [Create Account & Join Team]           │
          └─────────────────────────────────────────┘

Action 3: Email Verification → Verified

───────────────────────────────────────────────────────────────────
```

### Phase 3: Profile Setup (Career Growth Focus)

```
PROFILE COMPLETION
───────────────────────────────────────────────────────────────────

Screen 1: Basic Info
          ┌─────────────────────────────────────────┐
          │  📷 Upload profile photo                │
          │  [randomuser.me/portraits/women/65.jpg] │
          │                                         │
          │  Title: Senior Data Analyst             │
          │  Location: San Jose, CA                 │
          │  LinkedIn: linkedin.com/in/priyapatel   │
          └─────────────────────────────────────────┘

Screen 2: Experience
          ┌─────────────────────────────────────────┐
          │  Current Employer: TechFlow Analytics   │
          │  Current Title: Senior Data Analyst     │
          │  Years of Experience: 4                 │
          │                                         │
          │  Bio:                                   │
          │  "Data analyst passionate about         │
          │   translating complex data into         │
          │   actionable business insights."        │
          └─────────────────────────────────────────┘

Screen 3: Skills
          ┌─────────────────────────────────────────┐
          │  ☑ SQL                                  │
          │  ☑ Tableau                              │
          │  ☑ Python                               │
          │  ☑ Business Intelligence                │
          │  ☑ Data Visualization                   │
          └─────────────────────────────────────────┘

Screen 4: Preferences
          ┌─────────────────────────────────────────┐
          │  Availability: Open to opportunities    │
          │  Remote Preference: Flexible            │  ← No constraints
          │  Willing to Relocate: Yes               │  ← Flexible!
          │                                         │
          │  Career Goals (optional):               │
          │  "Seeking first management role.        │  ← Key goal
          │   Want to lead an analytics team        │
          │   within 12 months."                    │
          └─────────────────────────────────────────┘

───────────────────────────────────────────────────────────────────
```

### Phase 4: Team Membership & Contribution

```
TEAM DETAILS
───────────────────────────────────────────────────────────────────

Screen: Your Role on This Team
        ┌─────────────────────────────────────────┐
        │  Role: Data Analyst                     │
        │  Seniority: Mid                         │
        │                                         │
        │  Key Skills for This Team:              │
        │  [SQL] [Tableau] [Python] [BI]          │
        │                                         │
        │  Your Contribution:                     │
        │  "Drives analytics strategy and         │
        │   stakeholder reporting. Translates     │
        │   technical work into executive-ready   │
        │   dashboards. Documented $2.1M in       │
        │   business impact."                     │
        │                                         │
        │  [Save]                                 │
        └─────────────────────────────────────────┘

RESULT: Priya is now an active team member
        └─ Alex receives notification: "Priya joined!"
        └─ Team now 4/4 complete! 🎉

───────────────────────────────────────────────────────────────────
```

### Phase 5: Priya's Unique Participation

```
PRIYA'S ONGOING ACTIVITIES
───────────────────────────────────────────────────────────────────

Activity 1: Flag Management Track as Goal
            └─ In team discussions (off-platform)
            └─ Alex adds to negotiation priorities

Activity 2: Offer Geographic Flexibility
            └─ "I can go to NYC for onboarding if it helps"
            └─ Becomes team asset in negotiations

Activity 3: Prepare Business Impact Presentation
            └─ Compiles $2.1M savings evidence
            └─ Creates dashboard demos for interviews
            └─ Practices executive communication

Activity 4: Handle Imposter Syndrome
            └─ Week 3: "Am I the weak link?"
            └─ Sarah reassures: "You're our business translator"
            └─ Gains confidence through interview feedback

Activity 5: Negotiate Assertively
            └─ First time negotiating salary
            └─ Alex coaches her: "State your number"
            └─ Pushes from $180K to $200K (25% increase!)

Activity 6: Confirm Management Path in Offer
            └─ When NextGen offers:
               └─ Title: Lead Analytics Manager ✅
               └─ 2 direct reports within 12 months ✅
            └─ Signs offer letter

───────────────────────────────────────────────────────────────────
```

---

## 5. Sarah Rodriguez — Company User (Hires Team)

### Phase 1: Discovery (Pre-Platform)

```
WEEK 1: AWARENESS
───────────────────────────────────────────────────────────────────

Day 1: YPO dinner conversation
       └─ Another talent exec mentions "lift out"
       └─ "You hired all four? As a package deal?"
       └─ "Best hire I ever made."

Day 2: Googles "lift out hiring" "team-based hiring"
       └─ Finds HBR article by Groysberg
       └─ Reads Groysberg "Chasing Stars" research

Day 3: Deep research
       └─ 46% performance decline for solo movers
       └─ 12 months to productivity for new hires
       └─ Realizes: "Can I just BUY chemistry?"

Day 4: Finds Liftout.com
       └─ Browses "For Companies" page
       └─ Sees value proposition: "Day-one productivity"

Day 5: Creates account to browse teams
       └─ Signs up

───────────────────────────────────────────────────────────────────
```

### Phase 2: Account Creation

```
COMPANY SIGNUP
───────────────────────────────────────────────────────────────────

Action 1: Click "Get Started" or "Sign Up"
          └─ URL: /auth/signup

Action 2: Choose user type
          ┌─────────────────────────────────────────┐
          │  How do you want to use Liftout?        │
          │                                         │
          │  ○ I'm part of a team looking to move   │
          │  ● I'm a company looking to hire teams  │  ← Sarah selects
          └─────────────────────────────────────────┘

Action 3: Enter personal information
          ┌─────────────────────────────────────────┐
          │  Email: company@example.com             │
          │  Password: ••••••••                     │
          │  First Name: Sarah                      │
          │  Last Name: Rodriguez                   │
          │  Title: VP of Talent Acquisition        │
          └─────────────────────────────────────────┘

Action 4: Email verification → Verified

Action 5: Redirect to company setup
          └─ URL: /app/onboarding

───────────────────────────────────────────────────────────────────
```

### Phase 3: Company Profile Setup (MANDATORY)

```
COMPANY PROFILE (REQUIRED)
───────────────────────────────────────────────────────────────────

NOTE: Company creation is MANDATORY for company users. Cannot skip.

Screen 1: Company Basic Info
          ┌─────────────────────────────────────────┐
          │  Tell us about your company             │
          │                                         │
          │  Company Name: NextGen Financial        │
          │  Industry: Financial Services           │
          │  Company Size: 500-1000 employees       │
          │  Founded: 2019                          │
          │  Website: nextgenfinancial.com          │
          │  Headquarters: New York, NY             │
          └─────────────────────────────────────────┘
          └─ Click "Continue"

Screen 2: Company Details
          ┌─────────────────────────────────────────┐
          │  Description:                           │
          │  "Series B fintech building the future  │
          │   of financial analytics. $125M raised, │
          │   40% YoY growth, 850 employees."       │
          │                                         │
          │  Company Culture:                       │
          │  "Innovative, fast-paced, data-driven.  │
          │   We value collaboration and impact."   │
          │                                         │
          │  Employee Count: 850                    │
          └─────────────────────────────────────────┘
          └─ Click "Continue"

Screen 3: Your Role
          ┌─────────────────────────────────────────┐
          │  Your Title: VP of Talent Acquisition   │
          │  Primary Contact: ☑ Yes                 │
          │  Admin Access: ☑ Yes                    │
          └─────────────────────────────────────────┘
          └─ Click "Complete Setup"

ONBOARDING COMPLETE → OPPORTUNITY ENCOURAGEMENT:
┌─────────────────────────────────────────────────────────────────┐
│  🎉 Welcome to Liftout, Sarah!                                  │
│                                                                 │
│  Your company "NextGen Financial" is now set up.                │
│                                                                 │
│  WHAT WOULD YOU LIKE TO DO FIRST?                               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🎯 Post an Opportunity                                 │   │
│  │  Tell teams what you're looking for                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  👥 Browse Available Teams                              │   │
│  │  See what teams are looking to move                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  PRO TIP: Companies that post opportunities get 3x more         │
│  qualified team matches!                                        │
└─────────────────────────────────────────────────────────────────┘

Sarah clicks: "Post an Opportunity" (encouraged path)
OR
Sarah clicks: "Browse Available Teams" (alternate path)

───────────────────────────────────────────────────────────────────
```

### Phase 4: Browse Available Teams

```
TEAM DISCOVERY
───────────────────────────────────────────────────────────────────

Action 1: Navigate to Teams
          └─ URL: /app/teams/browse

Action 2: Apply Filters
          ┌─────────────────────────────────────────┐
          │  Find Teams                             │
          │                                         │
          │  Industry: [Financial Services ▼]       │
          │  Specialization: [Data Science ▼]       │
          │  Team Size: [3-6 ▼]                     │
          │  Location: [Any ▼]                      │
          │  Remote OK: ☑                           │
          │  Availability: [Available ▼]            │
          │                                         │
          │  [Search]                               │
          └─────────────────────────────────────────┘

Action 3: Review Results
          ┌─────────────────────────────────────────┐
          │  8 teams match your criteria            │
          │                                         │
          │  ┌─────────────────────────────────────┐│
          │  │ TechFlow Data Science Team          ││
          │  │ 4 members | 3.5 years together      ││
          │  │ San Francisco | FinTech Analytics   ││
          │  │ Cohesion: 94/100 | Match: 88%       ││
          │  │ [View Profile]                      ││
          │  └─────────────────────────────────────┘│
          │                                         │
          │  ┌─────────────────────────────────────┐│
          │  │ Bay Area ML Team                    ││
          │  │ 5 members | 2 years together        ││
          │  │ ...                                 ││
          │  └─────────────────────────────────────┘│
          └─────────────────────────────────────────┘

Action 4: View Team Profile
          └─ Click on TechFlow Data Science Team
          └─ URL: /app/teams/techflow-data-science

Team Profile View:
          ┌─────────────────────────────────────────┐
          │  TechFlow Data Science Team             │
          │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
          │                                         │
          │  📊 Cohesion Score: 94/100              │
          │  👥 4 Members | 3.5 Years Together      │
          │  📍 San Francisco, CA | Hybrid OK       │
          │  💰 $180K - $280K per member            │
          │                                         │
          │  TEAM MEMBERS                           │
          │  ┌─────────┬─────────────────────────┐ │
          │  │ 👨‍💼 Alex │ Team Lead, 10 yrs exp    │ │
          │  │ 👩‍🔬 Sarah│ Sr Data Scientist, PhD   │ │
          │  │ 👨‍💻 Marcus│ ML Engineer, MLOps      │ │
          │  │ 👩‍💼 Priya│ Sr Analyst, BI expert    │ │
          │  └─────────┴─────────────────────────┘ │
          │                                         │
          │  HIGHLIGHTS                             │
          │  • $2.1M documented savings             │
          │  • 10M+ predictions/day in production   │
          │  • 3 papers at NeurIPS/ICML             │
          │  • 99.9% system uptime                  │
          │                                         │
          │  [Express Interest] [Save Team]         │
          └─────────────────────────────────────────┘

───────────────────────────────────────────────────────────────────
```

### Phase 5: Post Opportunity

```
OPPORTUNITY CREATION
───────────────────────────────────────────────────────────────────

Action 1: Navigate to Opportunities
          └─ URL: /app/opportunities
          └─ Click "Post New Opportunity"

Action 2: Opportunity Details
          ┌─────────────────────────────────────────┐
          │  Create Opportunity                     │
          │                                         │
          │  Title: Lead FinTech Analytics Division │
          │                                         │
          │  Description:                           │
          │  "We're building an analytics division  │
          │   from scratch. Looking for a data      │
          │   science team (4-6 people) to own our  │
          │   ML and analytics strategy. You'll     │
          │   report to the CTO with full P&L       │
          │   responsibility."                      │
          │                                         │
          │  Team Size Needed: 4-6                  │
          │  Industry: Financial Services           │
          │  Specialization: Data Science / ML      │
          └─────────────────────────────────────────┘
          └─ Click "Continue"

Action 3: Compensation & Location
          ┌─────────────────────────────────────────┐
          │  Salary Range: $180,000 - $400,000      │
          │  Equity: Yes                            │
          │  Location: New York, NY                 │
          │  Remote: Hybrid OK                      │
          │                                         │
          │  Requirements:                          │
          │  • 3+ years working together            │
          │  • Production ML experience             │
          │  • FinTech or financial services exp    │
          └─────────────────────────────────────────┘
          └─ Click "Continue"

Action 4: Review & Publish
          ┌─────────────────────────────────────────┐
          │  Review Your Opportunity                │
          │                                         │
          │  [Preview]                              │
          │                                         │
          │  Visibility:                            │
          │  ● Public - All matching teams can see  │
          │  ○ Private - Invite-only               │
          │                                         │
          │  [Publish Opportunity]                  │
          └─────────────────────────────────────────┘

RESULT: Opportunity published
        └─ Visible to matching teams
        └─ AI matching notifies relevant teams

───────────────────────────────────────────────────────────────────
```

### Phase 6: Receive & Review Applications

```
INBOUND INTEREST
───────────────────────────────────────────────────────────────────

Notification: "TechFlow Data Science Team expressed interest!"
              └─ Email + in-app notification

Action 1: View Expression of Interest
          └─ URL: /app/opportunities/lead-analytics/applicants
          ┌─────────────────────────────────────────┐
          │  Applicants: Lead FinTech Analytics     │
          │                                         │
          │  ┌─────────────────────────────────────┐│
          │  │ TechFlow Data Science Team          ││
          │  │ Match Score: 88% ⭐⭐⭐⭐            ││
          │  │ Applied: 2 hours ago                ││
          │  │                                     ││
          │  │ Message:                            ││
          │  │ "Our team has 3.5 years of exp in   ││
          │  │  fintech analytics. We've built     ││
          │  │  production ML systems processing   ││
          │  │  10M+ predictions daily..."         ││
          │  │                                     ││
          │  │ [View Full Profile] [Respond]       ││
          │  └─────────────────────────────────────┘│
          └─────────────────────────────────────────┘

Action 2: Deep Dive into Team Profile
          └─ Click "View Full Profile"
          └─ Review each team member
          └─ Check cohesion score breakdown
          └─ Review skills matrix

Action 3: Internal Discussion (off-platform)
          └─ Sarah presents team to CEO and CTO
          └─ Gets approval to proceed
          └─ CFO runs cost analysis

───────────────────────────────────────────────────────────────────
```

### Phase 7: Initiate Conversation

```
ENGAGEMENT
───────────────────────────────────────────────────────────────────

Action 1: Respond to Team
          └─ Click "Respond" on TechFlow application
          ┌─────────────────────────────────────────┐
          │  Message to TechFlow Data Science Team  │
          │                                         │
          │  "Hi Alex,                              │
          │                                         │
          │   Your team's profile is impressive.    │
          │   We're building an analytics division  │
          │   from scratch and your experience is   │
          │   exactly what we need.                 │
          │                                         │
          │   Would your team be available for an   │
          │   initial call this week?"              │
          │                                         │
          │  [Send]                                 │
          └─────────────────────────────────────────┘

Action 2: Conversation Thread Created
          └─ URL: /app/conversations/techflow-team
          └─ Both parties can message
          └─ All messages are NDA-protected

Action 3: Schedule Interview
          └─ Coordinate availability
          └─ Send calendar invite (outside platform)
          └─ Update status: "Interview Scheduled"

───────────────────────────────────────────────────────────────────
```

### Phase 8: Interview Process (Company Side)

```
INTERVIEW MANAGEMENT
───────────────────────────────────────────────────────────────────

Action 1: Update Application Status
          └─ URL: /app/opportunities/lead-analytics/applicants
          └─ TechFlow status: "Interview Stage"

Action 2: Conduct Interviews
          └─ Initial call (Sarah Rodriguez hosts)
          └─ Technical deep dive (CTO hosts)
          └─ Executive meeting (CEO, CFO join)
          └─ HR & Logistics (HR team)

Action 3: Internal Debrief (off-platform)
          └─ Hiring committee meets
          └─ Score each team member
          └─ Discuss team dynamics observed
          └─ Decision: "Proceed to offer"

Action 4: Reference Checks
          └─ Request references through platform
          └─ Team provides 3 references
          └─ All come back positive

Action 5: Update Status
          └─ TechFlow status: "Final Stage - Preparing Offer"

───────────────────────────────────────────────────────────────────
```

### Phase 9: Extend Offer

```
OFFER CREATION
───────────────────────────────────────────────────────────────────

Action 1: Create Team Offer
          └─ URL: /app/offers/create
          └─ Select: TechFlow Data Science Team
          ┌─────────────────────────────────────────┐
          │  Create Offer                           │
          │                                         │
          │  Team: TechFlow Data Science Team       │
          │  Opportunity: Lead FinTech Analytics    │
          │                                         │
          │  OFFER DETAILS BY MEMBER                │
          │  ─────────────────────────────────────  │
          │                                         │
          │  Alex Chen                              │
          │  Title: VP of Analytics                 │
          │  Salary: $380,000                       │
          │  Equity: $96,000/year                   │
          │  Signing Bonus: $25,000                 │
          │                                         │
          │  Sarah Martinez                         │
          │  Title: Principal Data Scientist        │
          │  Salary: $320,000                       │
          │  Equity: $72,000/year                   │
          │  Signing Bonus: $15,000                 │
          │                                         │
          │  Marcus Johnson                         │
          │  Title: Principal ML Engineer           │
          │  Salary: $290,000                       │
          │  Equity: $48,000/year                   │
          │  Signing Bonus: $7,000                  │
          │  Note: Confirm 16 weeks parental leave  │
          │                                         │
          │  Priya Patel                            │
          │  Title: Lead Analytics Manager          │
          │  Salary: $200,000                       │
          │  Equity: $24,000/year                   │
          │  Signing Bonus: $3,000                  │
          │  Note: Management track confirmed       │
          │                                         │
          │  ─────────────────────────────────────  │
          │  Start Date: March 1, 2025             │
          │  Location: Remote (Bay Area base OK)   │
          │  ─────────────────────────────────────  │
          │                                         │
          │  [Preview Offer] [Send Offer]           │
          └─────────────────────────────────────────┘

Action 2: Send Offer
          └─ Click "Send Offer"
          └─ Team receives notification
          └─ Status: "Offer Extended"

───────────────────────────────────────────────────────────────────
```

### Phase 10: Offer Accepted & Onboarding Prep

```
POST-ACCEPTANCE
───────────────────────────────────────────────────────────────────

Notification: "TechFlow Data Science Team accepted your offer!"

Action 1: Confirm Acceptance
          └─ URL: /app/offers/techflow-team
          └─ Status: "Offer Accepted"
          └─ All 4 members signed

Action 2: Initiate Onboarding (off-platform)
          └─ Send welcome emails
          └─ Begin background checks
          └─ Prepare equipment and access
          └─ Schedule Day 1 orientation

Action 3: Update Opportunity Status
          └─ Opportunity: "Filled"
          └─ Option to post success story

Action 4: Post-Hire Follow-up
          └─ 30-day check-in survey sent to both parties
          └─ 90-day success tracking
          └─ Outcome reported for platform metrics

───────────────────────────────────────────────────────────────────
```

---

## 6. Team ↔ Company Interaction Flow

### The Complete Conversation Arc

```
INTERACTION TIMELINE
═══════════════════════════════════════════════════════════════════

STAGE 1: DISCOVERY
─────────────────────
Team                              Company
────                              ───────
Alex creates team        →        Sarah browses teams
Invites members          →        Posts opportunity
Team goes "Available"    →        Sees TechFlow match (88%)

STAGE 2: FIRST CONTACT
─────────────────────
Team                              Company
────                              ───────
Alex sees NextGen posting         Sarah sees TechFlow EOI
Expresses interest       →
                         ←        Sarah responds, requests call
Alex confirms availability→
                         ←        Sarah sends calendar invite

STAGE 3: INTERVIEW
─────────────────────
Team                              Company
────                              ───────
All 4 join initial call  ↔        Sarah hosts initial call
Technical presentations  ↔        CTO evaluates
Meet executives          ↔        CEO/CFO assess fit
Discuss logistics        ↔        HR clarifies policies

STAGE 4: NEGOTIATION
─────────────────────
Team                              Company
────                              ───────
Alex sets team expectations →     Sarah presents to committee
                         ←        Sarah extends initial offer
Team reviews together
Alex counters on Sarah M's →      CFO approves adjustment
salary alignment         ←        Sarah sends revised offer
Team accepts             →        Sarah confirms

STAGE 5: CLOSE
─────────────────────
Team                              Company
────                              ───────
All 4 sign offer letters →        Sarah receives confirmations
Resign from TechFlow              Prep onboarding
                         ←        Welcome emails sent
Start at NextGen         →        Day 1 orientation

═══════════════════════════════════════════════════════════════════
```

### Platform Touchpoints

| Stage | Team Actions (Platform) | Company Actions (Platform) |
|-------|------------------------|---------------------------|
| Discovery | Browse opportunities, set filters | Browse teams, set filters |
| Profile | Create/update team profile | Create/update company profile |
| Matching | View match scores | View match scores |
| Interest | Express interest | Post opportunity |
| Conversation | Reply to messages | Initiate/reply to messages |
| Status | View application status | Update application status |
| Offer | Review offer, accept/negotiate | Create offer, send |
| Close | Confirm acceptance | Confirm receipt |
| Follow-up | Complete surveys | Complete surveys |

---

## 7. Complete Timeline View

### End-to-End Calendar

```
DECEMBER 2024
═══════════════════════════════════════════════════════════════════

Week 1 (Dec 1-7)
────────────────
Mon: Sarah Martinez sends article to Alex
Tue: Alex researches liftouts
Wed: Alex finds Liftout.com
Thu: Alex browses anonymously
Fri: Alex creates account

Week 2 (Dec 8-14)
────────────────
Mon: Alex completes profile
Tue: Alex creates team, invites members
Wed: Sarah M accepts invite, creates profile
Thu: Marcus accepts invite, creates profile
Fri: Priya accepts invite, creates profile
     └─ Team complete! 🎉

Week 3 (Dec 15-21)
────────────────
Mon: Alex sets team to "Available"
Tue: Alex expresses interest in NextGen
Wed: (Sarah Rodriguez already posted opportunity)
Thu: Sarah R sees TechFlow EOI, responds
Fri: Initial call scheduled for Monday

Week 4 (Dec 22-28)
────────────────
Mon: Initial team call with NextGen
Tue: Internal team debrief
Wed: Technical deep dive scheduled
Thu: (Holiday break begins)
Fri: (Holiday)

═══════════════════════════════════════════════════════════════════

JANUARY 2025
═══════════════════════════════════════════════════════════════════

Week 5 (Dec 29 - Jan 4)
────────────────
(Holiday week - minimal activity)

Week 6 (Jan 5-11)
────────────────
Mon: Technical deep dive interview
Tue: Each team member presents
Wed: Executive meeting (CEO, CFO)
Thu: Marcus has cold feet moment 😰
Fri: Alex talks Marcus through it ✅

Week 7 (Jan 12-18)
────────────────
Mon: HR & logistics discussion
Tue: Reference checks initiated
Wed: Reference checks complete
Thu: NextGen internal decision: "Proceed to offer"
Fri: Offer preparation begins

Week 8 (Jan 19-25)
────────────────
Mon: Sarah R sends offer via platform
Tue: Alex reviews with team
Wed: Minor negotiation (Sarah M salary alignment)
Thu: Revised offer sent
Fri: Team accepts offer 🎉

Week 9 (Jan 26 - Feb 1)
────────────────
Mon: All 4 sign offer letters
Tue: Background checks clear
Wed: Team coordinates resignation timing
Thu: All 4 resign from TechFlow
Fri: Notice period begins

═══════════════════════════════════════════════════════════════════

FEBRUARY 2025
═══════════════════════════════════════════════════════════════════

Week 10-13 (Feb 1-28)
────────────────
• Notice period at TechFlow
• Knowledge transfer and handoff
• NextGen preps onboarding
• Equipment and access provisioned

═══════════════════════════════════════════════════════════════════

MARCH 2025
═══════════════════════════════════════════════════════════════════

Week 14 (Mar 1-7)
────────────────
Mon: FIRST DAY AT NEXTGEN 🚀
     └─ Team arrives together
     └─ Welcome orientation
     └─ Meet executives
Tue-Fri: Intensive onboarding week

Week 15-17 (Mar 8-28)
────────────────
• Team integration continues
• First project identified
• Relationships built across org
• 30-day check-in survey sent

═══════════════════════════════════════════════════════════════════

APRIL 2025
═══════════════════════════════════════════════════════════════════

Week 18+
────────────────
• Marcus begins parental leave (April 15)
• Team covers, continues delivering
• 90-day check-in survey sent
• First major project delivered

═══════════════════════════════════════════════════════════════════

TOTAL PROCESS TIME: ~11 weeks (discovery to start)
                    ~8 weeks (signup to offer accepted)

═══════════════════════════════════════════════════════════════════
```

---

## Appendix: Screen-by-Screen Summary

### Team User Screens (Alex/Sarah M/Marcus/Priya)

| Screen | URL | Purpose |
|--------|-----|---------|
| Signup | /auth/signup | Create account |
| Email Verification | /auth/verify | Verify email |
| Onboarding | /app/onboarding | Profile + team setup |
| Dashboard | /app/dashboard | Overview |
| Team Profile | /app/teams/[slug] | View/edit team |
| Team Members | /app/teams/[slug]/members | Manage members |
| Browse Opportunities | /app/opportunities | Find matches |
| Opportunity Detail | /app/opportunities/[id] | View + apply |
| Applications | /app/applications | Track applications |
| Conversations | /app/conversations | Message companies |
| Offers | /app/offers | Review offers |
| Settings | /app/settings | Account settings |

### Company User Screens (Sarah Rodriguez)

| Screen | URL | Purpose |
|--------|-----|---------|
| Signup | /auth/signup | Create account |
| Email Verification | /auth/verify | Verify email |
| Onboarding | /app/onboarding | Company setup |
| Dashboard | /app/dashboard | Overview |
| Company Profile | /app/company | View/edit company |
| Browse Teams | /app/teams/browse | Find teams |
| Team Detail | /app/teams/[slug] | View team |
| Opportunities | /app/opportunities | Manage postings |
| Create Opportunity | /app/opportunities/create | Post new |
| Applicants | /app/opportunities/[id]/applicants | Review teams |
| Conversations | /app/conversations | Message teams |
| Create Offer | /app/offers/create | Extend offer |
| Settings | /app/settings | Account settings |

---

*Document last updated: December 2024*
