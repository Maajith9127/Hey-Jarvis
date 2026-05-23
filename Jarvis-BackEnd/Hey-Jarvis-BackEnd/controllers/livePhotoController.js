// // controllers/livePhotoController.js
// import PhotoCollection from '../models/PhotoCollection.js';
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { verifyAccountability } from '../routes/SavingFunctions/OtherHelperFunctions/VerifyAccountability.js';
// import { analyzeMoire } from '../utils/moireChecker.js';
// const ChallengeMap = new Map(); // Keep this here since it belongs to challenge tracking

// const convertImageUrlToBase64 = async (imageUrl) => {
//     try {
//         const response = await fetch(imageUrl);
//         const arrayBuffer = await response.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);
//         const contentType = response.headers.get('content-type') || 'image/jpeg';
//         return `data:${contentType};base64,${buffer.toString('base64')}`;
//     } catch (error) {
//         console.error('Failed to convert image to base64:', error);
//         return null;
//     }
// };
// export const generateChallengeController = async (req, res) => {
//     const userId = req.userId;
//     const { TodoId, Accountability } = req.body;
//     console.log('Acc::', Accountability);


//     console.log(" [Challenge Gen] Requested by user:", userId, "For Todo:", TodoId);

//     const photo = await PhotoCollection.findOne({ id: TodoId, userId });
//     if (!photo?.PhotoUrl) {
//         console.warn(" [Challenge Gen] Photo not found for user:", userId);
//         return res.status(404).json({ error: "Photo not found for this user" });
//     }

//     const UploadedImageInBase64 = await convertImageUrlToBase64(photo.PhotoUrl);

//     try {
//         const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//         const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" }, { apiVersion: "v1beta" });

//         const result = await model.generateContent([
//             {
//                 text: `Generate a short, clear visual challenge the user must perform in the photo given to prove it was taken live. The challenge should be simple, visually verifiable, and safe to do in public. Avoid predictable gestures.`
//             },
//             {
//                 inlineData: {
//                     mimeType: "image/jpeg",
//                     data: UploadedImageInBase64.split(",")[1]
//                 }
//             }
//         ]);

//         const ChallengeText = result.response.text().trim();
//         const generatedAt = Date.now();
//         const challengeKey = `${userId}_${TodoId}`;
//         ChallengeMap.set(challengeKey, { text: ChallengeText, generatedAt });

//         setTimeout(() => {
//             ChallengeMap.delete(challengeKey);
//             console.log(` [Challenge Expired] Key: ${challengeKey}`);
//         }, 30000);

//         console.log(" [Challenge Gen] Challenge Generated:", ChallengeText);
//         return res.json({ Challenge: ChallengeText, GeneratedAt: generatedAt });
//     } catch (err) {
//         const updateSuccess = await verifyAccountability({
//             VerificationResult: "1",
//             Accountability,
//             userId,
//         });

//         if (!updateSuccess) {
//             return res.status(400).json({ error: "Accountability verification fallback failed" });
//         }

//         return res.status(400).json({
//             message: "Our internal AI failed to generate a challenge. But don’t worry — your accountability task has been verified.",
//             verification: "Verified",
//             systemError: true
//         });
//     }
// };
// export const verifyLivePhotoController = async (req, res) => {
//     const userId = req.userId;
//     const { image, TodoId, Accountabilitiy } = req.body;

//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" }, { apiVersion: "v1beta" });

//     // Step 1: Moiré analysis prompt for the NEW image
//     const moirePrompt = [
//         {
//             text: `You are an AI authenticity checker. I am uploading an image. Your task is to simulate a moiré pattern analysis — analyze the image and give a moiré score between 0 and 100 (0 = no moiré at all, 100 = extreme moiré interference).

// Return only:
// - 'true' — if the moiré score is less than 10.
// - 'false | [reason]' — if score is 10 or more. Reason must be short, e.g., "moire lines visible", "screen grid detected", etc.

// No extra comments. Output must strictly be either:
// - true
// - false | [reason]`
//         },
//         {
//             inlineData: {
//                 mimeType: "image/jpeg",
//                 data: image.split(",")[1] // 🔍 analyzing captured image
//             }
//         }
//     ];

//     let moireResponse;
//     try {
//         const moireResult = await model.generateContent(moirePrompt);
//         moireResponse = moireResult.response.text().trim().toLowerCase();
//         console.log("🔍 Gemini Moiré Response:", moireResponse);

