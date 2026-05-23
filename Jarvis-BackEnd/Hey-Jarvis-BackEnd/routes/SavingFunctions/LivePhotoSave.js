
// import PhotoCollection from "../../models/PhotoCollection.js";
// // Main delta-based save handler
// const HandleLivePhotoSave = async ({ added = [], updated = [], deleted = [] }, session) => {
//     console.log('📥 Inside HandleLivePhotoSave with delta mode');

//     const bulkOps = [];

//     // DELETE
//     deleted.forEach(id => {
//         bulkOps.push({
//             deleteOne: {
//                 filter: { id }
//             }
//         });
//     });

//     // ADD
//     added.forEach(photo => {
//         bulkOps.push({
//             insertOne: {
//                 document: photo
//             }
//         });
//     });

//     // UPDATE
//     updated.forEach(photo => {
//         const updateFields = {};
//         if (photo.photoName !== undefined) updateFields.photoName = photo.photoName;
//         if (photo.PhotoUrl !== undefined) updateFields.PhotoUrl = photo.PhotoUrl;

//         bulkOps.push({
//             updateOne: {
//                 filter: { id: photo.id },
//                 update: { $set: updateFields }
//             }
//         });
//     });

//     // Execute only if there are changes
//     if (bulkOps.length > 0) {
//         const options = session ? { session } : {};
//         await PhotoCollection.bulkWrite(bulkOps, options);
//         console.log("✅ Bulk operations executed:", bulkOps.length);
//     } else {
//         console.log("🟡 No operations to perform.");
//     }

//     return {
//         added: added.length,
//         updated: updated.length,
//         deleted: deleted.length
//     };
// };

// // Fetch all photos from DB
// const GetLivePhotos = async (session) => {
//     try {
//         const photos = await PhotoCollection.find({}).session(session).lean();
//         const PhotoCollections = photos.map((photo) => ({
//             id: photo.id,
//             photoName: photo.photoName,
//             PhotoUrl: photo.PhotoUrl || '',
//             StrictMode: photo.StrictMode
//         }));
//         return { photos: PhotoCollections };
//     } catch (error) {
//         console.error('❌ Error fetching photos:', error);
//     }
// };

// export {
//     HandleLivePhotoSave,
//     GetLivePhotos
// };



