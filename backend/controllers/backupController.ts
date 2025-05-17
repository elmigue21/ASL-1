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
    console.log(data);

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
      res.status(403).json({ error: "unauthorized" });
      return;
    }

    console.log("grab bucket backend");
    const backupName = req.query.backupName as string;


    const { data: fileData, error: downloadError } = await supabaseUser.storage
      .from("backups") // Your storage bucket
      .download(backupName); // Path to the file


    if (fileData) {
      const text = await fileData.text(); // Read it as text
      const backupData = JSON.parse(text);

      // console.log("Parsed backup data:", backupData);

const transformSubscriptions = (backupData: any) => {
  // Group by subscriber_id (foreign key pointing to subscriber.id)
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
// console.log(transformedSubscriptions)
// return;

      const {data: insertData,error: insertError } = await supabaseUser.rpc("backup_table", {
        subscriptions: transformedSubscriptions,
      });

      if(insertError){
        console.error("error inserting ")
      }

      console.log('insert data' , insertData);

      res.json({ data: backupData });
    }
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: "Grab backup failed", details: err.message });
    return;
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
       .select("*");

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
     console.log('REPORTS', reportsData);

    merged.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA; // descending
    });




      res.json({ merged});
    } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: "Grab backup failed", details: err.message });
    return;
  }
};


