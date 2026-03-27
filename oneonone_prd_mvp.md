# PRD — **One-on-One** (Working Name)
**Version:** MVP v0.1  
**Date:** 2026-03-27  
**Author:** Kara + ChatGPT

---

# 1) Product Summary

## One-line description
A lightweight internal web app where **managers and reportees continuously log important work moments throughout the year**, so that **year-end reviews, self-appraisals, and people discussions are based on evidence instead of memory**.

## Core problem
At year-end, both managers and employees forget:
- important achievements
- certifications / learning efforts
- recurring issues
- coaching conversations
- notable positive or negative patterns

This leads to:
- recency bias
- unfair reviews
- weak self-appraisals
- lost context across the year
- managers chasing people manually for inputs

## MVP goal
Build the **smallest useful version** that lets:
1. A manager create a team board
2. Invite reportees to join
3. Each reportee log important events throughout the year
4. Manager log private observations per reportee
5. Manager view each employee’s year timeline in one place

This MVP should be **usable in real life within a few days of development**, not a polished HR platform.

---

# 2) Product Vision

## Vision
Create a **“performance memory system”** for teams.

## Positioning
This is **NOT**:
- an HRMS
- a project management tool
- a Slack replacement
- a task tracker
- an OKR system

This **IS**:
- a simple **work memory board**
- a place to log:
  - wins
  - learning
  - blockers
  - issues
  - observations
  - notable moments

---

# 3) Target Users

## Primary users
### A. Manager
A people manager who has 3–15 direct reports and needs a clean record of each person’s year.

### B. Reportee / Employee
An individual contributor who wants a place to keep track of:
- achievements
- certifications
- contributions
- blockers
- important context

## MVP target environment
Internal corporate teams (small pilot rollout first):
- team leads
- assistant managers
- managers
- senior managers

Best initial fit:
- consulting / analytics / tech / corporate teams

---

# 4) Jobs To Be Done

## Manager JTBD
> “Help me remember what each person did all year so I can review them fairly and quickly.”

## Employee JTBD
> “Help me capture my work and growth as it happens so I don’t forget it during appraisal time.”

---

# 5) MVP Scope (Strict)

This section is **critical**. Codex should build only what is needed for MVP.

## IN SCOPE for MVP
- Manager account creation / login
- Manager creates a team board
- Manager gets:
  - shareable invite link **or**
  - unique invite code
- Reportee joins board
- Reportee can create entries in their own timeline
- Manager can view all reportees under board
- Manager can open any reportee profile
- Manager can add **private notes** for that reportee
- Manager can filter entries by category
- Manager dashboard shows summary counts
- Simple team announcement section
- Clean timeline-based UI

## OUT OF SCOPE for MVP
**Do NOT build these in v0.1**
- AI writing / summarization
- peer feedback
- performance scoring
- ratings / bell curve
- Slack / Teams / Gmail integration
- reminders / nudges
- mobile app
- file uploads
- advanced RBAC
- multi-manager hierarchy
- HR admin dashboard
- SSO / enterprise auth
- export to PDF
- notification system
- comments / chat
- approvals
- 1:1 meeting workflows
- analytics / charts beyond basic counts

If there is time, polish UX — but **do not expand scope**.

---

# 6) MVP User Stories

---

## 6.1 Manager Stories

### US-M1 — Sign up / login
**As a manager**, I want to create an account and log in so I can create and manage my team board.

**Acceptance Criteria**
- Manager can sign up with:
  - name
  - work email
  - password
- Manager can log in
- Session persists after refresh

---

### US-M2 — Create a board
**As a manager**, I want to create a team board so I can organize my reportees in one place.

**Acceptance Criteria**
- Manager can create a board with:
  - board name (e.g. “Kara Reportees FY26”)
  - optional team description
- Board is linked to that manager account
- Manager lands on board dashboard after creation

---

