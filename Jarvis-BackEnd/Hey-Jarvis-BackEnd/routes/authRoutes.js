import express from "express";
import { loginUser, registerUser, logoutUser } from "../controllers/authController.js";
import { protect as authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser); //
router.post("/logout", logoutUser); //
router.get("/me", authMiddleware, (req, res) => {
    res.status(200).json({ userId: req.userId });
});

export default router;
