/**
 * API client with auth header management.
 * All API calls go through this central client.
 */

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export interface ApiOptions extends RequestInit {
  credentials?: "include" | "omit" | "same-origin";
}

/** Get the current session token from localStorage. */
export function getSessionToken(): string | null {
  return localStorage.getItem("learning-app-token");
}

/** Save a session token. */
export function setSessionToken(token: string): void {
  localStorage.setItem("learning-app-token", token);
}

/** Clear the session. */
export function clearSession(): void {
  localStorage.removeItem("learning-app-token");
  localStorage.removeItem("learning-app-user");
}

/** Get the current user info. */
export function getCurrentUser(): { username: string; role: string; child_name?: string } | null {
  const raw = localStorage.getItem("learning-app-user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Save current user info. */
export function setCurrentUser(username: string, role: string, childName?: string): void {
  localStorage.setItem(
    "learning-app-user",
    JSON.stringify({ username, role, child_name: childName })
  );
}

/** Build headers for API requests. */
function buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(customHeaders || {}),
  };
  const user = getCurrentUser();
  if (user) {
    headers["X-User-Name"] = user.username;
  }
  const token = getSessionToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Generic fetch wrapper with error handling.
 * Returns parsed JSON or throws an Error with the API detail message.
 */
export async function request<T>(path: string, options?: ApiOptions): Promise<T> {
  const headers = buildHeaders(options?.headers as Record<string, string> | undefined);

  const response = await fetch(`${API_BASE}${path}`, {
    headers,
    ...options,
    body: options?.body || undefined,
  });

  if (!response.ok) {
    let message = "请求失败";
    try {
      const body = await response.json();
      message = body.detail || message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

/**
 * Form-data fetch wrapper (for multipart uploads, login, etc.).
 */
export async function requestFormData<T>(path: string, formData: FormData): Promise<T> {
  const headers = buildHeaders({});
  // Don't set Content-Type for FormData; let the browser set it with boundary

  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    let message = "请求失败";
    try {
      const body = await response.json();
      message = body.detail || message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

/**
 * Simple login: saves user info to localStorage.
 * The actual auth call goes to /api/auth/login.
 */
export async function login(credentials: { username: string }): Promise<{ username: string; role: string; child_name: string }> {
  const resp = await request<{ username: string; role: string; child_name: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  setCurrentUser(resp.username, resp.role, resp.child_name);
  return resp;
}

export function logout(): void {
  clearSession();
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === "parent";
}
