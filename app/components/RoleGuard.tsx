"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // to prevent state updates if unmounted

    async function checkRole() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/getRole`,
          {
            method: "GET",
            credentials: "include", // send cookies
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          console.error(
            "RoleGuard: getRole fetch failed with status",
            res.status
          );
          if (isMounted) {
            setLoading(false);
            router.push("/loginPage");
          }
          return;
        }

        const data = await res.json();
        console.log("AUTH ROLE Data", data);

        if (!data.role || data.role !== "admin") {
          if (isMounted) {
            setLoading(false);
            router.push("/unauthorized");
          }
          return;
        }

        // Role is admin, allow access
        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error("RoleGuard: error during role check", error);
        if (isMounted) {
          setLoading(false);
          router.push("/loginPage");
        }
      }
    }

    checkRole();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // or spinner component
  }

  return <>{children}</>;
}
