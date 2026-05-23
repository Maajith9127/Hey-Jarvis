
// import { accountabilityQueue } from "../ScheduleComponents/queues/accountabilityQueue.js";
// import { getNextUpcomingAccountabilities } from "./HelperFunctions/getNextUpcomingAccountabilities.js";
// import { getInternalWss } from "../../wsServerInternal.js";
// import axios from "axios";

// //  Accept userId as input
// const ScheduleChain = async (userId) => {
//     console.log('Starting ScheduleChain for user:', userId);
//     if (!userId) throw new Error("userId is required in ScheduleChain");

//     const nextOnes = await getNextUpcomingAccountabilities(userId); // Updated below
//     console.log('Got next upcoming accountabilities:');
//     // 1. Clear only user's jobs (based on prefix or custom logic)
//     const jobs = await accountabilityQueue.getJobs([
//         'waiting', 'delayed', 'active', 'completed', 'failed', 'paused', 'waiting-children', 'repeat'
//     ]);

//     for (const job of jobs) {
//         // Optional: only clear jobs created by this user
//         if (job.id.startsWith(userId)) {
//             await job.remove();
//             console.log(` Removed job for user ${userId}: ${job.id}`);
//         }
//         console.log('You should not see this message if no jobs were found');
//     }
//     // 2. Prepare deduplication tracker
//     const scheduledJobs = new Set();
//     let firstScheduledEnd = null;
//     let scheduledCount = 0;

//     // 3. Schedule new jobs with user-specific jobId
//     for (const entry of nextOnes) {
//         const { accountability, parentTodo } = entry;

//         const jobName = "Verification";
//         const jobId = `${userId}__${accountability.SpecificEventId}__${accountability.AccountabilityId}`;

//         if (scheduledJobs.has(jobId)) continue;
//         scheduledJobs.add(jobId);

//         const jobData = {
//             acc: {
//                 AccountabilityId: accountability.AccountabilityId,
//                 SpecificEventId: accountability.SpecificEventId,
//             },
//             todo: {
//                 TodoId: parentTodo.TodoId,
//                 SpecificEventId: parentTodo.SpecificEventId,
//             },
//             userId
//         };

//         const delayUntil = new Date(accountability.end).getTime();//----> this would be from db (depending on the user (india, saudi, kuwait))
//         const delay = delayUntil - new Date().getTime(); // both sides are UTC


//         if (delay > 0) {
//             await accountabilityQueue.add(jobName, jobData, {
//                 jobId,
//                 delay,
//                 attempts: 1,
//                 removeOnComplete: true,
//                 removeOnFail: true,
//             });

//             console.log(` Scheduled: ${jobName} (${jobId}) at ${accountability.end.toISOString()}`);

//             if (firstScheduledEnd === null) firstScheduledEnd = accountability.end;
//             scheduledCount++;


//             //  NEW: Tell the worker service when to start
//             const startDelay = Math.max(delay - (2 * 60 * 1000), 0); // 2 min before
//             try {
//                 await axios.post("http://127.0.0.1:10000/start-worker", {
//                     userId,
//                     delay: startDelay
//                 }, { headers: { "Content-Type": "application/json" } });

//                 console.log(`Notified worker service to start in ${startDelay / 1000}s`);
//             } catch (err) {
//                 console.error("Failed to notify worker service:", err.message);
//             }


//         } else {
//             console.log(` Skipped: ${jobName} (already past time)`);
//         }
//     }

//     console.log(` Scheduled ${scheduledCount} jobs for user ${userId}`);


//     const internalWss = getInternalWss();
//     console.log('The internalWss is:', internalWss);

//     if (internalWss && firstScheduledEnd) {
//         const message = {
//             type: "next-schedule-updated",
//             userId,
//             nextScheduledAt: firstScheduledEnd.toISOString()
//         };

//         internalWss.clients.forEach(client => {
//             if (client.readyState === 1) {
//                 client.send(JSON.stringify(message));
//             }
//         });

//         console.log(`Sent nextScheduledAt to internal WS: ${firstScheduledEnd.toISOString()}`);
//     } else if (firstScheduledEnd) {
//         console.log(" Returning nextScheduledAt instead of pushing via WebSocket");
//         return firstScheduledEnd;
//     }


// };
// export { ScheduleChain };




