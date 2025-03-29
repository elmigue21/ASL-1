
import { Request, Response, RequestHandler } from "express";
import { supabase } from "../../lib/supabase"; // ✅ Ensure correct path
import { createClient } from "@supabase/supabase-js";
import { SupabaseClient, User } from "@supabase/supabase-js";

interface AuthenticatedRequest extends Request {
  supabaseUser?: SupabaseClient;
  user?: User | null;
}

export const getActiveSubsCount = async (req: Request, res: Response) => {
  try {

        const supabaseUser = req.supabaseUser;
        if (!supabaseUser) {
          return;
        }
    const { count, error } = await supabase
      .from("subscribers")
      .select(undefined, { count: "exact" }) // Get only the count
      .eq("active_status", true);

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({ count }); // Return count in an object
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
};
export const getInactiveSubsCount = async (req: Request, res: Response) => {
  try {

        const supabaseUser = req.supabaseUser;
        if (!supabaseUser) {
          return;
        }

    const { data, error, count } = await supabase
      .from("subscribers")
      .select(undefined, { count: "exact" })
      .eq("active_status", false);

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json(count);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
};

export const getSubCount: RequestHandler = async (req, res) => {
  try {

    const supabaseUser = req.supabaseUser;
    if(!supabaseUser){
      return;
    }
    
    const { data, error, count } = await supabaseUser
      .from("subscribers")
      .select(undefined, { count: "exact" });

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json(count);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
};

export const getCountryCount :RequestHandler = async (req, res) => {
  try {

const supabaseUser = req.supabaseUser;
console.log('supabase user',supabaseUser);

if(!supabaseUser){
  return;
}

    const { data,count, error } = await supabaseUser
      .rpc("count_countries");


      res.status(200).json(data);
  } catch (e) {
    console.error(e);
  }
};
