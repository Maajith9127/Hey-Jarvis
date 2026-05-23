

import mongoose from "mongoose";

// Embedded Accountability Schema
const AccountabilitySchema = new mongoose.Schema({
  AccountabilityId: { type: String, required: true },
  SpecificEventId: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  verified: { type: Boolean, default: false },
  past: { type: Boolean, required: true },
  title: { type: String, required: true },
  CollectionType: { type: String, required: true },
}, { _id: false });

// Embedded Todo Schema
const ToDoSchema = new mongoose.Schema({
  TodoId: { type: String, required: true },
  SpecificEventId: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
}, { _id: false });

// Main Collision Schema
const CollisionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  Todo: {
    type: ToDoSchema,
    required: true,
  },

  OtherAccountabilitiesInCollisionWith: {
    type: [AccountabilitySchema],
    default: [],
  },
});

// Indexes for performance
CollisionSchema.index({ "Todo.end": 1 });
CollisionSchema.index({ "OtherAccountabilitiesInCollisionWith.end": 1 });
// 1. Fast lookup of a Todo's collision (used in getTodoCollision API)
CollisionSchema.index({
  userId: 1,
  "Todo.SpecificEventId": 1
});

// 2. Optimize cleanup: remove collisions where an Accountability event was updated/deleted
CollisionSchema.index({
  userId: 1,
  "OtherAccountabilitiesInCollisionWith.SpecificEventId": 1
});

// 3. Optional: Efficiently filter by user + TodoId (if needed in analytics or history UI)
CollisionSchema.index({
  userId: 1,
  "Todo.TodoId": 1
});

// 4. Optional: Index to support future time-based queries (e.g., show all collisions in date range)
CollisionSchema.index({
  userId: 1,
  "Todo.start": 1,
  "Todo.end": 1
});


export default mongoose.model("CollisionCollection", CollisionSchema);
