import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { Request, Response, NextFunction, RequestHandler } from "express";

// ✅ Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      supabaseUser?: SupabaseClient;
      user?: User | null; // ✅ Correctly typed Supabase user
    }
  }
}

// ✅ Correct TypeScript typing for Express middleware
export const authenticateUser: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
       res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // ✅ Create Supabase client with the user's token
    const supabaseUser = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    // ✅ Verify the token with Supabase
    const { data, error } = await supabaseUser.auth.getUser();
    const user = data?.user;

    if (error || !user) {
       res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
// console.log('supabase userr',supabaseUser);
    req.supabaseUser = supabaseUser; // ✅ Store client for use in routes
    req.user = user; // ✅ Store authenticated user

    next(); // ✅ Continue to next middleware
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
