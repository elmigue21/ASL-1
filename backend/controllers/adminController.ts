import { Request, Response, RequestHandler } from "express";

import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
// import { supabase } from "../../lib/supabase"; // ✅ Ensure correct path
import cookie from "cookie";

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if(!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey){
  throw new Error("environment variables missing")
}


interface AuthenticatedRequest extends Request {
  supabaseUser?: SupabaseClient;
  user?: User | null;
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
// function createUserSupabaseClient(accessToken: string) {
//   if (!supabaseUrl || !supabaseAnonKey) {
//     throw new Error("environment variables missing");
//   }
//   return createClient(supabaseUrl, supabaseAnonKey, {
//     global: {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     },
//   });
// }

export const getEmployees = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

        const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    console.log("GET EMPLOYEES BACKEND")
    const { data, error } = await supabaseUser.from("profiles").select("*");

    if (error) {
      console.error("Supabase error:", error);
      res.status(500).json({ error: "Failed to fetch employees." });
      return;
    }
    console.log("employeeessss", data);

    res.status(200).json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Internal server error." });
    return;
  }
};
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { userId } = req.query as { userId: string };
    if (!userId) {
      res.status(400).json({ error: "Missing userId query parameter" });
      return;
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Step 1: Delete profile and any foreign-key-dependent records
    const { error: deleteProfileError } = await adminClient
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (deleteProfileError) {
      console.error("Failed to delete profile:", deleteProfileError);
      res.status(500).json({ error: "Failed to delete user profile." });
      return;
    }

    // Step 2: Now delete the Supabase Auth user
    const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(
      userId
    );

    if (authDeleteError) {
      console.error("Failed to delete auth user:", authDeleteError);
      res.status(500).json({ error: "Failed to delete auth user." });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};




