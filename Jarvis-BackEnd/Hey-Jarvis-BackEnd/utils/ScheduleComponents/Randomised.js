// ScheduleComponents/Randomised.js
import Randomised from "../../models/RandomisedCollection.js";
import { findNextTodoRandomisedEvent } from "./HelperFunctions/findNextTodoRandomisedEvent.js";
import { scheduleRandomisedJobs } from "./HelperFunctions/scheduleRandomisedJobs.js";
import { randomisedQueue } from "./queues/accountabilityQueue.js";

export const randomised = async ({ userId }) => {
  console.log("Triggered Randomised Handler");

  const config = await Randomised.findOne({ userId })
  console.log('Config:::::', config);

  if (!config) return console.warn(" No config found for user:", userId);

  // const allJobs = await randomisedQueue.getJobs([
  //   'waiting', 'delayed', 'active', 'completed', 'failed', 'paused', 'waiting-children', 'repeat'
  // ]);

  // for (const job of allJobs) {
  //   if (job?.id && job.id.includes(userId)) {
  //     await job.remove();
  //   }
  // }

  try {
    const allJobs = await randomisedQueue.getJobs([
      'waiting', 'delayed', 'active', 'completed', 'failed', 'paused', 'waiting-children', 'repeat'
    ]);

    for (const job of allJobs) {
      if (job?.id && job.id.includes(userId)) {
        await job.remove();
      }
    }

    console.log(`Cleared all randomised jobs for user ${userId}`);
  } catch (err) {
    console.error(" Failed while getting or removing jobs from randomisedQueue:", err);
  }

  console.log(`Cleared all randomised jobs for user ${userId}`);

  const nextTodo = await findNextTodoRandomisedEvent(userId);
  if (!nextTodo) return console.warn(" No upcoming Randomised Todo found");

  await scheduleRandomisedJobs(nextTodo, config, userId);

};