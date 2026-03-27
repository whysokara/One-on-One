# One-on-One

One-on-One is a lightweight performance memory app for managers and reportees. It helps teams log achievements, blockers, learning, certifications, and manager observations throughout the year so reviews are based on evidence instead of memory.

## What It Does

- Managers create a team board
- Reportees join with an invite code or link
- Reportees log work moments to their own timeline
- Managers review each employee timeline in one place
- Managers add private notes visible only to themselves
- Teams post lightweight announcements

## Current Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- AWS Cognito for auth
- DynamoDB for app data
- AWS CDK for infrastructure
- Amplify-ready build setup

## AWS Resources

The current app is wired for:

- Cognito User Pool
- DynamoDB tables for:
  - users
  - boards
  - memberships
  - entries
  - announcements

Infrastructure lives in [infra](./infra).

## Local Development

Install dependencies:

```bash
npm install
```

Create local env config from `.env.example` or use `.env.local` with your deployed AWS values.

Run the app:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Open:

```text
http://127.0.0.1:3000
```

## Useful Scripts

```bash
npm run dev
npm run build
npm run infra:synth
npm run infra:deploy
```

## AWS Setup

See [AWS_SETUP.md](./AWS_SETUP.md) for:

- CDK bootstrap
- infrastructure deploy
- environment variable mapping
- Amplify setup

## Test Accounts

Current test users created in Cognito:

- Manager: `manager.test@oneonone.app`
- Reportee: `reportee.test@oneonone.app`
- Password: `Oneonone1234`

Current test board:

- Board name: `QA Board FY26`
- Invite code: `00BHBY`

## Repo Structure

```text
app/          Next.js routes and pages
components/   Shared UI and forms
lib/          Auth, data, actions, queries, config
infra/        AWS CDK stack
```

## Product Direction

This is intentionally not an HRMS, task tracker, or chat product. It is a focused internal tool for year-round performance memory.

## Author

Made by kara  
X: https://x.com/whysokara
