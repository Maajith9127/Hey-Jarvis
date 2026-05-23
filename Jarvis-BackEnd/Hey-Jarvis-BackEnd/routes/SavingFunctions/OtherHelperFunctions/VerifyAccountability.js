
// import CollisionCollection from "../../../models/CollisionCollection.js";
// import CalendarCollection from "../../../models/CalendarCollection.js";
// import { sendVerificationSuccessNotification } from "../../../utils/ScheduleComponents/Notifications/VerificationSuccessNotification.js";

// export const verifyAccountability = async ({ VerificationResult, Accountability, userId }) => {
//     try {
//         if (VerificationResult !== "1" || !Accountability || !userId) return false;

//         const { AccountabilityId, SpecificEventId } = Accountability;
//         const now = new Date();
//         const graceMs = 2000;

//         // Update CollisionCollection (scoped by userId)
//         const updated = await CollisionCollection.updateMany(
//             {
//                 userId,
//                 "OtherAccountabilitiesInCollisionWith.AccountabilityId": AccountabilityId,
//                 "OtherAccountabilitiesInCollisionWith.SpecificEventId": SpecificEventId,
//                 "OtherAccountabilitiesInCollisionWith.start": { $lte: new Date(now.getTime() + graceMs) },
//                 "OtherAccountabilitiesInCollisionWith.end": { $gte: new Date(now.getTime() - graceMs) }
//             },
//             {
//                 $set: {
//                     "OtherAccountabilitiesInCollisionWith.$[acc].verified": true
//                 }
//             },
//             {
//                 arrayFilters: [
//                     {
//                         "acc.AccountabilityId": AccountabilityId,
//                         "acc.SpecificEventId": SpecificEventId
//                     }
//                 ]
//             }
//         );

//         //  Update CalendarCollection (also scoped by userId)
//         const calendarUpdate = await CalendarCollection.updateOne(
//             {
//                 userId, //  again restrict to user's calendar
//                 AccountabilityId,
//                 SpecificEventId
//             },
//             {
//                 $set: { verified: true }
//             }
//         );

//         console.log("Calendar updated:", calendarUpdate.modifiedCount > 0);

//         return updated.modifiedCount > 0 || calendarUpdate.modifiedCount > 0;
//     } catch (err) {
//         console.error(" Error updating verification in multiple todos:", err);
//         return false;
//     }
// };



import CollisionCollection from "../../../models/CollisionCollection.js";
import CalendarCollection from "../../../models/CalendarCollection.js";
import { sendVerificationSuccessNotification } from "../../../utils/ScheduleComponents/Notifications/VerificationSuccessNotification.js";

export const verifyAccountability = async ({ VerificationResult, Accountability, userId }) => {
    try {
        if (VerificationResult !== "1" || !Accountability || !userId) return false;

        const { AccountabilityId, SpecificEventId } = Accountability;
        const now = new Date();
        const graceMs = 2000;

        // Update CollisionCollection (scoped by userId)
        const updated = await CollisionCollection.updateMany(
            {
                userId,
                "OtherAccountabilitiesInCollisionWith.AccountabilityId": AccountabilityId,
                "OtherAccountabilitiesInCollisionWith.SpecificEventId": SpecificEventId,
                "OtherAccountabilitiesInCollisionWith.start": { $lte: new Date(now.getTime() + graceMs) },
                "OtherAccountabilitiesInCollisionWith.end": { $gte: new Date(now.getTime() - graceMs) }
            },
            {
                $set: {
                    "OtherAccountabilitiesInCollisionWith.$[acc].verified": true
                }
            },
            {
                arrayFilters: [
                    {
                        "acc.AccountabilityId": AccountabilityId,
                        "acc.SpecificEventId": SpecificEventId
                    }
                ]
            }
        );

        // Update CalendarCollection (also scoped by userId)
        const calendarUpdate = await CalendarCollection.updateOne(
            {
                userId, // again restrict to user's calendar
                AccountabilityId,
                SpecificEventId
            },
            {
                $set: { verified: true }
            }
        );

        console.log("Calendar updated:", calendarUpdate.modifiedCount > 0);

        // Trigger notification only if DB was actually updated
        if (updated.modifiedCount > 0 || calendarUpdate.modifiedCount > 0) {
            const accEvent = await CalendarCollection.findOne({ userId, AccountabilityId, SpecificEventId });
            if (accEvent) {
                await sendVerificationSuccessNotification(userId, accEvent);
            }
            return true;
        }

        return false;
    } catch (err) {
        console.error("Error updating verification in multiple todos:", err);
        return false;
    }
};
