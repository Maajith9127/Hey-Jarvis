
import mongoose from "mongoose";

const AccountabilitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  AccountabilityId: {
    type: String,
    required: true,
    unique: true,
  },
  message: {
    type: String,
    required: true,
  },
  ToAddress: {
    type: String,
    required: true,
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

const AccountabilityCollection = mongoose.model(
  "AccountabilityCollection",
  AccountabilitySchema
);

export default AccountabilityCollection;
