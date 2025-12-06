# Team Management Page - Complete Implementation Plan

## Current State Analysis

The `/app/teams` page (My Team view for team users) has significant gaps between what's displayed and what's functional:

### What Exists (Already Built)
- **Components available but not integrated:**
  - `EditTeamForm.tsx` - Full team editing with visibility controls
  - `TeamMemberManagement.tsx` - Tabbed interface (Members, Invitations, Analytics, Settings)
  - `MemberManagement.tsx` - Add/edit/remove members with skills, roles, ratings
  - `MemberInvitation.tsx` - Invite system with permissions, resend, cancel
  - `DeleteTeamModal.tsx` - Confirmation dialog for team deletion
  - `AvatarStack.tsx` - Reusable avatar display component

- **API endpoints available:**
  - `PUT/PATCH /api/teams/[id]` - Update team
  - `DELETE /api/teams/[id]` - Delete team
  - `/api/teams/invitations` - Invitation management
  - `/api/invites/[token]` - Token-based invite acceptance

### What's Broken/Missing
1. **Team card ⋮ menu** - Visible but non-functional
2. **Member row ⋮ menus** - Visible but non-functional
3. **Invite input** - Static placeholder, doesn't work
4. **No connection to real data** - Uses hardcoded `teamMembers` array
5. **No permission checks** - Team lead vs member distinction not enforced
6. **No pending invites display**
7. **No way to edit team details**

---

## Implementation Plan

### Phase 1: Connect to Real Data & Basic State Management

**1.1 Fetch User's Team Data**
- Use existing `useTeams` hook or create `useMyTeam` hook
- Fetch team where user is a member
- Get team members with avatars, roles, experience from database
- Determine if current user is team lead (createdBy or isLead flag)

**1.2 Replace Hardcoded Data**
- Remove static `teamMembers` array
- Use fetched team data for:
  - Team card (name, description, industry, location)
  - Member table (real members with real avatars)
  - Member count, experience totals

---

### Phase 2: Team Card Actions (⋮ Menu)

**2.1 Implement Dropdown Menu**
Using HeadlessUI `Menu` component (already in project):

```
Team Card ⋮ Menu Options:
├── Edit team details → Opens EditTeamForm in modal/slide-over
├── Change availability → Quick toggle (Available/Not Available)
├── Team settings → Link to /app/teams/settings or modal
├── ─────────────── (divider)
└── Delete team → Opens DeleteTeamModal (team lead only)
```

**2.2 Edit Team Modal**
- Wrap existing `EditTeamForm` in a modal
- Pre-populate with current team data
- Handle save → refresh team data
- Fields: name, description, industry, location, visibility, compensation, availability

**2.3 Delete Team Flow**
- Use existing `DeleteTeamModal`
- Require typing team name to confirm
- Redirect to dashboard after deletion
- Only visible to team lead/creator

---

### Phase 3: Member Row Actions (⋮ Menu)

**3.1 Implement Member Dropdown Menu**
```
Member Row ⋮ Menu Options (for Team Lead):
├── View profile → Link to /app/profile/[userId]
├── Edit role → Inline edit or modal
├── Make team lead → Transfers lead status (with confirmation)
├── ─────────────── (divider)
└── Remove from team → Confirmation dialog

Member Row ⋮ Menu Options (for Self - non-lead):
├── View my profile → Link to /app/profile/me
├── ─────────────── (divider)
└── Leave team → Confirmation dialog (cannot leave if only 2 members)
```

**3.2 Role Change Modal**
- Simple modal with role dropdown/input
- Options: Team Lead, Senior Member, Member, etc.
- Save updates team member record

**3.3 Remove Member Flow**
- Confirmation dialog: "Remove {name} from {team}?"
- Warning: Member will lose access to team conversations
- Cannot remove if team would have < 2 members
- Cannot remove self if team lead (must transfer first)

**3.4 Leave Team Flow (for non-leads)**
- Confirmation: "Are you sure you want to leave?"
- Redirect to dashboard after leaving

---

### Phase 4: Working Invite System

**4.1 Connect Invite Input**
- Wire up the email input field
- Validate email format
- Check if email already has pending invite
- Check if email is already a team member