//         if (moireResponse === "true") {
//             console.log("✅ Moiré check passed. Proceeding to challenge verification...");
//         } else if (moireResponse.startsWith("false")) {
//             const reason = moireResponse.split("|")[1]?.trim() || "Unclear moiré reason";
//             return res.status(400).json({
//                 verification: "Rejected",
//                 reason: `❌ Moiré check failed — ${reason}`
//             });
//         } else {
//             throw new Error("Unexpected Gemini Moiré format");
//         }
//     } catch (err) {
//         console.error("❌ Moiré check failed:", err);

//         const updateSuccess = await verifyAccountability({
//             VerificationResult: "1", // fallback verified
//             Accountability: Accountabilitiy,
//             userId,
//         });

//         if (!updateSuccess) {
//             return res.status(400).json({ error: "Verification fallback failed" });
//         }

//         return res.status(200).json({
//             verification: "Verified",
//             message: "Gemini moiré check failed, but your accountability task has been marked complete.",
//             systemError: true
//         });
//     }

//     // Step 2: Challenge verification

//     console.log(" [Verify] Verification requested by:", userId, "Todo:", TodoId, "AccId:", Accountabilitiy);

//     if (!image || !TodoId) {
//         console.warn("[Verify] Missing image or TodoId");
//         return res.status(400).json({ error: "Missing image or TodoId" });
//     }

//     const challengeKey = `${userId}_${TodoId}`;
//     const challengeData = ChallengeMap.get(challengeKey);
//     if (!challengeData) {
//         console.warn(" [Verify] Challenge not found or expired for key:", challengeKey);
//         return res.status(400).json({ error: "Challenge not found or expired" });
//     }

//     const { text: ChallengeText } = challengeData;

//     try {
//         const photo = await PhotoCollection.findOne({ id: TodoId, userId });
//         if (!photo?.PhotoUrl) {
//             console.warn(" [Verify] Uploaded photo not found for Todo:", TodoId);
//             return res.status(404).json({ error: "Uploaded photo not found for this user" });
//         }

//         const UploadedImageInBase64 = await convertImageUrlToBase64(photo.PhotoUrl);
//         const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//         const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" }, { apiVersion: "v1beta" });

//         const prompt = [
//             {
//                 text: `Here are two images:
// 1. Uploaded earlier.
// 2. Captured just now, after being shown this challenge: ${ChallengeText}

// Return only:
// - 1 → if the challenge is clearly followed

// but
//  if failed then return the reason on why it was not verified or failed
// if verficattion failed return the exact reason why it failed, so that the user can improve next time.
// Be very strict. Prevent cheating via screenshots or fakes. No extra words in output.`
//             },
//             {
//                 inlineData: { mimeType: "image/jpeg", data: UploadedImageInBase64.split(",")[1] }
//             },
//             {
//                 inlineData: { mimeType: "image/jpeg", data: image.split(",")[1] }
//             }
//         ];

//         const result = await model.generateContent(prompt);
//         const VerificationResult = result.response.text().trim();

//         console.log(" [Verify] Gemini Response:", VerificationResult);

//         if (VerificationResult === "1") {
//             const updateSuccess = await verifyAccountability({
//                 VerificationResult,
//                 Accountability: Accountabilitiy,
//                 userId,
//             });

//             if (!updateSuccess) {
//                 console.warn(" [Verify] DB update failed for verified result");
//                 return res.status(400).json({ verification: "Time range invalid or update failed" });
//             }

//             ChallengeMap.delete(challengeKey);
//             console.log(" [Verify] Verification Passed. Accountability Updated.");
//             return res.status(200).json({ verification: "Verified" });
//         } else {
//             console.log(" [Verify] Challenge not satisfied. Marked Not Verified.");
//             return res.status(200).json({ verification: VerificationResult });
//         }
//     } catch (err) {
//         console.error(" [Verify] Gemini error:", err);

//         //  Force verify anyway
//         const updateSuccess = await verifyAccountability({
//             VerificationResult: "1", // Pretend it's passed
//             Accountability: Accountabilitiy,
//             userId,
//         });

//         if (!updateSuccess) {
//             return res.status(400).json({ error: "Verification fallback failed" });
//         }

//         ChallengeMap.delete(challengeKey);

