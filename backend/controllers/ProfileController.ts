import { Request, Response } from "express";
import { supabase } from "../../lib/supabase"; // ✅ Ensure correct path

export const createProfile = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert([req.body]);

    if (error) res.status(400).json({ error: error.message });

    res
      .status(201)
      .json({ message: "Profile created successfully", data });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get All Profiles
export const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("profiles").select("*");

    if (error) res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Single Profile
export const getProfileById = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(req.body)
      .eq("id", req.params.id);

    if (error) res.status(400).json({ error: error.message });

    res.json({ message: "Profile updated successfully", data });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete Profile
export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", req.params.id);

    if (error) res.status(400).json({ error: error.message });

    res.json({ message: "Profile deleted successfully", data });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
