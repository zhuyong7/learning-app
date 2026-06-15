/**
 * Auth context provider.
 * Wraps the app with auth state that drives routing decisions.
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { login, logout, getCurrentUser } from "../api/client";

export interface UserSession {
  username: string;
  role: "parent" | "child";
  childName: string;
}

interface AuthContextValue {
  session: UserSession | null;
  loading: boolean;
  login: (username: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
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

  const doLogin = useCallback(async (username: string) => {
    setLoading(true);
    try {
      const result = await login({ username });
      setSession({
        username: result.username,
        role: result.role as "parent" | "child",
        childName: result.child_name,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const doLogout = useCallback(() => {
    logout();
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        login: doLogin,
        logout: doLogout,
        isAdmin: session?.role === "parent",
        isLoggedIn: !!session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
