import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import userRoutes from "./routes/UserRoutes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello from Express API!");
});

// const PORT = process.env.PORT || 5000;
const PORT = 5050;
app.listen(PORT, () => console.log(`BACKEND running on port ${PORT}`));
