import { Request, Response, RequestHandler } from "express";
import { SupabaseClient, User } from "@supabase/supabase-js";
// import { supabase } from "@/lib/supabase";

interface AuthenticatedRequest extends Request {
  supabaseUser?: SupabaseClient;
  user?: User | null;
}

export const downloadFile: RequestHandler = async (req, res): Promise<void> => {
  try {
    const supabaseUser = (req as AuthenticatedRequest).supabaseUser;
    if (!supabaseUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const {fileUrl} = req.query as {fileUrl: string};
    const pathStart = "/storage/v1/object/public/excels/";

    if(!fileUrl){
              console.error("No file path extracted");
              res.status(400).json({ error: "Invalid file path" });
              return; 
    }

    const filePath = fileUrl.split(pathStart)[1];

    if (!filePath) {
      console.error("No file path extracted");
      res.status(400).json({ error: "Invalid file path" });
      return; 
    }

    const { data, error } = await supabaseUser.storage
      .from("excels")
      .download(filePath);

    if (error || !data) {
      console.error("Supabase download error:", error);
      res.status(500).json({ error: "Failed to download file" });
      return; 
    }

    // Convert the downloaded data into a buffer (we can use Uint8Array for binary data)
    const fileBuffer = await data.arrayBuffer();

    // Set headers to prompt file download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filePath.split("/").pop()}"`
    );
    res.setHeader("Content-Type", "application/octet-stream");

    // Send the file buffer as the response
    res.status(200).send(Buffer.from(fileBuffer));
    return;
  } catch (e) {
    console.error("Download handler error:", e);
    res.status(500).json({ message: "Server error", details: e });
    return;
  }
};