import express from "express";
// const express = require("express");

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
connectDB();
const app = express();
const port = 5001;

app.use("/api/hello", notesRoutes);

app.listen(port, (req, res) => {
  console.log(`server is running at ${port}`);
});
