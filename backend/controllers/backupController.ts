import { Request, Response, RequestHandler } from "express";

import { SupabaseClient, User } from "@supabase/supabase-js";
// import { supabase } from "@/lib/supabase";
import { Subscription } from "@/types/subscription";

interface AuthenticatedRequest extends Request {
  supabaseUser?: SupabaseClient;
  user?: User | null;
}

export const getBackups: RequestHandler = async (req, res) => {
  try {
    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { data: backups, error } = await supabaseUser
      .from("backups_data")
      .select("*")
      .order("created_at", { ascending: false });;

    if (error) {
      // console.log("error", error);
      res.status(500).json({ error: error });
      return;
    }

    // For each backup row, check if file is corrupted
    const backupsWithStatus = await Promise.all(
      backups.map(async (backup) => {
        try {
          // Attempt to download the backup file by fileName or path stored in backup
          const { data: fileData, error: downloadError } =
            await supabaseUser.storage
              .from("backups")
              .download(backup.fileName); // Adjust if field name differs

          if (downloadError || !fileData) {
            // If download fails, mark corrupted
            return { ...backup, status: "corrupted" };
          }

          const text = await fileData.text();
          JSON.parse(text); // Try parsing JSON, throws if corrupted

          // If parse succeeds
          return { ...backup, status: "OK" };
        } catch (err) {
          // JSON parse error or other errors mark corrupted
          return { ...backup, status: "corrupted" };
        }
      })
    );

    res.json(backupsWithStatus);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
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

    // console.log("FETCHING ERROR?", error);
    // console.log(data);

    if (error) throw error;
    if (!data || data.length === 0) break; // Stop when no more rows

    allData = allData.concat(data);
    start += batchSize;
  }

  return allData;
}

export const backupBucket: RequestHandler = async (req, res) => {
  try {
    const tables = [
      "subscribers",
      "emails",
      "addresses",
      "companies",
      "phone_numbers",
      "industries",
      "occupations",
    ]; // Modify as needed
    let backupData: Record<string, Record<string, any>[]> = {};

    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      return;
    }
    // console.log('supabase user',supabaseUser)

    for (const table of tables) {
      backupData[table] = await fetchAllRows(table, supabaseUser);
    }
    // console.log('backup data',backupData);

    const backupJSON = JSON.stringify(backupData, null, 2);
    const fileSizeBytes = Buffer.byteLength(backupJSON, "utf8");
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

    if (uploadError) throw uploadError;

    const { data: publicData } = supabaseUser.storage
      .from("backups")
      .getPublicUrl(fileName);

    if (!publicData) {
      console.log(" NO FILE FOUND");
    }

    const publicURL = publicData.publicUrl;

    const { data: backupTableData, error: backupTableError } =
      await supabaseUser
        .from("backups_data")
        .insert([
          { url: publicURL, fileName: fileName, fileSize: fileSizeBytes },
        ]);

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
    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(403).json({ error: "Unauthorized: No user found" });
      return;
    }

    console.log("grab bucket backend");

    const backupName = req.query.backupName as string;
    if (!backupName) {
      console.error("NO BAKCUP NAME")
      console.error(backupName);
      res
        .status(400)
        .json({
          error: "Bad Request: 'backupName' query parameter is required",
        });
      return;
    }

    const { data: fileData, error: downloadError } = await supabaseUser.storage
      .from("backups")
      .download(backupName);

    if (downloadError) {
      console.error("Error downloading backup file:", downloadError.message);
      res
        .status(500)
        .json({
          error: "Failed to download backup file",
          details: downloadError.message,
        });
      return;
    }

    if (!fileData) {
      console.error("Backup file not found or empty.");
      res.status(404).json({ error: "Backup file not found" });
      return;
    }

    let backupData;
    try {
      const text = await fileData.text();
      backupData = JSON.parse(text);
    } catch (parseError) {
      console.error(
        "Failed to parse backup JSON:",
        (parseError as Error).message
      );
      res
        .status(500)
        .json({
          error: "Invalid backup file format",
          details: (parseError as Error).message,
        });
      return;
    }

    const transformSubscriptions = (backupData: any) => {
      // Grouping helper assumed to be defined elsewhere
      const groupedEmails = groupBySubscriberId(backupData.emails);
      const groupedAddresses = groupBySubscriberId(backupData.addresses);
      const groupedPhones = groupBySubscriberId(backupData.phone_numbers);
      const groupedCompanies = groupBySubscriberId(backupData.companies);
      const groupedOccupations = groupBySubscriberId(backupData.occupations);
      const groupedIndustries = groupBySubscriberId(backupData.industries);

      return backupData.subscribers.map((sub: any) => {
        const sid = sub.id;

        const addr = groupedAddresses[sid]?.[0] || {};
        const emails = groupedEmails[sid] || [];
        const phones = groupedPhones[sid] || [];
        const company = groupedCompanies[sid]?.[0] || {};
        const occupation = groupedOccupations[sid]?.[0]?.occupation || null;
        const industry = groupedIndustries[sid]?.[0]?.industry || null;

        return {
          first_name: sub.first_name || null,
          last_name: sub.last_name || null,
          person_facebook_url: sub.person_facebook_url || null,
          person_linkedin_url: sub.person_linkedin_url || null,
          created_on: sub.updated_from_linkedin || sub.created_on || null,
          phones: phones.map((p: any) => p.phone),
          emails: emails.map((e: any) => e.email),
          occupation,
          industry,
          company_name: company.name || null,
          company_website: company.website || null,
          company_linked_in_url: company.linked_in_url || null,
          address_country: addr.country || null,
          address_state: addr.state || null,
          address_city: addr.city || null,
        };
      });
    };

    const transformedSubscriptions = transformSubscriptions(backupData);

    const { data: insertData, error: insertError } = await supabaseUser.rpc(
      "backup_table",
      {
        subscriptions: transformedSubscriptions,
      }
    );

    if (insertError) {
      console.error("Error inserting backup data:", insertError.message);
      res
        .status(500)
        .json({
          error: "Failed to insert backup data",
          details: insertError.message,
        });
      return;
    }

    res.json({ data: backupData });
  } catch (error) {
    const err = error as Error;
    console.error("Grab backup failed:", err.message);
    res.status(500).json({ error: "Grab backup failed", details: err.message });
  }
};


