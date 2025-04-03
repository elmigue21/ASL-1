import { Request, Response, RequestHandler } from "express";
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
export const getInactiveSubsCount = async (req: Request, res: Response) => {
  try {

        const supabaseUser = req.supabaseUser;
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

    const supabaseUser = req.supabaseUser;
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

const supabaseUser = req.supabaseUser;

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
    const supabaseUser = req.supabaseUser;

    if (!supabaseUser) {
      return;
    }

    const { data, count, error } = await supabaseUser.rpc('get_new_subs_week');

    res.status(200).json(data);
    return
  } catch (e) {
    console.error(e);
    res.status(500).json({message:"error getting new subscribers",details:e});
    return;
  }
};