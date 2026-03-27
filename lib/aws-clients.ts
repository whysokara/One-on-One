import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { getAwsConfig, requireAwsConfig } from "@/lib/config";

let cognitoClient: CognitoIdentityProviderClient | null = null;
let documentClient: DynamoDBDocumentClient | null = null;

export function hasAwsConfig() {
  return Boolean(getAwsConfig());
}

export function getCognitoClient() {
  if (!cognitoClient) {
    const config = requireAwsConfig();
    cognitoClient = new CognitoIdentityProviderClient({
      region: config.awsRegion,
    });
  }

  return cognitoClient;
}

export function getDocumentClient() {
  if (!documentClient) {
    const config = requireAwsConfig();
    const client = new DynamoDBClient({
      region: config.awsRegion,
    });
    documentClient = DynamoDBDocumentClient.from(client, {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });
  }

  return documentClient;
}
