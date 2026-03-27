# Oneonone AWS Setup

## What Codex implemented
- Cognito-backed auth in the Next.js app
- DynamoDB-backed repositories for users, boards, memberships, entries, and announcements
- CDK infrastructure under `infra/`
- Amplify build config in `amplify.yml`
- Environment variable template in `.env.example`

## Actions you need to perform
1. Install dependencies:
   - `npm install`
2. Authenticate to AWS:
   - `aws configure` or your AWS SSO login flow
3. Bootstrap CDK in your AWS account and region:
   - `npx cdk bootstrap aws://ACCOUNT_ID/REGION --app "tsx infra/bin/oneonone.ts"`
4. Deploy infrastructure:
   - `npm run infra:deploy`
5. Copy the CloudFormation/CDK outputs into your app environment:
   - `AWS_REGION`
   - `COGNITO_USER_POOL_ID`
   - `COGNITO_USER_POOL_CLIENT_ID`
   - `DDB_USERS_TABLE`
   - `DDB_BOARDS_TABLE`
   - `DDB_MEMBERSHIPS_TABLE`
   - `DDB_ENTRIES_TABLE`
   - `DDB_ANNOUNCEMENTS_TABLE`
   - `APP_BASE_URL`
6. For local development, create `.env.local` from `.env.example`.
7. For hosting, create an Amplify app in AWS and connect your repo/branch.
8. Add the same environment variables in Amplify Hosting.
9. Trigger the first Amplify deployment.

## Recommended Amplify settings
- Framework: Next.js SSR
- Build spec: use `amplify.yml`
- Node version: 20+
- Branch env vars: set all values from `.env.example`

## Important notes
- Cognito is configured for self-signup.
- Email verification is optional in this stack.
- The app expects Cognito custom attribute `custom:role`.
- The app uses AWS runtime credentials; local development needs valid AWS credentials in your shell.
