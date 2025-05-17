import "./config";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config()

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabaseUrl = "https://qmyarvbxdbotqmhjcexd.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteWFydmJ4ZGJvdHFtaGpjZXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NDM5MTIsImV4cCI6MjA1NDUxOTkxMn0.HIH0ZqXtZqIQfhzKHb6hg6folpPBwAJkbQhXdTkLSGw";
console.log("supabase url ", supabaseUrl);
console.log("supabase anon key ", supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey,{auth:{
  autoRefreshToken:false,persistSession:true
}});
