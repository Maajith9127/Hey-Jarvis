import AccountabilityCollection from "../../models/AccountabilityCollection.js";
import { sendMailPenalty } from "./MailPenalty.js";
import PayoutCollection from "../../models/Payout.js";
import { PaymentPenalty } from "./PaymentPenalty.js";

export const triggerPenalty = async (AccountabilityId, CollectionType, userId) => {
    console.log(` Triggering penalty for user ${userId} on AccountabilityId: ${AccountabilityId} in ${CollectionType}`);

    if (!userId || !AccountabilityId || !CollectionType) {
        console.warn(" Missing required info for penalty trigger");
        return;
    }

    switch (CollectionType.toLowerCase()) {
        case "messagecollection": {
            const accountability = await AccountabilityCollection.findOne({ AccountabilityId, userId });

            if (!accountability) {
                console.warn(`❌ No matching accountability found for user ${userId} with ID ${AccountabilityId}`);
                return;
            }

            const { ToAddress, message } = accountability;

            if (!ToAddress || !message) {
                console.warn(" Missing ToAddress or message content");
                return;
            }

            await sendMailPenalty({ ToAddress, message, AccountabilityId });
            break;
        }
        case "payoutcollection": {
            const payout = await PayoutCollection.findOne({ AccountabilityId, userId });
            if (!payout) return console.warn("❌ No payout found for this accountability");

            const { amount, bankAccountId } = payout;
            if (!amount || !bankAccountId) return console.warn("❌ Missing amount or bank account");

            console.log(" Triggering payout penalty →", { amount, bankAccountId });

            //  Call your real payment function here
            await PaymentPenalty({ amount, bankAccountId, AccountabilityId, userId });

            break;
        }

        default:
            console.warn(" Unknown CollectionType:", CollectionType);
            return;
    }
};


