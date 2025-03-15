// auth.js
import { supabase } from "@/lib/supabase"; // assuming you have a separate supabaseClient setup

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
export const signIn = async (email : string, password : string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("Error signing in:", error.message);
    return null;
  }
  return data;
};

// Log out user
export const logout = async () => {
  await supabase.auth.signOut();
};
