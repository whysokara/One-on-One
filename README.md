# One-on-One

One-on-One is a lightweight performance memory app for managers and reportees. It is designed for year-round review context, not for task tracking, chat, or HR workflows.

## What It Does

- Managers create a board for a review cycle
- Reportees join with an invite code or link
- Reportees add shared timeline entries as work happens
- Managers review each employee timeline in one place
- Managers leave private notes only they can see
- Teams post short board announcements

## Current Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- AWS Cognito for auth
- DynamoDB for app data
- AWS CDK for infrastructure
- Amplify for web hosting

## Main Routes

- `/` landing page
- `/workspace` role-aware entry route
- `/login`
- `/signup`
- `/join`
- `/employee`
- `/manager`
- `/manager/create-board`
- `/manager/board/[boardId]`
- `/manager/board/[boardId]/employee/[employeeId]`
- `/health`

## Local Development

Install dependencies:

```bash
npm install
```

Create `.env.local` from `.env.example` and fill in your AWS values.

Run the app:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

If you need LAN access, the dev server binds to `0.0.0.0` by default.

## Environment Variables

Required AWS values:

- `AWS_REGION`
- `ONEONONE_AWS_REGION` for Amplify Hosting, because Amplify blocks custom `AWS_` env vars
- `COGNITO_USER_POOL_ID`
- `COGNITO_USER_POOL_CLIENT_ID`
- `DDB_USERS_TABLE`
- `DDB_BOARDS_TABLE`
- `DDB_MEMBERSHIPS_TABLE`
- `DDB_ENTRIES_TABLE`
- `DDB_ANNOUNCEMENTS_TABLE`

Optional values:

- `APP_BASE_URL` for invite links when request host headers are unavailable
- `NEXT_IGNORE_INCORRECT_LOCKFILE=true` for the current Amplify build path

Seed-script values are separate and should stay private:

- `SEED_BOARD_ID`
- `SEED_EMAIL`
- `SEED_FULL_NAME`
- `SEED_PASSWORD`
- `SEED_ENTRY_DATE`

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm test
npm run infra:synth
npm run infra:deploy
```

## AWS Setup

See [AWS_SETUP.md](./AWS_SETUP.md) for:

- CDK bootstrap
- infrastructure deploy
- environment variable mapping
- Amplify setup

## Testing

The repo includes:

- route and config checks
- validation tests
- rate-limit tests
- health-route checks
- build verification through Next.js

Run the suite:

```bash
npm test
```

## Seed Script

`scripts/seed-aditya.mjs` is a live AWS seed helper. It requires:

- explicit confirmation with `--confirm-live-seed` or `ONEONONE_ALLOW_LIVE_SEED=yes`
- the seed env vars listed above

It is intentionally not safe to run without those inputs.

## Repo Structure

```text
app/          Next.js routes and pages
components/   Shared UI and forms
lib/          Auth, data, actions, queries, config
infra/        AWS CDK stack
scripts/      One-off maintenance and seed helpers
tests/        Node test suite
kara/         Personal skills and agent notes
```

## Product Direction

The app is intentionally narrow. It is not a general HRMS, task manager, or chat product. The core loop is:

1. capture work moments while they are fresh
2. review the timeline later
3. keep manager-only context separate
4. keep the board simple enough that people actually use it

## Author

Made by kara  
X: https://x.com/whysokara
