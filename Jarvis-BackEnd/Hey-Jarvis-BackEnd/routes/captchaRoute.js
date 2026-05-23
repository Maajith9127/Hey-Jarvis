// routes/captchaRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    getUserPenalties,
    getCaptchaForPenalty as getCaptcha,
    verifyCaptchaForPenalty as verifyCaptcha,
} from "../controllers/captchaController.js";

const router = express.Router();

router.get("/penalties", protect, getUserPenalties);
router.get("/:accountabilityId/:specificEventId", protect, getCaptcha);
router.post("/:accountabilityId/:specificEventId/verify", protect, verifyCaptcha);

export default router;
