import { Request, Response, RequestHandler } from "express";

import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
// import { supabase } from "../../lib/supabase"; // ✅ Ensure correct path
import cookie from "cookie";

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if(!supabaseUrl || !supabaseAnonKey){
  throw new Error("environment variables missing")
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.session) {
      console.warn(
        "Supabase login error:",
        authError?.message || "No session returned"
      );
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const accessToken = authData.session.access_token;
    const userId = authData.user.id;

    // Fetch profile data from `profiles` table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError || !profileData) {
      console.warn("Profile fetch error:", profileError?.message);
      res.status(500).json({ error: "Failed to fetch user profile." });
      return;
    }

    console


    res.setHeader(
      "Set-Cookie",
      cookie.serialize("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60, // 1 hour
      })
    );

    res.status(200).json({
      message: "Logged in successfully.",
      profile: profileData,
    });
    return;
  } catch (err) {
    console.error("Login server error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};


export const register: RequestHandler = async (req, res) => {
  try {
    const { email, password ,first_name, last_name} = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

 const { data: authData, error: authError } = await supabase.auth.signUp({
   email,
   password,
 });

 if (authError) {
   console.warn("Supabase registration error:", authError.message);
   res.status(400).json({ error: authError.message });
   return;
 }

 // 2. After successful signup, create profile record
 const userId = authData.user?.id;
 if (!userId) {
   res.status(500).json({ error: "User ID not found after signup." });
   return;
 }

 const { error: profileError } = await supabase
   .from("profile")
   .insert([{ id: userId, email ,first_name,last_name, role:"employee"}]);

 if (profileError) {
   console.error("Error creating profile:", profileError.message);
   res.status(500).json({ error: "Failed to create user profile." });
   return;
 }

    res
      .status(201)
      .json({
        message:
          "Registration successful. Please check your email to confirm your account.",
      });
  } catch (err) {
    console.error("Register server error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const logout: RequestHandler = async (req, res) => {
  try {
    // Optional: Revoke token via Supabase API if required
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("access_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
      })
    );

    res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    console.error("Logout server error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getRole: RequestHandler = async (req, res) => {
  try {
 const cookies = cookie.parse(req.headers.cookie || "");
 const token = cookies.access_token;

 if (!token) {
   res.status(401).json({ error: "Missing access token cookie" });
   return;
 }

    // Verify the token and get the user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(403).json({ error: "Invalid token", detail: error?.message });
      return;
    }

    const userId = user.id;

    // Fetch the user's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    res.status(200).json({ role: profile.role });
  } catch (err) {
    console.error("Get role server error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
