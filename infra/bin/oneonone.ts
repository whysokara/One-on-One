#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { OneononeStack } from "../lib/oneonone-stack";

const app = new cdk.App();

new OneononeStack(app, "OneononeProdStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? process.env.AWS_REGION ?? "ap-south-1",
  },
});
