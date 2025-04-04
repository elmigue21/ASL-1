import { Request, Response, RequestHandler } from "express";
import { supabase } from "../../lib/supabase"; // ✅ Ensure correct path

import { SupabaseClient, User } from "@supabase/supabase-js";

interface AuthenticatedRequest extends Request {
  supabaseUser?: SupabaseClient;
  user?: User | null;
}

// Get All Subscriptions
export const backupData: RequestHandler = async (req, res) => {
  try {
    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const {data,error} = await supabaseUser.rpc('backup_data');


    if(error){
        console.log('error', error);
        res.status(500).json({error:error})
        return;
    }

   res.json(data);
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};

export const getBackup: RequestHandler = async (req, res) => {
  try {
    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { data, error } = await supabaseUser.rpc("get_backups");

    if (error) {
      console.log("error", error);
      res.status(500).json({ error: error });
      return;
    }

    res.json(data);
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};
