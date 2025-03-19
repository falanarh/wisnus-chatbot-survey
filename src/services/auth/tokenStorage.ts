// src/services/auth/tokenStorage.ts

const TOKEN_KEY = "auth_token";

/**
 * Saves authentication token to both cookie and localStorage
 */
export function saveToken(token: string): void {
  // Save to cookie - secure in production
  const secure = process.env.NODE_ENV === "production" ? "Secure" : "";
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=86400; SameSite=Strict; ${secure}`;

  // Save to localStorage as fallback
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Gets authentication token from cookie or localStorage
 */
export function getToken(): string | null {
  // Try from cookie first
  const tokenFromCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${TOKEN_KEY}=`))
    ?.split("=")[1];

  if (tokenFromCookie) return tokenFromCookie;

  // Fallback to localStorage
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Checks if a valid token exists
 */
export function hasToken(): boolean {
  return !!getToken();
}

/**
 * Removes token from all storage locations
 */
export function removeToken(): void {
  // Remove from cookie
  document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

  // Remove from localStorage
  localStorage.removeItem(TOKEN_KEY);
}
