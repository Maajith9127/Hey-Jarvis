import mongoose from "mongoose";

const RandomisedSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserCollection",
            required: true,
        },
        AccountabilityId: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["MessageCollection", "PayoutCollection"],
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        numberOfEvents: {
            type: Number,
            required: true,
            min: 1,
        },
        slotDuration: {
            type: Number,
            required: true,
            min: 1,
        },
        maxAccountabilities: {
            type: Number,
            required: true,
            min: 1,
        },
        // Optional future field to connect to a Todo
        TodoId: {
            type: String,
            default: null,
        },
        StrictMode: {
            type: Date,
            default: null,
        }
    },
    { timestamps: true }
);

const Randomised = mongoose.model("RandomisedCollection", RandomisedSchema);
export default Randomised;
