import { Request, Response, RequestHandler } from "express";
import { supabase } from "../../lib/supabase"; // ✅ Ensure correct path

import { SupabaseClient, User } from "@supabase/supabase-js";

interface AuthenticatedRequest extends Request {
  supabaseUser?: SupabaseClient;
  user?: User | null;
}

export const getAllSubscriptions : RequestHandler = async (req, res) => {

  try {

    
const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
if (!supabaseUser) {
  res.status(401).json({ error: "Unauthorized" });
  return;
}
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

      // const page = parseInt(req.query.page) || 1; // Default to page 1
      // const limit = parseInt(req.query.limit) || 10;

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    console.log('PAGEE!!', page)

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
      query = query.or(
        `first_name.ilike.%${req.query.search}%,last_name.ilike.%${req.query.search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({
      data: data || [],
      nextCursor: data && data.length === pageSize ? page + 1 : null, 
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};