//         return res.status(200).json({
//             verification: "Verified",
//             message: "Our verification system faced an internal error, but don’t worry — your task has been verified.",
//             systemError: true
//         });
//     }
// };
// //  Save photos for a specific user
// export const HandleLivePhotoSave = async ({ added = [], updated = [], deleted = [] }, userId, session) => {
//     console.log('📥 Inside HandleLivePhotoSave with delta mode');

//     const bulkOps = [];

//     // DELETE: Only delete photos that belong to the current user
//     deleted.forEach(id => {
//         bulkOps.push({
//             deleteOne: {
//                 filter: { id, userId }
//             }
//         });
//     });

//     // ADD: Include userId in each photo
//     added.forEach(photo => {
//         bulkOps.push({
//             insertOne: {
//                 document: {
//                     ...photo,
//                     userId
//                 }
//             }
//         });
//     });

//     // UPDATE: Only update photos that belong to the current user
//     updated.forEach(photo => {
//         const updateFields = {};
//         if (photo.photoName !== undefined) updateFields.photoName = photo.photoName;
//         if (photo.PhotoUrl !== undefined) updateFields.PhotoUrl = photo.PhotoUrl;

//         bulkOps.push({
//             updateOne: {
//                 filter: { id: photo.id, userId },
//                 update: { $set: updateFields }
//             }
//         });
//     });

//     // Execute operations
//     if (bulkOps.length > 0) {
//         const options = session ? { session } : {};
//         await PhotoCollection.bulkWrite(bulkOps, options);
//         console.log("✅ Bulk operations executed:", bulkOps.length);
//     } else {
//         console.log(" No operations to perform.");
//     }

//     return {
//         added: added.length,
//         updated: updated.length,
//         deleted: deleted.length
//     };
// };
// //Fetch only the logged-in user's photos
// export const GetLivePhotos = async (userId, session) => {
//     try {
//         const photos = await PhotoCollection.find({ userId }).session(session).lean();

//         const formatted = photos.map(photo => ({
//             id: photo.id,
//             photoName: photo.photoName,
//             PhotoUrl: photo.PhotoUrl || '',
//             StrictMode: photo.StrictMode
//         }));

//         return { photos: formatted };
//     } catch (error) {
//         console.error('Error fetching photos:', error);
//         throw error;
//     }
// };













// controllers/livePhotoController.js
import PhotoCollection from '../models/PhotoCollection.js';
import { verifyAccountability } from '../routes/SavingFunctions/OtherHelperFunctions/VerifyAccountability.js';
import PositionsCollection from '../models/PositionsCollection.js';

// utils/config.js (you can also inline but better to centralize)
export const CHALLENGE_TIME_LIMIT = parseInt(process.env.CHALLENGE_TIME_LIMIT || "180", 10); // default 3min
const ChallengeMap = new Map(); // Keep this here since it belongs to challenge tracking

// export const generateChallengeController = async (req, res) => {
//     const userId = req.userId;
//     const { TodoId, Accountability } = req.body;
//     console.log('Acc::', Accountability);


//     console.log(" [Challenge Gen] Requested by user:", userId, "For Todo:", TodoId);

//     const photo = await PhotoCollection.findOne({ id: TodoId, userId });
//     if (!photo?.PhotoUrl) {
//         console.warn(" [Challenge Gen] Photo not found for user:", userId);
//         return res.status(404).json({ error: "Photo not found for this user" });
//     }

//     const UploadedImageInBase64 = await convertImageUrlToBase64(photo.PhotoUrl);

//     try {
//         const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//         const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" }, { apiVersion: "v1beta" });

//         const result = await model.generateContent([
//             {
//                 text: `Generate a short, clear visual challenge the user must perform in the photo given to prove it was taken live. The challenge should be simple, visually verifiable, and safe to do in public. Avoid predictable gestures.`
//             },
//             {
//                 inlineData: {
//                     mimeType: "image/jpeg",
//                     data: UploadedImageInBase64.split(",")[1]
//                 }
//             }
//         ]);

//         const ChallengeText = result.response.text().trim();
//         const generatedAt = Date.now();
//         const challengeKey = `${userId}_${TodoId}`;
//         ChallengeMap.set(challengeKey, { text: ChallengeText, generatedAt });

//         setTimeout(() => {
//             ChallengeMap.delete(challengeKey);
//             console.log(` [Challenge Expired] Key: ${challengeKey}`);
//         }, 30000);

