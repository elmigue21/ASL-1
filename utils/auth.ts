// auth.js
import { supabase } from "@/supabase"; // assuming you have a separate supabaseClient setup

// Sign up user
export const signUp = async (email : string, password : string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error("Error signing up:", error.message);
    return null;
  }
  return data;
};

// Sign in user
export const signIn = async (email: string, password: string) => {
  console.log("Attempting sign-in...");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error signing in:", error.message);
    return null;
  }

  console.log("Signed in user:", data);

  // ✅ Get & manually store the session
  const session = data.session;
  console.log("Session after sign-in:", session);

  if (session) {
    supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  }

  return data;
};



// Log out user
export const logout = async () => {
  await supabase.auth.signOut();
};
