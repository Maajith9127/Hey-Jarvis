// import express from 'express';
// import { HandleLivePhotoSave, GetLivePhotos } from '../controllers/livePhotoController.js';
// import { protect } from '../middlewares/authMiddleware.js';

// const SaveLivePhotos = express.Router();
// //Secure both routes
// SaveLivePhotos.post('/SaveLivePhotos', protect, async (req, res) => {
//   try {
//     const { added, updated, deleted } = req.body;
//     const result = await HandleLivePhotoSave({ added, updated, deleted }, req.userId);
//     res.status(200).json({ message: "✅ LivePhotos delta saved", result });

//   } catch (error) {
//     console.error('❌ Error saving LivePhotos:', error);
//     res.status(500).json({ error: "Server error during save." });
//   }
// });

// SaveLivePhotos.get('/GetLivePhotos', protect, async (req, res) => {
//   try {
//     const result = await GetLivePhotos(req.userId);
//     res.status(200).json({ Photos: result.photos });

//   } catch (error) {
//     console.error('❌ Error fetching photos:', error);
//     res.status(500).json({ error: 'Server error while fetching photos' });
//   }
// });

// export default SaveLivePhotos;





import express from 'express';
import { HandleLivePhotoSave, GetLivePhotos } from '../controllers/livePhotoController.js';
import { HandlePositionsSave, GetPositions } from '../controllers/positionsController.js';
import { protect } from '../middlewares/authMiddleware.js';

const SaveLivePhotos = express.Router();

//  Save Live Photos
SaveLivePhotos.post('/SaveLivePhotos', protect, async (req, res) => {
  try {
    const { added, updated, deleted } = req.body;
    const result = await HandleLivePhotoSave({ added, updated, deleted }, req.userId);
    res.status(200).json({ message: "LivePhotos delta saved", result });
  } catch (error) {
    console.error('❌ Error saving LivePhotos:', error);
    res.status(500).json({ error: "Server error during save." });
  }
});

//  Get Live Photos
SaveLivePhotos.get('/GetLivePhotos', protect, async (req, res) => {
  try {
    const result = await GetLivePhotos(req.userId);
    res.status(200).json({ Photos: result.photos });
  } catch (error) {
    console.error('❌ Error fetching photos:', error);
    res.status(500).json({ error: 'Server error while fetching photos' });
  }
});

// Save Positions
SaveLivePhotos.post('/SavePositions', protect, async (req, res) => {
  try {
    const result = await HandlePositionsSave(req.body, req.userId);
    res.status(200).json({ message: "✅ Positions saved", result });
  } catch (error) {
    console.error('❌ Error saving positions:', error);
    res.status(500).json({ error: "Server error during positions save." });
  }
});

//  Get Positions
SaveLivePhotos.get('/GetPositions', protect, async (req, res) => {
  try {
    const result = await GetPositions(req.userId);
    res.status(200).json({ Positions: result.positions });
  } catch (error) {
    console.error('❌ Error fetching positions:', error);
    res.status(500).json({ error: 'Server error while fetching positions' });
  }
});

export default SaveLivePhotos;
