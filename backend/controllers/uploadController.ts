import { Request, Response, RequestHandler } from "express";

import { SupabaseClient, User } from "@supabase/supabase-js";
// import { supabase } from "../../lib/supabase";
import multer from "multer";
import xlsx from "xlsx";
import { stat } from "fs";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import path from "path";
import fs from "fs";
const logoPath = path.join(__dirname, "../../public/img/dempaLogoTxt.png");
const logoBuffer = fs.readFileSync(logoPath);
// import PDFDocument from './../../node_modules/pdfkit/js/pdfkit.esnext';
// import { downloadFile } from './downloadController';
// import { ChartConfiguration, ChartTypeRegistry } from 'chart.js';

interface AuthenticatedRequest extends Request {
  supabaseUser?: SupabaseClient;
  user?: User | null;
}

type ParsedPhone = {
  countryCode: string | null;
  number: string | null;
  original: string;
};

type ExcelData = {
  phone1: string;
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

    if (error) throw error;
    if (!data || data.length === 0) break; // Stop when no more rows

    allData = allData.concat(data);
    start += batchSize;
  }

  return allData;
}
// function parsePhoneNumber(rawPhone: string): ParsedPhone {
//   // Normalize the number: replace "00" with "+"
//   const original = rawPhone.trim();
//   rawPhone = rawPhone.replace(/^00/, "+");

//   // Remove all non-numeric characters except for "+" and spaces
//   const cleaned = rawPhone.replace(/[^\d+ ]/g, "");

//   // Match a country code (1 to 3 digits), followed by a space, and then exactly 9 digits for the number
//   const match = cleaned.match(/^(\+?\d{1,3})\s*(\d{9})$/); // Country code (1-3 digits), followed by local number (9 digits)

//   if (!match) {
//     return {
//       countryCode: null,
//       number: null,
//       original,
//     };
//   }

//   const [, countryCode, number] = match;
//   return {
//     countryCode: countryCode.replace("+", ""), // Remove '+' from the country code
//     number,
//     original,
//   };
// }

export const insertUpload: RequestHandler = async (req, res): Promise<void> => {
  const supabaseUser = (req as AuthenticatedRequest).supabaseUser;

  if (!supabaseUser) {
    res.status(401).json({ error: "Unauthorized from upload file" });
    return;
  }

  try {
    const { subscriptions } = req.body;

    console.log(`Received ${subscriptions.length} subscriptions`);

    // Fetch existing emails to filter duplicates
    const emails = await fetchAllRows("emails", supabaseUser);

    const existingEmails = new Set(
      emails.map((row: any) =>
        typeof row.email === "string" ? row.email.trim().toLowerCase() : ""
      )
    );

    // Helper to normalize emails
    const normalizeEmail = (val: any) =>
      typeof val === "string" ? val.trim().toLowerCase() : "";

    // Track filtered out duplicates with reason
    const filteredOutRows: any[] = [];

    // Filter out duplicates based on emails only
    const nonDuplicateRows = subscriptions.filter((row: any) => {
      const email1 = normalizeEmail(row.email1);
      const email2 = normalizeEmail(row.email2);

      // Reject if neither email1 nor email2 exists
      if (!email1 && !email2) {
        filteredOutRows.push({ ...row, reason: "Missing both emails" });
        console.log("Filtered out due to missing both emails:", row);
        return false;
      }

      // Check if either email already exists
      const isDuplicate =
        (email1 && existingEmails.has(email1)) ||
        (email2 && existingEmails.has(email2));

      if (isDuplicate) {
        filteredOutRows.push({ ...row, reason: "Email already exists" });
        console.log("Filtered out duplicate due to existing email:", {
          email1,
          email2,
          row,
        });
      }

      return !isDuplicate;
    });

    // Clean duplicates inside each row (if email1 === email2, clear email2)
    const cleanedRows = nonDuplicateRows.map((row: any) => {
      const email1 = normalizeEmail(row.email1);
      const email2 = normalizeEmail(row.email2);

      if (email1 && email2 && email1 === email2) {
        row.email2 = null;
      }
      return row;
    });

    // Transform rows before insertion
    const transformedSubscriptions = cleanedRows.map(transformRow);

    // Insert valid subscriptions via RPC
    const { data: insertData, error: insertError } = await supabaseUser.rpc(
      "insert_subscriptions",
      { subscriptions: transformedSubscriptions }
    );

    if (insertError) {
      console.error(`Insert RPC error`, insertError);
      res
        .status(500)
        .json({ error: "Insert RPC failed", details: insertError.message });
      return;
    }

    // Return success with inserted count and invalid subscriptions + reasons
    res.status(200).json({
      message: "Insert completed",
      insertedCount: Array.isArray(insertData) ? insertData.length : insertData,
      invalidSubscriptions: filteredOutRows,
    });
    return;
  } catch (e) {
    console.error("Unexpected error in insertUpload:", e);
    res
      .status(500)
      .json({ error: "Unexpected error", details: (e as Error).message });
      return;
  }
};

