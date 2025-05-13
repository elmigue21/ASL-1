"use client";

import { ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface SessionRefresherProps {
  children?: ReactNode;
}

export function SessionRefresher({ children }: SessionRefresherProps) {
  useEffect(() => {
    let sessionExpiryTime: number | null = null;

    const loadSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          sessionExpiryTime = session.expires_at
            ? session.expires_at * 1000
            : null;
          console.log("Session loaded. Expiry time:", sessionExpiryTime);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error loading session:", error.message);
        }
      }
    };

    const refreshSessionIfNeeded = async () => {
      if (!sessionExpiryTime) return;

      const now = Date.now();
      const threshold = 1 * 60 * 1000;

      const timeLeft = sessionExpiryTime - now;
      console.log(
        `Time left before session expires: ${Math.round(timeLeft / 1000)}s`
      );

      if (timeLeft <= threshold) {
        console.log("Session is about to expire, refreshing session...");
        try {
          const { data, error } = await supabase.auth.refreshSession();
          if (data?.session) {
            sessionExpiryTime = data.session.expires_at
              ? data.session.expires_at * 1000
              : null;
            console.log(
              "Session extended! New expiry time:",
              sessionExpiryTime
            );
          } else if (error) {
            console.error("Failed to refresh session:", error.message);
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Error refreshing session:", error.message);
          }
        }
      } else {
        console.log("Session is still valid, no need to refresh.");
      }
    };

    const handleClick = () => {
      console.log("User clicked. Checking session...");
      refreshSessionIfNeeded();
    };

    // Set up event listener
    window.addEventListener("click", handleClick);

    // Watch auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          sessionExpiryTime = session.expires_at
            ? session.expires_at * 1000
            : null;
          console.log(
            "Auth state changed. Updated expiry time:",
            sessionExpiryTime
          );
        } else {
          sessionExpiryTime = null;
          console.log("Auth state changed. No active session.");
        }
      }
    );

    // Initial load
    loadSession();

    return () => {
      window.removeEventListener("click", handleClick);
      authListener.subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
