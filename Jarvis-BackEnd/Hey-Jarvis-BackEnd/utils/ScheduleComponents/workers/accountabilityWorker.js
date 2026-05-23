
// import DbConnect from '../../../DbConnect.js';
// import { Worker } from 'bullmq';
// import { ScheduleChain } from '../ScheduleChain.js';
// import { checkVerifiedOrNot } from '../HelperFunctions/CheckVerfiedOrNot.js';
// import { randomised } from '../Randomised.js';
// import { handleAccJob } from '../WorkerHandlers/handleAccJob.js';
// import { sendRandomAccEventReminder } from '../Notifications/RandomAccEventReminder.js';
// import { initWebSocketServer } from '../../../wsServer.js';
// import { initInternalWebSocketServer } from '../../../wsServerInternal.js';
// import dotenv from 'dotenv';
// import express from "express";

// dotenv.config();

// console.log(" Worker is running and waiting for jobs...");
// console.log(" Connecting to DB...");
// await DbConnect();
// initWebSocketServer();
// initInternalWebSocketServer();
// //....................................................................................................................
// const worker = new Worker('accountability', async (job) => {
//   console.log(" Job received:", job?.id);

//   if (job.name === 'Verification') {
//     const accId = job.data?.acc?.AccountabilityId;
//     const accSpecId = job.data?.acc?.SpecificEventId;
//     const todoId = job.data?.todo?.TodoId;
//     const todoSpecId = job.data?.todo?.SpecificEventId;
//     const userId = job.data?.userId; //  extract userId

//     if (!userId) {
//       console.warn(" Missing userId in job.data — skipping ScheduleChain");
//       return;
//     }

//     console.log(` Running checkVerifiedOrNot for user ${userId}`);
//     await checkVerifiedOrNot(todoId, todoSpecId, accId, accSpecId, userId);

//   }
// }, {
//   connection: {
//     host: process.env.REDIS_END_POINT,
//     port: Number(process.env.REDIS_PORT),
//     password: process.env.REDIS_PASSWORD,
//     tls: true
//   },
//   concurrency: 5,
//   autorun: false
// });
// // Job Completed Event
// worker.on('completed', async (job) => {
//   const userId = job.data?.userId;
//   if (userId) {
//     console.log(` Re-running ScheduleChain for user ${userId}`);
//     await ScheduleChain(userId);
//   } else {
//     console.warn("Cannot re-run ScheduleChain — missing userId");
//   }
//   console.log("Auto-stopping accountability worker after job completion...");
//   // await stopAccountabilityWorker();
//   console.log(" Job completed:", job.id);
// });
// //  Job Failed
// worker.on('failed', async (job, err) => {
//   // await stopAccountabilityWorker();
//   console.error(" Job failed:", job?.id, err);
// });
// // Worker-level Error
// worker.on('error', async (err) => {
//   // await stopAccountabilityWorker();
//   console.error(" Worker error:", err);
// });
// //....................................................................................................................
// const randomisedWorker = new Worker('randomised', async (job) => {
//   console.log(`Randomised Job Received: ${job.name}`);

//   const { type, ...data } = job.data;
//   const userId = data.userId;

//   if (!userId) {
//     console.warn(" No userId found in job.data — skipping.");
//     return;
//   }

//   if (type === 'AccJob') {
//     console.log(` Scheduling accountability event for user ${userId}`);
//     await handleAccJob(data, userId);
//     await sendRandomAccEventReminder(userId, data);
//   }

//   if (type === 'NextChain') {
//     console.log(` Repeat Randomised Schedule for user ${userId}`);

//   }
// }, {
//   connection: {
//     host: process.env.REDIS_END_POINT,
//     port: Number(process.env.REDIS_PORT),
//     password: process.env.REDIS_PASSWORD,
//     tls: true
//   },
//   concurrency: 3,
//   autorun: false
// });
// randomisedWorker.on('completed', async (job) => {
//   const { type, userId } = job.data || {};

