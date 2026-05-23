// import express from "express";
// import AccountabilityCollection from "../models/AccountabilityCollection.js";
// import CalendarCollection from "../models/CalendarCollection.js";
// import PhotoCollection from "../models/PhotoCollection.js";

// const StrictMode = express.Router();

// // PATCH controller to set strict mode where it's not already set
// const setStrictModeController = async (req, res) => {
//     try {
//         const { StrictMode: timestamp } = req.body;

//         // Validate input
//         if (!timestamp || typeof timestamp !== 'number') {
//             return res.status(400).json({ error: 'A valid "StrictMode" timestamp is required.' });
//         }

//         // Convert to ISO string for DB
//         const finalDate = new Date(timestamp);
//         const isoString = finalDate.toISOString();

//         // Filter to find only docs where StrictMode is not set
//         const filter = { $or: [{ StrictMode: { $exists: false } }, { StrictMode: null }] };
//         const update = { $set: { StrictMode: isoString } };



//         // Update only those that don't already have a StrictMode
//         const [accRes, calRes, photoRes] = await Promise.all([
//             AccountabilityCollection.updateMany(filter, update),
//             CalendarCollection.updateMany(filter, update),
//             PhotoCollection.updateMany(filter, update)
//         ]);

//         console.log('📌 StrictMode Set:', {
//             messagesUpdated: accRes.modifiedCount,
//             calendarUpdated: calRes.modifiedCount,
//             photosUpdated: photoRes.modifiedCount
//         });

//         // Send back success response
//         res.status(200).json({
//             message: '✅ Strict Mode set only where not already defined.',
//             activeUntil: finalDate.toLocaleString(),
//             modified: {
//                 messages: accRes.modifiedCount,
//                 calendar: calRes.modifiedCount,
//                 photos: photoRes.modifiedCount
//             }
//         });

//     } catch (error) {
//         console.error("❌ Error setting Strict Mode:", error);
//         res.status(500).json({ error: 'An internal server error occurred.' });
//     }
// };

// // Define the PATCH route
// StrictMode.patch('/', setStrictModeController);

// // Export the router
// export { StrictMode };

import express from "express";
import { setStrictModeController } from "../controllers/strictModeController.js";
import { protect } from "../middlewares/authMiddleware.js";

const StrictMode = express.Router();

StrictMode.patch('/', protect, setStrictModeController);

export { StrictMode };
