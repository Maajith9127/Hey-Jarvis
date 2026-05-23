
// import CollisionCollection from "../../../models/CollisionCollection.js";
// import { triggerPenalty } from "../../Penalties/Trigger.js";
// import { sendPenaltyNotification } from "../Notifications/PenaltyNotification.js";
// import { sendVerificationSuccessNotification } from "../Notifications/VerficationSuccessNotification.js";

// export const checkVerifiedOrNot = async (
//     TodoId,
//     TodoSpecificEventId,
//     AccountabilityId,
//     AccountabilitySpecificEventId,
//     userId
// ) => {
//     console.log(` Checking verification for user ${userId}`);
//     console.log(`TodoId: ${TodoId}, TodoSpecificEventId: ${TodoSpecificEventId}`);
//     console.log(`AccountabilityId: ${AccountabilityId}, AccountabilitySpecificEventId: ${AccountabilitySpecificEventId}`);

//     try {
//         // 1️ Find the matching collision entry scoped to user
//         const Todo = await CollisionCollection.findOne({
//             userId,
//             "Todo.TodoId": TodoId,
//             "Todo.SpecificEventId": TodoSpecificEventId,
//         }).lean();

//         if (!Todo) {
//             console.warn("No Todo found for this user with given IDs");
//             return false;
//         }

//         // 2️ Locate accountability
//         const accountabilityList = Todo.OtherAccountabilitiesInCollisionWith || [];
//         const accountability = accountabilityList.find(acc =>
//             acc.AccountabilityId === AccountabilityId &&
//             acc.SpecificEventId === AccountabilitySpecificEventId
//         );

//         if (!accountability) {
//             console.warn(" Accountability not found inside that collision doc");
//             return false;
//         }

//         // 3️ Check if verified
//         if (accountability.verified === true) {
//             console.log(" Accountability verified — no penalty triggered", {
//                 AccountabilityId,
//                 SpecificEventId: AccountabilitySpecificEventId
//             });
//             return true;
//         } else {
//             const collectionType = accountability.CollectionType?.toLowerCase();

//             if (!collectionType) {
//                 console.warn(" Missing CollectionType — cannot trigger penalty");
//                 return false;
//             }

//             console.log(" Not verified — triggering penalty...");
//             await triggerPenalty(AccountabilityId, collectionType, userId);
//             return false;
//         }

//     } catch (error) {
//         console.error(" Error during verification check:", error);
//         return false;
//     }
// };




import CollisionCollection from "../../../models/CollisionCollection.js";
import { triggerPenalty } from "../../Penalties/Trigger.js";
import { sendPenaltyNotification } from "../Notifications/PenaltyNotification.js";
import { sendVerificationSuccessNotification } from "../Notifications/VerificationSuccessNotification.js";
import { createPenalty } from "../../Penalties/PenaltyModule.js";

export const checkVerifiedOrNot = async (
    TodoId,
    TodoSpecificEventId,
    AccountabilityId,
    AccountabilitySpecificEventId,
    userId
) => {
    console.log(` Checking verification for user ${userId}`);
    console.log(`TodoId: ${TodoId}, TodoSpecificEventId: ${TodoSpecificEventId}`);
    console.log(`AccountabilityId: ${AccountabilityId}, AccountabilitySpecificEventId: ${AccountabilitySpecificEventId}`);

    try {
        // 1️ Find the matching collision entry scoped to user
        const Todo = await CollisionCollection.findOne({
            userId,
            "Todo.TodoId": TodoId,
            "Todo.SpecificEventId": TodoSpecificEventId,
        }).lean();

        if (!Todo) {
            console.warn("No Todo found for this user with given IDs");
            return false;
        }

        // 2️ Locate accountability
        const accountabilityList = Todo.OtherAccountabilitiesInCollisionWith || [];
        const accountability = accountabilityList.find(acc =>
            acc.AccountabilityId === AccountabilityId &&
            acc.SpecificEventId === AccountabilitySpecificEventId
        );

        if (!accountability) {
            console.warn(" Accountability not found inside that collision doc");
            return false;
        }

        // 3️ Check if verified
        if (accountability.verified === true) {
            console.log("  Accountability verified — no penalty triggered", {
                AccountabilityId,
                SpecificEventId: AccountabilitySpecificEventId
            });

            //  Send success notification
            await sendVerificationSuccessNotification(userId, accountability);

            return true;
        } else {
            const collectionType = accountability.CollectionType?.toLowerCase();

            if (!collectionType) {
                console.warn(" Missing CollectionType — cannot trigger penalty");
                return false;
            }

            console.log("  Not verified — triggering penalty...");

            await createPenalty(userId, AccountabilityId,AccountabilitySpecificEventId, collectionType);

            // await triggerPenalty(AccountabilityId, collectionType, userId);
            // //  Send penalty notification
            // await sendPenaltyNotification(userId, AccountabilityId, collectionType);

            return false;
        }

    } catch (error) {
        console.error(" Error during verification check:", error);
        return false;
    }
};
