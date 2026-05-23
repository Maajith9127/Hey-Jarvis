import express from 'express';
import { HandlePositionsSave, GetPositions } from '../controllers/positionsController.js';
import { protect } from '../middlewares/authMiddleware.js';

const PositionsRoutes = express.Router();

// Save positions
PositionsRoutes.post('/SavePositions', protect, async (req, res) => {
    try {
        const result = await HandlePositionsSave(req.body, req.userId);
        res.status(200).json({ message: "✅ Positions saved successfully", result });
    } catch (error) {
        console.error('❌ Error saving positions:', error);
        res.status(500).json({ error: "Server error while saving positions" });
    }
});

// Get positions
PositionsRoutes.get('/GetPositions', protect, async (req, res) => {
    try {
        const result = await GetPositions(req.userId);
        res.status(200).json(result);
    } catch (error) {
        console.error('❌ Error fetching positions:', error);
        res.status(500).json({ error: "Server error while fetching positions" });
    }
});

export default PositionsRoutes;
