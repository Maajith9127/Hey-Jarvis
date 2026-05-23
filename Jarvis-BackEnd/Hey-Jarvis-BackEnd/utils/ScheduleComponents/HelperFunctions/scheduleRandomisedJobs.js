
// import { randomisedQueue } from "../queues/accountabilityQueue.js";
// import { format } from 'date-fns';
// import { v4 as uuidv4 } from 'uuid';
// // Generate clean, non-overlapping, randomly reduced slots
// export function generateSmartRandomisedEvents(todo, config, userId) {
//     const { slotDuration, AccountabilityId, type, label } = config;

//     const startMs = new Date(todo.start).getTime();
//     const endMs = new Date(todo.end).getTime();
//     const slotDurationMs = slotDuration * 60 * 1000;

//     const totalSlots = Math.floor((endMs - startMs) / slotDurationMs);
//     if (totalSlots <= 0) return [];

//     // Step 1: Generate evenly spaced slots
//     const allSlots = Array.from({ length: totalSlots }).map((_, i) => {
//         const slotStart = new Date(startMs + i * slotDurationMs);
//         const slotEnd = new Date(slotStart.getTime() + slotDurationMs);
//         const timeSlotStr = `${format(slotStart, 'hh:mma')} - ${format(slotEnd, 'hh:mma')} / ${format(slotStart, 'd/M/yyyy')}`;

//         return {
//             userId,
//             Type: "Accountability",
//             AccountabilityId,
//             SpecificEventId: uuidv4(),
//             title:label || "Untitled", 
//             start: slotStart,
//             end: slotEnd,
//             timeSlot: timeSlotStr,
//             verified: false,
//             past: false,
//             CollectionType: type,
//             StrictMode: slotEnd.toISOString()
//         };
//     });

//     // Step 2: Randomly drop some slots to simulate randomness
//     const finalSlots = allSlots.filter(() => Math.random() > 0.8); // ~60% chance to keep each

//     return finalSlots;
// }

// //  Schedule the selected accountability events as BullMQ jobs
// export const scheduleRandomisedJobs = async (todo, config, userId) => {
//     if (!todo || !config) return;

//     console.log(' Running scheduleRandomisedJobs...');
//     console.log(' Todo:', todo);
//     console.log(' Config:', config);
//     console.log(' UserId:', userId);

//     // Step 1: Generate accountability events
//     const accEvents = generateSmartRandomisedEvents(todo, config, userId);
//     console.log(`Will schedule ${accEvents.length} accountability events`);

//     // Step 2: Schedule each event into the queue
//     for (let i = 0; i < accEvents.length; i++) {
//         const accEvent = accEvents[i];
//         const delay = accEvent.start.getTime() - Date.now();

//         console.log(` Job #${i + 1} → triggers in ${Math.floor(delay / 1000)}s @ ${accEvent.start.toISOString()}`);

//         await randomisedQueue.add(`randomised-accountability-job-${i}-${userId}`, {
//             type: 'AccJob',
//             ...accEvent
//         }, {
//             delay,
//             removeOnComplete: true,
//             removeOnFail: true,
//             jobId: `randomised-accountability-job-${i}-${userId}`
//         });
//     }

//     // Step 3: Schedule NextChain trigger at the end of this Todo
//     const finalDelay = new Date(todo.end).getTime() - Date.now();
//     console.log(` Scheduling NextChain in ${Math.floor(finalDelay / 1000)}s`);

//     await randomisedQueue.add(`next-chain-${todo.TodoId}`, {
//         type: 'NextChain',
//         userId
//     }, {
//         delay: finalDelay,
//         removeOnComplete: true,
//         removeOnFail: true,
//         jobId: `randomised-accountability-job-${userId}`
//     });
// };


import { randomisedQueue } from "../queues/accountabilityQueue.js";
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const WORKER_SERVICE_URL = process.env.WORKER_SERVICE_URL || "http://127.0.0.1:10000";

