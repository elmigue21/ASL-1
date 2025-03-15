import { Request, Response, Router, RequestHandler } from "express";
import {supabase} from "../../lib/supabase";

const router = Router();

export const getUsers: RequestHandler = async (req, res) => {
  const { data, error } = await supabase.from("subscriptions").select("*");

  if (error) {
    res.status(500).json({ error: error.message });
  }

res.json(data);
};




