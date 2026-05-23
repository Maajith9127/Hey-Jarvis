import express from 'express';
import mongoose from 'mongoose';
import { protect } from "../middlewares/authMiddleware.js";

// Controllers
import { CalendarSave } from '../controllers/calendarController.js';
import { HandleLivePhotoSave } from '../controllers/livePhotoController.js';
import { HandleSaveAccountability } from '../controllers/accountabilityController.js';
import { SavePayoutDeltas } from '../controllers/paymentController.js';

import { ScheduleChain } from '../utils/ScheduleComponents/ScheduleChain.js';
import { randomised } from '../utils/ScheduleComponents/Randomised.js';

const SaveAll = express.Router();

SaveAll.post('/', protect, async (req, res) => {
  console.log('Inside SaveAll');

  const userId = req.userId;
  console.log(" Authenticated userId:", userId);

  const {
    Photos = {},
    CalendarEvents = {},
    AccountabilityMessages = {},
    Payouts = {}
  } = req.body;

  const {
    added: calendarAdded = [],
    updated: calendarUpdated = [],
    deleted: calendarDeleted = []
  } = CalendarEvents;

  const {
    added: photoAdded = [],
    updated: photoUpdated = [],
    deleted: photoDeleted = []
  } = Photos;

  const {
    added: msgAdded = [],
    updated: msgUpdated = [],
    deleted: msgDeleted = []
  } = AccountabilityMessages;

  const {
    added: payoutAdded = [],
    updated: payoutUpdated = [],
    deleted: payoutDeleted = []
  } = Payouts;



  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await CalendarSave(
      { added: calendarAdded, updated: calendarUpdated, deleted: calendarDeleted },
      userId,
      session
    );

    await HandleLivePhotoSave(
      { added: photoAdded, updated: photoUpdated, deleted: photoDeleted },
      userId,
      session
    );

    await HandleSaveAccountability(
      { added: msgAdded, updated: msgUpdated, deleted: msgDeleted },
      userId,
      session
    );

    await SavePayoutDeltas(
      { added: payoutAdded, updated: payoutUpdated, deleted: payoutDeleted },
      userId,
      session
    );

    await session.commitTransaction();

    console.log(' CRUD operations completed successfully for all components.');


    await randomised({
      userId
    });
    const nextScheduledAt = await ScheduleChain(userId);
    console.log(' Next scheduled at:', nextScheduledAt);
    session.endSession();

    console.log(' Session committed successfully');
    return res.status(200).json({
      message: " All saved successfully",
      nextScheduledAt
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error(" Transaction failed:", error);
    return res.status(500).json({
      message: " SaveAll failed, rolled back."
    });
  }
});

export { SaveAll };
