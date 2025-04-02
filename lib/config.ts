
import path from "path";
import dotenv from 'dotenv';

const envFile = `.env.${process.env.NODE_ENV || "local"}`;

dotenv.config({
  path: path.resolve(process.cwd(), envFile),
  debug: process.env.NODE_ENV !== "production",
});

