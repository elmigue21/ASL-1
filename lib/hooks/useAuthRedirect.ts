"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Run only in browser
    if (typeof window === "undefined") return;

    // Defensive: wait for cookies to be accessible
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const checkAuth = async () => {
      // Check if cookie exists in document.cookie before fetching
      if (!document.cookie.includes("access_token")) {
        console.log(
          "No access_token cookie in document.cookie — skipping auth check for now"
        );
        return;
      }

      // Small delay to ensure cookies are fully set
      await delay(300);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth`,
          {
            credentials: "include", // Send cookies with request
          }
        );

        if (!response.ok) {
          console.log("Not authenticated, redirecting...");
          router.push("/loginPage");
          return;
        }

        const data = await response.json();

        if (!data.authenticated) {
          console.log("Auth check failed: not authenticated, redirecting...");
          router.push("/loginPage");
          return;
        }

        console.log("Authenticated, continuing");
      } catch (error) {
        console.error("Failed to verify auth:", error);
        router.push("/loginPage");
      }
    };

    checkAuth();
  }, [router]);
}
