/**
 * Auth API endpoints.
 */
import { request } from "./client";
import { setCurrentUser, clearSession, getCurrentUser } from "./client";

export interface LoginCredentials {
  username: string;
  password?: string;
}

export interface LoginResponse {
  username: string;
  role: "parent" | "child";
  child_name: string;
}

/**
 * Login with username. Returns user info and saves session.
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const resp = await request<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  setCurrentUser(resp.username, resp.role, resp.child_name);
  return resp;
}

/**
 * Logout and clear session.
 */
export function logout(): void {
  clearSession();
}

/**
 * Check if the current user is a parent (admin).
 */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === "parent";
}

/**
 * Get the current username.
 */
export function getUsername(): string | null {
  return getCurrentUser()?.username ?? null;
}
