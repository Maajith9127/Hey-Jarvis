import PhotoCollection from '../models/PhotoCollection.js';
import CalendarCollection from '../models/CalendarCollection.js';
import AccountabilityCollection from '../models/AccountabilityCollection.js'; //Fixed import
import Randomised from '../models/RandomisedCollection.js';
import Payout from '../models/Payout.js';
import mongoose from 'mongoose';

export const createStrictModeFilter = async (req, res, next) => {
    const now = Date.now();
    const violations = [];
    //  Generic item checker
    const checkItems = async (items = [], collection, matchKey, label) => {
        for (const item of items) {
            //  Fix: handle if item is just an ID string
            const idToCheck = typeof item === 'string' ? item : item[matchKey];

            const record = await collection.findOne({ [matchKey]: idToCheck });
            if (record && new Date(record.StrictMode).getTime() > now) {
                violations.push({ type: label, id: idToCheck });
            }
        }
    };

    try {
        //  SaveLivePhotos → Check PhotoCollection by `id`
        if (req.originalUrl.includes("/SaveLivePhotos")) {
            console.log('Live Photo strict mode verification');

            const { updated = [], deleted = [] } = req.body;
            await checkItems(updated, PhotoCollection, "id", "photo");
            await checkItems(deleted, PhotoCollection, "id", "photo");
        }

        //  SaveMessages → Check AccountabilityCollection by `AccountabilityId`
        else if (req.originalUrl.includes("/SaveMessages")) {
            const { updated = [], deleted = [] } = req.body;
            await checkItems(updated, AccountabilityCollection, "AccountabilityId", "message");
            await checkItems(deleted, AccountabilityCollection, "AccountabilityId", "message");
        }

        //  SaveAll → Check all three types
        else if (req.originalUrl.includes("/SaveAll")) {
            console.log('Hey inside save  all middleware');

            const {
                Photos: { updated: photoUpdated = [], deleted: photoDeleted = [] } = {},
                CalendarEvents: { updated: calUpdated = [], deleted: calDeleted = [] } = {},
                AccountabilityMessages: { updated: msgUpdated = [], deleted: msgDeleted = [] } = {},
                Payouts: { updated: payoutUpdated = [], deleted: payoutDeleted = [] } = {},
            } = req.body;

            await checkItems(photoUpdated, PhotoCollection, "id", "photo");
            await checkItems(photoDeleted, PhotoCollection, "id", "photo");

            await checkItems(calUpdated, CalendarCollection, "SpecificEventId", "calendar");
            await checkItems(calDeleted, CalendarCollection, "SpecificEventId", "calendar");

            await checkItems(msgUpdated, AccountabilityCollection, "AccountabilityId", "message");
            await checkItems(msgDeleted, AccountabilityCollection, "AccountabilityId", "message");

            await checkItems(payoutUpdated, Payout, "AccountabilityId", "payout");
            await checkItems(payoutDeleted, Payout, "AccountabilityId", "payout");

        }


        else if (req.originalUrl.includes("/payment")) {
            console.log(' StrictMode check: /payment route///////////////////////////////////////////////////////////////////////////////');

            const { added = [], updated = [], deleted = [] } = req.body;
            console.log(' StrictMode check: /payment route', { added, updated, deleted });

            const itemsToCheck = [...updated, ...deleted];

            const accountabilityIds = itemsToCheck.map(p =>
                typeof p === "string" ? p : p.AccountabilityId
            );

            console.log(' StrictMode check: /payment route accountabilityIds:', accountabilityIds);
            console.log(' StrictMode check: /payment route userId:', req.userId);

            if (accountabilityIds.length > 0) {
                const locked = await Payout.find({
                    userId: req.userId,
                    AccountabilityId: { $in: accountabilityIds },
                    StrictMode: { $ne: null } // Only where strict mode is set
                });

                const now = new Date();

                const stillLocked = locked.filter(p => {
                    const lockTime = new Date(p.StrictMode);
                    return lockTime.getTime() > now.getTime();
                });

                console.log(' StrictMode check: /payment route locked payouts:', stillLocked);

                if (stillLocked.length > 0) {
                    const violations = stillLocked.map(p => ({
                        type: "payout",
                        id: p.AccountabilityId
                    }));

                    return res.status(403).json({
                        error: "Strict Mode is active for one or more payouts.",
                        blocked: violations
                    });
                }
            }
        }


        //  Block if any violations found
        if (violations.length > 0) {
            return res.status(403).json({
                error: " Strict Mode is active. Cannot mutate these items.",
                blocked: violations,
            });
        }
        console.log(' StrictMode middleware passed all checks');


        next(); // All clear, proceed
    } catch (err) {
        console.error(" StrictMode middleware error:", err);
        res.status(500).json({ error: "Internal server error during StrictMode validation" });
    }
};