//         console.log(" [Challenge Gen] Challenge Generated:", ChallengeText);
//         return res.json({ Challenge: ChallengeText, GeneratedAt: generatedAt });
//     } catch (err) {
//         const updateSuccess = await verifyAccountability({
//             VerificationResult: "1",
//             Accountability,
//             userId,
//         });

//         if (!updateSuccess) {
//             return res.status(400).json({ error: "Accountability verification fallback failed" });
//         }

//         return res.status(400).json({
//             message: "Our internal AI failed to generate a challenge. But don’t worry — your accountability task has been verified.",
//             verification: "Verified",
//             systemError: true
//         });
//     }
// };

// export const verifyLivePhotoController = async (req, res) => {
//     const userId = req.userId;
//     const { image, TodoId, Accountabilitiy } = req.body;

//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" }, { apiVersion: "v1beta" });

//     // Step 1: Moiré analysis prompt for the NEW image
//     const moirePrompt = [
//         {
//             text: `You are an AI authenticity checker. I am uploading an image. Your task is to simulate a moiré pattern analysis — analyze the image and give a moiré score between 0 and 100 (0 = no moiré at all, 100 = extreme moiré interference).

// Return only:
// - 'true' — if the moiré score is less than 10.
// - 'false | [reason]' — if score is 10 or more. Reason must be short, e.g., "moire lines visible", "screen grid detected", etc.

// No extra comments. Output must strictly be either:
// - true
// - false | [reason]`
//         },
//         {
//             inlineData: {
//                 mimeType: "image/jpeg",
//                 data: image.split(",")[1] // 🔍 analyzing captured image
//             }
//         }
//     ];

//     let moireResponse;
//     try {
//         const moireResult = await model.generateContent(moirePrompt);
//         moireResponse = moireResult.response.text().trim().toLowerCase();
//         console.log("🔍 Gemini Moiré Response:", moireResponse);

//         if (moireResponse === "true") {
//             console.log("✅ Moiré check passed. Proceeding to challenge verification...");
//         } else if (moireResponse.startsWith("false")) {
//             const reason = moireResponse.split("|")[1]?.trim() || "Unclear moiré reason";
//             return res.status(400).json({
//                 verification: "Rejected",
//                 reason: `❌ Moiré check failed — ${reason}`
//             });
//         } else {
//             throw new Error("Unexpected Gemini Moiré format");
//         }
//     } catch (err) {
//         console.error("❌ Moiré check failed:", err);

//         const updateSuccess = await verifyAccountability({
//             VerificationResult: "1", // fallback verified
//             Accountability: Accountabilitiy,
//             userId,
//         });

//         if (!updateSuccess) {
//             return res.status(400).json({ error: "Verification fallback failed" });
//         }

//         return res.status(200).json({
//             verification: "Verified",
//             message: "Gemini moiré check failed, but your accountability task has been marked complete.",
//             systemError: true
//         });
//     }

//     // Step 2: Challenge verification

//     console.log(" [Verify] Verification requested by:", userId, "Todo:", TodoId, "AccId:", Accountabilitiy);

//     if (!image || !TodoId) {
//         console.warn("[Verify] Missing image or TodoId");
//         return res.status(400).json({ error: "Missing image or TodoId" });
//     }

//     const challengeKey = `${userId}_${TodoId}`;
//     const challengeData = ChallengeMap.get(challengeKey);
//     if (!challengeData) {
//         console.warn(" [Verify] Challenge not found or expired for key:", challengeKey);
//         return res.status(400).json({ error: "Challenge not found or expired" });
//     }

//     const { text: ChallengeText } = challengeData;

//     try {
//         const photo = await PhotoCollection.findOne({ id: TodoId, userId });
//         if (!photo?.PhotoUrl) {
//             console.warn(" [Verify] Uploaded photo not found for Todo:", TodoId);
//             return res.status(404).json({ error: "Uploaded photo not found for this user" });
//         }

//         const UploadedImageInBase64 = await convertImageUrlToBase64(photo.PhotoUrl);
//         const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//         const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" }, { apiVersion: "v1beta" });

//         const prompt = [
//             {
//                 text: `Here are two images:
// 1. Uploaded earlier.
// 2. Captured just now, after being shown this challenge: ${ChallengeText}

// Return only:
// - 1 → if the challenge is clearly followed