// Generate clean, non-overlapping, randomly reduced slots
export function generateSmartRandomisedEvents(todo, config, userId) {
    const { slotDuration, AccountabilityId, type, label } = config;

    const startMs = new Date(todo.start).getTime();
    const endMs = new Date(todo.end).getTime();
    const slotDurationMs = slotDuration * 60 * 1000;

    const totalSlots = Math.floor((endMs - startMs) / slotDurationMs);
    if (totalSlots <= 0) return [];

    // Step 1: Generate evenly spaced slots
    const allSlots = Array.from({ length: totalSlots }).map((_, i) => {
        const slotStart = new Date(startMs + i * slotDurationMs);
        const slotEnd = new Date(slotStart.getTime() + slotDurationMs);
        const timeSlotStr = `${format(slotStart, 'hh:mma')} - ${format(slotEnd, 'hh:mma')} / ${format(slotStart, 'd/M/yyyy')}`;

        return {
            userId,
            Type: "Accountability",
            AccountabilityId,
            SpecificEventId: uuidv4(),
            title: label || "Untitled",
            start: slotStart,
            end: slotEnd,
            timeSlot: timeSlotStr,
            verified: false,
            past: false,
            CollectionType: type,
            StrictMode: slotEnd.toISOString()
        };
    });

    // Step 2: Randomly drop some slots to simulate randomness
    const finalSlots = allSlots.filter(() => Math.random() > 0.4); // keep ~60%

    return finalSlots;
}

// Schedule the selected accountability events as BullMQ jobs
export const scheduleRandomisedJobs = async (todo, config, userId) => {
    if (!todo || !config) return;

    console.log(' Running scheduleRandomisedJobs...');
    console.log(' Todo:', todo);
    console.log(' Config:', config);
    console.log(' UserId:', userId);

    // Step 1: Generate accountability events
    const accEvents = generateSmartRandomisedEvents(todo, config, userId);
    console.log(`Will schedule ${accEvents.length} accountability events`);

    // Step 2: Schedule each event into the queue + notify worker
    for (let i = 0; i < accEvents.length; i++) {
        const accEvent = accEvents[i];
        const delay = accEvent.start.getTime() - Date.now();

        // Ignore already expired ones
        if (delay <= 0) {
            console.warn(`⚠️ Skipping expired randomised job at ${accEvent.start.toISOString()}`);
            continue;
        }

        console.log(` Job #${i + 1} → triggers in ${Math.floor(delay / 1000)}s @ ${accEvent.start.toISOString()}`);

        // Add job to queue
        await randomisedQueue.add(`randomised-accountability-job-${i}-${userId}`, {
            type: 'AccJob',
            ...accEvent
        }, {
            delay,
            removeOnComplete: true,
            removeOnFail: true,
            jobId: `randomised-accountability-job-${i}-${userId}`
        });

        // Tell randomised worker to wake before this job
        const startDelay = Math.max(delay - 20_000, 1000);
        try {
            await axios.post(`${WORKER_SERVICE_URL}/start-randomised-worker`, {
                userId,
                delay: startDelay
            }, { headers: { "Content-Type": "application/json" } });

            console.log(`🔔 Notified randomised worker to start in ${startDelay / 1000}s`);
        } catch (err) {
            console.error("⚠️ Failed to notify randomised worker:", err.message);
        }
    }

    // Step 3: Schedule NextChain trigger at the end of this Todo
    const finalDelay = new Date(todo.end).getTime() - Date.now();
    console.log(` Scheduling NextChain in ${Math.floor(finalDelay / 1000)}s`);

    await randomisedQueue.add(`next-chain-${todo.TodoId}`, {
        type: 'NextChain',
        userId
    }, {
        delay: finalDelay,
        removeOnComplete: true,
        removeOnFail: true,
        jobId: `randomised-accountability-job-${userId}`
    });

    // Also notify worker for NextChain
    const chainStartDelay = Math.max(finalDelay - 20_000, 1000);
    try {
        await axios.post(`${WORKER_SERVICE_URL}/start-randomised-worker`, {
            userId,
            delay: chainStartDelay
        }, { headers: { "Content-Type": "application/json" } });

        console.log(`🔔 Notified randomised worker for NextChain in ${chainStartDelay / 1000}s`);
    } catch (err) {
        console.error("⚠️ Failed to notify randomised worker (NextChain):", err.message);
    }
};
