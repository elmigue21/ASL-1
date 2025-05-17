
import { Request, Response, RequestHandler } from "express";

import { SupabaseClient, User } from "@supabase/supabase-js";
// import { supabase } from "../../lib/supabase"; // ✅ Ensure correct path
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl,supabaseKey);

export const getCountries: RequestHandler = async (req, res) => {

 const supabase = createClient(supabaseUrl, supabaseKey);
  // Query countries table
  const { data, error } = await supabase.from("countries").select("*");

  if (error) {
    console.error("Supabase error:", error);
    res.status(500).json({ error: error.message });
    return;
  }

   res.json({ countries: data });
   return;
};