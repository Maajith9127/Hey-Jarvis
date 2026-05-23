
import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
    generateChallengeController,
    verifyLivePhotoController,
    getActiveChallengeController
} from '../controllers/livePhotoController.js';

const LivePhotoVerification = express.Router();

LivePhotoVerification.post('/ChallengeGenerate', protect, generateChallengeController);
LivePhotoVerification.post('/', protect, verifyLivePhotoController);
LivePhotoVerification.get("/getActiveChallenge", protect, getActiveChallengeController);

export default LivePhotoVerification;
