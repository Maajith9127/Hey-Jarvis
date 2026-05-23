
// import PositionsCollection from "../models/PositionsCollection.js";
// export const HandlePositionsSave = async (positionsPayload, userId) => {
//     try {
//         console.log(
//             "📥 Incoming positionsPayload:",
//             JSON.stringify(positionsPayload, null, 2)
//         );
//         console.log("👤 User ID:", userId);

//         const { positions } = positionsPayload;

//         //  Traverse each photo group element
//         for (const group of positions) {
//             const { photoId, changed, particularPhotos = [] } = group;

//             console.log(`➡️ Processing photoId: ${photoId}, changed: ${changed}`);

//             // 🗑️ Case 1: whole photoId group marked deleted
//             if (changed === "deleted") {
//                 await PositionsCollection.deleteOne({ userId, photoId });
//                 console.log(`🗑️ Deleted entire photoId group: ${photoId}`);
//                 continue; // skip further processing for this group
//             }

//             // 🔍 Check if this photoId group exists in DB
//             let dbGroup = await PositionsCollection.findOne({ userId, photoId });

//             if (!dbGroup) {
//                 // 📝 Create new group document if it doesn't exist
//                 dbGroup = await PositionsCollection.create({
//                     userId,
//                     photoId,
//                     particularPhotos: []
//                 });
//                 console.log(`✨ Created new group for photoId: ${photoId}`);
//             }

//             // 📊 Separate particularPhotos into arrays based on what needs to be done
//             const toAdd = [];
//             const toUpdate = [];
//             const toDelete = [];

//             for (const pPhoto of particularPhotos) {
//                 const { ParticularPhotoId, ParticularPhotoUrl, changed, positions = [] } = pPhoto;

//                 console.log(`   🔍 Checking ParticularPhotoId: ${ParticularPhotoId}, changed: ${changed}`);

//                 // 🔍 Check if this particularPhoto exists in the DB group
//                 const existsInDb = dbGroup.particularPhotos?.find(
//                     (pp) => pp.ParticularPhotoId === ParticularPhotoId
//                 );

//                 if (changed === "deleted") {
//                     // 🗑️ Mark for deletion (only if exists in DB)
//                     if (existsInDb) {
//                         toDelete.push(ParticularPhotoId);
//                         console.log(`   🗑️ Marked for deletion: ${ParticularPhotoId}`);
//                     }
//                 } else if (changed === true) {
//                     if (!existsInDb) {
//                         // ➕ Add new particularPhoto
//                         toAdd.push({
//                             ParticularPhotoId,
//                             ParticularPhotoUrl,
//                             positions: positions.filter(pos => pos.changed !== "deleted") // Don't add deleted positions
//                         });
//                         console.log(`   ➕ Marked for addition: ${ParticularPhotoId}`);
//                     } else {
//                         //  Update existing particularPhoto
//                         toUpdate.push({
//                             ParticularPhotoId,
//                             ParticularPhotoUrl,
//                             positions: positions.filter(pos => pos.changed !== "deleted") // Filter out deleted positions
//                         });
//                         console.log(`Marked for update: ${ParticularPhotoId}`);
//                     }
//                 }
//                 // If changed === false, skip (no action needed)
//             }

//             // 🎯 Execute Database Operations

//             // 1️⃣ Handle Deletions
//             for (const particularPhotoId of toDelete) {
//                 await PositionsCollection.updateOne(
//                     { userId, photoId },
//                     { $pull: { particularPhotos: { ParticularPhotoId: particularPhotoId } } }
//                 );
//                 console.log(`🗑️ Deleted particularPhoto: ${particularPhotoId}`);
//             }

//             // 2️⃣ Handle Additions
//             for (const pPhoto of toAdd) {
//                 await PositionsCollection.updateOne(
//                     { userId, photoId },
//                     { $push: { particularPhotos: pPhoto } }
//                 );
//                 console.log(`➕ Added new particularPhoto: ${pPhoto.ParticularPhotoId}`);
//             }

//             // 3️⃣ Handle Updates
//             for (const pPhoto of toUpdate) {
//                 await PositionsCollection.updateOne(
//                     { userId, photoId, "particularPhotos.ParticularPhotoId": pPhoto.ParticularPhotoId },
//                     {
//                         $set: {
//                             "particularPhotos.$.ParticularPhotoUrl": pPhoto.ParticularPhotoUrl,
//                             "particularPhotos.$.positions": pPhoto.positions || [],
//                         },
//                     }
//                 );
//                 console.log(`🔄 Updated particularPhoto: ${pPhoto.ParticularPhotoId}`);
//             }

//             console.log(`✅ Completed processing for photoId: ${photoId}`);
//             console.log(
//                 `   📊 Stats - Added: ${toAdd.length}, Updated: ${toUpdate.length}, Deleted: ${toDelete.length}`
//             );
//         }

//         return { success: true, message: "✅ Positions saved/updated successfully" };
//     } catch (error) {
//         console.error("❌ Error in HandlePositionsSave:", error);
//         throw error;
//     }
// };

