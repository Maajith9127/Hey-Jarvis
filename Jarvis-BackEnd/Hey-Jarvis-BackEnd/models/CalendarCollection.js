
// import mongoose from "mongoose";

// const CalendarSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },

//   Type: {
//     type: String,
//     required: true,
//     enum: ["Todo", "Accountability"]
//   },

//   TodoId: {
//     type: String,
//     validate: {
//       validator(value) {
//         return this.Type === "Todo" ? !!value : true;
//       },
//       message: "TodoId is required when Type is 'Todo'",
//     },
//   },

//   AccountabilityId: {
//     type: String,
//     validate: {
//       validator(value) {
//         return this.Type === "Accountability" ? !!value : true;
//       },
//       message: "AccountabilityId is required when Type is 'Accountability'",
//     },
//   },

//   SpecificEventId: { type: String, required: true },
//   title: { type: String, required: true },
//   start: { type: Date, required: true },
//   end: { type: Date, required: true },
//   timeSlot: { type: String, required: true },
//   StrictMode: { type: String, required: false },

//   verified: {
//     type: Boolean,
//     default: false,
//     required: function () {
//       return this.Type === "Accountability";
//     },
//     validate: {
//       validator(value) {
//         if (this.Type === "Accountability") {
//           return typeof value === "boolean";
//         }
//         return true;
//       },
//       message: "verified must be a boolean for Accountability type"
//     }
//   },

//   past: {
//     type: Boolean,
//     required: true,
//     default: false,
//   },

//   CollectionType: { type: String, required: true },
// });

// CalendarSchema.index({ userId: 1, CollectionType: 1, Type: 1, start: 1 });
// const CalendarCollection = mongoose.model("CalendarCollection", CalendarSchema);
// export default CalendarCollection;





// ==========================================
// CALENDAR COLLECTION INDEXES
// ==========================================

// Replace your existing CalendarSchema.index with these optimized ones:

import mongoose from "mongoose";

const CalendarSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Type: {
    type: String,
    required: true,
    enum: ["Todo", "Accountability"]
  },
  TodoId: {
    type: String,
    validate: {
      validator(value) {
        return this.Type === "Todo" ? !!value : true;
      },
      message: "TodoId is required when Type is 'Todo'",
    },
  },
  AccountabilityId: {
    type: String,
    validate: {
      validator(value) {
        return this.Type === "Accountability" ? !!value : true;
      },
      message: "AccountabilityId is required when Type is 'Accountability'",
    },
  },
  SpecificEventId: { type: String, required: true },
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  StrictMode: { type: String, required: false },
  verified: {
    type: Boolean,
    default: false,
    required: function () {
      return this.Type === "Accountability";
    },
    validate: {
      validator(value) {
        if (this.Type === "Accountability") {
          return typeof value === "boolean";
        }
        return true;
      },
      message: "verified must be a boolean for Accountability type"
    }
  },
  past: {
    type: Boolean,
    required: true,
    default: false,
  },
  CollectionType: { type: String, required: true },
});

// ✅ CRITICAL INDEXES FOR YOUR OPTIMIZED CODE
// These are the exact indexes your collision detection needs:

// 1. MAIN PERFORMANCE INDEX - Used by batchValidateTodoEvents()
CalendarSchema.index({ 
  userId: 1, 
  Type: 1, 
  start: 1, 
  end: 1 
});

// 2. SPECIFIC EVENT LOOKUP - Used for updates/deletes
CalendarSchema.index({ 
  userId: 1, 
  SpecificEventId: 1 
});

// 3. TODO QUERIES - Used by getNextTodoEventsByPhotoId()
CalendarSchema.index({ 
  userId: 1, 
  Type: 1, 
  TodoId: 1, 
  start: 1 
});

// 4. TIME RANGE QUERIES - Used by range-based collision detection
CalendarSchema.index({ 
  userId: 1, 
  start: 1, 
  end: 1 
});

// 5. KEEP YOUR EXISTING INDEX (it's still useful)
CalendarSchema.index({ 
  userId: 1, 
  CollectionType: 1, 
  Type: 1, 
  start: 1 
});

const CalendarCollection = mongoose.model("CalendarCollection", CalendarSchema);
export default CalendarCollection;