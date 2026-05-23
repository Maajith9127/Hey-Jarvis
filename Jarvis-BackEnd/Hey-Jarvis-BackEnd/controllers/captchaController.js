// // controllers/captchaController.js
// import PenaltyCollection from "../models/PenaltyCollection.js";
// import svgCaptcha from "svg-captcha";
// import { cancelAllPenaltyTimers } from "../utils/Penalties/PenaltyModule.js";
// import { sendCustomNotification } from "../utils/ScheduleComponents/Notifications/GeneralNotification.js";

// // In-memory store: key → expected text
// // We'll use "accountabilityId:specificEventId" as the key
// const captchaMemory = new Map();

// // 1. Get all active penalties for the logged-in user
// export const getUserPenalties = async (req, res) => {
//     try {
//         const penalties = await PenaltyCollection.find({
//             userId: req.userId,
//         }).select("-__v");

//         res.json({ penalties });
//     } catch (err) {
//         console.error("❌ Error fetching penalties:", err);
//         res.status(500).json({ error: "Failed to fetch penalties" });
//     }
// };


// // 2. Generate captcha for a specific penalty
// export const getCaptchaForPenalty = async (req, res) => {
//     try {
//         const { accountabilityId, specificEventId } = req.params;

//         const penalty = await PenaltyCollection.findOne({
//             AccountabilityId: accountabilityId,
//             SpecificEventId: specificEventId,
//             userId: req.userId,
//             status: "pending",
//         });

//         if (!penalty) {
//             return res.status(404).json({ error: "Penalty not found or not active" });
//         }

//         const captcha = svgCaptcha.create({
//             size: 8,
//             noise: 3,
//             color: true,
//             background: "#f9f9f9",
//             width: 300,
//             height: 100,
//             charPreset: "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
//         });

//         // Save whatever svgCaptcha generated
//         captchaMemory.set(`${accountabilityId}:${specificEventId}`, captcha.text);


//         res.json({
//             captcha: captcha.data,
//             AccountabilityId: accountabilityId,
//             SpecificEventId: specificEventId,
//         });
//     } catch (err) {
//         console.error("❌ Error generating captcha:", err);
//         res.status(500).json({ error: "Failed to generate captcha" });
//     }
// };

// // 3. Verify captcha solution
// // controllers/captchaController.js
// export const verifyCaptchaForPenalty = async (req, res) => {
//     try {
//         const { accountabilityId, specificEventId } = req.params;
//         const { answer } = req.body;

//         const penalty = await PenaltyCollection.findOne({
//             AccountabilityId: accountabilityId,
//             SpecificEventId: specificEventId,
//             userId: req.userId,
//             status: "pending",
//         });

//         if (!penalty) {
//             return res.status(404).json({ error: "Penalty not found or not active" });
//         }

//         const key = `${accountabilityId}:${specificEventId}`;
//         const expected = captchaMemory.get(key);
//         console.log('Expected:', expected, 'Received:', answer);

//         if (!expected) {
//             return res.status(400).json({ error: "No captcha generated for this penalty" });
//         }

//         if (answer === expected) {
//             penalty.solvedCount += 1;
//             if (penalty.solvedCount >= 2) {
//                 //Nuke ALL penalties in the collection
//                 await cancelAllPenaltyTimers()
//                 await PenaltyCollection.deleteMany({});
//                 captchaMemory.clear();

//                 await sendCustomNotification(
//                     req.userId,
//                     " All Penalties & Timers Cleared",
//                     `<p>Great news 🎉</p>
//              <p>You have successfully solved enough captchas.</p>
//              <p>All active penalties and their timers have been <strong>cleared</strong>. No worries 🚀.</p>
//              <p>Stay consistent and keep up the discipline!</p>`
//                 );

//                 return res.json({
//                     success: true,
//                     solvedCount: 10,
//                     waived: true,
//                     AccountabilityId: accountabilityId,
//                     SpecificEventId: specificEventId
//                 });
//             }

//             await penalty.save();
//             captchaMemory.delete(key);

