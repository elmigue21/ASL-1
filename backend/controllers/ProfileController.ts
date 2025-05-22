import { Request, Response } from "express";
import { SupabaseClient } from "@supabase/supabase-js";
import { User } from "@supabase/supabase-js";
interface AuthenticatedRequest extends Request {
  supabaseUser?: SupabaseClient;
  user?: User | null;
}



import supabaseAdmin from "../utils/supabaseAdmin"; // Adjust path

import { createClient } from "@supabase/supabase-js";


// export const changeEmail = async (req: Request, res: Response) => {
//   const newEmail = req.body.newEmail;
//   const token = req.cookies?.access_token;

//   if (!token) {
//     res.status(401).json({ error: "Unauthorized: No token provided" });
//     return;
//   }

//   if (!newEmail) {
//     res.status(400).json({ error: "New email is required" });
//     return;
//   }

//   const supabaseUrl = process.env.SUPABASE_URL!;
//   const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

//   if (!supabaseUrl || !supabaseAnonKey) {
//     console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY env variables");
//     res.status(500).json({ error: "Server configuration error" });
//     return;
//   }

//   // Create Supabase client with the user's access token as Bearer authorization
//   const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
//     global: {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     },
//   });

//   try {
//     const { data, error } = await supabaseUser.auth.updateUser({
//       email: newEmail,
//     });

//     if (error) {
//       console.error("Email update failed:", error.message);
//       res.status(400).json({ error: error.message });
//       return;
//     }

//     res.status(200).json({
//       message: "Email updated successfully. Confirmation sent to new address.",
//       data,
//     });
//   } catch (err) {
//     console.error("Unexpected error:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };





export const changeProfilePicture = async (req: AuthenticatedRequest, res: Response) => {

    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
  if (!supabaseUser) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
    if (!req.user) {
    res.status(401).json({ error: "no req.user" });
    return;
  }

  const file = (req as any).file;
  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  try {
    const userId = req.user.id;
    const filename = `${userId}`;

    const { error: uploadError } = await supabaseUser.storage
      .from("pfp")
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });
    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      res.status(500).json({ error: "Failed to upload image" });
      return;
    }
    const { data: pfpData } = supabaseUser.storage
      .from("pfp")
      .getPublicUrl(filename);
    const publicURL = pfpData.publicUrl;
    const { data: profileData, error: dbError } = await supabaseUser
      .from("profiles")
      .update({ profile_picture: publicURL })
      .eq("id", userId)
      .select("*");
    console.log("profile data", profileData);

    if (dbError) {
      console.error("DB update error:", dbError.message);
      res.status(500).json({ error: "Failed to update profile picture" });
      return;
    }

    res
      .status(201)
      .json({ message: "Profile picture updated", url: publicURL });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const changeName = async (req: AuthenticatedRequest, res: Response) => {
  console.log("🔧 changeName endpoint hit");

  const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
  if (!supabaseUser) {
    console.warn("⚠️ Supabase user not found in request");
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!req.user) {
    console.warn("⚠️ req.user missing");
    res.status(401).json({ error: "no req.user" });
    return;
  }

  const { first_name, last_name } = req.body;
  console.log("📥 Request body:", { first_name, last_name });

  if (!first_name || !last_name) {
    console.warn("⚠️ Missing first_name or last_name");
    res.status(400).json({ error: "First name and last name are required" });
    return;
  }

  try {
    const userId = req.user.id;
    console.log("👤 Authenticated user ID:", userId);

    console.log("📝 Attempting to update profile in Supabase...");
    const { data: profileData, error: dbError } = await supabaseUser
      .from("profiles")
      .update({ first_name, last_name })
      .eq("id", userId)
      .select("*");

    if (dbError) {
      console.error("❌ DB update error:", dbError.message);
      res.status(500).json({ error: "Failed to update name" });
      return;
    }

    console.log("✅ Profile update successful:", profileData);
    res.status(200).json({ message: "Name updated", profile: profileData });
    return;
  } catch (err) {
    console.error("🔥 Internal server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};


