// // auth.js
// import { supabase } from "@/lib/supabase"; // assuming you have a separate supabaseClient setup
// import { useRouter } from "next/navigation";
// import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";



// // Sign up user
// export const signUp = async (email : string, password : string) => {
//   const { data, error } = await supabase.auth.signUp({ email, password });
//   if (error) {
//     console.error("Error signing up:", error.message);
//     return null;
//   }
//   return data;
// };

// // Sign in user
// export const signIn = async (email: string, password: string) => {
//   console.log("Attempting sign-in...");

//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });

//   if (error) {
//     console.error("Error signing in:", error.message);
//     return null;
//   }

//   console.log("Signed in user:", data);

//   // ✅ Get & manually store the session
//   const session = data.session;
//   console.log("Session after sign-in:", session);

//   if (session) {
//     supabase.auth.setSession({
//       access_token: session.access_token,
//       refresh_token: session.refresh_token,
//     });
//   }

//   return data;
// };



// // Log out user
// export const logout = async (/* router : AppRouterInstance */) => {
//   // const router = useRouter();

//   await supabase.auth.signOut();

//   // Clear tokens from cookies
//   document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
//   document.cookie =
//     "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
//   document.cookie =
//     "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

//   // Optionally clear tokens from localStorage and sessionStorage
//   localStorage.removeItem("access_token");
//   localStorage.removeItem("refresh_token");

//   sessionStorage.removeItem("access_token");
//   sessionStorage.removeItem("refresh_token");

//   console.log(
//     "User signed out and tokens cleared from cookies, localStorage, and sessionStorage."
//   );
//   // router.replace("/login");
//   // window.history.forward();
// };