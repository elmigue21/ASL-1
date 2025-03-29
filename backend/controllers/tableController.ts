import { Request, Response, RequestHandler } from "express";
import { supabase } from "../../lib/supabase"; // ✅ Ensure correct path

import { SupabaseClient, User } from "@supabase/supabase-js";

interface AuthenticatedRequest extends Request {
  supabaseUser?: SupabaseClient;
  user?: User | null;
}

// Create Subscription
export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .insert([req.body]);

    if (error) return res.status(400).json({ error: error.message });

    res
      .status(201)
      .json({ message: "Subscription created successfully", data });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get All Subscriptions
export const getAllSubscriptions : RequestHandler = async (req, res) => {

  try {

    
const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
if (!supabaseUser) {
  res.status(401).json({ error: "Unauthorized" });
  return;
}
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

let query = supabaseUser
  .from("subscribers")
  .select(
    `
    id,
    first_name,
    last_name,
    active_status,
    companies!inner(id,name),
    emails!inner (id, email),
    addresses!inner (id, state, city, country)
  `
  )
  .range(start, end);

    if(req.query.search){
      // console.log('LOGGING SEARCH')
      // console.log(req.query.search);
      query = query.or(
        `first_name.ilike.%${req.query.search}%,last_name.ilike.%${req.query.search}%`
      );
        // .or(`last_name.ilike.%${req.query.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      res.status(500).json({ error: error.message });
    }
    // console.log('ASDFASDFASDFADSF', data)

    res.json({
      data: data || [], // ✅ This is an array
      nextCursor: data && data.length === pageSize ? page + 1 : null, // ✅ Corrected check
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};



// Get Single Subscription
export const getSubscriptionById = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Subscription
export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .update(req.body)
      .eq("id", req.params.id);

    if (error) res.status(400).json({ error: error.message });

    res.json({ message: "Subscription updated successfully", data });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete Subscription
export const deleteSubscription = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .delete()
      .eq("id", req.params.id);

    if (error) res.status(400).json({ error: error.message });

    res.json({ message: "Subscription deleted successfully", data });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getActiveSubsCount = async (req: Request, res: Response) => {
  try {
    const { count, error } = await supabase
      .from("subscriptions")
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
    const { data, error, count } = await supabase
      .from("subscriptions")
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

export const getSubCount = async (req: Request, res: Response) => {
  try {
    const { data, error, count } = await supabase
      .from("subscriptions")
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

export const getCountryCount = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .rpc("get_unique_countries")

      res.status(200).json(data);
  } catch (e) {
    console.error(e);
  }
};
