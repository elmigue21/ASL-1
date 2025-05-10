import { Request, Response, RequestHandler } from "express";

import { SupabaseClient, User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import multer from "multer";
import xlsx from "xlsx";
import { stat } from "fs";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
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

    console.log("FETCHING ERROR?", error);

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
      console.log("UPLOAD ERROR")
      console.error(uploadError);
    }

    const { data: publicData } = supabaseUser.storage
      .from("excels")
      .getPublicUrl(fileName);

    if (!publicData) {
      console.log(" NO FILE FOUND");
    }

    const publicURL = publicData.publicUrl;

    const { data: excelTableData, error: excelTableError } =
      await supabaseUser.from("excels_data").insert([
        {
          url: publicURL,
          fileName: fileName,
          fileSize: fileSizeBytes,
        },
      ]);

      if(excelTableError){
        console.error(excelTableError)
      }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    console.log(fileName)
res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    res.send(buffer)/* .json({fileName}) */;
    return;
  } catch (e) {
    console.error(e);
    return;
  }
};

export const uploadFile: RequestHandler = async (req, res) => {
  try {
    console.log("UPLOAD FILE");

    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(401).json({ error: "Unauthorized from upload file" });
      return;
    }

    const file = req.file;

    // console.log("form data from backend", file);

    if (!file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    //   console.log("Workbook object:", workbook); // Check if the workbook is being created

    const sheetName = workbook.SheetNames[0];
    //   console.log("Sheet Name:", sheetName); // Ensure the sheet name is available

    const sheet = workbook.Sheets[sheetName];
    //   console.log("Sheet data:", sheet);

    const data: ExcelData[] = xlsx.utils.sheet_to_json(sheet);

    const emails = await fetchAllRows("emails", supabaseUser);
    //   console.log("Fetched Emails:", emails); // Check if emails are fetched correctly

    const phones = await fetchAllRows("phone_numbers", supabaseUser);
    console.log("Fetched phones:", phones); // Check if emails are fetched correctly

    const existingEmails = new Set(
      emails.map((row: any) => row.email.toLowerCase())
    );

    const existingPhones = new Set(phones.map((row: any) => row.phone));
    //   console.log(existingPhones)

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



export const generatePdf: RequestHandler = async (req, res) => {
  const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
  if (!supabaseUser) {
    res.status(401).json({ error: "Unauthorized from upload file" });
    return;
  }

  try {
    const doc = new PDFDocument();

   const chartData = {
     labels: [
       "2025-05-01",
       "2025-05-02",
       "2025-05-03",
       "2025-05-04",
       "2025-05-05",
       "2025-05-06",
       "2025-05-07",
     ],
     datasets: [
       {
         label: "Subscribers",
         data: [100, 124, 150, 189, 200, 215, 230],
         fill: true,
         borderColor: "#1A2B88",
         backgroundColor: "rgba(26, 43, 136, 0.1)",
         tension: 0.4,
       },
     ],
   };

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 400, height: 400 });
const imageBuffer = await chartJSNodeCanvas.renderToBuffer({
  type: "line", // Type of the chart
  data: chartData, // The data for the chart
  options: {
    // Set the background color for the entire canvas
    plugins: {
      legend: {
        position: "top", // Customize the legend if necessary
      },
    },
    // Set the canvas background color
    backgroundColor: "green", // This sets the background color to green
  },
});

    const bufferChunks: Buffer[] = [];


    

    const stream = new PassThrough();
    doc.pipe(stream);

        doc.image(imageBuffer, {
          fit: [600, 300],
          align: "center",
          valign: "center",
        });

    // Collect PDF data in bufferChunks
    stream.on("data", (chunk) => {
      bufferChunks.push(chunk);
    });

    stream.on("end", async () => {
      const buffer = Buffer.concat(bufferChunks);
          const now = new Date();
          const datePart = now.toISOString().split("T")[0]; // e.g., "2025-05-04"
          const timePart = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // e.g., "14-30-05"
          const fileName = `data-report-${datePart}_${timePart}.pdf`;
      const fileSizeBytes = Buffer.byteLength(buffer, "utf8");

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

    if (!publicData) {
      console.log(" NO FILE FOUND");
    }

    const publicURL = publicData.publicUrl;

    const { data: reportsTableData, error: reportsTableError } = await supabaseUser
      .from("reports_data")
      .insert([
        {
          url: publicURL,
          fileName: fileName,
          fileSize: fileSizeBytes,
        },
      ]);

      console.log('REPORTS TABLE DATA', reportsTableData)

    if (reportsTableError) {
      console.error(reportsTableError);
    }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.send(buffer);
    });

    // Write content to the PDF
    doc.fontSize(20).text(`User`, 100, 100);
    doc.text("This PDF was generated on the server.");
    doc.end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to generate PDF" });
    return;
  }
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

  console.log('file urll!!', fileName)

  try {
    const { data, error } = await supabaseUser.storage
      .from(fileStorage)
      .download(fileName);

    if (error || !data) {
      console.error(error);
      res.status(500).json({ error: "Failed to download file" });
      return; 
    }
    console.log('FILEE GOT', data);

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
