// utils/supabaseAdmin.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Explicitly load .env.local file (adjust the path as needed)
const envPath = path.resolve(__dirname, "../../.env.local");
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("❌ Failed to load .env file:", result.error);
} else {
  console.log("✅ .env loaded successfully from", envPath);
  console.log(
    "SUPABASE_URL =",
    process.env.SUPABASE_URL ? "[FOUND]" : "[NOT FOUND]"
  );
  console.log(
    "SUPABASE_SERVICE_ROLE_KEY =",
    process.env.SUPABASE_SERVICE_ROLE_KEY ? "[FOUND]" : "[NOT FOUND]"
  );
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable!"
  );
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default supabaseAdmin;
