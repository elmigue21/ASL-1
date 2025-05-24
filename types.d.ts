import { SupabaseClient, User } from "@supabase/supabase-js";
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      supabaseUser?: SupabaseClient;
      user?: User | null;
    }
  }
}

export {};