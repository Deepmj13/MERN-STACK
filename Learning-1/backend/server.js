// import express from "express";
const express = require("express");

const app = express();
const port = 5001;

app.get("/api/hello/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.listen(port, (req, res) => {
  console.log(`server is running at ${port}`);
});