//   if (type === 'NextChain' && userId) {
//     console.log(` Job completed: ${job.id} — Now triggering randomised() for user ${userId}`);
//     await randomised({ userId });
//   }
// });
// //....................................................................................................................
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.get("/ping", (req, res) => {
//   res.send(" Worker is alive!");
// });

// app.post("/start-worker", async (req, res) => {
//   const { delay, userId } = req.body;

//   if (!delay || !userId) {
//     return res.status(400).json({ error: "delay and userId required" });
//   }

//   console.log(`⏳ Worker for user ${userId} will start in ${delay / 1000}s`);

//   setTimeout(async () => {
//     console.log(`🚀 Starting accountability worker for user ${userId}`);
//     await startAccountabilityWorker();
//   }, delay);

//   res.json({ status: "scheduled", startIn: delay });
// });


// app.listen(PORT, () => {
//   console.log(` Worker HTTP server running on http://localhost:${PORT}`);
// });

// //....................................................................................................................
// //  Export controls so you can start/stop workers when needed
// export async function startAccountabilityWorker() {
//   console.log(" Starting accountability worker");
//   await worker.run();
// }
// export async function stopAccountabilityWorker() {
//   console.log("Stopping accountability worker");
//   await worker.close();
// }

// export async function startRandomisedWorker() {
//   console.log("Starting randomised worker");
//   await randomisedWorker.run();
// }
// export async function stopRandomisedWorker() {
//   console.log("Stopping randomised worker");
//   await randomisedWorker.close();
// }
// //...........................................................................................


















// import DbConnect from '../../../DbConnect.js';
// import { Worker } from 'bullmq';
// import { ScheduleChain } from '../ScheduleChain.js';
// import { checkVerifiedOrNot } from '../HelperFunctions/CheckVerfiedOrNot.js';
// import { randomised } from '../Randomised.js';
// import { handleAccJob } from '../WorkerHandlers/handleAccJob.js';
// import { sendRandomAccEventReminder } from '../Notifications/RandomAccEventReminder.js';
// import { initWebSocketServer } from '../../../wsServer.js';
// import { initInternalWebSocketServer } from '../../../wsServerInternal.js';
// import dotenv from 'dotenv';
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// dotenv.config();

// console.log(" Worker is running and waiting for jobs...");
// console.log(" Connecting to DB...");
// await DbConnect();
// initWebSocketServer();
// initInternalWebSocketServer();

// //....................................................................................................................
// // Workers
// const worker = new Worker('accountability', async (job) => {
//   console.log(" Job received:", job?.id);

//   if (job.name === 'Verification') {
//     const accId = job.data?.acc?.AccountabilityId;
//     const accSpecId = job.data?.acc?.SpecificEventId;
//     const todoId = job.data?.todo?.TodoId;
//     const todoSpecId = job.data?.todo?.SpecificEventId;
//     const userId = job.data?.userId;

//     if (!userId) {
//       console.warn(" Missing userId in job.data — skipping ScheduleChain");
//       return;
//     }

//     console.log(` Running checkVerifiedOrNot for user ${userId}`);
//     await checkVerifiedOrNot(todoId, todoSpecId, accId, accSpecId, userId);
//   }
// }, {
//   connection: {
//     host: process.env.REDIS_END_POINT,
//     port: Number(process.env.REDIS_PORT),
//     password: process.env.REDIS_PASSWORD,
//     tls: true
//   },
//   concurrency: 5,
//   autorun: false
// });

// worker.on('completed', async (job) => {
//   const userId = job.data?.userId;

//   if (userId) {
//     console.log(` Re-running ScheduleChain for user ${userId}`);
//     await ScheduleChain(userId);
//   }

//   console.log(" Job completed:", job.id);

//   // Stop worker after processing jobs
//   console.log(" Shutting down accountability worker...");
//   await stopAccountabilityWorker();
// });

// worker.on('failed', async (job, err) => {
//   console.error("Job failed:", job?.id, err);

//   console.log(" Shutting down accountability worker due to failure...");
//   await stopAccountabilityWorker();
// });

// //....................................................................................................................
// const randomisedWorker = new Worker('randomised', async (job) => {
//   console.log(`Randomised Job Received: ${job.name}`);
//   const { type, ...data } = job.data;
//   const userId = data.userId;

//   if (!userId) return console.warn(" No userId found in job.data — skipping.");

//   if (type === 'AccJob') {
//     await handleAccJob(data, userId);
//     await sendRandomAccEventReminder(userId, data);
//   }
// }, {
//   connection: {
//     host: process.env.REDIS_END_POINT,
//     port: Number(process.env.REDIS_PORT),
//     password: process.env.REDIS_PASSWORD,
//     tls: true
//   },
//   concurrency: 3,
//   autorun: false
// });

// //....................................................................................................................
// // Express setup (same as main server)
// const app = express();
// const PORT = process.env.WORKER_PORT || 10000;

// app.use(cors({
//   origin: "*",   // accept from anywhere
// }));

// app.use(express.json({ limit: '30mb' }));
// app.use(cookieParser());
// app.use((req, res, next) => {
//   console.log("Incoming request:", req.method, req.url);
//   next();
// });


// app.get("/ping", (req, res) => {
//   res.send(" Worker is alive!");
// });

// app.post("/start-worker", async (req, res) => {
//   console.log('Yooooo i got the message from the Main server');

//   const { delay, userId } = req.body;

//   if (!delay || !userId) {
//     return res.status(400).json({ error: "delay and userId required" });
//   }

//   console.log(`⏳ Worker for user ${userId} will start in ${delay / 1000}s`);

//   setTimeout(async () => {
//     console.log(`🚀 Starting accountability worker for user ${userId}`);
//     await startAccountabilityWorker();
//   }, delay);

//   res.json({ status: "scheduled", startIn: delay });
// });

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(` Worker HTTP server running on http://${process.env.HOST || '0.0.0.0'}:${PORT}`);
// });

// //....................................................................................................................
// // Export controls
// export async function startAccountabilityWorker() {
//   console.log(" Starting accountability worker");
//   await worker.run();
// }

// export async function stopAccountabilityWorker() {
//   try {
//     console.log("Stopping accountability worker...");
//     await worker.close();   // closes connections
//     console.log("Accountability worker stopped");
//   } catch (err) {
//     console.error("Error stopping accountability worker:", err);
//   }
// }

// export async function startRandomisedWorker() {
//   console.log("Starting randomised worker");
//   await randomisedWorker.run();
// }

// export async function stopRandomisedWorker() {
//   console.log("Stopping randomised worker");
//   await randomisedWorker.close();
// }

// export { worker, randomisedWorker };




// import DbConnect from '../../../DbConnect.js';
// import { Worker } from 'bullmq';
// import { ScheduleChain } from '../ScheduleChain.js';
// import { checkVerifiedOrNot } from '../HelperFunctions/CheckVerfiedOrNot.js';
// import { randomised } from '../Randomised.js';
// import { handleAccJob } from '../WorkerHandlers/handleAccJob.js';
// import { sendRandomAccEventReminder } from '../Notifications/RandomAccEventReminder.js';
// import { initWebSocketServer } from '../../../wsServer.js';
// import { initInternalWebSocketServer } from '../../../wsServerInternal.js';
// import dotenv from 'dotenv';
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// dotenv.config();

// console.log(" Worker is running and waiting for jobs...");
// console.log(" Connecting to DB...");
// await DbConnect();
// initWebSocketServer();
// initInternalWebSocketServer();

// //....................................................................................................................
// // Accountability Worker
// const worker = new Worker(
//   'accountability',
//   async (job) => {
//     console.log(" Job received:", job?.id);

//     if (job.name === 'Verification') {
//       const accId = job.data?.acc?.AccountabilityId;
//       const accSpecId = job.data?.acc?.SpecificEventId;
//       const todoId = job.data?.todo?.TodoId;
//       const todoSpecId = job.data?.todo?.SpecificEventId;
//       const userId = job.data?.userId;

//       if (!userId) {
//         console.warn(" Missing userId in job.data — skipping ScheduleChain");
//         return;
//       }

//       console.log(` Running checkVerifiedOrNot for user ${userId}`);
//       await checkVerifiedOrNot(todoId, todoSpecId, accId, accSpecId, userId);
//     }
//   },
//   {
//     connection: {
//       host: process.env.REDIS_END_POINT,
//       port: Number(process.env.REDIS_PORT),
//       password: process.env.REDIS_PASSWORD,
//       tls: true,
//     },
//     concurrency: 5,
//     autorun: false,
//   }
// );

// worker.on('completed', async (job) => {
//   const userId = job.data?.userId;

//   if (userId) {
//     console.log(` Re-running ScheduleChain for user ${userId}`);
//     await ScheduleChain(userId);
//   }

//   console.log(" Job completed:", job.id);

//   // Pause instead of closing
//   console.log("⏸️ Pausing accountability worker...");
//   await pauseAccountabilityWorker();
// });

// worker.on('failed', async (job, err) => {
//   console.error("Job failed:", job?.id, err);

//   console.log("⏸️ Pausing accountability worker due to failure...");
//   await pauseAccountabilityWorker();
// });

// //....................................................................................................................
// // Randomised Worker
// const randomisedWorker = new Worker(
//   'randomised',
//   async (job) => {
//     console.log(`Randomised Job Received: ${job.name}`);
//     const { type, ...data } = job.data;
//     const userId = data.userId;

//     if (!userId) return console.warn(" No userId found in job.data — skipping.");

//     if (type === 'AccJob') {
//       await handleAccJob(data, userId);
//       await sendRandomAccEventReminder(userId, data);
//     }
//   },
//   {
//     connection: {
//       host: process.env.REDIS_END_POINT,
//       port: Number(process.env.REDIS_PORT),
//       password: process.env.REDIS_PASSWORD,
//       tls: true,
//     },
//     concurrency: 3,
//     autorun: false,
//   }
// );

// //....................................................................................................................
// // Express setup (same as main server)
// const app = express();
// const PORT = process.env.WORKER_PORT || 10000;

// app.use(
//   cors({
//     origin: "*", // accept from anywhere
//   })
// );

// app.use(express.json({ limit: '30mb' }));
// app.use(cookieParser());
// app.use((req, res, next) => {
//   console.log("Incoming request:", req.method, req.url);
//   next();
// });

// app.get("/ping", (req, res) => {
//   res.send(" Worker is alive!");
// });

// app.post("/start-worker", async (req, res) => {
//   console.log('Yooooo i got the message from the Main server');

//   const { delay, userId } = req.body;

//   if (!delay || !userId) {
//     return res.status(400).json({ error: "delay and userId required" });
//   }

//   console.log(`⏳ Worker for user ${userId} will start in ${delay / 1000}s`);

//   setTimeout(async () => {
//     console.log(`🚀 Resuming accountability worker for user ${userId}`);
//     await resumeAccountabilityWorker();
//   }, delay);

//   res.json({ status: "scheduled", startIn: delay });
// });

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(
//     ` Worker HTTP server running on http://${process.env.HOST || '0.0.0.0'}:${PORT}`
//   );
// });

// //....................................................................................................................
// // Export controls
// export async function startAccountabilityWorker() {
//   console.log(" Starting accountability worker");
//   await worker.run();
// }

// export async function pauseAccountabilityWorker() {
//   try {
//     console.log("Pausing accountability worker...");
//     await worker.pause();
//     console.log("✅ Accountability worker paused");
//   } catch (err) {
//     console.error("Error pausing accountability worker:", err);
//   }
// }

// export async function resumeAccountabilityWorker() {
//   try {
//     console.log("Resuming accountability worker...");
//     await worker.resume();
//     console.log("✅ Accountability worker resumed");
//   } catch (err) {
//     console.error("Error resuming accountability worker:", err);
//   }
// }

// export async function startRandomisedWorker() {
//   console.log("Starting randomised worker");
//   await randomisedWorker.run();
// }

// export async function stopRandomisedWorker() {
//   console.log("Stopping randomised worker");
//   await randomisedWorker.close();
// }

// export { worker, randomisedWorker };



// import DbConnect from '../../../DbConnect.js';
// import { Worker } from 'bullmq';
// import { ScheduleChain } from '../ScheduleChain.js';
// import { checkVerifiedOrNot } from '../HelperFunctions/CheckVerfiedOrNot.js';
// import { randomised } from '../Randomised.js';
// import { handleAccJob } from '../WorkerHandlers/handleAccJob.js';
// import { sendRandomAccEventReminder } from '../Notifications/RandomAccEventReminder.js';
// import { initWebSocketServer } from '../../../wsServer.js';
// import { initInternalWebSocketServer } from '../../../wsServerInternal.js';
// import dotenv from 'dotenv';
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// import CrashMarker from '../../../models/CrashMarker.js';
// import redisClient from '../../redisClient.js';
// import { sendCrashMail } from '../Notifications/CrashNotifier.js';

// dotenv.config();

// console.log(" Worker is running and waiting for jobs...");
// console.log(" Connecting to DB...");
// await DbConnect();
// initWebSocketServer();
// initInternalWebSocketServer();

// // ==================================================================
// // Accountability Worker
// // ==================================================================
// const worker = new Worker(
//   'accountability',
//   async (job) => {
//     console.log(" Job received:", job?.id);

//     if (job.name === 'Verification') {
//       const accId = job.data?.acc?.AccountabilityId;
//       const accSpecId = job.data?.acc?.SpecificEventId;
//       const todoId = job.data?.todo?.TodoId;
//       const todoSpecId = job.data?.todo?.SpecificEventId;
//       const userId = job.data?.userId;

//       if (!userId) {
//         console.warn(" Missing userId in job.data — skipping ScheduleChain");
//         return;
//       }

//       console.log(` Running checkVerifiedOrNot for user ${userId}`);
//       await checkVerifiedOrNot(todoId, todoSpecId, accId, accSpecId, userId);
//     }
//   },
//   {
//     connection: {
//       host: process.env.REDIS_END_POINT,
//       port: Number(process.env.REDIS_PORT),
//       password: process.env.REDIS_PASSWORD,
//       tls: true,
//     },
//     concurrency: 5,
//     autorun: false,
//   }
// );

// worker.on('completed', async (job) => {
//   const userId = job.data?.userId;
//   if (userId) {
//     console.log(` Re-running ScheduleChain for user ${userId}`);
//     await ScheduleChain(userId);
//   }

//   console.log(" Job completed:", job.id);
//   console.log("⏸️ Pausing accountability worker...");
//   await pauseAccountabilityWorker();
// });

// worker.on('failed', async (job, err) => {
//   console.error("Job failed:", job?.id, err);
//   console.log("⏸️ Pausing accountability worker due to failure...");
//   await pauseAccountabilityWorker();
// });

// // ==================================================================
// // Randomised Worker
// // ==================================================================
// const randomisedWorker = new Worker(
//   'randomised',
//   async (job) => {
//     console.log(`Randomised Job Received: ${job.name}`);
//     const { type, ...data } = job.data;
//     const userId = data.userId;

//     if (!userId) return console.warn(" No userId found in job.data — skipping.");

//     if (type === 'AccJob') {
//       await handleAccJob(data, userId);
//       await sendRandomAccEventReminder(userId, data);
//     }

//     if (type === 'NextChain') {
//       console.log(`🔄 NextChain triggered for user ${userId}`);
//       await randomised({ userId });
//     }
//   },
//   {
//     connection: {
//       host: process.env.REDIS_END_POINT,
//       port: Number(process.env.REDIS_PORT),
//       password: process.env.REDIS_PASSWORD,
//       tls: true,
//     },
//     concurrency: 3,
//     autorun: false,
//   }
// );

// randomisedWorker.on('completed', async (job) => {
//   const { type, userId } = job.data || {};
//   console.log(`✅ Randomised job completed: ${job.id}`);

//   if (type === 'AccJob') {
//     console.log("⏸️ Pausing randomised worker after AccJob...");
//     await pauseRandomisedWorker();
//   }

//   if (type === 'NextChain' && userId) {
//     console.log(`🔄 Triggering randomised() again for user ${userId}`);
//     await randomised({ userId });

//     console.log("⏸️ Pausing randomised worker after NextChain...");
//     await pauseRandomisedWorker();   // <—— add this
//   }
// });

// randomisedWorker.on('failed', async (job, err) => {
//   console.error("Randomised job failed:", job?.id, err);
//   console.log("⏸️ Pausing randomised worker due to failure...");
//   await pauseRandomisedWorker();
// });

// // ==================================================================
// // Express setup
// // ==================================================================
// const app = express();
// const PORT = process.env.WORKER_PORT || 10000;

// app.use(cors({ origin: "*" }));
// app.use(express.json({ limit: '30mb' }));
// app.use(cookieParser());
// app.use((req, res, next) => {
//   console.log("Incoming request:", req.method, req.url);
//   next();
// });

// app.get("/ping", (req, res) => {
//   res.send(" Worker is alive!");
// });

// // Start accountability worker
// app.post("/start-worker", async (req, res) => {
//   console.log('Yooooo i got the message from the Main server');
//   const { delay, userId } = req.body;
//   if (!delay || !userId) return res.status(400).json({ error: "delay and userId required" });

//   console.log(`⏳ Accountability worker for user ${userId} will start in ${delay / 1000}s`);
//   setTimeout(async () => {
//     console.log(`🚀 Resuming accountability worker for user ${userId}`);
//     await resumeAccountabilityWorker();
//   }, delay);

//   res.json({ status: "scheduled", startIn: delay });
// });

// // Start randomised worker
// app.post("/start-randomised-worker", async (req, res) => {
//   console.log('Yooooo i got the message from the Main server (Randomised)');
//   const { delay, userId } = req.body;
//   if (!delay || !userId) return res.status(400).json({ error: "delay and userId required" });

//   console.log(`⏳ Randomised worker for user ${userId} will start in ${delay / 1000}s`);
//   setTimeout(async () => {
//     console.log(`🚀 Resuming randomised worker for user ${userId}`);
//     await resumeRandomisedWorker();
//   }, delay);

//   res.json({ status: "scheduled", startIn: delay });
// });

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(` Worker HTTP server running on http://${process.env.HOST || '0.0.0.0'}:${PORT}`);
// });

// // ==================================================================
// // Export controls
// // ==================================================================
// export async function startAccountabilityWorker() {
//   console.log(" Starting accountability worker");
//   await worker.run();
// }
// export async function pauseAccountabilityWorker() {
//   try {
//     console.log("Pausing accountability worker...");
//     await worker.pause();
//     console.log("✅ Accountability worker paused");
//   } catch (err) {
//     console.error("Error pausing accountability worker:", err);
//   }
// }
// export async function resumeAccountabilityWorker() {
//   try {
//     console.log("Resuming accountability worker...");
//     await worker.resume();
//     console.log("✅ Accountability worker resumed");
//   } catch (err) {
//     console.error("Error resuming accountability worker:", err);
//   }
// }

// export async function startRandomisedWorker() {
//   console.log(" Starting randomised worker");
//   await randomisedWorker.run();
// }
// export async function pauseRandomisedWorker() {
//   try {
//     console.log("Pausing randomised worker...");
//     await randomisedWorker.pause();
//     console.log("✅ Randomised worker paused");
//   } catch (err) {
//     console.error("Error pausing randomised worker:", err);
//   }
// }
// export async function resumeRandomisedWorker() {
//   try {
//     console.log("Resuming randomised worker...");
//     await randomisedWorker.resume();
//     console.log("✅ Randomised worker resumed");
//   } catch (err) {
//     console.error("Error resuming randomised worker:", err);
//   }
// }

// export { worker, randomisedWorker };




import DbConnect from '../../../DbConnect.js';
import { Worker } from 'bullmq';
import { ScheduleChain } from '../ScheduleChain.js';
import { checkVerifiedOrNot } from '../HelperFunctions/CheckVerfiedOrNot.js';
import { randomised } from '../Randomised.js';
import { handleAccJob } from '../WorkerHandlers/handleAccJob.js';
import { sendRandomAccEventReminder } from '../Notifications/RandomAccEventReminder.js';
import { initWebSocketServer } from '../../../wsServer.js';
import { initInternalWebSocketServer } from '../../../wsServerInternal.js';
import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Crash detection
import CrashMarker from '../../../models/CrashMarker.js';
import redisClient from '../../redisClient.js';
import { sendCrashMail } from '../Notifications/CrashNotifier.js';

dotenv.config();

console.log("Worker is running and waiting for jobs...");
console.log("Connecting to DB...");
await DbConnect();
initWebSocketServer();
initInternalWebSocketServer();

// ==================================================================
// CrashMarker helpers
// ==================================================================
async function recordBoot(serviceName) {
  const existing = await CrashMarker.findOne({ name: serviceName });

  if (existing) {
    console.warn(`Crash detected: ${serviceName} had leftover marker from last run.`);

    // Flush Redis
    await redisClient.flushAll();
    console.log("Redis fully flushed — all keys removed.");

    // Send crash mail
    await sendCrashMail();
  }

  await CrashMarker.updateOne(
    { name: serviceName },
    { startedAt: new Date() },
    { upsert: true }
  );

  console.log(`${serviceName} boot recorded.`);
}

async function recordShutdown(serviceName) {
  await CrashMarker.deleteOne({ name: serviceName });
  console.log(`Clean shutdown recorded for ${serviceName}`);
}

// Record boot for this worker process
await recordBoot("worker-service");

// ==================================================================
// Accountability Worker
// ==================================================================
const worker = new Worker(
  'accountability',
  async (job) => {
    console.log("Job received:", job?.id);

    if (job.name === 'Verification') {
      const accId = job.data?.acc?.AccountabilityId;
      const accSpecId = job.data?.acc?.SpecificEventId;
      const todoId = job.data?.todo?.TodoId;
      const todoSpecId = job.data?.todo?.SpecificEventId;
      const userId = job.data?.userId;

      if (!userId) {
        console.warn("Missing userId in job.data — skipping ScheduleChain");
        return;
      }

      console.log(`Running checkVerifiedOrNot for user ${userId}`);
      await checkVerifiedOrNot(todoId, todoSpecId, accId, accSpecId, userId);
    }
  },
  {
    connection: {
      host: process.env.REDIS_END_POINT,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      tls: true,
    },
    concurrency: 5,
    autorun: false,
  }
);

worker.on('completed', async (job) => {
  const userId = job.data?.userId;
  if (userId) {
    console.log(`Re-running ScheduleChain for user ${userId}`);
    await ScheduleChain(userId);
  }

  console.log("Job completed:", job.id);
  console.log("Pausing accountability worker...");
  await pauseAccountabilityWorker();
});

worker.on('failed', async (job, err) => {
  console.error("Job failed:", job?.id, err);
  console.log("Pausing accountability worker due to failure...");
  await pauseAccountabilityWorker();
});

// ==================================================================
// Randomised Worker
// ==================================================================
const randomisedWorker = new Worker(
  'randomised',
  async (job) => {
    console.log(`Randomised Job Received: ${job.name}`);
    const { type, ...data } = job.data;
    const userId = data.userId;

    if (!userId) return console.warn("No userId found in job.data — skipping.");

    if (type === 'AccJob') {
      await handleAccJob(data, userId);
      await sendRandomAccEventReminder(userId, data);
    }

    if (type === 'NextChain') {
      console.log(`NextChain triggered for user ${userId}`);
      await randomised({ userId });
    }
  },
  {
    connection: {
      host: process.env.REDIS_END_POINT,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      tls: true,
    },
    concurrency: 3,
    autorun: false,
  }
);

randomisedWorker.on('completed', async (job) => {
  const { type, userId } = job.data || {};
  console.log(`Randomised job completed: ${job.id}`);

  if (type === 'AccJob') {
    console.log("Pausing randomised worker after AccJob...");
    await pauseRandomisedWorker();
  }

  if (type === 'NextChain' && userId) {
    console.log(`Triggering randomised() again for user ${userId}`);
    await randomised({ userId });

    console.log("Pausing randomised worker after NextChain...");
    await pauseRandomisedWorker();
  }
});

randomisedWorker.on('failed', async (job, err) => {
  console.error("Randomised job failed:", job?.id, err);
  console.log("Pausing randomised worker due to failure...");
  await pauseRandomisedWorker();
});

// ==================================================================
// Express setup
// ==================================================================
const app = express();
const PORT = process.env.WORKER_PORT || 10000;

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: '30mb' }));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

