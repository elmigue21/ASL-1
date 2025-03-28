import { Request, Response } from "express";
import { supabase } from "../../lib/supabase"; // ✅ Ensure correct path


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
    const { data,count, error } = await supabase
      .rpc("count_countries");
      console.log('countries',data);

      console.log("Authorization Header:", req.headers.authorization); 

      const { data: user, error: error2 } = await supabase.auth.getUser();

if (error2) {
  console.error("Error fetching user:", error2);
} else {
  console.log("Current user:", user);

  
}

const { data: session, error: erro3 } = await supabase.auth.getSession();
console.log("Session Data:", session);


      res.status(200).json(data);
  } catch (e) {
    console.error(e);
  }
};
