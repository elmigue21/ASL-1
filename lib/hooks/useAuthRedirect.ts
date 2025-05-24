"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip auth check on public routes
    const publicRoutes = ["/", "/loginPage","/confirm","/unsubscribe"];
    if (publicRoutes.includes(pathname)) return;

    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth`,
          { credentials: "include" }
        );

        if (!response.ok) {
          router.push("/loginPage");
          return;
        }

        const { authenticated } = await response.json();

        if (!authenticated) {
          router.push("/loginPage");
        }
      } catch (error) {
        console.error(error);
        router.push("/loginPage");
      }
    };

    checkAuth();
  }, [pathname, router]);

  return null;
}