// import { accountabilityQueue } from "../ScheduleComponents/queues/accountabilityQueue.js";
// import { getNextUpcomingAccountabilities } from "./HelperFunctions/getNextUpcomingAccountabilities.js";
// import { getInternalWss } from "../../wsServerInternal.js";
// import axios from "axios";

// //  Accept userId as input
// const ScheduleChain = async (userId) => {
//     console.log('Starting ScheduleChain for user:', userId);
//     if (!userId) throw new Error("userId is required in ScheduleChain");

//     const nextOnes = await getNextUpcomingAccountabilities(userId);
//     console.log('Got next upcoming accountabilities:');

//     // 1. Clear only user's jobs
//     const jobs = await accountabilityQueue.getJobs([
//         'waiting', 'delayed', 'active', 'completed', 'failed', 'paused', 'waiting-children', 'repeat'
//     ]);

//     for (const job of jobs) {
//         if (job.id.startsWith(userId)) {
//             await job.remove();
//             console.log(` Removed job for user ${userId}: ${job.id}`);
//         }
//     }

//     // 2. Prepare deduplication tracker
//     const scheduledJobs = new Set();
//     let firstScheduledEnd = null;
//     let scheduledCount = 0;

//     // 3. Schedule new jobs
//     for (const entry of nextOnes) {
//         const { accountability, parentTodo } = entry;

//         const jobName = "Verification";
//         const jobId = `${userId}__${accountability.SpecificEventId}__${accountability.AccountabilityId}`;

//         if (scheduledJobs.has(jobId)) continue;
//         scheduledJobs.add(jobId);

//         const jobData = {
//             acc: {
//                 AccountabilityId: accountability.AccountabilityId,
//                 SpecificEventId: accountability.SpecificEventId,
//             },
//             todo: {
//                 TodoId: parentTodo.TodoId,
//                 SpecificEventId: parentTodo.SpecificEventId,
//             },
//             userId
//         };

//         const delayUntil = new Date(accountability.end).getTime();
//         const delay = delayUntil - new Date().getTime(); // UTC-based

//         // Graceful handling for very short delays
//         if (delay < 10_000) { // less than 10 seconds
//             console.warn(`⏳ Delay too short (${delay} ms) for job: ${jobId}`);
//             return {
//                 error: true,
//                 message: "Delay too short to schedule this accountability. Please try again.",
//                 jobId,
//                 scheduledAt: accountability.end
//             };
//         }

//         if (delay > 0) {
//             await accountabilityQueue.add(jobName, jobData, {
//                 jobId,
//                 delay,
//                 attempts: 1,
//                 removeOnComplete: true,
//                 removeOnFail: true,
//             });

//             console.log(` Scheduled: ${jobName} (${jobId}) at ${accountability.end.toISOString()}`);

//             if (firstScheduledEnd === null) firstScheduledEnd = accountability.end;
//             scheduledCount++;

//             // Tell the worker service when to start
//             const startDelay = Math.max(delay - 20_000, 0); // 20 seconds before

//             try {
//                 await axios.post("http://127.0.0.1:10000/start-worker", {
//                     userId,
//                     delay: startDelay
//                 }, { headers: { "Content-Type": "application/json" } });

//                 console.log(`Notified worker service to start in ${startDelay / 1000}s`);
//             } catch (err) {
//                 console.log('Delay is :', delay);

//                 console.error("Failed to notify worker service:", err.message);
//             }

//         } else {
//             console.log(` Skipped: ${jobName} (already past time)`);
//         }
//     }

//     console.log(` Scheduled ${scheduledCount} jobs for user ${userId}`);

//     // 4. Push next schedule via WS
//     const internalWss = getInternalWss();
//     console.log('The internalWss is:', internalWss);

//     if (internalWss && firstScheduledEnd) {
//         const message = {
//             type: "next-schedule-updated",
//             userId,
//             nextScheduledAt: firstScheduledEnd.toISOString()
//         };

//         internalWss.clients.forEach(client => {
//             if (client.readyState === 1) {
//                 client.send(JSON.stringify(message));
//             }
//         });

//         console.log(`Sent nextScheduledAt to internal WS: ${firstScheduledEnd.toISOString()}`);
//     } else if (firstScheduledEnd) {
//         console.log(" Returning nextScheduledAt instead of pushing via WebSocket");
//         return firstScheduledEnd;
//     }
// };

// export { ScheduleChain };


