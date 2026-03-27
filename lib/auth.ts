"use server";

import { AuthFlowType, InitiateAuthCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { jwtVerify, createRemoteJWKSet, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCognitoClient, hasAwsConfig } from "@/lib/aws-clients";
import { requireAwsConfig } from "@/lib/config";
import { ensureUserProfile, getUserById } from "@/lib/db";
import { AuthTokens, User, UserRole } from "@/lib/types";
import { normalizeEmail } from "@/lib/utils";

const SESSION_COOKIE = "oneonone_auth";

function getIssuer() {
  const config = requireAwsConfig();
  return `https://cognito-idp.${config.awsRegion}.amazonaws.com/${config.cognitoUserPoolId}`;
}

function encodeTokens(tokens: AuthTokens) {
  return Buffer.from(JSON.stringify(tokens), "utf8").toString("base64url");
}

function decodeTokens(value: string) {
  try {
    const raw = Buffer.from(value, "base64url").toString("utf8");
    return JSON.parse(raw) as AuthTokens;
  } catch {
    return null;
  }
}

async function setSession(tokens: AuthTokens) {
  (await cookies()).set(SESSION_COOKIE, encodeTokens(tokens), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

function tokensFromAuthResult(authResult: {
  IdToken?: string;
  ExpiresIn?: number;
}) {
  if (!authResult.IdToken) {
    throw new Error("Cognito did not return a complete session.");
  }

  return {
    idToken: authResult.IdToken,
    expiresAt: Date.now() + (authResult.ExpiresIn ?? 3600) * 1000,
  } satisfies AuthTokens;
}

async function verifyIdToken(idToken: string) {
  const config = requireAwsConfig();
  const issuer = getIssuer();
  const jwks = createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`));

  const result = await jwtVerify(idToken, jwks, {
    issuer,
    audience: config.cognitoUserPoolClientId,
  });

  return result.payload;
}

function extractRole(payload: JWTPayload) {
  const role = payload["custom:role"];
  if (role === "manager" || role === "reportee") {
    return role;
  }
  return null;
}

function extractString(payload: JWTPayload, key: string) {
  const value = payload[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<User | null> {
  if (!hasAwsConfig()) {
    return null;
  }

  const rawCookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!rawCookie) {
    return null;
  }

  let tokens = decodeTokens(rawCookie);
  if (!tokens) {
    return null;
  }

  try {
    if (tokens.expiresAt <= Date.now()) {
      return null;
    }

    const payload = await verifyIdToken(tokens.idToken);
    const userId = extractString(payload, "sub");
    if (!userId) {
      return null;
    }

    const existing = await getUserById(userId);
    if (existing) {
      return existing;
    }

    const role = extractRole(payload);
    const fullName = extractString(payload, "name");
    const email = extractString(payload, "email");
    if (!role || !fullName || !email) {
      return null;
    }

    return ensureUserProfile({
      id: userId,
      fullName,
      email,
      role,
    });
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireRole(role: UserRole) {
  const user = await requireUser();
  if (user.role !== role) {
    redirect(user.role === "manager" ? "/manager" : "/employee");
  }
  return user;
}

export async function signUp(input: {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  const config = requireAwsConfig();
  const client = getCognitoClient();
  const email = normalizeEmail(input.email);

  await client.send(
    new SignUpCommand({
      ClientId: config.cognitoUserPoolClientId,
      Username: email,
      Password: input.password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "name", Value: input.fullName.trim() },
        { Name: "custom:role", Value: input.role },
      ],
    }),
  );

  const user = await logIn({
    email,
    password: input.password,
  });

  await ensureUserProfile({
    id: user.id,
    fullName: input.fullName,
    email,
    role: input.role,
  });

  return user;
}

export async function logIn(input: { email: string; password: string }) {
  const config = requireAwsConfig();
  const client = getCognitoClient();
  const result = await client.send(
    new InitiateAuthCommand({
      ClientId: config.cognitoUserPoolClientId,
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: normalizeEmail(input.email),
        PASSWORD: input.password,
      },
    }),
  );

  const tokens = tokensFromAuthResult(result.AuthenticationResult ?? {});
  await setSession(tokens);

  const payload = await verifyIdToken(tokens.idToken);
  const userId = extractString(payload, "sub");
  const fullName = extractString(payload, "name");
  const email = extractString(payload, "email");
  const role = extractRole(payload);

  if (!userId || !fullName || !email || !role) {
    throw new Error("Your Cognito profile is missing required Oneonone attributes.");
  }

  return ensureUserProfile({
    id: userId,
    fullName,
    email,
    role,
  });
}
