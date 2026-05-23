import mongoose from 'mongoose';

const PayoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserCollection', required: true },
  AccountabilityId: { type: String, required: true }, // 🔥 New field to unify front & back
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  bankAccountId: { type: String, required: true },
  transferId: { type: String },
  status: { type: String, default: 'pending' },
  StrictMode: { type: String, default: null }, //  New field for strict mode
}, { timestamps: true });

const Payout = mongoose.model('PayoutCollection', PayoutSchema);
export default Payout;