//             return res.json({
//                 success: true,
//                 solvedCount: penalty.solvedCount,
//                 waived: false,
//                 required: 10,
//                 AccountabilityId: penalty.AccountabilityId,
//                 SpecificEventId: penalty.SpecificEventId
//             });
//         } else {
//             return res.status(400).json({ error: "Incorrect captcha" });
//         }
//     } catch (err) {
//         console.error("❌ Error verifying captcha:", err);
//         res.status(500).json({ error: "Failed to verify captcha" });
//     }
// };





// controllers/captchaController.js
import PenaltyCollection from "../models/PenaltyCollection.js";
import svgCaptcha from "svg-captcha";
import { cancelAllPenaltyTimers } from "../utils/Penalties/PenaltyModule.js";
import { sendCustomNotification } from "../utils/ScheduleComponents/Notifications/GeneralNotification.js";

// In-memory store
const captchaMemory = new Map();

// Read from env with fallback (default 10)
const solveThreshold = parseInt(process.env.CAPTCHA_SOLVE_THRESHOLD, 10) || 10;

// 1. Get all active penalties
export const getUserPenalties = async (req, res) => {
    try {
        const penalties = await PenaltyCollection.find({
            userId: req.userId,
        }).select("-__v");

        res.json({ penalties });
    } catch (err) {
        console.error("❌ Error fetching penalties:", err);
        res.status(500).json({ error: "Failed to fetch penalties" });
    }
};

// 2. Generate captcha
export const getCaptchaForPenalty = async (req, res) => {
    try {
        const { accountabilityId, specificEventId } = req.params;

        const penalty = await PenaltyCollection.findOne({
            AccountabilityId: accountabilityId,
            SpecificEventId: specificEventId,
            userId: req.userId,
            status: "pending",
        });

        if (!penalty) {
            return res.status(404).json({ error: "Penalty not found or not active" });
        }

        const captcha = svgCaptcha.create({
            size: 8,
            noise: 3,
            color: true,
            background: "#f9f9f9",
            width: 300,
            height: 100,
            charPreset: "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
        });

        captchaMemory.set(`${accountabilityId}:${specificEventId}`, captcha.text);

        res.json({
            captcha: captcha.data,
            AccountabilityId: accountabilityId,
            SpecificEventId: specificEventId,
        });
    } catch (err) {
        console.error("❌ Error generating captcha:", err);
        res.status(500).json({ error: "Failed to generate captcha" });
    }
};

// 3. Verify captcha
export const verifyCaptchaForPenalty = async (req, res) => {
    try {
        const { accountabilityId, specificEventId } = req.params;
        const { answer } = req.body;

        const penalty = await PenaltyCollection.findOne({
            AccountabilityId: accountabilityId,
            SpecificEventId: specificEventId,
            userId: req.userId,
            status: "pending",
        });

        if (!penalty) {
            return res.status(404).json({ error: "Penalty not found or not active" });
        }

        const key = `${accountabilityId}:${specificEventId}`;
        const expected = captchaMemory.get(key);
        console.log("Expected:", expected, "Received:", answer);

        if (!expected) {
            return res.status(400).json({ error: "No captcha generated for this penalty" });
        }

        if (answer === expected) {
            penalty.solvedCount += 1;

            if (penalty.solvedCount >= solveThreshold) {
                await cancelAllPenaltyTimers();
                await PenaltyCollection.deleteMany({});
                captchaMemory.clear();

                await sendCustomNotification(
                    req.userId,
                    "✅ All Penalties & Timers Cleared",
                    `<p>Great news 🎉</p>
                     <p>You have successfully solved enough captchas.</p>
                     <p>All active penalties and their timers have been <strong>cleared</strong>. No worries 🚀.</p>
                     <p>Stay consistent and keep up the discipline!</p>`
                );

                return res.json({
                    success: true,
                    solvedCount: penalty.solvedCount,
                    waived: true,
                    AccountabilityId: accountabilityId,
                    SpecificEventId: specificEventId
                });
            }

            await penalty.save();
            captchaMemory.delete(key);

            return res.json({
                success: true,
                solvedCount: penalty.solvedCount,
                waived: false,
                required: solveThreshold,
                AccountabilityId: penalty.AccountabilityId,
                SpecificEventId: penalty.SpecificEventId
            });
        } else {
            return res.status(400).json({ error: "Incorrect captcha" });
        }
    } catch (err) {
        console.error("❌ Error verifying captcha:", err);
        res.status(500).json({ error: "Failed to verify captcha" });
    }
};
