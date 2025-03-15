// backend/lib/config.ts
import dotenv from "dotenv";
import path from "path";

const envFile = `.env.${process.env.NODE_ENV || "local"}`; // Defaults to `.env.local`

dotenv.config({
  path: path.resolve(process.cwd(), envFile),
  debug: process.env.NODE_ENV !== "production", // Enable debug mode only in development
});

// console.log('node env', process.env.NODE_ENV);

// console.log(`Loaded environment: ${envFile}`);


// console.log("✅ Environment variables loaded.");
