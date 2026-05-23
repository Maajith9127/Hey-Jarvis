// import mongoose from "mongoose";

// const PositionSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     photoId: { type: String, required: true },
//     particularPhotos: {
//         type: [
//             {
//                 ParticularPhotoId: String,
//                 ParticularPhotoUrl: String,
//                 positions: [
//                     {
//                         positionid: String,
//                         position: String,
//                         string: String,
//                     }
//                 ]
//             }
//         ],
//         default: []   //important!
//     }
// });


// const ParticularPhotoSchema = new mongoose.Schema({
//     ParticularPhotoId: { type: String, required: true },  // UUID
//     ParticularPhotoUrl: { type: String, default: "" },
//     positions: [PositionSchema]    // embed positions inside
// });

// const PhotoGroupSchema = new mongoose.Schema({
//     photoId: { type: String, required: true },       // id from PhotoSlice
//     particularPhotos: [ParticularPhotoSchema]
// });

// // Root model for the collection
// const PositionsCollectionSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // scope per user
//     items: [PhotoGroupSchema]
// }, { timestamps: true });

// export default mongoose.model("PositionsCollection", PositionsCollectionSchema);



import mongoose from "mongoose";

// Individual position schema (inside particularPhotos)
const PositionSchema = new mongoose.Schema({
    positionid: { type: String, required: true },
    position: { type: String, default: "" },
    string: { type: String, default: "" },
}, { _id: false }); // Disable _id for subdocuments

// ParticularPhoto schema (inside each photo group)
const ParticularPhotoSchema = new mongoose.Schema({
    ParticularPhotoId: { type: String, required: true },
    ParticularPhotoUrl: { type: String, default: "" },
    positions: [PositionSchema]
}, { _id: false }); // Disable _id for subdocuments

// Root collection schema - one document per photoId per user
const PositionsCollectionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    photoId: { type: String, required: true }, // Each document represents one photo
    particularPhotos: [ParticularPhotoSchema]
}, { 
    timestamps: true,
    // Create compound index for efficient queries
    indexes: [
        { userId: 1, photoId: 1 } // Unique combo of user + photo
    ]
});

// Ensure one document per user per photo
PositionsCollectionSchema.index({ userId: 1, photoId: 1 }, { unique: true });

export default mongoose.model("PositionsCollection", PositionsCollectionSchema);