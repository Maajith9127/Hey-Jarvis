
// // utils/Penalties/penaltyModule.js
// import PenaltyCollection from "../../models/PenaltyCollection.js";
// import { sendPenaltyNotification } from "../ScheduleComponents/Notifications/PenaltyNotification.js";
// import { triggerPenalty } from "./Trigger.js";
// import { sendCustomNotification } from "../ScheduleComponents/Notifications/GeneralNotification.js";

// // In-memory store: active timers (key = penaltyId, value = timer reference)
// const activePenaltyTimers = new Map();

// /**
//  * Create a penalty + schedule its follow-up check
//  */
// export const createPenalty = async (userId, AccountabilityId, SpecificEventId, collectionType) => {
//     try {
//         const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours

//         const penalty = new PenaltyCollection({
//             userId,
//             AccountabilityId,
//             SpecificEventId,
//             collectionType,
//             solvedCount: 0,
//             expiresAt,
//             status: "pending",
//         });

//         await penalty.save();

//         console.log("Penalty created:", {
//             penaltyId: penalty._id,
//             userId,
//             AccountabilityId,
//             SpecificEventId,
//             collectionType,
//             expiresAt,
//         });

//         // Notify immediately
//         await sendCustomNotification(
//             userId,
//             "Penalty Created – Action Required",
//             `<p>You missed an accountability event.</p>
//              <p>You have 3 hours to complete your verification.</p>`
//         );

//         // Follow-up check
//         const timer = setTimeout(async () => {
//             console.log('OMMMAAAAAALAAAAAAAAA HAAAAA)))))))))))))))))))))))))))))))))))))))))');

//             console.log(">>> [PenaltyTimer] Running check for", {
//                 userId,
//                 AccountabilityId,
//                 SpecificEventId,
//             });

//             try {
//                 const fresh = await PenaltyCollection.findOne({
//                     userId,
//                     AccountabilityId,
//                     SpecificEventId,
//                     status: "pending", // only care about pending
//                 });

//                 if (fresh) {
//                     console.log(">>> [PenaltyTimer] Still pending — enforcing");
//                     await triggerPenalty(AccountabilityId, collectionType, userId);
//                     await sendPenaltyNotification(userId, AccountabilityId, collectionType);

//                     fresh.status = "enforced";
//                     await fresh.save();
//                 } else {
//                     console.log(">>> [PenaltyTimer] Already cleared/waived ✅");
//                 }
//             } catch (err) {
//                 console.error("❌ Error in penalty timer:", err);
//             }

//             activePenaltyTimers.delete(penalty._id.toString());
//         }, 2 * 60 * 1000); // 2 minutes for testing

//         // Save timer reference
//         activePenaltyTimers.set(penalty._id.toString(), timer);
//         console.log(`⏳ Follow-up check scheduled in ${delayMs / 1000} seconds (${delayMs / 60000} minutes)`)

//         return penalty;
//     } catch (err) {
//         console.error("Error creating penalty:", err);
//         throw err;
//     }
// };

// /**
//  * Cancel ALL timers in this instance
//  */
// export const cancelAllPenaltyTimers = () => {
//     console.log(`Cancelling ${activePenaltyTimers.size} active timers...`);
//     for (const [penaltyId, timer] of activePenaltyTimers.entries()) {
//         clearTimeout(timer);
//         console.log(`Cancelled timer for penalty ${penaltyId}`);
//     }
//     activePenaltyTimers.clear();
//     console.log("All penalty timers cancelled");
//     console.log('After this You should see no Penalty timers clogs');

// };




// utils/Penalties/penaltyModule.js
import PenaltyCollection from "../../models/PenaltyCollection.js";
import { sendPenaltyNotification } from "../ScheduleComponents/Notifications/PenaltyNotification.js";
import { triggerPenalty } from "./Trigger.js";
import { sendCustomNotification } from "../ScheduleComponents/Notifications/GeneralNotification.js";

// In-memory store
const activePenaltyTimers = new Map();

// Read delay from env (fallback to 2 mins if not set)
const delayMs = parseInt(process.env.PENALTY_CHECK_DELAY_MS, 10) || (2 * 60 * 1000);

export const createPenalty = async (userId, AccountabilityId, SpecificEventId, collectionType) => {
    try {
        const expiresAt = new Date(Date.now() + delayMs);

        const penalty = new PenaltyCollection({
            userId,
            AccountabilityId,
            SpecificEventId,
            collectionType,
            solvedCount: 0,
            expiresAt,
            status: "pending",
        });

        await penalty.save();

        console.log("Penalty created:", {
            penaltyId: penalty._id,
            userId,
            AccountabilityId,
            SpecificEventId,
            collectionType,
            expiresAt,
        });

        // Notify immediately
        await sendCustomNotification(
            userId,
            "Penalty Created – Action Required",
            `<p>You missed an accountability event.</p>
             <p>You have ${Math.round(delayMs / (60 * 1000))} minutes to complete your verification.</p>`
        );

        // Follow-up check
        const timer = setTimeout(async () => {
            console.log(">>> [PenaltyTimer] Running check for", { userId, AccountabilityId, SpecificEventId });

            try {
                const fresh = await PenaltyCollection.findOne({
                    userId,
                    AccountabilityId,
                    SpecificEventId,
                    status: "pending",
                });

                if (fresh) {
                    console.log(">>> [PenaltyTimer] Still pending — enforcing");
                    await triggerPenalty(AccountabilityId, collectionType, userId);
                    await sendPenaltyNotification(userId, AccountabilityId, collectionType);

                    fresh.status = "enforced";
                    await fresh.save();
                } else {

                    await sendCustomNotification(
                        req.userId,
                        "✅ All Penalties & Timers Cleared",
                        `<p>Great news 🎉</p>
                                         <p>You have successfully solved enough captchas.</p>
                                         <p>All active penalties and their timers have been <strong>cleared</strong>. No worries 🚀.</p>
                                         <p>Stay consistent and keep up the discipline!</p>`
                    );
                    
                    console.log(">>> [PenaltyTimer] Already cleared/waived ✅");

                }
            } catch (err) {
                console.error("❌ Error in penalty timer:", err);
            }

            activePenaltyTimers.delete(penalty._id.toString());
        }, delayMs);

        activePenaltyTimers.set(penalty._id.toString(), timer);
        console.log(`⏳ Follow-up check scheduled in ${delayMs / 1000} seconds (${delayMs / 60000} minutes)`);

        return penalty;
    } catch (err) {
        console.error("Error creating penalty:", err);
        throw err;
    }
};

export const cancelAllPenaltyTimers = () => {
    console.log(`Cancelling ${activePenaltyTimers.size} active timers...`);
    for (const [penaltyId, timer] of activePenaltyTimers.entries()) {
        clearTimeout(timer);
        console.log(`Cancelled timer for penalty ${penaltyId}`);
    }
    activePenaltyTimers.clear();
    console.log("✅ All penalty timers cancelled");
};
