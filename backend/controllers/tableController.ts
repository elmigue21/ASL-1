import { Request, Response, RequestHandler } from "express";
// import { supabase } from "../../lib/supabase"; // ✅ Ensure correct path

import { SupabaseClient, User } from "@supabase/supabase-js";

interface AuthenticatedRequest extends Request {
  supabaseUser?: SupabaseClient;
  user?: User | null;
}

export const getAllSubscriptions: RequestHandler = async (req, res) => {

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

    // 🟡 Build base query (no range yet) for count
    let baseQuery = supabaseUser.from("subscribers").select(
      `
        id,
        first_name,
        last_name,
        active_status,
        verified_status,
        archived_status,
        companies(id, name),
        emails(id, email),
        addresses(id, state, city, country)
      `,
      { count: "exact" }
    );

    // 🔍 Search filter
    if (req.query.search) {
      const search = req.query.search as string;
      baseQuery = baseQuery.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%`
      );
    }
    // ✅ Status filters
    console.log()
        if (req.query.archive !== "true") {
      console.log("ARCHIVE TRUE")
      baseQuery = baseQuery.eq("active_status", true);
    }
    if (req.query.verified === "true") {
      baseQuery = baseQuery.eq("verified_status", true);
    }

    // ✅ Status filters
    /*     const statusFilters: string[] = [];

    if (req.query.verified === "true")
      statusFilters.push("verified_status.eq.true");
    if (req.query.archived === "true")
      statusFilters.push("archived_status.eq.true");
    if (req.query.active === "true")
      statusFilters.push("active_status.eq.true");

    if (statusFilters.length > 0) {
      baseQuery = baseQuery.or(statusFilters.join(","));
    }
 */

    // 📦 Clone query for count before adding .range()
    const {
      data: fullData,
      count,
      error: countError,
    } = await baseQuery.range(start, end);

    if (countError) {
      console.error(countError);
      res.status(500).json({ error: countError.message });
      return;
    }

    res.json({
      data: fullData,
      total: count,
      page,
      pageSize,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};


export const getTableCount : RequestHandler = async (req, res) => {
  try {
    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { data, error } = await supabaseUser
      .from("subscribers")
      .select("*", { count: "exact" });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ count: data?.length || 0 });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
}
export const archiveSubscriber: RequestHandler = async (req, res) => {
  try {
    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const id = req.query.id as string;
    if (!id) {
      res.status(400).json({ error: "No subscriber ID provided" });
      return;
    }

    // Fetch current active_status of the subscriber
    const { data: subscriber, error: fetchError } = await supabaseUser
      .from("subscribers")
      .select("active_status")
      .eq("id", id)
      .single();

    if (fetchError) {
      res.status(500).json({ error: fetchError.message });
      return;
    }

    if (!subscriber) {
      res.status(404).json({ error: "Subscriber not found" });
      return;
    }

    // Toggle active_status
    const newStatus = !subscriber.active_status;

    const { error: updateError } = await supabaseUser
      .from("subscribers")
      .update({ active_status: newStatus })
      .eq("id", id);

    if (updateError) {
      res.status(500).json({ error: updateError.message });
      return;
    }

    res
      .status(200)
      .json({
        message: "Subscriber active_status toggled successfully",
        active_status: newStatus,
      });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: (e as Error).message });
  }
};