// export const GetPositions = async (userId) => {
//     try {
//         const positions = await PositionsCollection.find({ userId });
//         return { positions };
//     } catch (error) {
//         console.error("❌ Error fetching positions:", error);
//         throw error;
//     }
// };


import PositionsCollection from "../models/PositionsCollection.js";
import PhotoCollection from "../models/PhotoCollection.js";

//  Save / Update Positions
export const HandlePositionsSave = async (positionsPayload, userId) => {
    try {
        console.log("📥 Incoming positionsPayload:", JSON.stringify(positionsPayload, null, 2));
        console.log("👤 User ID:", userId);

        const { positions } = positionsPayload;

        for (const group of positions) {
            const { photoId, changed, particularPhotos = [] } = group;

            console.log(`➡️ Processing photoId: ${photoId}, changed: ${changed}`);

            //  Strict Mode check
            const photoDoc = await PhotoCollection.findOne({ id: photoId, userId });
            if (photoDoc?.StrictMode) {
                const strictUntil = new Date(photoDoc.StrictMode).getTime();
                if (Date.now() < strictUntil) {
                    console.log(` Strict Mode active for ${photoId} until ${photoDoc.StrictMode}`);
                    return {
                        success: false,
                        strict: true,
                        message: `Strict Mode active until ${new Date(strictUntil).toLocaleString()}`
                    };
                }
            }

            // Case 1: whole photoId group marked deleted
            if (changed === "deleted") {
                await PositionsCollection.deleteOne({ userId, photoId });
                console.log(` Deleted entire photoId group: ${photoId}`);
                continue;
            }

            // 🔍 Check if this photoId group exists in DB
            let dbGroup = await PositionsCollection.findOne({ userId, photoId });

            if (!dbGroup) {
                dbGroup = await PositionsCollection.create({
                    userId,
                    photoId,
                    particularPhotos: []
                });
                console.log(`✨ Created new group for photoId: ${photoId}`);
            }

            const toAdd = [];
            const toUpdate = [];
            const toDelete = [];

            for (const pPhoto of particularPhotos) {
                const { ParticularPhotoId, ParticularPhotoUrl, changed, positions = [] } = pPhoto;

                const existsInDb = dbGroup.particularPhotos?.find(
                    (pp) => pp.ParticularPhotoId === ParticularPhotoId
                );

                if (changed === "deleted") {
                    if (existsInDb) toDelete.push(ParticularPhotoId);
                } else if (changed === true) {
                    if (!existsInDb) {
                        toAdd.push({
                            ParticularPhotoId,
                            ParticularPhotoUrl,
                            positions: positions.filter(pos => pos.changed !== "deleted")
                        });
                    } else {
                        toUpdate.push({
                            ParticularPhotoId,
                            ParticularPhotoUrl,
                            positions: positions.filter(pos => pos.changed !== "deleted")
                        });
                    }
                }
            }

            //Deletions
            for (const particularPhotoId of toDelete) {
                await PositionsCollection.updateOne(
                    { userId, photoId },
                    { $pull: { particularPhotos: { ParticularPhotoId: particularPhotoId } } }
                );
            }

            //  Additions
            for (const pPhoto of toAdd) {
                await PositionsCollection.updateOne(
                    { userId, photoId },
                    { $push: { particularPhotos: pPhoto } }
                );
            }

            //  Updates
            for (const pPhoto of toUpdate) {
                await PositionsCollection.updateOne(
                    { userId, photoId, "particularPhotos.ParticularPhotoId": pPhoto.ParticularPhotoId },
                    {
                        $set: {
                            "particularPhotos.$.ParticularPhotoUrl": pPhoto.ParticularPhotoUrl,
                            "particularPhotos.$.positions": pPhoto.positions || [],
                        },
                    }
                );
            }

            console.log(`Completed processing for photoId: ${photoId}`);
        }

        return { success: true, message: "Positions saved/updated successfully" };
    } catch (error) {
        console.error("Error in HandlePositionsSave:", error);
        throw error;
    }
};

//Fetch Positions
export const GetPositions = async (userId) => {
    try {
        const positions = await PositionsCollection.find({ userId }).lean();

        const masked = await Promise.all(
            positions.map(async (group) => {
                const photoDoc = await PhotoCollection.findOne({ id: group.photoId, userId }).lean();

                if (photoDoc?.StrictMode) {
                    const strictUntil = new Date(photoDoc.StrictMode).getTime();
                    if (Date.now() < strictUntil) {
                        console.log(` Strict Mode active for ${group.photoId}, masking strings + positions + replacing URL`);

                        return {
                            ...group,
                            particularPhotos: group.particularPhotos.map(p => ({
                                ...p,
                                ParticularPhotoUrl: "https://www.drupal.org/files/issues/sample-im-10.png", // 🔁 static URL
                                positions: p.positions.map(pos => ({
                                    ...pos,
                                    position: "*************", //mask position
                                    string: "*************"   //mask string
                                }))
                            }))
                        };
                    }
                }

                //  Not in Strict Mode → return normally
                return group;
            })
        );

        return { positions: masked };
    } catch (error) {
        console.error("Error fetching positions:", error);
        throw error;
    }
};

