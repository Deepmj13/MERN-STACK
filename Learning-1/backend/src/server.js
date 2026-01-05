import express from "express";
// const express = require("express");

import notesRoutes from "./routes/notesRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
dotenv.config();
const app = express();
const port = 5001;

app.use(express.json());
app.use(rateLimiter);

app.use("/api/notes", notesRoutes);
app.use("/api/user", userRoutes);

connectDB().then(() => {
  app.listen(port, (req, res) => {
    console.log(`server is running at ${port}`);
  });
});
