import express from 'express';
import CalendarCollection from '../models/CalendarCollection.js';
import { acquireLock, releaseLock } from '../utils/redisLock.js';
import {PerformToDoCollisionCrud} from '../utils/todoCollisionCrud.js';
// import { ScheduleChain } from '../utils/ScheduleComponents/ScheduleChain.js';
import { CalendarSave,GetCalendarEvents } from './SavingFunctions/CalendarSave.js';

const CalendarRoute = express.Router();

CalendarRoute.post('/CalendarSave', async (req, res) => {
  const { events } = req.body;
  const lockKey = 'calendar:lock:global'; // Or use per user/calendar like `calendar:lock:${userId}`
  const lockAcquired = await acquireLock(lockKey);
  if (!lockAcquired) {
    console.log("Hey its locked please wait")
  return res.status(423).json({ message: "Calendar is currently being modified. Please try again shortly." });
}
//Critical Section of the Code
try{
  const TodoCollisionCollection= await CalendarSave(events);
    // await PerformToDoCollisionCrud(TodoCollisionCollection.TodoCollisionCollection)
    // await ScheduleChain()
    return res.status(200).json({
    message: `Message Received Successfully:`
  });
}
finally{
  await releaseLock(lockKey);
}
});
CalendarRoute.get('/getAllEvents', async (req, res) => {

  try {
    console.log('Getting All Events');
    const AllEventsInDataBase = await GetCalendarEvents();
    console.log('All Events:', AllEventsInDataBase);
    return res.status(200).json({
      Events: AllEventsInDataBase
    });
  } catch (error) {
    console.log('There is an error', error);
  }
})
CalendarRoute.patch('/StrictMode', async (req, res) => {
  const { Message } = req.body;
  try {
    await CalendarCollection.updateMany({}, { $set: { StrictMode: true } })
    console.log("Strict Mode Updated")
  } catch (error) {
    console.log('There is an error', error);
  }
  return res.status(200).json({
    message: `Message Received Successfully:`
  });
})
CalendarRoute.delete('/deleteEvent', async (req, res) => {
  const { SpecificEventId } = req.body;
  console.log('"Deleting events');
  if (!SpecificEventId) {
    return res.status(400).json({ error: "Missing SpecificEventId in request body." });
  }
  try {
    const result = await CalendarCollection.deleteOne({ SpecificEventId });
    console.log("🗑️ Deleting event:", SpecificEventId);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Event not found." });
    }
    return res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});
export default CalendarRoute;





//MY OLD BAD CODE FOR LEARNING PURPOSE
// import express from 'express';
// import CalendarCollection from '../models/CalendarCollection.js';
// import CollisionCollection from '../models/CollisionCollection.js';
// import { acquireLock, releaseLock } from '../utils/redisLock.js';

// const CalendarRoute = express.Router();

// const UpdateCollisionCollection = async (event, collisions) => {
// };
// const ToDoColllision = async (event) => {
//   const EventTimeRange = {
//     start: event.start,
//     end: event.end,
//   }
//   // console.log('Hey the ToDo element is ',event);
//   // console.log('Event Time Range',EventTimeRange);
//   let OuterFlag = false;
//   const EventsInDb = await CalendarCollection.find({}).lean()
//   const ToDoCollisionWithAccountabilities = []
//   // console.log('All the elements in DB are ',EventsInDb);
//   const start1 = new Date(EventTimeRange.start);
//   const end1 = new Date(EventTimeRange.end);

//   for (let j = 0; j < EventsInDb.length; j++) {
//     if (EventsInDb[j].Type === "Todo") {
//       const start2 = new Date(EventsInDb[j].start);
//       const end2 = new Date(EventsInDb[j].end);
//       if ((end1 > start2) && (start1 < end2)) {
//         // console.log(`The Todo  event ${event} collides  with the Todo event ${EventsInDb[j]}`);
//         OuterFlag = true
//         //Move out of the loop
//       }
//     }
//     else if (EventsInDb[j].Type === 'Accountability') {
//       const start2 = new Date(EventsInDb[j].start);
//       const end2 = new Date(EventsInDb[j].end);
//       if ((end1 > start2) && (start1 < end2)) {
//         // console.log(`The Todo  event ${event} collides  with the Todo event ${EventsInDb[j]}`);
//         ToDoCollisionWithAccountabilities.push(EventsInDb[j]);
//       }
//     }
//   }
//   await UpdateCollisionCollection(event, ToDoCollisionWithAccountabilities)
//   return OuterFlag;
// }
// // CalendarRoute.post('/CalendarSave', async (req, res) => {

// //   const { events } = req.body;

// //   events.sort((a, b) => {
// //     if (a.Type === 'Accountability' && b.Type === 'Todo') return -1;
// //     if (a.Type === 'Todo' && b.Type === 'Accountability') return 1;
// //     return 0;
// //   });

// //   for (let i = 0; i < events.length; i++) {
// //     const event = events[i];
// //     const lockKey = event.SpecificEventId;
// //     const gotLock = await acquireLock(lockKey);
// //     if (!gotLock) {
// //       console.log(`🚫 Lock not acquired for ${lockKey}, skipping`);
// //       continue; 
// //     }

// //     const DoesEventExists = await CalendarCollection.findOne({ SpecificEventId: event.SpecificEventId })
// //     if (DoesEventExists === null) {
// //       if (event.Type === "Todo") {
// //         console.log('Hey this is a Todo Event', event);
// //         if (await ToDoColllision(event)) {
// //         } else {
// //           await CalendarCollection.create(event)
// //         }
// //       }
// //       else if (event.Type === 'Accountability') {
// //         await CalendarCollection.create(event)
// //       }
// //     }
// //     else {

