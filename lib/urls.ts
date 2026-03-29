export function buildInviteLink(
  boardId: string,
  requestHeaders: Pick<Headers, "get">,
  fallbackBaseUrl = process.env.APP_BASE_URL?.trim() || "http://localhost:3000",
) {
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const forwardedProto = requestHeaders.get("x-forwarded-proto");
  const proto = forwardedProto ?? (fallbackBaseUrl.startsWith("https") ? "https" : "http");

  if (host) {
    return `${proto}://${host.replace(/\/$/, "")}/join?boardId=${boardId}`;
  }

  return `${fallbackBaseUrl.replace(/\/$/, "")}/join?boardId=${boardId}`;
}
