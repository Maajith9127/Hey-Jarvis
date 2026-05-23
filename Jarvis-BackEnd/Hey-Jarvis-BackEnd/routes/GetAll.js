
import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
//  Controller imports (without session argument now)
import { GetAccountabilityMessages } from '../controllers/accountabilityController.js';
import { GetCalendarEvents } from '../controllers/calendarController.js';
import { GetLivePhotos } from '../controllers/livePhotoController.js';
import { GetAllPayouts } from '../controllers/paymentController.js';

const GetAll = express.Router();

// GetAll.get('/', protect, async (req, res) => {
//     const userId = req.userId;

//     try {
//         const [accountabilityMessages, calendarEvents, livePhotos] = await Promise.all([
//             GetAccountabilityMessages(userId),
//             GetCalendarEvents(userId),
//             GetLivePhotos(userId),
//             GetAllPayouts( userId )
//         ]);

//         return res.status(200).json({
//             Accountability: accountabilityMessages,
//             Calendar: calendarEvents,
//             LivePhotos: livePhotos,
//             Payouts: payoutsResponse
//         });

//     } catch (error) {
//         console.error(' GetAll failed:', error);
//         return res.status(500).json({ error: "Something went wrong while fetching your data." });
//     }
// });


GetAll.get('/', protect, async (req, res) => {
    const userId = req.userId;

    try {
        const [
            accountabilityMessages,
            calendarEvents,
            livePhotos,
            payoutsResponse // this will now be the actual payouts array
        ] = await Promise.all([
            GetAccountabilityMessages(userId),
            GetCalendarEvents(userId),
            GetLivePhotos(userId),
            GetAllPayouts(userId) //now safe
        ]);

        return res.status(200).json({
            Accountability: accountabilityMessages,
            Calendar: calendarEvents,
            LivePhotos: livePhotos,
            Payouts: payoutsResponse
        });

    } catch (error) {
        console.error(' GetAll failed:', error);
        return res.status(500).json({ error: "Something went wrong while fetching your data." });
    }
});



export { GetAll };
