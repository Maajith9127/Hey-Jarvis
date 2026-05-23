import express from 'express';
import { getTodoCollision } from '../controllers/calendarController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, getTodoCollision); //  PROTECTED

export { router as GetTodoCollision };

