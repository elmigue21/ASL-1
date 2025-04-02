// backend/lib/config.ts
// import { loadEnvConfig } from "@next/env";

// const projectDir = process.cwd();
// loadEnvConfig(projectDir);
// import dotenv
import path from "path";
import dotenv from 'dotenv';

const envFile = `.env.${process.env.NODE_ENV || "local"}`; // Defaults to `.env.local`

dotenv.config({
  path: path.resolve(process.cwd(), envFile),
  debug: process.env.NODE_ENV !== "production", // Enable debug mode only in development
});

// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }
