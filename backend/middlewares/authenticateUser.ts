import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { Request, Response, NextFunction, RequestHandler } from "express";

declare global {
  namespace Express {
    interface Request {
      supabaseUser?: SupabaseClient;
      user?: User | null;
    }
  }
}

export const authenticateUser: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
       res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const supabaseUser = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data, error } = await supabaseUser.auth.getUser();
    const user = data?.user;

    if (error || !user) {
       res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.supabaseUser = supabaseUser; 
    req.user = user; 

    
    next(); 
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