function groupBySubscriberId(data: any[]) {
  return data.reduce((acc: Record<string, any[]>, item: any) => {
    const id = item.subscriber_id;
    if (!acc[id]) acc[id] = [];
    acc[id].push(item);
    return acc;
  }, {});
}

export const getReportsAndExcel: RequestHandler = async (req, res) => {
  try {
    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(403).json({ error: "unauthorized" });
      return;
    }
    const { data: excelData, error: excelError } = await supabaseUser
      .from("excels_data")
      .select("*")
      .order("created_at", { ascending: false });;

    if (excelError) throw excelError;

    // Fetch reports_data
    const { data: reportsData, error: reportsError } = await supabaseUser
      .from("reports_data")
      .select("*");

    if (reportsError) throw reportsError;

    // Merge both arrays

    const excelDataWithType = excelData.map((item) => ({
      ...item,
      attachType: "excel",
    }));

    const reportsDataWithType = reportsData.map((item) => ({
      ...item,
      attachType: "report",
    }));

    const merged = [...excelDataWithType, ...reportsDataWithType];

    //  const merged = [...excelData, ...reportsData];
    // console.log("REPORTS", reportsData);

    merged.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA; // descending
    });

    res.json({ merged });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: "Grab backup failed", details: err.message });
    return;
  }
};

export const deleteBackup: RequestHandler = async (req, res): Promise<void> => {
  try {
    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(401).json({ error: "Unauthorized from upload file" });
      return;
    }

    const { fileName, recordId } = req.body;
    // console.log("fileNAME", fileName);
    // console.log("id", recordId);

    if (!fileName || !recordId) {
      res.status(400).json({ error: "Missing required fields." });
      return;
    }

    const { error: storageError } = await supabaseUser.storage
      .from("backups")
      .remove([fileName]);
    if (storageError) {
      console.error("Error deleting file from storage:", storageError);
      res.status(500).json({ error: "Failed to delete file from storage." });
      return;
    }

    const { error: dbError } = await supabaseUser
      .from("backups_data")
      .delete()
      .eq("id", recordId);
    if (dbError) {
      console.error("Error deleting record from table:", dbError);
      res.status(500).json({ error: "Failed to delete record from table." });
      return;
    }

    res.json({ message: "File and record deleted successfully." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error." });
  }
};
