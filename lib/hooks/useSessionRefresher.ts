"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useSessionRefresher() {
  useEffect(() => {
    let sessionExpiryTime: number | null = null;

    // Load session and set expiry time
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        sessionExpiryTime = session.expires_at
          ? session.expires_at * 1000
          : null;
        console.log("Session loaded. Expiry time:", sessionExpiryTime);
      }
    };

    // Refresh session if it's about to expire in 30 minutes
    const refreshSessionIfNeeded = async () => {
      if (!sessionExpiryTime) return;

      const now = Date.now();
      const thirtyMinutesInMs = 30 * 60 * 1000; // 30 minutes in milliseconds

      // Check if session is about to expire within 30 minutes
      if (sessionExpiryTime - now <= thirtyMinutesInMs) {
        console.log("Session is about to expire, refreshing session...");
        const { data, error } = await supabase.auth.refreshSession();
        if (data.session) {
          sessionExpiryTime = data.session.expires_at
            ? data.session.expires_at * 1000
            : null;
          console.log("Session extended!");
        } else if (error) {
          console.error("Failed to refresh session:", error.message);
        }
      }
    };

    // Check for session refresh every minute
    const intervalId = setInterval(refreshSessionIfNeeded, 60 * 1000); // Check every minute

    // Handle auth state change (refresh sessionExpiryTime)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          sessionExpiryTime = session.expires_at
            ? session.expires_at * 1000
            : null;
        } else {
          sessionExpiryTime = null;
        }
      }
    );

    // Load session initially
    loadSession();

    // Cleanup when layout unmounts (important)
    return () => {
      clearInterval(intervalId); // Clear the interval on unmount
      authListener.subscription.unsubscribe();
    };
  }, []);
}
