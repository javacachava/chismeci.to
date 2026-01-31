type VudyAuthConfig = {
  apiKey: string;
  profileId?: string;
  teamId?: string;
  sessionToken?: string;
};

/**
 * Builds Vudy API headers based on available credentials.
 * Priority: Pattern C (session) > Pattern B (profile/team) > Pattern A (api key only)
 */
export function getVudyHeaders(config: VudyAuthConfig): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-api-key": config.apiKey
  };

  // Pattern C: Session token (highest priority)
  if (config.sessionToken) {
    headers["Authorization"] = `Bearer ${config.sessionToken}`;
    return headers;
  }

  // Pattern B: Profile + Team headers
  if (config.profileId && config.teamId) {
    headers["x-profile-id"] = config.profileId;
    headers["x-team-id"] = config.teamId;
    return headers;
  }

  // Pattern A: API key only (default)
  return headers;
}

/**
 * Get JWT expiry timestamp from token payload.
 * Returns null if token is invalid or has no exp claim.
 */
export function getJwtExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload));
    return typeof decoded?.exp === "number" ? decoded.exp : null;
  } catch {
    return null;
  }
}

/**
 * Check if JWT is expired or within buffer period.
 */
export function isJwtExpired(token: string, bufferSeconds = 300): boolean {
  const exp = getJwtExpiry(token);
  if (!exp) return true;
  return Math.floor(Date.now() / 1000) >= exp - bufferSeconds;
}

/**
 * Attempt to refresh Vudy session token.
 * Returns new token if successful, original token otherwise.
 */
export async function refreshVudySession(
  baseUrl: string,
  apiKey: string,
  currentToken: string
): Promise<string> {
  try {
    const response = await fetch(`${baseUrl}/v1/auth/refresh-session`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        Authorization: `Bearer ${currentToken}`
      }
    });

    if (!response.ok) return currentToken;

    const data = await response.json();
    return data?.data?.session ?? currentToken;
  } catch {
    return currentToken;
  }
}
