// routes/userRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { updateUserLocation } from "../controllers/userController.js";

const router = express.Router();

router.patch("/location", protect, updateUserLocation); // 🔐 protected route

export default router;
