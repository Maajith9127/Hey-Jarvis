import AccountabilityCollection from "../models/AccountabilityCollection.js";
import CalendarCollection from "../models/CalendarCollection.js";
import PhotoCollection from "../models/PhotoCollection.js";
import Randomised from "../models/RandomisedCollection.js";
import Payout from "../models/Payout.js";

export const setStrictModeController = async (req, res) => {
    try {
        const { StrictMode: timestamp } = req.body;
        const userId = req.userId;

        if (!timestamp || typeof timestamp !== 'number') {
            return res.status(400).json({ error: 'A valid "StrictMode" timestamp is required.' });
        }

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: No userId found' });
        }

        const finalDate = new Date(timestamp);
        const isoString = finalDate.toISOString();

        const updateDocs = async (Model) => {
            const docs = await Model.find({ userId }).lean();
            let modifiedCount = 0;

            const bulkOps = docs.map(doc => {
                const current = doc.StrictMode;
                if (!current || new Date(current) < new Date(isoString)) {
                    modifiedCount++;
                    return {
                        updateOne: {
                            filter: { _id: doc._id },
                            update: { $set: { StrictMode: isoString } }
                        }
                    };
                }
                return null;
            }).filter(Boolean);

            if (bulkOps.length > 0) {
                await Model.bulkWrite(bulkOps);
            }

            return modifiedCount;
        };

        const [accCount, calCount, photoCount, randomisedCount, payoutCount] = await Promise.all([
            updateDocs(AccountabilityCollection),
            updateDocs(CalendarCollection),
            updateDocs(PhotoCollection),
            updateDocs(Randomised),
            updateDocs(Payout),
        ]);

        console.log('StrictMode Set:', {
            messagesUpdated: accCount,
            calendarUpdated: calCount,
            photosUpdated: photoCount
        });

        res.status(200).json({
            message: ' Strict Mode updated where applicable.',
            activeUntil: finalDate.toLocaleString(),
            modified: {
                messages: accCount,
                calendar: calCount,
                photos: photoCount,
                payouts: payoutCount,
                randomised: randomisedCount,
            }
        });

    } catch (error) {
        console.error("❌ Error setting Strict Mode:", error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};
