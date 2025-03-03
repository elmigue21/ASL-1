import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import userRoutes from "./routes/UserRoutes";

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

app.get("/", (req, res) => {
  res.send("Hello from Express API!");
});

app.use("/api", userRoutes);


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
