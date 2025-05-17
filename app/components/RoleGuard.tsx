"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("ASDFASDFASDFSADFASDFASDFADFS")
    async function checkRole() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/role`, {
          method: "GET",
          credentials: "include", // important to send cookies
          headers: {
            "Content-Type": "application/json",
          },
        });

        
        if (!res.ok) {
          // Not authenticated or error, redirect to login
          router.push("/loginPage");
          return;
        }

        const data = await res.json();

        console.log("AUTH ROLE Data" ,data)
        if (!data.role || data.role !== "admin") {
          router.push("/unauthorized");
          return;
        }

        // Role is admin, allow access
        setLoading(false);
      } catch (error) {
        // On error, redirect to login
        router.push("/loginPage");
      }
    }

    checkRole();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Or your spinner
  }

  return <>{children}</>;
}