### US-M3 — Invite reportees
**As a manager**, I want to invite reportees so they can join my board.

**Acceptance Criteria**
- Manager can see:
  - invite code
  - invite link
- Reportees can join using either
- Manager can see pending / joined members

---

### US-M4 — View reportees list
**As a manager**, I want to see all my reportees in one place so I can quickly access each person’s profile.

**Acceptance Criteria**
- Board dashboard shows all joined reportees
- Each reportee card shows:
  - name
  - email
  - number of entries
  - last updated date

---

### US-M5 — View reportee timeline
**As a manager**, I want to see a reportee’s timeline so I can review their year in one place.

**Acceptance Criteria**
- Clicking reportee opens dedicated profile page
- Page shows:
  - employee info
  - all employee-created entries
  - all manager-created private notes (manager only)
- Timeline sorted newest first
- Filter by category works

---

### US-M6 — Add private notes
**As a manager**, I want to add private notes for a reportee so I can record observations that only I can see.

**Acceptance Criteria**
- Manager can create a note attached to a specific reportee
- Note includes:
  - title
  - description
  - category
  - date
- Note is visible only to manager
- Employee must not see it anywhere

---

### US-M7 — Post team announcement
**As a manager**, I want to post a team-wide announcement so I can keep important reminders in one place.

**Acceptance Criteria**
- Manager can create announcement with:
  - title
  - message
- Announcement visible to all reportees on board
- Most recent announcements shown first

---

## 6.2 Employee / Reportee Stories

### US-E1 — Join board
**As a reportee**, I want to join my manager’s board using a code or link so I can start logging my year.

**Acceptance Criteria**
- Reportee can sign up / log in
- Reportee can join board using:
  - invite code
  - invite link
- Once joined, they can only see:
  - their own profile / entries
  - team announcements
- They must NOT see other reportees

---

### US-E2 — Add work log entry
**As a reportee**, I want to quickly log a meaningful event so I don’t forget it later.

**Acceptance Criteria**
- Reportee can create an entry with:
  - title (required)
  - description (required)
  - category (required)
  - date (default = today)
- Entry appears in their personal timeline
- Entry becomes visible to manager

---

### US-E3 — Edit / delete own entry
**As a reportee**, I want to update or remove my own entry if I made a mistake.

**Acceptance Criteria**
- Reportee can edit their own entry
- Reportee can delete their own entry
- Manager notes cannot be edited by reportee

---

### US-E4 — View own timeline
**As a reportee**, I want to see my own year in one place so I can track what I’ve logged.

**Acceptance Criteria**
- Employee profile page shows their own entries only
- Can filter by category
- Can sort newest first
- Cannot see manager private notes

---

### US-E5 — View team announcements
**As a reportee**, I want to see board announcements so I can stay updated.

**Acceptance Criteria**
- Reportee can see announcement feed
- Cannot create/edit/delete announcements

---

# 7) Core Data Model

Keep schema simple and production-friendly.

---

## 7.1 Users
### Table: `users`
Fields:
- `id` (uuid, pk)
- `full_name` (text, required)
- `email` (text, unique, required)
- `password_hash` (text, required)
- `role` (enum: `manager`, `reportee`)
- `created_at` (timestamp)
- `updated_at` (timestamp)

---

## 7.2 Boards
### Table: `boards`
Fields:
- `id` (uuid, pk)
- `manager_id` (fk -> users.id)
- `name` (text, required)
- `description` (text, nullable)
- `invite_code` (text, unique, required)
- `created_at` (timestamp)
- `updated_at` (timestamp)

One manager can have one or multiple boards in future, but MVP can support one board per manager if easier.

---

## 7.3 Board Members
### Table: `board_members`
Fields:
- `id` (uuid, pk)
- `board_id` (fk -> boards.id)
- `user_id` (fk -> users.id)
- `joined_at` (timestamp)

Constraint:
- one reportee should not join same board twice

---