// but
//  if failed then return the reason on why it was not verified or failed
// if verficattion failed return the exact reason why it failed, so that the user can improve next time.
// Be very strict. Prevent cheating via screenshots or fakes. No extra words in output.`
//             },
//             {
//                 inlineData: { mimeType: "image/jpeg", data: UploadedImageInBase64.split(",")[1] }
//             },
//             {
//                 inlineData: { mimeType: "image/jpeg", data: image.split(",")[1] }
//             }
//         ];

//         const result = await model.generateContent(prompt);
//         const VerificationResult = result.response.text().trim();

//         console.log(" [Verify] Gemini Response:", VerificationResult);

//         if (VerificationResult === "1") {
//             const updateSuccess = await verifyAccountability({
//                 VerificationResult,
//                 Accountability: Accountabilitiy,
//                 userId,
//             });

//             if (!updateSuccess) {
//                 console.warn(" [Verify] DB update failed for verified result");
//                 return res.status(400).json({ verification: "Time range invalid or update failed" });
//             }

//             ChallengeMap.delete(challengeKey);
//             console.log(" [Verify] Verification Passed. Accountability Updated.");
//             return res.status(200).json({ verification: "Verified" });
//         } else {
//             console.log(" [Verify] Challenge not satisfied. Marked Not Verified.");
//             return res.status(200).json({ verification: VerificationResult });
//         }
//     } catch (err) {
//         console.error(" [Verify] Gemini error:", err);

//         //  Force verify anyway
//         const updateSuccess = await verifyAccountability({
//             VerificationResult: "1", // Pretend it's passed
//             Accountability: Accountabilitiy,
//             userId,
//         });

//         if (!updateSuccess) {
//             return res.status(400).json({ error: "Verification fallback failed" });
//         }

//         ChallengeMap.delete(challengeKey);

//         return res.status(200).json({
//             verification: "Verified",
//             message: "Our verification system faced an internal error, but don’t worry — your task has been verified.",
//             systemError: true
//         });
//     }
// };
//  Save photos for a specific user
export const generateChallengeController = async (req, res) => {
    const userId = req.userId;
    const { TodoId, Accountability } = req.body;
    console.log(" [Challenge Gen] Multi-step random requested by:", userId, "For Todo:", TodoId);

    try {
        const challengeKey = `${userId}_${TodoId}`;

        // Check if a challenge already exists for this user & todo
        if (ChallengeMap.has(challengeKey)) {
            return res.status(400).json({
                error: "An active challenge already exists. Please complete it before generating a new one."
            });
        }

        // --- existing code continues here ---
        const dbGroup = await PositionsCollection.findOne({ userId, photoId: TodoId });
        if (!dbGroup || !dbGroup.particularPhotos || dbGroup.particularPhotos.length === 0) {
            return res.status(404).json({ error: "No positions found for this photo" });
        }

        const challenges = [];
        for (let i = 0; i < 3; i++) {
            const pPhoto = dbGroup.particularPhotos[Math.floor(Math.random() * dbGroup.particularPhotos.length)];
            if (!pPhoto.positions || pPhoto.positions.length === 0) continue;

            const pos = pPhoto.positions[Math.floor(Math.random() * pPhoto.positions.length)];
            challenges.push({
                photoUrl: pPhoto.ParticularPhotoUrl,
                position: pos.position,
                hiddenString: pos.string
            });
        }

        if (challenges.length === 0) {
            return res.status(400).json({ error: "No usable positions found to generate challenge" });
        }

        const generatedAt = Date.now();
        ChallengeMap.set(challengeKey, { challenges, step: 0, generatedAt });

        setTimeout(() => {
            ChallengeMap.delete(challengeKey);
            console.log(` [Challenge Expired] Key: ${challengeKey}`);
        }, CHALLENGE_TIME_LIMIT * 1000);

        const first = challenges[0];
        return res.json({
            Challenge: `POSITION: ${first.position}, ENTER THE STRING`,
            PhotoUrl: first.photoUrl,
            Step: 1,
            TotalSteps: challenges.length,
            GeneratedAt: generatedAt
        });

    } catch (err) {
        console.error("❌ Error in random challenge generation:", err);
        return res.status(500).json({ error: "Server error during challenge generation" });
    }
};