import { accountabilityQueue } from "../ScheduleComponents/queues/accountabilityQueue.js";
import { getNextUpcomingAccountabilities } from "./HelperFunctions/getNextUpcomingAccountabilities.js";
import { getInternalWss } from "../../wsServerInternal.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const WORKER_SERVICE_URL = process.env.WORKER_SERVICE_URL || "http://127.0.0.1:10000";

//  Accept userId as input
const ScheduleChain = async (userId) => {
    console.log('Starting ScheduleChain for user:', userId);
    if (!userId) throw new Error("userId is required in ScheduleChain");

    const nextOnes = await getNextUpcomingAccountabilities(userId);
    console.log('Got next upcoming accountabilities:');

    // 1. Clear only user's jobs
    const jobs = await accountabilityQueue.getJobs([
        'waiting', 'delayed', 'active', 'completed', 'failed', 'paused', 'waiting-children', 'repeat'
    ]);

    for (const job of jobs) {
        if (job.id.startsWith(userId)) {
            const state = await job.getState();

            if (state === "waiting" || state === "delayed" || state === "failed" || state === "completed") {
                await job.remove();
                console.log(`Removed job for user ${userId}: ${job.id}`);
            } else {
                console.log(` Skipped removing job ${job.id} because it’s in state: ${state}`);
            }
        }
    }

    // 2. Prepare deduplication tracker
    const scheduledJobs = new Set();
    let firstScheduledEnd = null;
    let scheduledCount = 0;

    // 3. Schedule new jobs
    for (const entry of nextOnes) {
        const { accountability, parentTodo } = entry;

        const jobName = "Verification";
        const jobId = `${userId}__${accountability.SpecificEventId}__${accountability.AccountabilityId}`;

        if (scheduledJobs.has(jobId)) continue;
        scheduledJobs.add(jobId);

        const jobData = {
            acc: {
                AccountabilityId: accountability.AccountabilityId,
                SpecificEventId: accountability.SpecificEventId,
            },
            todo: {
                TodoId: parentTodo.TodoId,
                SpecificEventId: parentTodo.SpecificEventId,
            },
            userId
        };

        let delayUntil = new Date(accountability.end).getTime();
        let delay = delayUntil - new Date().getTime(); // UTC-based

        // Safeguard: if delay is <= 0, push it by +1s so job doesn't get lost
        if (delay <= 0) {
            console.warn(`⚠️ Delay calculated as ${delay}ms, adjusting to 1000ms`);
            delay = 1000;
        }

        if (delay > 0) {
            await accountabilityQueue.add(jobName, jobData, {
                jobId,
                delay,
                attempts: 1,
                removeOnComplete: true,
                removeOnFail: true,
            });

            console.log(` Scheduled: ${jobName} (${jobId}) at ${accountability.end.toISOString()}`);

            if (firstScheduledEnd === null) firstScheduledEnd = accountability.end;
            scheduledCount++;

            // Tell the worker service when to start
            const startDelay = Math.max(delay - 20_000, 1000); // 20 seconds before, fallback 1s

            try {
                await axios.post(`${WORKER_SERVICE_URL}/start-worker`, {
                    userId,
                    delay: startDelay
                }, { headers: { "Content-Type": "application/json" } });

                console.log(`Notified worker service to start in ${startDelay / 1000}s`);
            } catch (err) {
                console.log('Delay is :', delay);
                console.error("Failed to notify worker service:", err.message);
            }

        } else {
            console.log(` Skipped: ${jobName} (already past time)`);
        }
    }

    console.log(` Scheduled ${scheduledCount} jobs for user ${userId}`);

    // 4. Push next schedule via WS
    const internalWss = getInternalWss();
    console.log('The internalWss is:', internalWss);

    if (internalWss && firstScheduledEnd) {
        const message = {
            type: "next-schedule-updated",
            userId,
            nextScheduledAt: firstScheduledEnd.toISOString()
        };

        internalWss.clients.forEach(client => {
            if (client.readyState === 1) {
                client.send(JSON.stringify(message));
            }
        });

        console.log(`Sent nextScheduledAt to internal WS: ${firstScheduledEnd.toISOString()}`);
    } else if (firstScheduledEnd) {
        console.log(" Returning nextScheduledAt instead of pushing via WebSocket");
        return firstScheduledEnd;
    }
};

export { ScheduleChain };