## 7.4 Entries
### Table: `entries`
Fields:
- `id` (uuid, pk)
- `board_id` (fk -> boards.id)
- `employee_id` (fk -> users.id)
- `created_by_user_id` (fk -> users.id)
- `visibility` (enum: `shared`, `manager_private`)
- `category` (enum)
- `title` (text, required)
- `description` (text, required)
- `entry_date` (date, required)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Notes
- Employee-created entries:
  - `created_by_user_id = employee_id`
  - `visibility = shared`
- Manager-created private notes:
  - `created_by_user_id = manager_id`
  - `visibility = manager_private`

This unified model is better than separate tables for MVP.

---

## 7.5 Announcements
### Table: `announcements`
Fields:
- `id` (uuid, pk)
- `board_id` (fk -> boards.id)
- `created_by_user_id` (fk -> users.id)
- `title` (text, required)
- `message` (text, required)
- `created_at` (timestamp)
- `updated_at` (timestamp)

---

# 8) Entry Categories (MVP)

Keep categories limited and useful.

## Shared entry categories (employee can create)
- `achievement`
- `learning`
- `certification`
- `project_contribution`
- `appreciation`
- `blocker`
- `issue`
- `other`

## Manager private note categories
- `positive_observation`
- `improvement_area`
- `discipline_issue`
- `coaching_note`
- `other`

### Implementation note
If simpler, store all categories in one enum list and restrict via frontend by role.

---

# 9) Permission Rules (Very Important)

This is the **most critical product behavior**.

## Manager can:
- create board
- invite reportees
- see all reportees on their board
- see all shared entries for each reportee
- create manager-private entries for each reportee
- see their own announcements
- create / edit / delete announcements

## Reportee can:
- join board
- see only their own shared entries
- create / edit / delete only their own shared entries
- see team announcements

## Reportee cannot:
- see other reportees
- see manager-private notes
- see board-level member list beyond maybe own manager identity
- create announcements
- access manager dashboard

This permission separation must be enforced both:
1. in frontend
2. in backend / DB query logic

Do NOT rely only on UI hiding.

---

# 10) UX Principles

This product must feel:
- fast
- low-friction
- not “corporate heavy”
- simple enough to actually use all year

## UX rule:
**Logging an entry should take under 30 seconds.**

Avoid:
- long forms
- too many required fields
- too many pages
- complicated enterprise layouts

Prefer:
- clean cards
- timeline feed
- simple modals
- obvious CTA buttons

---

# 11) Screens / Pages Required

---

## 11.1 Public / Auth

### A. Landing page
Purpose:
- explain product simply
- CTA to sign up / log in

Sections:
- headline
- short problem statement
- “For managers” / “For employees”
- CTA buttons

---

### B. Sign up page
Fields:
- full name
- email
- password
- role selector:
  - manager
  - reportee

---

### C. Login page
Fields:
- email
- password

---

## 11.2 Manager Experience

### D. Create Board page
Fields:
- board name
- description (optional)

CTA:
- Create Board

---

### E. Manager Board Dashboard
This is the main manager home page.

Sections:
1. Board header
   - board name
   - description
   - invite code
   - copy invite link button

2. Summary cards
   - total reportees
   - total entries
   - entries this month
   - manager notes count

3. Reportees list
   - name
   - last updated
   - entry count
   - button: View Profile

4. Announcement panel
   - recent announcements
   - button: Add announcement

---

### F. Reportee Detail Page (Manager View)
Sections:
1. Employee header
   - name
   - email
   - total entries
   - last updated

2. Filters
   - category dropdown
   - visibility tabs:
     - Shared entries
     - Manager private notes
     - All

3. Timeline feed
   Each card shows:
   - date
   - category
   - title
   - description
   - visibility badge

4. Actions
   - Add private note button

---

### G. Add Private Note Modal
Fields:
- title
- description
- category
- date

