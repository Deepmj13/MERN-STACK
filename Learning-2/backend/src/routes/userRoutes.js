import express from "express";
import { Router } from "express";
import { getAllUser } from "../controller/userController.js";

const router = express.Router();

router.get("/", getAllUser);

export default router;
