import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class OneononeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const usersTable = new dynamodb.Table(this, "UsersTable", {
      tableName: "oneonone-users",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
    });

    const boardsTable = new dynamodb.Table(this, "BoardsTable", {
      tableName: "oneonone-boards",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
    });

    boardsTable.addGlobalSecondaryIndex({
      indexName: "managerId-index",
      partitionKey: { name: "managerId", type: dynamodb.AttributeType.STRING },
    });

    boardsTable.addGlobalSecondaryIndex({
      indexName: "inviteCode-index",
      partitionKey: { name: "inviteCode", type: dynamodb.AttributeType.STRING },
    });

    const membershipsTable = new dynamodb.Table(this, "MembershipsTable", {
      tableName: "oneonone-memberships",
      partitionKey: { name: "boardId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
    });

    membershipsTable.addGlobalSecondaryIndex({
      indexName: "userId-index",
      partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "userJoinedAt", type: dynamodb.AttributeType.STRING },
    });

    const entriesTable = new dynamodb.Table(this, "EntriesTable", {
      tableName: "oneonone-entries",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
    });

    entriesTable.addGlobalSecondaryIndex({
      indexName: "boardId-boardSortKey-index",
      partitionKey: { name: "boardId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "boardSortKey", type: dynamodb.AttributeType.STRING },
    });

    entriesTable.addGlobalSecondaryIndex({
      indexName: "employeeId-employeeSortKey-index",
      partitionKey: { name: "employeeId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "employeeSortKey", type: dynamodb.AttributeType.STRING },
    });

    const announcementsTable = new dynamodb.Table(this, "AnnouncementsTable", {
      tableName: "oneonone-announcements",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
    });

    announcementsTable.addGlobalSecondaryIndex({
      indexName: "boardId-boardSortKey-index",
      partitionKey: { name: "boardId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "boardSortKey", type: dynamodb.AttributeType.STRING },
    });

    const userPool = new cognito.UserPool(this, "UserPool", {
      userPoolName: "oneonone-users",
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
        fullname: {
          required: true,
          mutable: true,
        },
      },
      customAttributes: {
        role: new cognito.StringAttribute({
          minLen: 7,
          maxLen: 8,
          mutable: true,
        }),
      },
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.LINK,
        emailSubject: "Verify your One-on-One account",
        emailBody: "Verify your account by clicking on {##Verify Email##}",
      },
      autoVerify: {
        email: true,
      },
      passwordPolicy: {
        minLength: 10,
        requireDigits: true,
        requireLowercase: true,
        requireUppercase: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    userPool.addDomain("UserPoolDomain", {
      cognitoDomain: {
        domainPrefix: "oneonone-auth-ap-south-1",
      },
    });

    const userPoolClient = userPool.addClient("WebClient", {
      userPoolClientName: "oneonone-web",
      disableOAuth: true,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      preventUserExistenceErrors: true,
      accessTokenValidity: cdk.Duration.hours(1),
      idTokenValidity: cdk.Duration.hours(1),
      refreshTokenValidity: cdk.Duration.days(30),
    });

    new cdk.CfnOutput(this, "AwsRegion", {
      value: cdk.Stack.of(this).region,
    });

    new cdk.CfnOutput(this, "CognitoUserPoolId", {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, "CognitoUserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });

    new cdk.CfnOutput(this, "UsersTableName", {
      value: usersTable.tableName,
    });

    new cdk.CfnOutput(this, "BoardsTableName", {
      value: boardsTable.tableName,
    });

    new cdk.CfnOutput(this, "MembershipsTableName", {
      value: membershipsTable.tableName,
    });

    new cdk.CfnOutput(this, "EntriesTableName", {
      value: entriesTable.tableName,
    });

    new cdk.CfnOutput(this, "AnnouncementsTableName", {
      value: announcementsTable.tableName,
    });
  }
}