CTA:
- Save Note

---

### H. Add Announcement Modal
Fields:
- title
- message

CTA:
- Publish

---

## 11.3 Employee Experience

### I. Join Board page
Entry options:
- paste invite code
- or auto-join from invite link

CTA:
- Join Board

---

### J. Employee Home / My Timeline
Sections:
1. Welcome header
2. Quick action:
   - Add Entry
3. Filters:
   - category
4. Timeline feed:
   - own entries only
5. Announcement sidebar / section

---

### K. Add Entry Modal
Fields:
- title
- description
- category
- date

CTA:
- Save Entry

---

# 12) Recommended Tech Stack (MVP)

This should be optimized for **speed of shipping**.

## Recommended stack
- **Frontend:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI:** shadcn/ui
- **Backend + DB + Auth:** Supabase
- **ORM (optional):** Drizzle or Prisma
- **Hosting:** Vercel
- **DB:** Supabase Postgres

## Why this stack
- very fast to build
- good auth + DB primitives
- easy deployment
- enough for MVP
- easy for Codex to scaffold

---

# 13) Architecture Notes

## Suggested architecture
### Frontend
Next.js app with:
- auth pages
- role-based dashboard routes
- board pages
- timeline pages

### Backend
Can be done in one of two ways:

#### Option A — Fastest MVP (recommended)
Use:
- Supabase Auth
- Supabase Postgres
- Supabase Row Level Security (RLS)
- Next.js server actions / route handlers

#### Option B
Custom backend APIs with Next.js route handlers

**Recommendation:** Use **Option A** for speed.

---

# 14) Security / Access Rules

Because this app contains sensitive manager observations, access control matters.

## Required security behavior
- only authenticated users can access app pages
- managers only access boards they own
- reportees only access boards they are members of
- reportees only access entries where:
  - `employee_id = self`
  - `visibility = shared`
- manager can access:
  - all entries for members of their board
  - manager_private entries they created for those members

## Must-have protections
- secure password auth
- route protection
- server-side authorization checks
- prevent IDOR (insecure direct object references)

Example:
A reportee must not be able to manually change a URL and open another employee’s page.

---

# 15) Functional Requirements

---

## 15.1 Authentication
- User can sign up
- User can log in
- User stays signed in
- User can log out

---

## 15.2 Board Management
- Manager can create a board
- Manager can view board details
- Manager can share invite link/code

---

## 15.3 Membership
- Reportee can join a board
- Joined membership is stored
- Duplicate joins prevented

---

## 15.4 Entry Management
- Employee can create shared entries
- Employee can edit/delete own shared entries
- Manager can create private notes for a reportee
- Timeline displays entries correctly by permissions

---

## 15.5 Announcements
- Manager can create announcement
- Manager can view all announcements
- Reportee can view announcements

---

## 15.6 Filtering
- Filter entries by category
- Sort newest first (default)

---

# 16) Non-Functional Requirements

## Performance
- Core pages should load quickly (< 2 sec on normal connection)
- Timeline should feel responsive

## Reliability
- Basic error handling for:
  - failed save
  - invalid invite code
  - unauthorized access

## Usability
- clean, low-friction UI
- mobile responsive enough for basic use
  - but mobile-first perfection is not required in MVP

---

# 17) Edge Cases

Codex should explicitly handle these.

## Membership / Invite
- invalid invite code
- expired / malformed invite link (if implemented)
- already joined board
- manager tries to join own board as reportee

## Entries
- empty title / description
- invalid date
- employee edits entry that doesn’t belong to them
- employee tries to access manager private note

## Access
- reportee tries to access another reportee page
- unauthenticated user hits protected route
- manager opens non-existent board

---

# 18) Suggested Information Architecture

## Route structure (example)
```txt
/
 /login
 /signup

 /manager
 /manager/create-board
 /manager/board/[boardId]
 /manager/board/[boardId]/employee/[employeeId]

 /join
 /employee
 /employee/board/[boardId]
```

