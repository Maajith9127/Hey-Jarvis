
import express from "express";
import {
    HandleSaveAccountability,
    GetAccountabilityMessages,
} from "../controllers/accountabilityController.js";
import { protect } from "../middlewares/authMiddleware.js";

const SaveAccountability = express.Router();

//  Save for authenticated user
SaveAccountability.post('/SaveMessages', protect, async (req, res) => {
    const { added = [], updated = [], deleted = [] } = req.body;
    const userId = req.userId;

    console.log('📥 Delta Payload for user:', userId, { added, updated, deleted });

    try {
        await HandleSaveAccountability({ added, updated, deleted }, userId);
        return res.status(200).json({ message: '✅ Messages saved successfully' });
    } catch (err) {
        console.error('❌ Error saving delta:', err);
        return res.status(500).json({ error: 'Server error while saving accountabilities' });
    }
});

//  Fetch only that user's messages
SaveAccountability.get('/GetMessages', protect, async (req, res) => {
    const userId = req.userId;

    try {
        const messages = await GetAccountabilityMessages(userId);
        return res.status(200).json({ Messages: messages });
    } catch (error) {
        console.error('❌ Error fetching messages:', error);
        return res.status(500).json({ error: 'Failed to fetch accountability messages' });
    }
});

export { SaveAccountability };
