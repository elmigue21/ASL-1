import { Request, Response, RequestHandler } from "express";

import { SupabaseClient, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthenticatedRequest extends Request {
  supabaseUser?: SupabaseClient;
  user?: User | null;
}

// Get All Subscriptions
export const backupData: RequestHandler = async (req, res) => {
  try {
    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { data, error } = await supabaseUser.rpc("backup_data");

    if (error) {
      console.log("error", error);
      res.status(500).json({ error: error });
      return;
    }

    res.json(data);
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};

export const getBackup: RequestHandler = async (req, res) => {
  try {
    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { data, error } = await supabaseUser.from("backups_data").select("*");

    if (error) {
      console.log("error", error);
      res.status(500).json({ error: error });
      return;
    }

    res.json(data);
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    return;
  }
};

async function fetchAllRows(tableName: string, supabaseUser: SupabaseClient) {
  let allData: Record<string, any>[] = [];
  let start = 0;
  const batchSize = 1000;

  while (true) {
    const { data, error } = await supabaseUser
      .from(tableName)
      .select("*")
      .range(start, start + batchSize - 1);

    console.log("FETCHING ERROR?", error);

    if (error) throw error;
    if (!data || data.length === 0) break; // Stop when no more rows

    allData = allData.concat(data);
    start += batchSize;
  }

  return allData;
}

export const backupBucket: RequestHandler = async (req, res) => {
  try {
    const tables = ["subscribers","emails"]; // Modify as needed
    let backupData: Record<string, Record<string, any>[]> = {};

    const supabaseUser = req.supabaseUser;
    if (!supabaseUser) {
      return;
    }
    // console.log('supabase user',supabaseUser)

    for (const table of tables) {
      backupData[table] = await fetchAllRows(table, supabaseUser);
    }
    // console.log('backup data',backupData);

    const backupJSON = JSON.stringify(backupData, null, 2);
    const fileName = `backup_${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.json`;

    console.log(" backup jsoned");

    const { data: fileData, error: uploadError } = await supabaseUser.storage
      .from("backups")
      .upload(fileName, backupJSON, {
        cacheControl: "3600",
        upsert: true,
        contentType: "application/json",
      });

    console.log(" backup storage");
    console.log("UPLOAD ERROR?", uploadError);
    if (uploadError) throw uploadError;

    const { data: publicData } = supabaseUser.storage
      .from("backups")
      .getPublicUrl(fileName);

    if (!publicData) {
      console.log(" NO FILE FOUND");
    }

    const publicURL = publicData.publicUrl;

    const { data: backupTableData, error: backupTableError } =
      await supabaseUser.from("backups_data").insert([{ url: publicURL,fileName:fileName }]);
    console.log("backupTableData", backupTableData);
    console.log("backupTableError", backupTableError);

    res.json({ message: "Backup successful", fileUrl: fileData.path });
    return;
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: "Backup failed", details: err.message });
    return;
  }
};

export const grabBucket: RequestHandler = async (req, res) => {
  try {
    const supabaseUser = req.supabaseUser;
    if (!supabaseUser) {
      res.status(403).json({ error: "unauthorized" });
      return;
    }

    console.log('grab bucket backend')

    const { data: fileData, error: downloadError } = await supabaseUser.storage
      .from("backups") // Your storage bucket
      .download(
        "backup_2025-04-03T17-13-17-225Z.json"
      ); // Path to the file

      console.log('filedata,',fileData)
    if (fileData) {
      console.log('file data', fileData)
      const text = await fileData.text(); // Read it as text
      const backupData = JSON.parse(text).subscribers;

      console.log("Parsed backup data:", backupData);

      const { data: insertData, error: insertError } = await supabaseUser
        .from("subscribers_duplicate") // Your table name
        .upsert(backupData); // Insert or update (depending on your needs)

      if (insertError) {
        console.error("Error inserting data:", insertError);
      } else {
        console.log("Data inserted successfully:", insertData);
      }
    }
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: "Grab backup failed", details: err.message });
    return;
  }
};