app.get("/ping", (req, res) => {
  res.send("Worker is alive!");
});

// Start accountability worker
app.post("/start-worker", async (req, res) => {
  console.log('Received start message for accountability worker');
  const { delay, userId } = req.body;
  if (!delay || !userId) return res.status(400).json({ error: "delay and userId required" });

  console.log(`Accountability worker for user ${userId} will start in ${delay / 1000}s`);
  setTimeout(async () => {
    console.log(`Resuming accountability worker for user ${userId}`);
    await resumeAccountabilityWorker();
  }, delay);

  res.json({ status: "scheduled", startIn: delay });
});

// Start randomised worker
app.post("/start-randomised-worker", async (req, res) => {
  console.log('Received start message for randomised worker');
  const { delay, userId } = req.body;
  if (!delay || !userId) return res.status(400).json({ error: "delay and userId required" });

  console.log(`Randomised worker for user ${userId} will start in ${delay / 1000}s`);
  setTimeout(async () => {
    console.log(`Resuming randomised worker for user ${userId}`);
    await resumeRandomisedWorker();
  }, delay);

  res.json({ status: "scheduled", startIn: delay });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Worker HTTP server running on http://${process.env.HOST || '0.0.0.0'}:${PORT}`);
});

// ==================================================================
// Shutdown hooks
// ==================================================================
process.on("SIGINT", async () => {
  await recordShutdown("worker-service");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await recordShutdown("worker-service");
  process.exit(0);
});

