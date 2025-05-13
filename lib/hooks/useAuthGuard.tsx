import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { supabase } from "../supabase"; // Adjust the import path if needed

const useAuthGuard = () => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      // Mark the component as mounted to safely use the router
      setMounted(true);
    }, []);

  useEffect(() => {
    if (!mounted) return;
    const checkAuth = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        router.replace("/login");
      } else {
        setChecking(false);
      }
    };

    checkAuth();

    const handleBack = () => {
      // In case user presses back button, validate token
      const token = localStorage.getItem("supabase_token");
      if (!token) {
        router.replace("/login");
      }
    };

    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [router]);

  return checking;
};

export default useAuthGuard;
