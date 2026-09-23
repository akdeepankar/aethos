"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { account, OAuthProvider } from "../_lib/appwrite";
import { Models } from "appwrite";

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  signInWithGoogle: (redirectUrl?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const signInWithGoogle = async (redirectTarget?: string) => {
    try {
      const currentLoc = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";
      const redirectUrl = redirectTarget || (currentLoc.startsWith("/auth") || currentLoc.startsWith("/signin") ? "/" : currentLoc);
      
      if (typeof window !== "undefined") {
        sessionStorage.setItem("aethos_auth_redirect", redirectUrl);
        const origin = window.location.origin;
        await account.createOAuth2Token({
          provider: OAuthProvider.Google,
          success: `${origin}/auth/success`,
          failure: `${origin}/auth/failure`,
        });
      }
    } catch (err) {
      console.error("Sign in with Google error:", err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await account.deleteSession({ sessionId: "current" });
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setUser(null);
      if (typeof window !== "undefined") {
        window.location.assign("/auth");
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