// ==================================================================
// Export controls
// ==================================================================
export async function startAccountabilityWorker() {
  console.log("Starting accountability worker");
  await worker.run();
}
export async function pauseAccountabilityWorker() {
  try {
    console.log("Pausing accountability worker...");
    await worker.pause();
    console.log("Accountability worker paused");
  } catch (err) {
    console.error("Error pausing accountability worker:", err);
  }
}
export async function resumeAccountabilityWorker() {
  try {
    console.log("Resuming accountability worker...");
    await worker.resume();
    console.log("Accountability worker resumed");
  } catch (err) {
    console.error("Error resuming accountability worker:", err);
  }
}

export async function startRandomisedWorker() {
  console.log("Starting randomised worker");
  await randomisedWorker.run();
}
export async function pauseRandomisedWorker() {
  try {
    console.log("Pausing randomised worker...");
    await randomisedWorker.pause();
    console.log("Randomised worker paused");
  } catch (err) {
    console.error("Error pausing randomised worker:", err);
  }
}
export async function resumeRandomisedWorker() {
  try {
    console.log("Resuming randomised worker...");
    await randomisedWorker.resume();
    console.log("Randomised worker resumed");
  } catch (err) {
    console.error("Error resuming randomised worker:", err);
  }
}

export { worker, randomisedWorker };