// //       if (event.Type === "Todo") {
// //         if (await ToDoColllision(event)) {
// //           console.log('New Updates has  collision Therefore Don update it');
// //         }
// //         else {
// //           console.log('New Updates have no collision');
// //           await CalendarCollection.updateOne(
// //             { SpecificEventId: event.SpecificEventId },
// //             {
// //               $set: {
// //                 start: event.start,
// //                 end: event.end,
// //                 title: event.title,
// //                 timeSlot: event.timeSlot,
// //                 StrictMode: event.StrictMode,
// //                 TodoId: event.TodoId,
// //                 Type: event.Type
// //               }
// //             }
// //           );

// //         }
// //       }
// //       else if (event.Type === "Accountability") {
// //         await CalendarCollection.updateOne(
// //           { SpecificEventId: event.SpecificEventId },
// //           {
// //             $set: {
// //               start: event.start,
// //               end: event.end,
// //               title: event.title,
// //               timeSlot: event.timeSlot,
// //               StrictMode: event.StrictMode,
// //               AccountabilityId: event.AccountabilityId,
// //               Type: event.Type
// //             }
// //           }
// //         );
// //         console.log("✅ Accountability event updated successfully");
// //       }
// //     }
    
// //   }
    
    
// //   return res.status(200).json({
// //     message: `Message Received Successfully:`
// //   });
// // })

// CalendarRoute.post('/CalendarSave', async (req, res) => {
//   const { events } = req.body;

//   events.sort((a, b) => {
//     if (a.Type === 'Accountability' && b.Type === 'Todo') return -1;
//     if (a.Type === 'Todo' && b.Type === 'Accountability') return 1;
//     return 0;
//   });

//   for (let i = 0; i < events.length; i++) {
//     const event = events[i];
//     const lockKey = event.SpecificEventId;

//     const gotLock = await acquireLock(lockKey);
//     if (!gotLock) {
//       console.log(`🚫 Lock not acquired for ${lockKey}, skipping`);
//       continue;
//     }

//     try {
//       const DoesEventExists = await CalendarCollection.findOne({ SpecificEventId: event.SpecificEventId });

//       if (DoesEventExists === null) {
//         if (event.Type === "Todo") {
//           console.log('Hey this is a Todo Event', event);
//           const hasCollision = await ToDoColllision(event);
//           if (!hasCollision) {
//             await CalendarCollection.create(event);
//           }
//         } else if (event.Type === 'Accountability') {
//           await CalendarCollection.create(event);
//         }
//       } else {
//         if (event.Type === "Todo") {
//           const hasCollision = await ToDoColllision(event);
//           if (hasCollision) {
//             console.log('New Updates has collision, therefore don’t update it');
//           } else {
//             console.log('New Updates have no collision');
//             await CalendarCollection.updateOne(
//               { SpecificEventId: event.SpecificEventId },
//               {
//                 $set: {
//                   start: event.start,
//                   end: event.end,
//                   title: event.title,
//                   timeSlot: event.timeSlot,
//                   StrictMode: event.StrictMode,
//                   TodoId: event.TodoId,
//                   Type: event.Type
//                 }
//               }
//             );
//           }
//         } else if (event.Type === "Accountability") {
//           await CalendarCollection.updateOne(
//             { SpecificEventId: event.SpecificEventId },
//             {
//               $set: {
//                 start: event.start,
//                 end: event.end,
//                 title: event.title,
//                 timeSlot: event.timeSlot,
//                 StrictMode: event.StrictMode,
//                 AccountabilityId: event.AccountabilityId,
//                 Type: event.Type
//               }
//             }
//           );
//           console.log("✅ Accountability event updated successfully");
//         }
//       }
//     } finally {
//       await releaseLock(lockKey); // Always release the lock
//     }
//   }

//   return res.status(200).json({
//     message: `Message Received Successfully:`
//   });
// });



// CalendarRoute.patch('/StrictMode', async (req, res) => {
//   const { Message } = req.body;
//   try {
//     await CalendarCollection.updateMany({}, { $set: { StrictMode: true } })
//     console.log("Strict Mode Updated")
//   } catch (error) {
//     console.log('There is an error', error);
//   }
//   return res.status(200).json({
//     message: `Message Received Successfully:`
//   });
// })

// CalendarRoute.get('/getAllEvents', async (req, res) => {

//   try {
//     console.log('Getting All Events');
//     const AllEventsInDataBase = await CalendarCollection.find({}).lean();
//     console.log('All Events:', AllEventsInDataBase);
//     return res.status(200).json({
//       Events: AllEventsInDataBase
//     });
//   } catch (error) {
//     console.log('There is an error', error);
//   }
// })

// CalendarRoute.delete('/deleteEvent', async (req, res) => {
//   const { SpecificEventId } = req.body;
//   console.log('"Deleting events');
//   if (!SpecificEventId) {
//     return res.status(400).json({ error: "Missing SpecificEventId in request body." });
//   }
//   try {
//     const result = await CalendarCollection.deleteOne({ SpecificEventId });
//     console.log("🗑️ Deleting event:", SpecificEventId);
//     if (result.deletedCount === 0) {
//       return res.status(404).json({ message: "Event not found." });
//     }
//     return res.status(200).json({ message: "Event deleted successfully." });
//   } catch (error) {
//     console.error("Error deleting event:", error);
//     return res.status(500).json({ error: "Internal server error." });
//   }
// });
// export default CalendarRoute;





