import { Request, Response, RequestHandler } from "express";

import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
// import { supabase } from "../../lib/supabase"; // ✅ Ensure correct path
import cookie from "cookie";
interface AuthenticatedRequest extends Request {
  supabaseUser?: SupabaseClient;
  user?: User | null;
  // jwtPayload?: JWTPayload;
}
// import { JWTPayload } from "jose";
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if(!supabaseUrl || !supabaseAnonKey){
  throw new Error("environment variables missing")
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function createUserSupabaseClient(accessToken: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("environment variables missing");
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

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
   .from("profiles")
   .insert([{ id: userId ,first_name,last_name, role:"employee"}]);

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
      return;
  } catch (err) {
    console.error("Register server error:", err);
    res.status(500).json({ error: "Internal server error." });
    return;
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
    return;
  } catch (err) {
    console.error("Logout server error:", err);
    res.status(500).json({ error: "Internal server error." });
    return;
  }
};

export const getRole: RequestHandler = async (req, res) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.access_token;

    if (!token) {
      console.error("getRole error: Missing access token cookie");
      res.status(401).json({ error: "Missing access token cookie" });
      return;
    }

    // Create a Supabase client with user token
    const supabaseUser = createUserSupabaseClient(token);

    // Get user from Supabase auth (optional, but recommended for validation)
    const { data, error } = await supabaseUser.auth.getUser();

    if (error) {
      console.error(
        "getRole error: supabaseUser.auth.getUser failed:",
        error.message
      );
      res.status(403).json({ error: "Invalid token", detail: error.message });
      return;
    }

    if (!data.user) {
      console.error("getRole error: User not found for given token");
      res.status(403).json({ error: "User not found for given token" });
      return;
    }

    const userId = data.user.id;

    // Fetch the user's profile role using the authenticated client
    const { data: profile, error: profileError } = await supabaseUser
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error(
        "getRole error: Failed to fetch profile:",
        profileError.message
      );
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    if (!profile) {
      console.error("getRole error: Profile data missing");
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    res.status(200).json({ role: profile.role });
  } catch (err) {
    console.error("getRole server error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const changePassword: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
   const accessToken = req.cookies["access_token"];
    const { newPassword } = req.body;

    if (!accessToken || !newPassword) {
      // no token or no password, just return (or optionally call next with error)
      return;
    }

    const userSupabase = createUserSupabaseClient(accessToken);

    const { error } = await userSupabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      // handle error if you want (no response sent here as you requested)
      return;
    }

    // password updated successfully
  } catch (error) {
    // optionally log error, no response sent
  }
};


export const checkAuth: RequestHandler = (req : AuthenticatedRequest, res) => {
  //  const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
  if (!req.supabaseUser) {
     res.status(401).json({ authenticated: false });
     return
  }
  res.status(200).json({
    authenticated: true,
    user: req.supabaseUser,
  });
  return;
};