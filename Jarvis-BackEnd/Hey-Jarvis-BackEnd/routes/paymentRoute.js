import express from 'express';
import dotenv from 'dotenv';
import { protect } from '../middlewares/authMiddleware.js';
import { handlePayment, handleWithdrawal,getBalance ,triggerPayoutPenalty,savePayoutsDelta,getAllPayouts} from '../controllers/paymentController.js';
import { createStrictModeFilter } from '../middlewares/strictMode.middleware.js';

dotenv.config();
const router = express.Router();

router.post('/pay', protect, handlePayment);
router.post('/withdraw', protect, handleWithdrawal);
router.get('/balance', protect, getBalance);
router.post('/trigger',triggerPayoutPenalty); // Uncomment if you want to use this route
router.post('/save-delta',protect,createStrictModeFilter,savePayoutsDelta)
router.get('/all', protect, getAllPayouts);
export default router;