function transformRow(row: any) {
  return {
    first_name: row.first_name,
    last_name: row.last_name,
    active_status: row.active_status || null,
    emails: [row.email1, row.email2].filter(
      (email) => email && email.trim() !== ""
    ),
    phones: [row.phone1, row.phone2].filter(
      (phone) => phone && phone.trim() !== ""
    ),

    address_city: row.city,
    address_state: row.state,
    address_country: row.country,
    person_facebook_url: row.person_facebook_url,
    person_linkedin_url: row.person_linkedin_url,
    industry: row.industry,
    occupation: row.occupation,
    company_name: row.company,
    company_website: row.company_website,
    company_linkedin: row.company_linked_in || row.company_linkedin || "",
    created_on: row.created_on,
  };
}



export const exportToExcel: RequestHandler = async (req, res) => {
  const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
  if (!supabaseUser) {
    res.status(401).json({ error: "Unauthorized from upload file" });
    return;
  }
  const workbook = xlsx.utils.book_new();

  try {
    const tables = [
      "addresses",
      "companies",
      "emails",
      "industries",
      "occupations",
      "phone_numbers",
      "subscribers",
    ];
    for (const table of tables) {
      const data = await fetchAllRows(table, supabaseUser);
      const worksheet = xlsx.utils.json_to_sheet(data);
      xlsx.utils.book_append_sheet(workbook, worksheet, table);
    }
    const buffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    const now = new Date();
    const datePart = now.toISOString().split("T")[0]; // e.g., "2025-05-04"
    const timePart = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // e.g., "14-30-05"
    const fileName = `excel-export-${datePart}_${timePart}.xlsx`;
    const fileSizeBytes = Buffer.byteLength(buffer, "utf8");
    const { data: fileData, error: uploadError } = await supabaseUser.storage
      .from("excels")
      .upload(fileName, buffer, {
        cacheControl: "3600",
        upsert: true,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

    if (uploadError) {
      console.error(uploadError);
    }

    const { data: publicData } = supabaseUser.storage
      .from("excels")
      .getPublicUrl(fileName);

    if (!publicData) {
      console.log(" NO FILE FOUND");
    }

    const publicURL = publicData.publicUrl;

    const { data: excelTableData, error: excelTableError } = await supabaseUser
      .from("excels_data")
      .insert([
        {
          url: publicURL,
          fileName: fileName,
          fileSize: fileSizeBytes,
        },
      ]);

    if (excelTableError) {
      console.error(excelTableError);
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    res.send(buffer) /* .json({fileName}) */;
    return;
  } catch (e) {
    console.error(e);
    return;
  }
};

export const uploadFile: RequestHandler = async (req, res) => {
  try {

    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(401).json({ error: "Unauthorized from upload file" });
      return;
    }

    const file = req.file;


    if (!file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    const workbook = xlsx.read(file.buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];

    const data: ExcelData[] = xlsx.utils.sheet_to_json(sheet);

    const emails = await fetchAllRows("emails", supabaseUser);

    const phones = await fetchAllRows("phone_numbers", supabaseUser);

    const existingEmails = new Set(
      emails.map((row: any) => row.email.toLowerCase())
    );

    const existingPhones = new Set(phones.map((row: any) => row.phone));

    const nonDuplicateRows = data
      .filter((row: any) => {
        const email1 = String(row.email1).toLowerCase();
        const email2 = String(row.email2).toLowerCase();
        const phone1 = String(row.phone1);
        const phone2 = String(row.phone2);

        return (
          !existingEmails.has(email1) &&
          !existingEmails.has(email2) &&
          !existingPhones.has(phone1) &&
          !existingPhones.has(phone2)
        );
      })
      .map((row: any) => {
        const email1 = String(row.email1).toLowerCase();
        const email2 = String(row.email2).toLowerCase();

        // If both emails are the same, keep email1 and set email2 to null
        if (email1 === email2) {
          return { ...row, email2: null };
        }

        if (row.phone1 === row.phone2) {
          return { ...row, phone2: null };
        }

        return row;
      });

    const transformedRows = nonDuplicateRows.map((row: any) => ({
      ...row,
      emails: [row.email1, row.email2].filter(Boolean), // removes null/undefined/empty
      phones: [row.phone1, row.phone2].filter(Boolean),
    }));

    const subscriptions = transformedRows.map((row) => {
      // Create a new object with transformed keys
      return {
        first_name: row.first_name,
        last_name: row.last_name,
        active_status: row.active_status,
        emails: row.emails,
        phones: row.phones,

        city: row.city,
        state: row.state,
        country: row.country,
        person_facebook_url: row.person_facebook_url,
        person_linkedin_url: row.person_linkedin_url,
        industry: row.industry,
        occupation: row.occupation,
        company: row.company,
        company_website: row.company_website,
        company_linkedin: row.company_linkedin,
        created_on: row.created_on,
      };
    });

    const { data: insertData, error: insertError } = await supabaseUser.rpc(
      "insert_subscriptions",
      {
        subscriptions: subscriptions,
      }
    );

    if (insertError) {
      console.error("Insert Error:", insertError);
      res.status(500).json({ error: insertError.message });
      return;
    }

    res.json({ insertData, insertError });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

const labels = [
  "2025-05-01",
  "2025-05-02",
  "2025-05-03",
  "2025-05-04",
  "2025-05-05",
  "2025-05-06",
  "2025-05-07",
];

const data = [100, 124, 150, 189, 200, 215, 230];

// import { RequestHandler } from "express";
// import PDFDocument from "pdfkit";
// import { PassThrough } from "stream";
// import { ChartJSNodeCanvas } from "chartjs-node-canvas";
// import { writeText, writeImage } from "../utils/pdfUtils"; // adjust import paths as needed

const generateCountryRows = (
  doc: PDFKit.PDFDocument,
  countryData: any[],
  startX: number,
  startY: number
): number => {
  // Aggregate active/inactive counts by country
  const summary: Record<string, { active: number; inactive: number }> = {};

  countryData.forEach((subscriber) => {
    const country = subscriber.addresses?.country || "Unknown";

    if (!summary[country]) {
      summary[country] = { active: 0, inactive: 0 };
    }

    if (subscriber.active_status) {
      summary[country].active += 1;
    } else {
      summary[country].inactive += 1;
    }
  });

  const summaryRows = Object.entries(summary).map(([country, counts]) => ({
    country,
    active: counts.active,
    inactive: counts.inactive,
  }));

  const rowHeight = 20;
  const colWidths = [200, 100, 100];
  const headers = ["Country", "Active", "Inactive"];

  let y = startY;

  // Title
  doc.moveDown(1);
  doc
    .fontSize(12)
    .text("Subscriber Status by Country", startX, y, { underline: true });
  y += 20;

  // Header row
  doc
    .rect(
      startX,
      y,
      colWidths.reduce((a, b) => a + b, 0),
      rowHeight
    )
    .fillAndStroke("#eeeeee", "black");
  doc.fillColor("black").font("Helvetica-Bold").fontSize(10);

  let x = startX;
  headers.forEach((header, i) => {
    doc.text(header, x + 5, y + 5, { width: colWidths[i] - 10, align: "left" });
    x += colWidths[i];
  });

  y += rowHeight;
  doc
    .moveTo(startX, y)
    .lineTo(startX + colWidths.reduce((a, b) => a + b, 0), y)
    .stroke();

  doc.font("Helvetica").fontSize(9);

  // Data rows with alternate shading
  summaryRows.forEach((row, i) => {
    x = startX;

    if (i % 2 === 0) {
      doc
        .rect(
          x,
          y,
          colWidths.reduce((a, b) => a + b, 0),
          rowHeight
        )
        .fillAndStroke("#f9f9f9", "black");
      doc.fillColor("black");
    }

    doc.text(row.country, x + 5, y + 5, {
      width: colWidths[0] - 10,
      align: "left",
    });
    x += colWidths[0];
    doc.text(row.active.toString(), x + 5, y + 5, {
      width: colWidths[1] - 10,
      align: "left",
    });
    x += colWidths[1];
    doc.text(row.inactive.toString(), x + 5, y + 5, {
      width: colWidths[2] - 10,
      align: "left",
    });
    x += colWidths[2];

    y += rowHeight;
  });

  // Bottom border
  doc
    .moveTo(startX, y)
    .lineTo(startX + colWidths.reduce((a, b) => a + b, 0), y)
    .stroke();

  // Vertical lines for the whole table
  x = startX;
  for (let i = 0; i <= headers.length; i++) {
    doc
      .moveTo(x, y - rowHeight * (summaryRows.length + 1))
      .lineTo(x, y)
      .stroke();
    if (i < headers.length) x += colWidths[i];
  }

  return y + 10; // Return new y position after table + some padding
};
const drawSubscriberTable = (
  doc: PDFKit.PDFDocument,
  data: any[],
  startX: number,
  startY: number
): number => {
  const headers = [
    "ID",
    "First Name",
    "Last Name",
    "Country",
    "Occupation",
    "Industry",
    "Active",
    "Verified",
    "Created On",
  ];
  const colWidths = [30, 60, 60, 70, 70, 70, 40, 40, 72];
  const rowHeight = 16;

  let y = startY;

  // Draw header row
  doc
    .rect(
      startX,
      y,
      colWidths.reduce((a, b) => a + b, 0),
      rowHeight
    )
    .fillAndStroke("#eeeeee", "black");
  doc.fillColor("black").font("Helvetica-Bold");

  let x = startX;
  headers.forEach((header, i) => {
    doc.fontSize(8).text(header, x + 2, y + 4, {
      width: colWidths[i] - 4,
      align: "left",
    });
    x += colWidths[i];
  });

  // Draw horizontal line below header
  doc
    .moveTo(startX, y + rowHeight)
    .lineTo(startX + colWidths.reduce((a, b) => a + b, 0), y + rowHeight)
    .stroke();

  // Draw vertical lines for header
  x = startX;
  for (let i = 0; i <= headers.length; i++) {
    doc
      .moveTo(x, y)
      .lineTo(x, y + rowHeight + (data?.length || 0) * rowHeight)
      .stroke();
    if (i < headers.length) x += colWidths[i];
  }

  doc.font("Helvetica");

  // Draw data rows
  data?.forEach((subscriber, rowIndex) => {
    const rowY = y + rowHeight + rowIndex * rowHeight;

    if (rowIndex % 2 === 0) {
      doc
        .rect(
          startX,
          rowY,
          colWidths.reduce((a, b) => a + b, 0),
          rowHeight
        )
        .fillAndStroke("#f9f9f9", "black");
      doc.fillColor("black");
    }

    x = startX;
    const rowValues = [
      subscriber.id?.toString() || "",
      subscriber.first_name || "-",
      subscriber.last_name || "-",
      subscriber.addresses?.country || "-",
      subscriber.occupations?.occupation || "-",
      subscriber.industries?.industry || "-",
      subscriber.active_status ? "Yes" : "No",
      subscriber.verified_status ? "Yes" : "No",
      subscriber.created_on
        ? new Date(subscriber.created_on).toLocaleDateString()
        : "-",
    ];

    rowValues.forEach((text, i) => {
      doc.fontSize(7).text(text, x + 2, rowY + 4, {
        width: colWidths[i] - 4,
        align: "left",
      });
      x += colWidths[i];
    });
  });

  const tableBottomY = y + rowHeight + (data?.length || 0) * rowHeight;

  // Draw bottom border
  doc
    .moveTo(startX, tableBottomY)
    .lineTo(startX + colWidths.reduce((a, b) => a + b, 0), tableBottomY)
    .stroke();

  // Draw vertical lines after rows
  x = startX;
  for (let i = 0; i <= headers.length; i++) {
    doc
      .moveTo(x, y + rowHeight)
      .lineTo(x, tableBottomY)
      .stroke();
    if (i < headers.length) x += colWidths[i];
  }

  return tableBottomY + 10; // return the y position after the table plus padding
};


export const generatePdf: RequestHandler = async (req, res) => {
  const supabaseUser = (req as any).supabaseUser;
  if (!supabaseUser) {
     res.status(401).json({ error: "Unauthorized from upload file" });
     return;
  }

  try {
    const doc = new PDFDocument({ margin: 50 });

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data, error } = await supabaseUser
      .from("subscribers")
      .select(
        `
        id,
        first_name,
        last_name,
        active_status,
        verified_status,
        created_on,
        addresses (country),
        occupations(occupation),
        industries(industry)
      `
      )
      .gte("created_on", oneWeekAgo.toISOString());

    if (error) {
      console.error("Supabase query error:", error);
       res.status(500).json({ error: "Failed to fetch subscribers" });
       return;
    }

    writeImage(doc, logoBuffer, 90);
    // Title
    doc.moveDown(2);
    doc.fontSize(12).text("Subscribers This Week", { underline: true });

let y = doc.y + 10;
const startX = 50;
const tableBottomY = drawSubscriberTable(doc, data, startX, y);

    const { data:countryData, error:countryError } = await supabaseUser.from("subscribers").select(`
    active_status,
    addresses (
      country
    )
  `);

  if (countryError) {
    console.error("Supabase country data error:", countryError);
  } else if (countryData) {
    const newY = generateCountryRows(doc, countryData, 50, tableBottomY + 20);

  }






    doc.moveDown(2);
    doc.fontSize(8).text("Generated on: " + new Date().toLocaleString(), {
      align: "center",
    });

    // Stream PDF
    const bufferChunks: Buffer[] = [];
    const stream = new PassThrough();
    doc.pipe(stream);
    stream.on("data", (chunk) => bufferChunks.push(chunk));
    stream.on("end", async () => {
      const buffer = Buffer.concat(bufferChunks);
      const now = new Date();
      const fileName = `data-report-${now.toISOString().split("T")[0]}_${now
        .toTimeString()
        .split(" ")[0]
        .replace(/:/g, "-")}.pdf`;

      const fileSizeBytes = Buffer.byteLength(buffer);
      const { data: fileData, error: uploadError } = await supabaseUser.storage
        .from("reports")
        .upload(fileName, buffer, {
          cacheControl: "3600",
          upsert: true,
          contentType: "application/pdf",
        });

      if (uploadError) {
        console.error(uploadError);
         res.status(500).json({ error: "Upload failed" });
         return;
      }

      const { data: publicData } = supabaseUser.storage
        .from("reports")
        .getPublicUrl(fileName);

      const publicURL = publicData?.publicUrl || "";

      await supabaseUser
        .from("reports_data")
        .insert([{ url: publicURL, fileName, fileSize: fileSizeBytes }]);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.send(buffer);
    });

    doc.end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to generate PDF" });
    return;
  }
};



const writeText = (
  doc: PDFKit.PDFDocument,
  text: string,
  options: PDFKit.Mixins.TextOptions = {},
  spacing = 10
) => {
  doc.text(text, options);
  doc.y += spacing; // Add vertical space after text
};

const writeImage = (
  doc: PDFKit.PDFDocument,
  imageBuffer: Buffer,
  imageHeight: number
) => {
  const imageWidth = 500; // Set a fixed width
  const x = (doc.page.width - imageWidth) / 2; // Center horizontally

  doc.image(imageBuffer, x, doc.y, {
    width: imageWidth,
    height: imageHeight,
  });

  doc.y += imageHeight + 10; // Move cursor down after image
};


export const downloadFile: RequestHandler = async (req, res) => {
  const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
  if (!supabaseUser) {
    res.status(401).json({ error: "Unauthorized from upload file" });
    return;
  }
  const { fileName, fileStorage } = req.query as {
    fileName: string;
    fileStorage: string;
  };

  if (!fileName || !fileStorage) {
    res.status(400).json({ error: "Missing fileUrl or fileStorage" });
    return;
  }


  try {
    const { data, error } = await supabaseUser.storage
      .from(fileStorage)
      .download(fileName);

    if (error || !data) {
      console.error(error);
      res.status(500).json({ error: "Failed to download file" });
      return;
    }

    const fileBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // Optionally set headers based on fileType
    // const fileType = req.query.fileType;
    // if (fileType === "pdf") {
    //   res.setHeader("Content-Type", "application/pdf");
    //   res.setHeader("Content-Disposition", `attachment; filename="report.pdf"`);
    // } else if (fileType === "excel") {
    //   res.setHeader(
    //     "Content-Type",
    //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    //   );
    //   res.setHeader(
    //     "Content-Disposition",
    //     `attachment; filename="report.xlsx"`
    //   );
    // }

    res.send(buffer);
    return;
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Unexpected server error" });
    return;
  }
};


export const deleteFile: RequestHandler = async (req, res): Promise<void> => {
  try {
    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(401).json({ error: "Unauthorized from upload file" });
      return;
    }

    const { bucket, fileName, tableName, recordId } = req.body;
    if (!bucket || !fileName || !tableName || !recordId) {
      res.status(400).json({ error: "Missing required fields." });
      return;
    }

    const { error: storageError } = await supabaseUser.storage
      .from(bucket)
      .remove([fileName]);
    if (storageError) {
      console.error("Error deleting file from storage:", storageError);
      res.status(500).json({ error: "Failed to delete file from storage." });
      return;
    }

    const { error: dbError } = await supabaseUser
      .from(tableName)
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
