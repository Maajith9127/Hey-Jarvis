import mongoose from "mongoose";

const PenaltySchema = new mongoose.Schema({
  userId: { type: String, required: true },

  // Accountability event details
  AccountabilityId: { type: String, required: true },
  SpecificEventId: { type: String, required: true },
  collectionType: { type: String, required: true }, // e.g. "calendar", "photo", etc.

  // Captcha tracking
  solvedCount: { type: Number, default: 0 }, // must reach 170

  // Expiry
  expiresAt: { type: Date, required: true }, // 3 hours after penalty creation

  // Status
  status: {
    type: String,
    enum: ["pending", "waived", "enforced"],
    default: "pending",
  },
});

//  Virtual field: how many left to solve
PenaltySchema.virtual("remaining").get(function () {
  return Math.max(170 - this.solvedCount, 0);
});

export default mongoose.model("PenaltyCollection", PenaltySchema);
