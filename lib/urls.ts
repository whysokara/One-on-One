export function buildInviteLink(
  boardId: string,
  requestHeaders: Pick<Headers, "get">,
  fallbackBaseUrl = process.env.APP_BASE_URL?.trim() || "",
) {
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const forwardedProto = requestHeaders.get("x-forwarded-proto");
  const proto = forwardedProto ?? (fallbackBaseUrl.startsWith("https") ? "https" : "http");

  if (host) {
    return `${proto}://${host.replace(/\/$/, "")}/join?boardId=${boardId}`;
  }

  if (!fallbackBaseUrl) {
    throw new Error("Cannot build an invite link without a request host or APP_BASE_URL.");
  }

  return `${fallbackBaseUrl.replace(/\/$/, "")}/join?boardId=${boardId}`;
}
