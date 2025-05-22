"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function useAuthRedirect() {
  const router = useRouter();
  const hasRun = useRef(false); // prevents double-run logic

  useEffect(() => {
    if (hasRun.current) return; // only run once
    hasRun.current = true;

    if (typeof window === "undefined") return;

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const checkAuth = async () => {
     await delay(1000);

      // const hasToken = document.cookie.includes("access_token");
      // if (!hasToken) {
      //   console.log("No access_token cookie, skipping auth check.");
      //   return;
      // }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          console.warn("Auth API call failed, redirecting...");
          router.push("/loginPage");
          return;
        }

        const { authenticated } = await response.json();
        if (!authenticated) {
          console.warn("Not authenticated, redirecting...");
          router.push("/loginPage");
        } else {
          console.log("Authenticated, staying on page.");
        }
      } catch (error) {
        console.error("Auth check error, redirecting:", error);
        router.push("/loginPage");
      }
    };

    checkAuth();
  }, [router]);
}
