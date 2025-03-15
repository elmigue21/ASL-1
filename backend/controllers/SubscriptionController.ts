import { Request, Response } from "express";
import { supabase } from "../../lib/supabase"; // ✅ Ensure correct path

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
export const getAllSubscriptions = async (req: Request, res: Response) => {
    console.log('getttt')
  try {
    console.log('qweqwe')
    const { data, error } = await supabase.from("subscriptions").select("*");

    if (error) res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
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