export const verifyLivePhotoController = async (req, res) => {
    const userId = req.userId;
    const { TodoId, enteredString, Accountability } = req.body;

    console.log(" [Verify] Multi-step verification:", { userId, TodoId, enteredString, Accountability });

    const challengeKey = `${userId}_${TodoId}`;
    const challengeData = ChallengeMap.get(challengeKey);

    if (!challengeData) {
        return res.status(400).json({ error: "Challenge not found or expired" });
    }

    const { challenges, step, generatedAt } = challengeData;

    if (step >= challenges.length) {
        return res.status(400).json({ error: "All challenges already completed" });
    }

    const current = challenges[step];

    //Compare user input with hidden string
    if (enteredString?.trim() === current.hiddenString?.trim()) {
        console.log(`✅ Step ${step + 1} passed for user ${userId}`);

        // Move to next step
        const nextStep = step + 1;
        if (nextStep < challenges.length) {
            // Save updated step
            ChallengeMap.set(challengeKey, { ...challengeData, step: nextStep });

            const nextChallenge = challenges[nextStep];
            return res.status(200).json({
                verification: "StepVerified",
                Step: nextStep + 1,
                TotalSteps: challenges.length,
                Challenge: `POSITION: ${nextChallenge.position}, ENTER THE STRING`,
                PhotoUrl: nextChallenge.photoUrl
            });
        } else {
            // All steps complete → mark accountability verified
            const updateSuccess = await verifyAccountability({
                VerificationResult: "1",
                Accountability,
                userId,
            });

            ChallengeMap.delete(challengeKey);

            if (!updateSuccess) {
                return res.status(400).json({ error: "Final accountability update failed" });
            }

            return res.status(200).json({ verification: "FullyVerified" });
        }
    } else {
        console.log(`Step ${step + 1} failed for user ${userId}`);

        // ChallengeMap.delete(challengeKey);
        return res.status(400).json({
            verification: "Rejected",
            reason: `Wrong string entered at step ${step + 1}`
        });
    }
};
//Hanndle photo save with user association
export const HandleLivePhotoSave = async ({ added = [], updated = [], deleted = [] }, userId, session) => {
    console.log(' Inside HandleLivePhotoSave with delta mode');

    const bulkOps = [];

    // DELETE: Only delete photos that belong to the current user
    deleted.forEach(id => {
        bulkOps.push({
            deleteOne: {
                filter: { id, userId }
            }
        });
    });

    // ADD: Include userId in each photo
    added.forEach(photo => {
        bulkOps.push({
            insertOne: {
                document: {
                    ...photo,
                    userId
                }
            }
        });
    });

    // UPDATE: Only update photos that belong to the current user
    updated.forEach(photo => {
        const updateFields = {};
        if (photo.photoName !== undefined) updateFields.photoName = photo.photoName;
        if (photo.PhotoUrl !== undefined) updateFields.PhotoUrl = photo.PhotoUrl;

        bulkOps.push({
            updateOne: {
                filter: { id: photo.id, userId },
                update: { $set: updateFields }
            }
        });
    });

    // Execute operations
    if (bulkOps.length > 0) {
        const options = session ? { session } : {};
        await PhotoCollection.bulkWrite(bulkOps, options);
        console.log(" Bulk operations executed:", bulkOps.length);
    } else {
        console.log(" No operations to perform.");
    }

    return {
        added: added.length,
        updated: updated.length,
        deleted: deleted.length
    };
};
//Fetch only the logged-in user's photos
export const GetLivePhotos = async (userId, session) => {
    try {
        const photos = await PhotoCollection.find({ userId }).session(session).lean();

        const formatted = photos.map(photo => ({
            id: photo.id,
            photoName: photo.photoName,
            PhotoUrl: photo.PhotoUrl || '',
            StrictMode: photo.StrictMode
        }));

        return { photos: formatted };
    } catch (error) {
        console.error('Error fetching photos:', error);
        throw error;
    }
};
// controllers/livePhotoController.js
export const getActiveChallengeController = async (req, res) => {
    const userId = req.userId;
    const { TodoId } = req.query; // pass TodoId from frontend

    const challengeKey = `${userId}_${TodoId}`;
    const challengeData = ChallengeMap.get(challengeKey);

    if (!challengeData) {
        return res.json({ active: false });
    }

    const { challenges, step, generatedAt } = challengeData;

    if (step >= challenges.length) {
        return res.json({ active: false });
    }

    const current = challenges[step];

    return res.json({
        active: true,
        Challenge: `POSITION: ${current.position}, ENTER THE STRING`,
        PhotoUrl: current.photoUrl,
        Step: step + 1,
        TotalSteps: challenges.length,
        GeneratedAt: generatedAt
    });
};


