// "use client";

// import { useEffect, useCallback, useRef } from "react";
// import { supabase } from "@/lib/supabase";

// export function useSessionRefresher() {
//   const sessionExpiryTimeRef = useRef<number | null>(null); // Using useRef to persist sessionExpiryTime

//   useEffect(() => {
//     // Load session and set expiry time
//     const loadSession = async () => {
//       try {
//         const {
//           data: { session },
//         } = await supabase.auth.getSession();
//         if (session) {
//           sessionExpiryTimeRef.current = session.expires_at
//             ? session.expires_at * 1000
//             : null;
//           console.log(
//             "Session loaded. Expiry time:",
//             sessionExpiryTimeRef.current
//           );
//         }
//       } catch (error: unknown) {
//         if (error instanceof Error) {
//           console.error("Error loading session:", error.message);
//         } else {
//           console.error("Unknown error occurred while loading session");
//         }
//       }
//     };

//     // Refresh session if it's about to expire
//     const refreshSessionIfNeeded = useCallback(async () => {
//       if (!sessionExpiryTimeRef.current) return;

//       const now = Date.now();
//       const threshold = 59 * 60 * 1000; // 59 minutes

//       const timeLeft = sessionExpiryTimeRef.current - now;
//       console.log(
//         `Time left before session expires: ${Math.round(timeLeft / 1000)}s`
//       );

//       if (timeLeft <= threshold) {
//         console.log("Session is about to expire, refreshing session...");
//         try {
//           const { data, error } = await supabase.auth.refreshSession();
//           if (data?.session) {
//             sessionExpiryTimeRef.current = data.session.expires_at
//               ? data.session.expires_at * 1000
//               : null;
//             console.log(
//               "Session extended! New expiry time:",
//               sessionExpiryTimeRef.current
//             );
//           } else if (error) {
//             // Explicitly handle error
//             console.error("Failed to refresh session:", error.message);
//           }
//         } catch (error: unknown) {
//           if (error instanceof Error) {
//             console.error("Error refreshing session:", error.message);
//           } else {
//             console.error("Unknown error occurred while refreshing session");
//           }
//         }
//       } else {
//         console.log("Session is still valid, no need to refresh.");
//       }
//     }, []);

//     // Click handler
//     const handleClick = useCallback(() => {
//       console.log("User clicked. Checking session...");
//       refreshSessionIfNeeded();
//     }, [refreshSessionIfNeeded]);

//     // Listen for clicks
//     window.addEventListener("click", handleClick);

//     // Handle auth state changes
//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         if (session) {
//           sessionExpiryTimeRef.current = session.expires_at
//             ? session.expires_at * 1000
//             : null;
//           console.log(
//             "Auth state changed. Updated expiry time:",
//             sessionExpiryTimeRef.current
//           );
//         } else {
//           sessionExpiryTimeRef.current = null;
//           console.log("Auth state changed. No active session.");
//         }
//       }
//     );

//     // Initial session load
//     loadSession();

//     // Cleanup
//     return () => {
//       window.removeEventListener("click", handleClick);
//       authListener.subscription.unsubscribe();
//     };
//   }, []); // Empty dependency array ensures this runs once when the component mounts
// }
