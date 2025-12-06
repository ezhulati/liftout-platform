# Complete User Actions List

> Every possible action each user type can take on the Liftout platform

---

## Table of Contents

1. [Action Categories Overview](#action-categories-overview)
2. [Alex Chen — Team Lead Actions](#alex-chen--team-lead-actions)
3. [Sarah Martinez — Team Member Actions](#sarah-martinez--team-member-actions)
4. [Marcus Johnson — Team Member Actions](#marcus-johnson--team-member-actions)
5. [Priya Patel — Team Member Actions](#priya-patel--team-member-actions)
6. [Sarah Rodriguez — Company User Actions](#sarah-rodriguez--company-user-actions)
7. [Action Permissions Matrix](#action-permissions-matrix)
8. [Action-to-API Mapping](#action-to-api-mapping)

---

## Action Categories Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    ACTION CATEGORIES                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔐 AUTHENTICATION        Account creation, login, security     │
│  👤 PROFILE               Personal info, preferences, settings  │
│  👥 TEAM                  Team creation, membership, management │
│  💼 OPPORTUNITIES         Browse, apply, track opportunities    │
│  💬 CONVERSATIONS         Messaging with companies/teams        │
│  📄 APPLICATIONS          Submit, track, manage applications    │
│  📋 OFFERS                Review, negotiate, accept offers      │
│  🏢 COMPANY               Company profile, opportunity posting  │
│  🔔 NOTIFICATIONS         Manage alerts and preferences         │
│  ⚙️ SETTINGS              Account and privacy settings          │
│  📊 ANALYTICS             View metrics and insights             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Alex Chen — Team Lead Actions

### 🔐 Authentication Actions

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| A1 | Sign up | Create new account | `/auth/signup` |
| A2 | Verify email | Confirm email address | `/auth/verify?token=xxx` |
| A3 | Log in | Access account | `/auth/signin` |
| A4 | Log out | End session | `/auth/signout` |
| A5 | Reset password | Request password reset | `/auth/forgot-password` |
| A6 | Change password | Update password | `/app/settings/security` |
| A7 | Enable 2FA | Turn on two-factor auth | `/app/settings/security` |
| A8 | Disable 2FA | Turn off two-factor auth | `/app/settings/security` |
| A9 | View active sessions | See logged-in devices | `/app/settings/security` |
| A10 | Revoke session | Log out other devices | `/app/settings/security` |

### 👤 Profile Actions

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| P1 | Complete onboarding | Initial profile setup | `/app/onboarding` |
| P2 | Upload profile photo | Add/change avatar | `/app/profile` |
| P3 | Edit basic info | Name, title, location | `/app/profile` |
| P4 | Edit bio | Personal description | `/app/profile` |
| P5 | Add experience | Work history | `/app/profile/experience` |
| P6 | Edit experience | Modify work history | `/app/profile/experience` |
| P7 | Delete experience | Remove work history | `/app/profile/experience` |
| P8 | Add skills | Select skills | `/app/profile/skills` |
| P9 | Remove skills | Deselect skills | `/app/profile/skills` |
| P10 | Set availability status | Open/Not looking/Urgent | `/app/profile` |
| P11 | Set remote preference | Remote/Hybrid/Onsite | `/app/profile` |
| P12 | Set relocation willingness | Yes/No/Maybe | `/app/profile` |
| P13 | Add LinkedIn URL | Link LinkedIn profile | `/app/profile` |
| P14 | Add portfolio URL | Link portfolio | `/app/profile` |
| P15 | Set salary expectations | Min/Max range | `/app/profile` |
| P16 | View own profile | See public view | `/app/profile/preview` |
| P17 | Download profile | Export as PDF | `/app/profile` |

### 👥 Team Actions (Lead-Specific)

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| T1 | Create team | Start new team | `/app/teams/create` |
| T2 | Edit team name | Change team name | `/app/teams/[slug]/edit` |
| T3 | Edit team description | Update description | `/app/teams/[slug]/edit` |
| T4 | Edit team industry | Change industry | `/app/teams/[slug]/edit` |
| T5 | Edit team specialization | Change focus area | `/app/teams/[slug]/edit` |
| T6 | Set team location | Primary location | `/app/teams/[slug]/edit` |
| T7 | Set remote status | Remote/Hybrid/Onsite | `/app/teams/[slug]/edit` |
| T8 | Set years together | Time as team | `/app/teams/[slug]/edit` |
| T9 | Edit team culture | Culture description | `/app/teams/[slug]/edit` |
| T10 | Edit working style | How team operates | `/app/teams/[slug]/edit` |
| T11 | Set salary range | Min/Max per member | `/app/teams/[slug]/edit` |
| T12 | Set relocation willingness | Team-wide setting | `/app/teams/[slug]/edit` |
| T13 | Invite team member | Send invite email | `/app/teams/[slug]/members` |
| T14 | Cancel pending invite | Revoke before accepted | `/app/teams/[slug]/members` |
| T15 | Resend invite | Re-send invite email | `/app/teams/[slug]/members` |
| T16 | Remove team member | Remove from team | `/app/teams/[slug]/members` |
| T17 | Promote to admin | Give admin rights | `/app/teams/[slug]/members` |
| T18 | Demote from admin | Remove admin rights | `/app/teams/[slug]/members` |
| T19 | Transfer leadership | Make another user lead | `/app/teams/[slug]/settings` |
| T20 | Set team visibility | Public/Selective/Anonymous | `/app/teams/[slug]/settings` |
| T21 | Block company | Prevent company from seeing | `/app/teams/[slug]/settings` |
| T22 | Unblock company | Allow company to see | `/app/teams/[slug]/settings` |
| T23 | Set availability status | Available/Not looking | `/app/teams/[slug]/settings` |
| T24 | Request verification | Submit for verification | `/app/teams/[slug]/settings` |
| T34 | Post team | Make team visible to companies | `/app/teams/[slug]` |
| T35 | Unpost team | Hide team from companies | `/app/teams/[slug]` |
| T36 | Re-post team | Make previously unposted team visible again | `/app/teams/[slug]` |
| T37 | View posting requirements | See what's needed to post | `/app/teams/[slug]` |
| T38 | View team status | See DRAFT/READY/POSTED/UNPOSTED | `/app/teams/[slug]` |
| T25 | Add team achievement | Highlight accomplishment | `/app/teams/[slug]/achievements` |
| T26 | Edit team achievement | Modify achievement | `/app/teams/[slug]/achievements` |
| T27 | Delete team achievement | Remove achievement | `/app/teams/[slug]/achievements` |
| T28 | Upload team document | Add supporting doc | `/app/teams/[slug]/documents` |
| T29 | Delete team document | Remove document | `/app/teams/[slug]/documents` |
| T30 | View team analytics | See team metrics | `/app/teams/[slug]/analytics` |
| T31 | Delete team | Permanently remove team | `/app/teams/[slug]/settings` |
| T32 | Archive team | Hide without deleting | `/app/teams/[slug]/settings` |
| T33 | View team cohesion score | See chemistry metrics | `/app/teams/[slug]` |

### 💼 Opportunity Actions

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| O1 | Browse opportunities | View all opportunities | `/app/opportunities` |
| O2 | Filter opportunities | Apply filters | `/app/opportunities` |
| O3 | Search opportunities | Keyword search | `/app/opportunities` |
| O4 | Sort opportunities | Change sort order | `/app/opportunities` |
| O5 | View opportunity detail | See full details | `/app/opportunities/[id]` |
| O6 | Save opportunity | Bookmark for later | `/app/opportunities/[id]` |
| O7 | Unsave opportunity | Remove bookmark | `/app/opportunities/[id]` |
| O8 | View saved opportunities | See all bookmarks | `/app/opportunities/saved` |
| O9 | Express interest | Initial application | `/app/opportunities/[id]` |
| O10 | Withdraw interest | Cancel application | `/app/applications/[id]` |
| O11 | View match score | See AI match % | `/app/opportunities/[id]` |
| O12 | View company profile | See hiring company | `/app/companies/[slug]` |
| O13 | Report opportunity | Flag inappropriate | `/app/opportunities/[id]` |
| O14 | Share opportunity | Share with team (internal) | `/app/opportunities/[id]` |
| O15 | Hide opportunity | Don't show again | `/app/opportunities/[id]` |
| O16 | Set opportunity alerts | Get notified of matches | `/app/settings/notifications` |

### 💬 Conversation Actions

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| C1 | View conversations | See all threads | `/app/conversations` |
| C2 | Open conversation | View specific thread | `/app/conversations/[id]` |
| C3 | Send message | Write to company | `/app/conversations/[id]` |
| C4 | Reply to message | Respond to company | `/app/conversations/[id]` |
| C5 | Attach file | Add document to message | `/app/conversations/[id]` |
| C6 | Download attachment | Get attached file | `/app/conversations/[id]` |
| C7 | Mark as read | Clear unread status | `/app/conversations/[id]` |
| C8 | Mark as unread | Set as unread | `/app/conversations/[id]` |
| C9 | Archive conversation | Hide from inbox | `/app/conversations/[id]` |
| C10 | Unarchive conversation | Restore to inbox | `/app/conversations/archived` |
| C11 | Search conversations | Find messages | `/app/conversations` |
| C12 | Filter conversations | By status/date | `/app/conversations` |
| C13 | Mute conversation | Stop notifications | `/app/conversations/[id]` |
| C14 | Unmute conversation | Resume notifications | `/app/conversations/[id]` |
| C15 | Report conversation | Flag inappropriate | `/app/conversations/[id]` |
| C16 | Block company | Prevent future contact | `/app/conversations/[id]` |

### 📄 Application Actions

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| AP1 | View all applications | See application list | `/app/applications` |
| AP2 | View application detail | See specific app | `/app/applications/[id]` |
| AP3 | Update application note | Add internal notes | `/app/applications/[id]` |
| AP4 | Withdraw application | Cancel application | `/app/applications/[id]` |
| AP5 | View application status | See current stage | `/app/applications/[id]` |
| AP6 | View application history | See status changes | `/app/applications/[id]` |
| AP7 | Filter applications | By status/date | `/app/applications` |
| AP8 | Sort applications | Change order | `/app/applications` |
| AP9 | Export applications | Download as CSV | `/app/applications` |

### 📋 Offer Actions

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| OF1 | View offers | See all offers | `/app/offers` |
| OF2 | View offer detail | See specific offer | `/app/offers/[id]` |
| OF3 | Accept offer | Confirm acceptance | `/app/offers/[id]` |
| OF4 | Decline offer | Reject offer | `/app/offers/[id]` |
| OF5 | Request negotiation | Ask for changes | `/app/offers/[id]` |
| OF6 | Counter offer | Propose new terms | `/app/offers/[id]` |
| OF7 | View offer history | See revisions | `/app/offers/[id]` |
| OF8 | Download offer | Get as PDF | `/app/offers/[id]` |
| OF9 | Share offer with team | Internal sharing | `/app/offers/[id]` |
| OF10 | Set offer deadline | Response deadline | `/app/offers/[id]` |

### 🔔 Notification Actions

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| N1 | View notifications | See all alerts | `/app/notifications` |
| N2 | Mark notification read | Clear single | `/app/notifications` |
| N3 | Mark all read | Clear all | `/app/notifications` |
| N4 | Delete notification | Remove single | `/app/notifications` |
| N5 | Clear all notifications | Remove all | `/app/notifications` |
| N6 | Set email preferences | Which emails to receive | `/app/settings/notifications` |
| N7 | Set push preferences | Which push to receive | `/app/settings/notifications` |
| N8 | Mute all notifications | Temporary silence | `/app/settings/notifications` |
| N9 | Set quiet hours | No notifications during | `/app/settings/notifications` |

### ⚙️ Settings Actions

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| S1 | View account settings | See all settings | `/app/settings` |
| S2 | Change email | Update email address | `/app/settings/account` |
| S3 | Change password | Update password | `/app/settings/security` |
| S4 | Delete account | Permanently remove | `/app/settings/account` |
| S5 | Export data | Download all data | `/app/settings/privacy` |
| S6 | Set privacy level | Profile visibility | `/app/settings/privacy` |
| S7 | Manage blocked users | See/unblock users | `/app/settings/privacy` |
| S8 | Connect LinkedIn | OAuth integration | `/app/settings/integrations` |
| S9 | Disconnect LinkedIn | Remove integration | `/app/settings/integrations` |
| S10 | Set timezone | Local time display | `/app/settings/preferences` |
| S11 | Set language | Interface language | `/app/settings/preferences` |
| S12 | Set date format | Date display format | `/app/settings/preferences` |

### 📊 Analytics Actions

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| AN1 | View profile views | Who viewed profile | `/app/analytics` |
| AN2 | View team views | Who viewed team | `/app/analytics` |
| AN3 | View match statistics | Match score trends | `/app/analytics` |
| AN4 | View application stats | Application metrics | `/app/analytics` |
| AN5 | Export analytics | Download reports | `/app/analytics` |

---

## Sarah Martinez — Team Member Actions

*Sarah has all profile and personal actions but limited team admin capabilities*

### 🔐 Authentication Actions
*Same as Alex: A1-A10*

### 👤 Profile Actions
*Same as Alex: P1-P17*

### 👥 Team Actions (Member-Specific)

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| TM1 | Accept team invite | Join team | `/auth/signup?invite=xxx` |
| TM2 | Decline team invite | Reject invite | (email link) |
| TM3 | View team profile | See team details | `/app/teams/[slug]` |
| TM4 | View team members | See all members | `/app/teams/[slug]/members` |
| TM5 | Edit own role | Update team role | `/app/teams/[slug]/members` |
| TM6 | Edit own contribution | Update contribution text | `/app/teams/[slug]/members` |
| TM7 | Edit own skills (team) | Skills for this team | `/app/teams/[slug]/members` |
| TM8 | Leave team | Remove self from team | `/app/teams/[slug]` |
| TM9 | View team opportunities | See what team applied to | `/app/teams/[slug]/opportunities` |
| TM10 | View team conversations | See team messages | `/app/conversations` |
| TM11 | Add comment to conversation | Internal team note | `/app/conversations/[id]` |
| TM12 | View team analytics | See team metrics | `/app/teams/[slug]/analytics` |
| TM13 | Request admin access | Ask lead for admin | `/app/teams/[slug]` |

### 💼 Opportunity Actions (Limited)

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| O1 | Browse opportunities | View all opportunities | `/app/opportunities` |
| O2 | Filter opportunities | Apply filters | `/app/opportunities` |
| O3 | Search opportunities | Keyword search | `/app/opportunities` |
| O4 | View opportunity detail | See full details | `/app/opportunities/[id]` |
| O5 | Save opportunity | Bookmark for later | `/app/opportunities/[id]` |
| O6 | Unsave opportunity | Remove bookmark | `/app/opportunities/[id]` |
| O7 | View saved opportunities | See all bookmarks | `/app/opportunities/saved` |
| O11 | View match score | See AI match % | `/app/opportunities/[id]` |
| O12 | View company profile | See hiring company | `/app/companies/[slug]` |
| O14 | Suggest to team lead | Recommend opportunity | `/app/opportunities/[id]` |

*Note: Sarah cannot express interest (O9) directly—only team lead can*

### 💬 Conversation Actions (Limited)

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| C1 | View conversations | See team threads | `/app/conversations` |
| C2 | Open conversation | View specific thread | `/app/conversations/[id]` |
| C7 | Mark as read | Clear unread status | `/app/conversations/[id]` |
| C11 | Search conversations | Find messages | `/app/conversations` |
| TM11 | Add internal comment | Note for team only | `/app/conversations/[id]` |

*Note: Sarah cannot send messages to companies directly—goes through Alex*

### 📄 Application Actions (View Only)

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| AP1 | View all applications | See application list | `/app/applications` |
| AP2 | View application detail | See specific app | `/app/applications/[id]` |
| AP5 | View application status | See current stage | `/app/applications/[id]` |
| AP6 | View application history | See status changes | `/app/applications/[id]` |

### 📋 Offer Actions

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| OF1 | View offers | See all offers | `/app/offers` |
| OF2 | View offer detail | See specific offer | `/app/offers/[id]` |
| OF3 | Accept offer (own portion) | Confirm own acceptance | `/app/offers/[id]` |
| OF4 | Decline offer (own portion) | Reject own portion | `/app/offers/[id]` |
| OF6 | Request changes (own) | Ask for adjustment | `/app/offers/[id]` |
| OF7 | View offer history | See revisions | `/app/offers/[id]` |
| OF8 | Download offer | Get own as PDF | `/app/offers/[id]` |

### 🔔 Notification Actions
*Same as Alex: N1-N9*

### ⚙️ Settings Actions
*Same as Alex: S1-S12*

### 📊 Analytics Actions (Limited)

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| AN1 | View profile views | Who viewed own profile | `/app/analytics` |
| AN2 | View team views | Who viewed team | `/app/analytics` |

---

## Marcus Johnson — Team Member Actions

*Same permissions as Sarah Martinez, with same action set: TM1-TM13*

### Unique Considerations for Marcus

| Action | Marcus-Specific Note |
|--------|---------------------|
| P10 (Set availability) | May set special note about parental leave timing |
| TM6 (Edit contribution) | Includes infrastructure/MLOps specifics |
| OF6 (Request changes) | May specifically request parental leave confirmation |

---

## Priya Patel — Team Member Actions

*Same permissions as Sarah Martinez, with same action set: TM1-TM13*

### Unique Considerations for Priya

| Action | Priya-Specific Note |
|--------|---------------------|
| P10 (Set availability) | May note management track interest |
| P12 (Relocation) | Set to "Yes" - fully flexible |
| TM6 (Edit contribution) | Emphasizes business translation role |
| OF6 (Request changes) | May specifically request management path confirmation |

---

## Sarah Rodriguez — Company User Actions

### 🔐 Authentication Actions
*Same as team users: A1-A10*

### 👤 Profile Actions (Personal)

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| P1 | Complete onboarding | Initial profile + company setup | `/app/onboarding` |
| P2 | Upload profile photo | Add/change avatar | `/app/profile` |
| P3 | Edit basic info | Name, title | `/app/profile` |
| P13 | Add LinkedIn URL | Link LinkedIn profile | `/app/profile` |

### 🏢 Company Actions

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| CO1 | Create company | Register company | `/app/company/create` |
| CO2 | Edit company name | Change company name | `/app/company/edit` |
| CO3 | Edit company description | Update description | `/app/company/edit` |
| CO4 | Upload company logo | Add/change logo | `/app/company/edit` |
| CO5 | Set company industry | Change industry | `/app/company/edit` |
| CO6 | Set company size | Employee count range | `/app/company/edit` |
| CO7 | Set company location | Headquarters | `/app/company/edit` |
| CO8 | Set company website | Company URL | `/app/company/edit` |
| CO9 | Edit company culture | Culture description | `/app/company/edit` |
| CO10 | Set founded year | Year established | `/app/company/edit` |
| CO11 | Add office location | Additional locations | `/app/company/locations` |
| CO12 | Remove office location | Delete location | `/app/company/locations` |
| CO13 | Invite colleague | Add company user | `/app/company/team` |
| CO14 | Remove colleague | Remove company user | `/app/company/team` |
| CO15 | Set colleague role | Admin/Member | `/app/company/team` |
| CO16 | Transfer ownership | Make another user owner | `/app/company/settings` |
| CO17 | Request verification | Submit for verification | `/app/company/verification` |
| CO18 | Upload verification docs | Proof documents | `/app/company/verification` |
| CO19 | View company analytics | Company-wide metrics | `/app/company/analytics` |
| CO20 | Set company policies | Remote, benefits, etc. | `/app/company/policies` |
| CO21 | Add benefit | Parental leave, etc. | `/app/company/benefits` |
| CO22 | Edit benefit | Modify benefit | `/app/company/benefits` |
| CO23 | Remove benefit | Delete benefit | `/app/company/benefits` |
| CO24 | Delete company | Permanently remove | `/app/company/settings` |

### 👥 Team Browsing Actions

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| TB1 | Browse teams | View all available teams | `/app/teams/browse` |
| TB2 | Filter teams | Apply filters | `/app/teams/browse` |
| TB3 | Search teams | Keyword search | `/app/teams/browse` |
| TB4 | Sort teams | Change sort order | `/app/teams/browse` |
| TB5 | View team profile | See full details | `/app/teams/[slug]` |
| TB6 | View team members | See all members | `/app/teams/[slug]` |
| TB7 | View member profile | Individual profile | `/app/users/[id]` |
| TB8 | Save team | Bookmark for later | `/app/teams/[slug]` |
| TB9 | Unsave team | Remove bookmark | `/app/teams/[slug]` |
| TB10 | View saved teams | See all bookmarks | `/app/teams/saved` |
| TB11 | View match score | See AI match % | `/app/teams/[slug]` |
| TB12 | Express interest in team | Initial outreach | `/app/teams/[slug]` |
| TB13 | Report team | Flag inappropriate | `/app/teams/[slug]` |
| TB14 | Hide team | Don't show again | `/app/teams/[slug]` |
| TB15 | Set team alerts | Get notified of matches | `/app/settings/notifications` |
| TB16 | Compare teams | Side-by-side view | `/app/teams/compare` |
| TB17 | Export team list | Download matches | `/app/teams/browse` |

### 💼 Opportunity Management Actions

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| OP1 | View my opportunities | See posted opps | `/app/opportunities/manage` |
| OP2 | Create opportunity | Post new opp | `/app/opportunities/create` |
| OP3 | Edit opportunity | Modify posting | `/app/opportunities/[id]/edit` |
| OP4 | Set opportunity title | Change title | `/app/opportunities/[id]/edit` |
| OP5 | Set opportunity description | Change description | `/app/opportunities/[id]/edit` |
| OP6 | Set team size needed | How many people | `/app/opportunities/[id]/edit` |
| OP7 | Set required skills | Must-have skills | `/app/opportunities/[id]/edit` |
| OP8 | Set preferred skills | Nice-to-have skills | `/app/opportunities/[id]/edit` |
| OP9 | Set salary range | Compensation range | `/app/opportunities/[id]/edit` |
| OP10 | Set equity offered | Yes/No/Details | `/app/opportunities/[id]/edit` |
| OP11 | Set location | Where team will work | `/app/opportunities/[id]/edit` |
| OP12 | Set remote policy | Remote/Hybrid/Onsite | `/app/opportunities/[id]/edit` |
| OP13 | Set industry | Target industry | `/app/opportunities/[id]/edit` |
| OP14 | Set start date | When team would start | `/app/opportunities/[id]/edit` |
| OP15 | Set application deadline | When apps close | `/app/opportunities/[id]/edit` |
| OP16 | Set opportunity visibility | Public/Private | `/app/opportunities/[id]/edit` |
| OP17 | Publish opportunity | Make live | `/app/opportunities/[id]` |
| OP18 | Unpublish opportunity | Take offline | `/app/opportunities/[id]` |
| OP19 | Close opportunity | Mark as filled/closed | `/app/opportunities/[id]` |
| OP20 | Reopen opportunity | Reactivate | `/app/opportunities/[id]` |
| OP21 | Duplicate opportunity | Copy to new | `/app/opportunities/[id]` |
| OP22 | Delete opportunity | Permanently remove | `/app/opportunities/[id]` |
| OP23 | View opportunity analytics | Views, apps, etc. | `/app/opportunities/[id]/analytics` |
| OP24 | Share opportunity | Get shareable link | `/app/opportunities/[id]` |
| OP25 | Invite team to apply | Direct invite | `/app/opportunities/[id]` |

### 📄 Applicant Management Actions

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| AM1 | View applicants | See all applicants | `/app/opportunities/[id]/applicants` |
| AM2 | Filter applicants | By status/score | `/app/opportunities/[id]/applicants` |
| AM3 | Sort applicants | By date/match | `/app/opportunities/[id]/applicants` |
| AM4 | View applicant detail | See team application | `/app/applications/[id]` |
| AM5 | Update applicant status | Move to next stage | `/app/applications/[id]` |
| AM6 | Add applicant note | Internal notes | `/app/applications/[id]` |
| AM7 | Rate applicant | Score 1-5 | `/app/applications/[id]` |
| AM8 | Reject applicant | Decline team | `/app/applications/[id]` |
| AM9 | Request more info | Ask team for details | `/app/applications/[id]` |
| AM10 | Schedule interview | Set interview time | `/app/applications/[id]` |
| AM11 | Cancel interview | Remove scheduled | `/app/applications/[id]` |
| AM12 | Add interview feedback | Post-interview notes | `/app/applications/[id]` |
| AM13 | Move to offer stage | Advance application | `/app/applications/[id]` |
| AM14 | Export applicants | Download as CSV | `/app/opportunities/[id]/applicants` |
| AM15 | Bulk update status | Change multiple | `/app/opportunities/[id]/applicants` |
| AM16 | Compare applicants | Side-by-side | `/app/applications/compare` |

### 💬 Conversation Actions

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| C1 | View conversations | See all threads | `/app/conversations` |
| C2 | Open conversation | View specific thread | `/app/conversations/[id]` |
| C3 | Start conversation | Initiate with team | `/app/conversations/new` |
| C4 | Send message | Write to team | `/app/conversations/[id]` |
| C5 | Reply to message | Respond to team | `/app/conversations/[id]` |
| C6 | Attach file | Add document | `/app/conversations/[id]` |
| C7 | Download attachment | Get attached file | `/app/conversations/[id]` |
| C8 | Mark as read | Clear unread | `/app/conversations/[id]` |
| C9 | Mark as unread | Set as unread | `/app/conversations/[id]` |
| C10 | Archive conversation | Hide from inbox | `/app/conversations/[id]` |
| C11 | Unarchive | Restore to inbox | `/app/conversations/archived` |
| C12 | Search conversations | Find messages | `/app/conversations` |
| C13 | Filter conversations | By status/date | `/app/conversations` |
| C14 | Add colleague to thread | Include team member | `/app/conversations/[id]` |
| C15 | Remove from thread | Remove colleague | `/app/conversations/[id]` |
| C16 | Mute conversation | Stop notifications | `/app/conversations/[id]` |
| C17 | Report conversation | Flag inappropriate | `/app/conversations/[id]` |
| C18 | Block team | Prevent future contact | `/app/conversations/[id]` |

### 📋 Offer Management Actions

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| OFM1 | View offers | See all sent offers | `/app/offers/manage` |
| OFM2 | Create offer | Build new offer | `/app/offers/create` |
| OFM3 | Set offer for team | Select team | `/app/offers/create` |
| OFM4 | Set offer for opportunity | Link to opp | `/app/offers/create` |
| OFM5 | Add team member offer | Individual terms | `/app/offers/create` |
| OFM6 | Set member title | Role at company | `/app/offers/create` |
| OFM7 | Set member salary | Base compensation | `/app/offers/create` |
| OFM8 | Set member equity | Equity package | `/app/offers/create` |
| OFM9 | Set member bonus | Signing bonus | `/app/offers/create` |
| OFM10 | Add member note | Special terms | `/app/offers/create` |
| OFM11 | Set start date | When they'd start | `/app/offers/create` |
| OFM12 | Set offer deadline | Response due by | `/app/offers/create` |
| OFM13 | Set location | Work location | `/app/offers/create` |
| OFM14 | Add offer attachment | Contract, docs | `/app/offers/create` |
| OFM15 | Preview offer | See before sending | `/app/offers/create` |
| OFM16 | Send offer | Deliver to team | `/app/offers/create` |
| OFM17 | Edit pending offer | Modify before response | `/app/offers/[id]/edit` |
| OFM18 | Revoke offer | Withdraw offer | `/app/offers/[id]` |
| OFM19 | Extend deadline | Give more time | `/app/offers/[id]` |
| OFM20 | View offer status | See acceptance | `/app/offers/[id]` |
| OFM21 | Send revised offer | Update terms | `/app/offers/[id]` |
| OFM22 | Accept counter-offer | Agree to team's terms | `/app/offers/[id]` |
| OFM23 | Reject counter-offer | Decline team's terms | `/app/offers/[id]` |
| OFM24 | Mark offer complete | Close after acceptance | `/app/offers/[id]` |
| OFM25 | Download offer | Get as PDF | `/app/offers/[id]` |
| OFM26 | View offer history | See all revisions | `/app/offers/[id]` |

### 🔔 Notification Actions
*Same as team users: N1-N9, plus:*

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| N10 | Set applicant alerts | New applications | `/app/settings/notifications` |
| N11 | Set response alerts | Team responses | `/app/settings/notifications` |

### ⚙️ Settings Actions
*Same as team users: S1-S12*

### 📊 Analytics Actions

| # | Action | Description | URL/Endpoint |
|---|--------|-------------|--------------|
| AN1 | View company dashboard | Overview metrics | `/app/analytics` |
| AN2 | View opportunity stats | Per-opp metrics | `/app/analytics/opportunities` |
| AN3 | View applicant funnel | Conversion rates | `/app/analytics/funnel` |
| AN4 | View source analytics | Where teams come from | `/app/analytics/sources` |
| AN5 | View time-to-hire | Process duration | `/app/analytics/time` |
| AN6 | Export analytics | Download reports | `/app/analytics` |
| AN7 | Schedule reports | Auto email reports | `/app/analytics/scheduled` |
| AN8 | Compare opportunities | Cross-opp analysis | `/app/analytics/compare` |

---

## Action Permissions Matrix

### Team Actions by Role

| Action | Lead | Admin | Member |
|--------|:----:|:-----:|:------:|
| Create team | ✅ | ❌ | ❌ |
| Edit team info | ✅ | ✅ | ❌ |
| Delete team | ✅ | ❌ | ❌ |
| Invite members | ✅ | ✅ | ❌ |
| Remove members | ✅ | ✅ | ❌ |
| Promote to admin | ✅ | ❌ | ❌ |
| Transfer leadership | ✅ | ❌ | ❌ |
| Set visibility | ✅ | ✅ | ❌ |
| Block companies | ✅ | ✅ | ❌ |
| **Post team** | ✅ | ✅ | ❌ |
| **Unpost team** | ✅ | ✅ | ❌ |
| **Re-post team** | ✅ | ✅ | ❌ |
| View posting requirements | ✅ | ✅ | ✅ |
| View team status | ✅ | ✅ | ✅ |
| Express interest | ✅** | ✅** | ❌ |
| Send messages | ✅ | ✅ | ❌ |
| View conversations | ✅ | ✅ | ✅ |
| Add internal comments | ✅ | ✅ | ✅ |
| Accept/decline offers | ✅ | ❌ | Own only |
| Withdraw application | ✅ | ✅ | ❌ |
| Edit own profile | ✅ | ✅ | ✅ |
| Edit own team role | ✅ | ✅ | ✅ |
| Leave team | ✅* | ✅ | ✅ |

*Lead must transfer leadership first
**Team must be POSTED to express interest in opportunities

### Company Actions by Role

| Action | Owner | Admin | Member |
|--------|:-----:|:-----:|:------:|
| Edit company | ✅ | ✅ | ❌ |
| Delete company | ✅ | ❌ | ❌ |
| Invite colleagues | ✅ | ✅ | ❌ |
| Remove colleagues | ✅ | ✅ | ❌ |
| Transfer ownership | ✅ | ❌ | ❌ |
| Create opportunity | ✅ | ✅ | ✅ |
| Edit opportunity | ✅ | ✅ | Own only |
| Delete opportunity | ✅ | ✅ | Own only |
| View applicants | ✅ | ✅ | ✅ |
| Update applicant status | ✅ | ✅ | ✅ |
| Send messages | ✅ | ✅ | ✅ |
| Create offer | ✅ | ✅ | ❌ |
| Send offer | ✅ | ✅ | ❌ |
| Revoke offer | ✅ | ✅ | ❌ |
| View analytics | ✅ | ✅ | Own opps |

---

## Action-to-API Mapping

### Authentication APIs

| Action | Method | Endpoint |
|--------|--------|----------|
| Sign up | POST | `/api/auth/signup` |
| Log in | POST | `/api/auth/signin` |
| Log out | POST | `/api/auth/signout` |
| Verify email | POST | `/api/auth/verify` |
| Reset password | POST | `/api/auth/reset-password` |
| Change password | PUT | `/api/user/password` |

### Profile APIs

| Action | Method | Endpoint |
|--------|--------|----------|
| Get profile | GET | `/api/user/profile` |
| Update profile | PUT | `/api/user/profile` |
| Upload photo | POST | `/api/user/profile/photo` |
| Delete photo | DELETE | `/api/user/profile/photo` |
| Get settings | GET | `/api/user/settings` |
| Update settings | PUT | `/api/user/settings` |

### Team APIs

| Action | Method | Endpoint |
|--------|--------|----------|
| Create team | POST | `/api/teams` |
| Get team | GET | `/api/teams/[id]` |
| Update team | PUT | `/api/teams/[id]` |
| Delete team | DELETE | `/api/teams/[id]` |
| List team members | GET | `/api/teams/[id]/members` |
| Invite member | POST | `/api/teams/[id]/invitations` |
| Accept invite | POST | `/api/teams/join` |
| Remove member | DELETE | `/api/teams/[id]/members/[userId]` |
| Update member role | PUT | `/api/teams/[id]/members/[userId]` |
| Post team | POST | `/api/teams/[id]/post` |
| Unpost team | POST | `/api/teams/[id]/unpost` |
| Get team status | GET | `/api/teams/[id]/status` |
| Get posting requirements | GET | `/api/teams/[id]/posting-requirements` |

### Opportunity APIs

| Action | Method | Endpoint |
|--------|--------|----------|
| List opportunities | GET | `/api/opportunities` |
| Get opportunity | GET | `/api/opportunities/[id]` |
| Create opportunity | POST | `/api/opportunities` |
| Update opportunity | PUT | `/api/opportunities/[id]` |
| Delete opportunity | DELETE | `/api/opportunities/[id]` |
| Express interest | POST | `/api/eoi` |
| Withdraw interest | DELETE | `/api/eoi/[id]` |

### Conversation APIs

| Action | Method | Endpoint |
|--------|--------|----------|
| List conversations | GET | `/api/conversations` |
| Get conversation | GET | `/api/conversations/[id]` |
| Create conversation | POST | `/api/conversations` |
| Send message | POST | `/api/conversations/[id]/messages` |
| Mark read | PUT | `/api/conversations/[id]/read` |
| Archive | PUT | `/api/conversations/[id]/archive` |

### Application APIs

| Action | Method | Endpoint |
|--------|--------|----------|
| List applications | GET | `/api/applications` |
| Get application | GET | `/api/applications/[id]` |
| Update status | PUT | `/api/applications/[id]/status` |
| Add note | POST | `/api/applications/[id]/notes` |
| Withdraw | DELETE | `/api/applications/[id]` |

### Offer APIs

| Action | Method | Endpoint |
|--------|--------|----------|
| List offers | GET | `/api/offers` |
| Get offer | GET | `/api/offers/[id]` |
| Create offer | POST | `/api/offers` |
| Update offer | PUT | `/api/offers/[id]` |
| Send offer | POST | `/api/offers/[id]/send` |
| Accept offer | POST | `/api/offers/[id]/accept` |
| Decline offer | POST | `/api/offers/[id]/decline` |
| Revoke offer | POST | `/api/offers/[id]/revoke` |

### Company APIs

| Action | Method | Endpoint |
|--------|--------|----------|
| Create company | POST | `/api/companies` |
| Get company | GET | `/api/companies/[id]` |
| Update company | PUT | `/api/companies/[id]` |
| Delete company | DELETE | `/api/companies/[id]` |
| Invite user | POST | `/api/companies/invitations` |
| Remove user | DELETE | `/api/companies/[id]/users/[userId]` |
| Request verification | POST | `/api/company/verification` |

---

## Action Count Summary

| User Type | Total Unique Actions |
|-----------|---------------------|
| Alex (Team Lead) | 147 actions |
| Sarah M (Team Member) | 92 actions |
| Marcus (Team Member) | 92 actions |
| Priya (Team Member) | 92 actions |
| Sarah R (Company User) | 156 actions |

### By Category

| Category | Team Lead | Team Member | Company |
|----------|-----------|-------------|---------|
| Authentication | 10 | 10 | 10 |
| Profile | 17 | 17 | 4 |
| Team | 38 | 16 | - |
| Team Browsing | - | - | 17 |
| Opportunities | 16 | 11 | 25 |
| Applicant Mgmt | - | - | 16 |
| Conversations | 16 | 5 | 18 |
| Applications | 9 | 4 | - |
| Offers | 10 | 6 | 26 |
| Company | - | - | 24 |
| Notifications | 9 | 9 | 11 |
| Settings | 12 | 12 | 12 |
| Analytics | 5 | 2 | 8 |

### New Team Posting Actions (T34-T38)

| # | Action | Who Can Perform | Description |
|---|--------|-----------------|-------------|
| T34 | Post team | Lead, Admin | Makes team visible to companies (requires all members joined + profiles complete) |
| T35 | Unpost team | Lead, Admin | Hides team from company searches (team still exists) |
| T36 | Re-post team | Lead, Admin | Makes previously unposted team visible again |
| T37 | View posting requirements | Lead, Admin, Member | See checklist of requirements to post |
| T38 | View team status | Lead, Admin, Member | See current status: DRAFT / READY TO POST / POSTED / UNPOSTED |

### Team Status States

```
┌─────────────────────────────────────────────────────────────────┐
│                      TEAM STATUS STATES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  DRAFT             Team created, members not yet joined         │
│      │             Not visible to companies                     │
│      ▼                                                          │
│  READY TO POST     All members joined, all profiles complete    │
│      │             Not visible to companies until posted        │
│      ▼                                                          │
│  POSTED            Team lead clicked "Post Team"                │
│      │             Visible to companies (per visibility rules)  │
│      ▼                                                          │
│  UNPOSTED          Team lead clicked "Unpost Team"              │
│                    Hidden from searches, can be re-posted       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

*Document last updated: December 2024*
