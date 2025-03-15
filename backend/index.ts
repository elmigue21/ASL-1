import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { Request, Response } from "express";
import userRoutes from "./routes/UserRoutes";
import subscriptionRoutes from "./routes/SubscriptionRoutes";
import { supabase } from "../lib/supabase";
import profileRoutes from './routes/ProfileRoutes';
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

    res.redirect("/api/profiles");
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Sign-in failed", details: error.message });
    } else {
      res.status(500).json({ error: "Sign-in failed", details: String(error) });
    }
  }
});

app.post("/send-bulk-email", async (req: Request, res: Response) => {
  try {
    const { recipients, subject, text, html }: EmailRequest = req.body;

    if (!recipients || recipients.length === 0) {
       res.status(400).json({ error: "No recipients provided" });
    }

    for (const recipient of recipients) {
      await transporter.sendMail({
        from: "gueljohnc@gmail.com",
        to: recipient,
        subject,
        text,
        html,
      });
    }

     res.json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Email sending failed:", error);
     res.status(500).json({ error: "Email sending failed" });
  }
});


apiRouter.use("/profiles", profileRoutes);
apiRouter.use('/subscriptions', subscriptionRoutes)

app.use("/api", apiRouter);


// ✅ Start the server in development mode only

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () =>
    console.log(`Backend running locally on port ${PORT}`)
  );
}

// ✅ Export app for Vercel deployment
export default app;
