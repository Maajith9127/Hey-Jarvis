// import { CalendarSave } from "../../../controllers/calendarController.js";
// import { ScheduleChain } from "../ScheduleChain.js";
// import { wss } from "../../../wsServer.js";

// export const handleAccJob = async (data, userId) => {
//     try {
//         console.log("[AccJob] Received accountability event data:");
//         console.log(JSON.stringify(data, null, 2));
//         // Step 1: Use CalendarSave with proper delta structure
//         await CalendarSave(
//             {
//                 added: [data],   // insert one accountability event
//                 updated: [],
//                 deleted: []
//             },
//             userId,
//             null //  no session, not part of SaveAll
//         );
//         // Step 2: Trigger ScheduleChain to update queue
//         await ScheduleChain(userId);
//         console.log("[AccJob] ScheduleChain executed");
//         // Step 3: Send data to frontend via WebSocket
//         wss.clients.forEach(client => {
//             if (client.readyState === 1) { // 1 = OPEN
//                 client.send(JSON.stringify({
//                     type: "new-acc-event",
//                     payload: data
//                 }));
//             }
//         });
//     } catch (error) {
//         console.error(" [AccJob] Error:", error.message);
//     }
// };



import { CalendarSave } from "../../../controllers/calendarController.js";
import { ScheduleChain } from "../ScheduleChain.js";
import { getWss } from "../../../wsServer.js"; //  Use dynamic getter

export const handleAccJob = async (data, userId) => {
    try {
        console.log("[AccJob] Received accountability event data:");
        console.log(JSON.stringify(data, null, 2));

        // Step 1: Save the event
        await CalendarSave(
            {
                added: [data],
                updated: [],
                deleted: [],
            },
            userId,
            null
        );

        // Step 2: Trigger ScheduleChain
        await ScheduleChain(userId);
        console.log("[AccJob] ScheduleChain executed");

        // Step 3: Send via WebSocket
        const wss = getWss(); //  Dynamically get the initialized instance
        if (wss) {
            wss.clients.forEach(client => {
                if (client.readyState === 1) {
                    client.send(
                        JSON.stringify({
                            type: "new-acc-event",
                            payload: data,
                        })
                    );
                }
            });
            console.log("✅ Sent new-acc-event via WebSocket");
        } else {
            console.warn("⚠️ WebSocket server not initialized — skipping send");
        }
    } catch (error) {
        console.error("❌ [AccJob] Error:", error.message);
    }
};
