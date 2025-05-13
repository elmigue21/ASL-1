import { Request, Response, RequestHandler } from "express";
import { SupabaseClient, User } from "@supabase/supabase-js";

interface AuthenticatedRequest extends Request {
  supabaseUser?: SupabaseClient;
  user?: User | null;
}

export const getActiveSubsCount : RequestHandler = async (req, res) => {
  try {

        const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
        if (!supabaseUser) {
          return;
        }
    const { data,count, error } = await supabaseUser
      .from("subscribers")
      .select(undefined, { count: "exact" }) 
      .eq("active_status", true);

    if (error) {
      res
        .status(500)
        .json({ message: "error getting active subs", details: error });
      return;
    }



    res.status(200).json({ count }); 

    return
  } catch (e) {
    res
      .status(500)
      .json({ message: "error getting active subs", details: e });
    return;
  }
};
export const getInactiveSubsCount : RequestHandler = async (req, res) => {
  try {

        const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
        if (!supabaseUser) {
          return;
        }

    const { data, error, count } = await supabaseUser
      .from("subscribers")
      .select(undefined, { count: "exact" })
      .eq("active_status", false);

    if (error) {
     res
        .status(500)
        .json({ message: "error getting inactive subs", details: error });
        return;
    }

    res.status(200).json(count);
    return
  } catch (e) {
    res
      .status(500)
      .json({ message: "error getting inactive subs", details: e });
    return;
  }
};

export const getSubCount: RequestHandler = async (req, res) => {
  try {

    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if(!supabaseUser){
      return;
    }
    
    const { data, error, count } = await supabaseUser
      .from("subscribers")
      .select(undefined, { count: "exact" });

    if (error) {
      res
        .status(500)
        .json({ message: "error getting sub count", details: error });
      return;
    }

    res.status(200).json(count);
    return
  } catch (e) {
    res
      .status(500)
      .json({ message: "error getting country count", details: e });
    return;
  }
};

export const getCountryCount :RequestHandler = async (req, res) => {
  try {

const supabaseUser = (req as AuthenticatedRequest).supabaseUser;

if(!supabaseUser){
  return;
}

    const { data,count, error } = await supabaseUser
      .rpc("count_countries");


      res.status(200).json(data);
      return
  } catch (e) {
    console.error(e);
      res
        .status(500)
        .json({ message: "error getting country count", details: e });
        return;
  }
};

export const getNewSubscribers: RequestHandler = async (req, res) => {
  try {
    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    const range = (req.query.dateRange as "7d" | "1m" | "6m" | "1y") || "7d";
    console.log(range);

    if (!supabaseUser) {
      res.status(401).json({ message: "User not authenticated" });
      return;8
    }

    const now = new Date();
    const from = getFromDate(range);
    const groupBy = range === "6m" || range === "1y" ? "month" : "day";
    const formatStr = groupBy === "day" ? "YYYY-MM-DD" : "YYYY-MM";

    console.log("from", from);

    // Refactored Query with Group By
    // const { data, error } = await supabaseUser
    //   .from("subscribers")
    //   .select(`count(*), to_char(created_on, '${formatStr}') as date`)
    //   .gte("created_on", from.toISOString())
    //   .lte("created_on", now.toISOString())
    //   .group("date") // Group by the formatted date
    //   .order("date");
    const { data, error } = await supabaseUser.rpc("get_new_subscribers_by_range", {
      range: range, // This will fall back to 7 days as default
    });


    console.log("new subs data", data);
    console.log("error", error);

    if (error) {
      res.status(500).json({ message: "Error fetching new subscribers", details: error });
      return;
    }

    res.status(200).json(data);
    return;
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error getting new subscribers", details: e });
    return;
  }
};

function getFromDate(range: "7d" | "1m" | "6m" | "1y"): Date {
  const now = new Date();
  const from = new Date(now);

  switch (range) {
    case "7d":
      from.setDate(now.getDate() - 6);
      break;
    case "1m":
      from.setMonth(now.getMonth() - 1);
      break;
    case "6m":
      from.setMonth(now.getMonth() - 6);
      break;
    case "1y":
      from.setFullYear(now.getFullYear() - 1);
      break;
  }

  return from;
}