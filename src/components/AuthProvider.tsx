"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { AuthUser } from "@/lib/auth";
import { getSession, logout as authLogout } from "@/lib/auth";

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  refresh: () => void;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  ready: false,
  refresh: () => {},
  logout: () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setUser(getSession());
  }, []);

  useEffect(() => {
    refresh();
    setReady(true);
  }, [refresh]);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        refresh,
        logout,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
