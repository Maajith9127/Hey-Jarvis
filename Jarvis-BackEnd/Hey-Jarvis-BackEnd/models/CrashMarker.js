// models/CrashMarker.js
import mongoose from "mongoose";

const crashMarkerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true // one per service: main-server, accountability-worker, etc.
    },
    startedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("CrashMarker", crashMarkerSchema);
