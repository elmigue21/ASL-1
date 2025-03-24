import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { Request, Response } from "express";
import subscriptionRoutes from "./routes/SubscriptionRoutes";
import { supabase } from "../lib/supabase";
import profileRoutes from "./routes/ProfileRoutes";
import { EmailRequest } from "@/types/emailRequest";
import { transporter } from "../lib/emailTransporter";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "https://asl-topaz.vercel.app", // ✅ Change this to your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
const apiRouter = express.Router();
app.get("/", (req, res) => {
  res.send("Hello from Express API!");
});

app.get("/postman", async (req, res) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "user@example.com",
      password: "12345",
    });
    if (error) throw error; // Handle authentication error

    res.redirect("/api/subscriptions/countryCount");
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Sign-in failed", details: error.message });
    } else {
      res.status(500).json({ error: "Sign-in failed", details: String(error) });
    }
  }
});

app.get("/debug-token", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader?.split(" ")[1];
  try {
    const { data: user, error } = await supabase.auth.getUser(token);
    if (error) {
      res.status(401).json({ error: "Invalid token", details: error.message });
    }
    res.json({ message: "Token is valid", user });
  } catch (err) {
    res.status(500).json({ error: "Unexpected error", details: err });
  }
});

// app.post("/send-bulk-email", async (req: Request, res: Response) => {
//   try {
//     const { recipients, subject, text, html }: EmailRequest = req.body;

//     if (!recipients || recipients.length === 0) {
//        res.status(400).json({ error: "No recipients provided" });
//     }

//     for (const recipient of recipients) {
//       await transporter.sendMail({
//         from: "gueljohnc@gmail.com",
//         to: recipient,
//         subject,
//         text,
//         html,
//       });
//     }

//      res.json({ message: "Emails sent successfully" });
//   } catch (error) {
//     console.error("Email sending failed:", error);
//      res.status(500).json({ error: "Email sending failed" });
//   }
// });

apiRouter.use("/profiles", profileRoutes);
apiRouter.use("/subscriptions", subscriptionRoutes);

app.use("/api", apiRouter);

// ✅ Start the server in development mode only

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Backend running locally on port ${PORT}`)
  );
}

// ✅ Export app for Vercel deployment
export default app;