---

# 19) Design Guidance for Codex

## Design style
Use a UI that feels:
- clean
- modern
- calm
- not over-designed

Think:
- Linear / Notion / modern internal tool
- minimal borders
- clear spacing
- soft cards
- simple timeline

## Visual hierarchy
Prioritize:
1. easy entry logging
2. easy employee lookup
3. easy timeline scanning

## Avoid
- HR dashboard aesthetic
- clutter
- too many charts
- too many colors
- heavy enterprise tables everywhere

---

# 20) MVP Success Criteria

This MVP is successful if a real manager can:

1. create a board in under 3 minutes
2. invite 5–8 reportees easily
3. have reportees add entries over time
4. open any employee and understand their year quickly
5. add private observations throughout the year
6. use it at appraisal time instead of hunting through chats/emails/memory

---

# 21) Example Usage Scenario

## Manager: Kara
Kara creates:
> “Kara Reportees FY26”

He shares invite code with 8 direct reports.

## Reportee: Aisha
Over the year, Aisha logs:
- “Completed Azure Data Factory course”
- “Presented dashboard to Shell stakeholders”
- “Resolved client issue under urgent deadline”
- “Blocked due to delayed source data”

## Manager: Kara
Throughout the year, Kara logs private notes:
- “Handled client call very confidently”
- “Missed timesheet 3 times this quarter”
- “Needs stronger ownership on follow-ups”

## At year-end
Kara opens Aisha’s profile and instantly sees:
- all major wins
- learning efforts
- blockers
- behavior notes

No need to reconstruct the year from memory.

That is the MVP’s value.

---

# 22) Build Order (Recommended for Codex)

Codex should build in this exact order:

## Phase 1 — Foundations
1. Next.js app setup
2. Supabase setup
3. Auth flows
4. Role-based routing

## Phase 2 — Board core
5. Create board
6. Invite code/link generation
7. Join board flow

## Phase 3 — Entry system
8. Employee add/edit/delete entry
9. Employee timeline
10. Manager reportee list
11. Manager reportee detail page

## Phase 4 — Manager notes + announcements
12. Private note creation
13. Announcement creation + viewing

## Phase 5 — Polish
14. Filters
15. Empty states
16. Error states
17. Responsive cleanup

---

# 23) What Codex Should Optimize For

## Highest priority
- working auth
- correct permissions
- simple clean UX
- fast shipping

## Lower priority
- animations
- perfect branding
- advanced architecture
- over-engineering

---

# 24) Explicit Instruction to Codex

Build this as a **real, working MVP**, not a design prototype.

## Required
- implement actual authentication
- implement actual database schema
- implement actual CRUD
- implement access control
- make it deployable

## Do NOT
- replace real logic with fake mock data unless explicitly necessary for placeholders
- add features not in scope
- overcomplicate architecture
- spend too much effort on fancy visuals over functionality

---

# 25) Future Versions (Reference Only — Do NOT Build Now)

These are for later versions only:

## V2 / V3 ideas
- AI self-appraisal draft generator
- AI manager review summary
- monthly reminders
- attachments / evidence upload
- 1:1 notes
- peer appreciation
- sentiment / pattern detection
- export to PDF
- Slack / Teams integrations
- manager digest emails
- dashboard analytics

Again:
**Do NOT build these in MVP.**

---

# 26) Final Product Principle

If there is ever a tradeoff, choose:

> **Simple and usable** over **feature-rich and complicated**

The product should feel like:
> “A place to quickly note things worth remembering.”

If that works, the product works.

---

# 27) Suggested Working Names

Optional — choose one later:
- One-on-One
- RecallBoard
- ReviewTrail
- Yearbook (internal only)
- Trace
- LoopNote
- PeopleLog
- EvalBoard

For MVP codebase, use:
## `oneonone`

---

# END
