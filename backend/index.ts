import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { Request, Response } from "express";
import subscriptionRoutes from "./routes/SubscriptionRoutes";
// import { supabase } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import profileRoutes from "./routes/ProfileRoutes";
import { EmailRequest } from "@/types/emailRequest";
import { transporter } from "../lib/emailTransporter";
import dashboardRoutes from "./routes/dashboardRoutes";
import { authenticateUser } from "./middlewares/authenticateUser";
import tableRoutes from "./routes/tableRoutes";
import emailRoutes from "./routes/emailRoutes";
import backupRoutes from './routes/backupRoutes'
import uploadRoutes from './routes/uploadRoutes'
import downloadRoutes from './routes/downloadRoutes';
import landingRoutes from './routes/landingRoutes'
import authRoutes from './routes/authRoutes'
import countriesRoutes from './routes/countriesRoutes'
import adminRoutes from "./routes/adminRoutes";
// import profileRoutes from "./routes/profileRoutes";
import path from 'path'
// const env = process.env.NODE_ENV || "local"; // fallback to local
// Hardcode the path to the .env.local file
import cookieParser from "cookie-parser";
const envPath = path.resolve(__dirname, '../.env.local');
console.log('Attempting to load .env from:', envPath);

// Now explicitly call dotenv.config with the path
const result = dotenv.config({ path: envPath });
if (result.error) {
    console.error("Failed to load .env file:", result.error);
} else {
    console.log("Environment variables loaded successfully.");
}

// Log the specific variable you're trying to access
// console.log("EMAIL_SECRET:", process.env.EMAIL_SECRET);

const app = express();
app.use(cookieParser());




app.use(
  cors({
    origin:
      process.env.NODE_ENV?.trim() === "production"
        ? "https://asl-topaz.vercel.app"
        : "http://localhost:3000", // exact local frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    exposedHeaders: ["Content-Disposition"],
    credentials: true,
  })
);
app.use(express.json());
const apiRouter = express.Router();

apiRouter.use("/admin", authenticateUser,adminRoutes);
apiRouter.use("/countries", countriesRoutes);
apiRouter.use("/subscriptions",authenticateUser, subscriptionRoutes);
apiRouter.use("/dashboard",authenticateUser, dashboardRoutes);
apiRouter.use("/table", authenticateUser,tableRoutes);
apiRouter.use("/email",authenticateUser,emailRoutes);
apiRouter.use('/backups',authenticateUser,backupRoutes);
apiRouter.use('/upload',authenticateUser,uploadRoutes);
apiRouter.use('/download',authenticateUser,downloadRoutes);
apiRouter.use('/landing', landingRoutes);
apiRouter.use("/auth", authRoutes);
apiRouter.use('/profile',authenticateUser,profileRoutes)



app.use("/api", apiRouter);


console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Backend running locally on port ${PORT}`)
  );
}

// ✅ Export app for Vercel deployment
export default app;
