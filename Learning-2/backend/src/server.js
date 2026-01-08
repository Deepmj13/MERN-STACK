import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

connectDB().then(() => {
  app.listen(5001, (req, res) => {
    console.log("Server running on port 5001");
  });
});

app.use("/api/", userRoutes);
