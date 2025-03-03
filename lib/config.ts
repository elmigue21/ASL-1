// backend/lib/config.ts
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
  debug: true,
});

console.log("✅ Environment variables loaded.");
