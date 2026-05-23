import express from "express";
import { getNextTodoEventsByPhotoId } from "../controllers/calendarController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/next-todo-events/:photoId", protect, getNextTodoEventsByPhotoId);

export default router;
