

import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  id: {
    type: String,
    required: true,
    unique: true,
  },

  photoName: {
    type: String,
    required: true,
  },

  PhotoUrl: {
    type: String,
    required: false,
  },

  CollectionType: {
    type: String,
    required: true,
  },

  StrictMode: {
    type: String,
    required: false,
  },
}, { timestamps: true });

const PhotoCollection = mongoose.model("PhotoCollection", PhotoSchema);
export default PhotoCollection;