**4.2 Send Invite Flow**
```
1. User enters email + clicks "Send Invite"
2. POST /api/teams/invitations
3. Create TeamInvitation record with:
   - teamId, email, invitedBy, expiresAt (7 days)
   - Generate unique token
4. (Future) Send email with invite link
5. Show success toast
6. Add to pending invites list
```

**4.3 Pending Invites Section**
Add below invite input:
```
Pending Invitations (3)
┌─────────────────────────────────────────────────┐
│ sarah@example.com     Pending    5 days left    │
│ Senior Designer                  [Resend][Cancel]│
├─────────────────────────────────────────────────┤
│ mike@example.com      Accepted   2 days ago     │
│ Product Manager                                  │
└─────────────────────────────────────────────────┘
```

**4.4 Resend/Cancel Actions**
- Resend: Update `sentAt`, reset expiration
- Cancel: Delete invitation record

---

### Phase 5: Permission System

**5.1 Define Permission Levels**
```typescript
type TeamRole = 'owner' | 'lead' | 'member';

const permissions = {
  owner: {
    canEditTeam: true,
    canDeleteTeam: true,
    canInviteMembers: true,
    canRemoveMembers: true,
    canChangeRoles: true,
    canTransferOwnership: true,
  },
  lead: {
    canEditTeam: true,
    canDeleteTeam: false,
    canInviteMembers: true,
    canRemoveMembers: true,
    canChangeRoles: true,
    canTransferOwnership: false,
  },
  member: {
    canEditTeam: false,
    canDeleteTeam: false,
    canInviteMembers: false,
    canRemoveMembers: false,
    canChangeRoles: false,
    canTransferOwnership: false,
    canLeaveTeam: true,
  },
};
```

**5.2 UI Permission Guards**
- Hide/disable actions based on user's role
- Show appropriate menu options per permission level
- Display "Team Lead" or "Owner" badges

---

### Phase 6: Edge Cases & Polish

**6.1 Edge Cases to Handle**
- Last admin trying to leave → Must transfer ownership first
- Removing member brings team below 2 → Block with message
- User not in any team → Show "Create or Join a Team" CTA
- Invite to existing member → Show "Already a member" error
- Expired invite clicked → Show "Invite expired" message

**6.2 Loading & Error States**
- Skeleton loaders for team card and member list
- Error boundary for fetch failures
- Optimistic updates for actions
- Toast notifications for all actions

**6.3 Mobile Responsiveness**
- Collapse member table to cards on mobile
- Stack action buttons vertically
- Swipe actions for member rows (optional)

---

## File Changes Summary

### Files to Modify:
1. `apps/web-app/src/app/app/teams/page.tsx`
   - Replace hardcoded data with real data fetch
   - Add team card dropdown menu
   - Add member row dropdown menus
   - Wire up invite functionality
   - Add pending invites section

### Files to Create:
2. `apps/web-app/src/hooks/useMyTeam.ts`
   - Hook to fetch current user's team with members

3. `apps/web-app/src/components/teams/TeamCardMenu.tsx`
   - Dropdown menu component for team card actions

4. `apps/web-app/src/components/teams/MemberRowMenu.tsx`
   - Dropdown menu component for member row actions

5. `apps/web-app/src/components/teams/EditTeamModal.tsx`
   - Modal wrapper around EditTeamForm

6. `apps/web-app/src/components/teams/RemoveMemberModal.tsx`
   - Confirmation modal for removing members

7. `apps/web-app/src/components/teams/ChangeRoleModal.tsx`
   - Modal for changing member roles

8. `apps/web-app/src/components/teams/PendingInvites.tsx`
   - List of pending invitations with actions

### Existing Files to Integrate:
- `EditTeamForm.tsx` - Use in EditTeamModal
- `DeleteTeamModal.tsx` - Use from team card menu
- `MemberInvitation.tsx` - Reference patterns for invite flow

---

## Implementation Order

1. **Phase 1** - Data connection (foundation for everything)
2. **Phase 3** - Member row actions (most visible gap in screenshot)
3. **Phase 4** - Invite system (prominently broken)
4. **Phase 2** - Team card actions
5. **Phase 5** - Permission system
6. **Phase 6** - Polish

Estimated: 8-10 components/files to create or significantly modify.
