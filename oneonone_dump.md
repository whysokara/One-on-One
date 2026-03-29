# One-on-One Reverse Engineering Reference

This document captures the current state of the **One-on-One** app so you can prompt Codex or another agent to reproduce or extend it without weaving through every file manually.

## 1. Product overview
- Purpose: lightweight performance memory board for manager/reportee workflows (one board per manager, one timeline per reportee).
- Roles: `manager` (creates board, invites team, publishes announcements/private notes) and `reportee` (joins board, logs shared entries).
- Key flows: signup/login via Cognito, manager board creation/join link/announcement, reportee join by code/link, timeline entry create/edit/delete, manager private notes, manager remove member.

## 2. Architecture / stack
- Framework: **Next.js 15** (App Router) with server actions for mutations.
- Auth & data: AWS Cognito user pool + DynamoDB tables (`users`, `boards`, `memberships`, `entries`, `announcements`), orchestrated through `lib/auth.ts`, `lib/db.ts`, `lib/actions.ts`.
- Infrastructure: AWS CDK app in `infra/`.
- UI system: custom design system under `components/ui.tsx`, with shared form helpers in `components/forms.tsx` and entry privates in `components/entry-forms.tsx`.
- Styling: global palette in `app/globals.css`.
- Entry filtering and permissions logic in `lib/queries.ts` and `lib/validation.ts`.

## 3. Routes
| Route | Purpose |
| --- | --- |
| `/` | Landing page with hero, product summary, and CTA buttons. |
| `/login`, `/signup` | Auth screens that redirect signed-in users to `/manager` or `/employee`. |
| `/join` | Reportee board join (code or link). |
| `/manager` | Manager home; create/open board and playbook tips. |
| `/manager/create-board` | Board creation form with invite generation. |
| `/manager/board/[boardId]` | Manager dashboard with metrics, member list, announcements, remove-member actions. |
| `/manager/board/[boardId]/employee/[employeeId]` | Manager detail: filters, shared timeline table, private notes, remove-member form. |
| `/employee` | Reportee workspace with entry add form, timeline cards, filters, announcements. |
| `/join`, `/login`, `/signup` also share the same `AppFrame`.
| `/error`, `/loading`, `/not-found` supply custom states.

## 4. Key components & helpers
- `AppFrame` (components/ui.tsx): new compact header/footer, minimal panels, summary tiles, member cards, timeline table.
- `ActionForm`, `Field`, `TextArea`, `SelectField` (components/forms.tsx): consistent inputs, buttons, success/error states, reset/refresh hooks.
- `entry-forms.tsx`: shared entry add/edit/delete + announcement/private note + remove member actions, all with UX guidance copy.
- `lib/actions.ts`: server actions for auth, board, entry, announcement, remove member, with validation (via `lib/validation.ts`) and role gating.
- `lib/db.ts`: DynamoDB wrappers for queries/mutations, ensures one-board constraints, entry filtering, membership cleanup.
- `lib/queries.ts`: filter normalizers, summary loaders for dashboards, employee home, manager detail.

## 5. Visual design keywords
- Palette: deep slate/blue hero (#18324d), charcoal text, soft mist background, subtle warm accent (#a06a37).
- System: low corner radius, compact cards, dense typography, sharp buttons.
- Behavior: shared timeline table, consistent cards, tight spacing, cohesive header/footer/section layout.

## 6. Setup guide
1. Copy `.env.local` from `.env.example` and fill AWS env vars (`COGNITO_*`, `DDB_*`, `AWS_REGION`).
2. Run `npm install`.
3. Start dev server with `npm run dev:reset` (ensures clean cache); use `npm run dev` for normal running.
4. Build via `npm run build`; tests run with `npm test` (requires IPC access).

## 7. Deployment notes
- App intended for AWS Amplify hosting; env vars match CDK outputs (`CognitoUserPoolId`, `DDB_*` tables, etc.).
- Use `npm run infra:synth`/`infra:deploy` to manage AWS stack.
- After deployment, configure Amplify environment variables to match `.env.local`.

## 8. Reverse engineering prompt template
Use this when asking Codex/another agent to reproduce the app:
```
Rebuild One-on-One:
1. Framework: Next.js 15 app router with server actions.
2. Auth: AWS Cognito (Cognito User Pool + client). Use `lib/auth.ts`.
3. Data: DynamoDB tables listed above, managed by `lib/db.ts`.
4. UI: Use the components/design language captured in `components/ui.tsx`, `components/forms.tsx`, `components/entry-forms.tsx`.
5. Routes/screens: match the table in section 3.
6. Visual style: palette and spacing described in section 5.
7. Infrastructure: mirror the CDK stack in `/infra`.
- Validate via `npm run build` and `npm test`.
```
