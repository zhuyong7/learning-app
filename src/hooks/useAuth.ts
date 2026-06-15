/**
 * Authentication hook.
 * Manages login state and provides user info to components.
 */
import { useState, useCallback, useEffect } from "react";
import { login as apiLogin, logout as apiLogout, isAdmin as apiIsAdmin, getCurrentUser } from "../api/client";

export interface UserSession {
  username: string;
  role: "parent" | "child";
  childName: string;
}

export function useAuth() {
  const [session, setSession] = useState<UserSession | null>(() => {
    const user = getCurrentUser();
    if (user) {
      return {
        username: user.username,
        role: user.role as "parent" | "child",
        childName: user.child_name || "",
      };
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string): Promise<{ username: string; role: string; child_name: string }> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiLogin({ username });
      setSession({
        username: result.username,
        role: result.role as "parent" | "child",
        childName: result.child_name,
      });
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "登录失败";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setSession(null);
    setError(null);
  }, []);

  const isAdmin = useCallback(() => apiIsAdmin(), []);

  // Check if there's a saved session on mount
  useEffect(() => {
    if (!session && getCurrentUser()) {
      const user = getCurrentUser()!;
      setSession({
        username: user.username,
        role: user.role as "parent" | "child",
        childName: user.child_name || "",
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    session,
    loading,
    error,
    login,
    logout,
    isAdmin,
    isLoggedIn: !!session,
  };
}
