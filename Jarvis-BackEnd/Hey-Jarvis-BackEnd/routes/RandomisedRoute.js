import express from "express";
import {
  createRandomised,
  getAllRandomised,
} from "../controllers/RandomisedController.js";
import { protect } from "../middlewares/authMiddleware.js"; // optional auth

const router = express.Router();

// CREATE
router.post("/create", protect, createRandomised);

// READ
router.get("/all", protect, getAllRandomised);

// UPDATE
// router.put("/update/:id", protect, updateRandomised);

// // DELETE
// router.delete("/delete/:id", protect, deleteRandomised);

export default router;
