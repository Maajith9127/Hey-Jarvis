
// // import CalendarCollection from "../../models/CalendarCollection.js";
// // import { PerformToDoCollisionCrud } from "../../utils/todoCollisionCrud.js";

// // const CalendarSave = async (events, session) => {
// //     //Refactoring steps
// //     //This function in here receives added,updated,deleted
// //     //whats is supposed to be added , updated, deleted
// //     //Needs a Todo Collision check for 1)added ,2)updated if any one of these fails , then we abort or rollback the entire action
// //     //----->A Todo event can be in collision with event that is there in the added array and updated array from the front end , already exisitng Todo event in the db , 
// //     //Then we actually perform the Calendar Collision map, 
// //     //a particular Todo event could be in collision with 
// //     //----->an accountability event that is there in the added array and updated array from the front end , already exisitng accountability event in the db , 
// //     //then with that we create CollisionAdded, CollisionDeleted, CollisionUpdated array and then feed it to the  Perform ToDOCollisionCrud Array




// //     events.sort((a, b) => {
// //         // First sort by Type
// //         if (a.Type === 'Accountability' && b.Type === 'Todo') return -1;
// //         if (a.Type === 'Todo' && b.Type === 'Accountability') return 1;
// //         // If both same type, sort by start time
// //         const timeA = new Date(a.start).getTime();
// //         const timeB = new Date(b.start).getTime();
// //         return timeA - timeB;
// //     });
// //     console.log('Hi there i am handle save');
// //     const ReduxEventBuffer = []
// //     const ReduxEventBufferFinalised = [];
// //     let EventsInDB = null;
// //     const TodoCollisionCollection = []
// //     const TodoCollisionCollectionCRUDOperation = (OneTodoCollisionCollectionObject) => {
// //         TodoCollisionCollection.push(OneTodoCollisionCollectionObject)
// //     }
// //     const AccountabilityClash = (Event) => {
// //         // console.log('Hey This is from Accountability Clash', Event);

// //     }
// //     const ToDoCollision = (Event) => {
// //         // console.log('Hey This is from ToDoCollison Clash', Event);
// //         const start1 = Event.start
// //         const end1 = Event.end
// //         let flag = false
// //         const OneTodoCollisionCollectionObject =
// //         {
// //             Todo: {
// //                 TodoId: Event.TodoId,
// //                 SpecificEventId: Event.SpecificEventId,
// //                 start: Event.start,
// //                 end: Event.end,
// //             },
// //             OtherAccountabilitiesInCollisionWith: []
// //         }
// //         for (let i = 0; i < ReduxEventBuffer.length; i++) {
// //             // console.log('Accountabilty is',ReduxEventBuffer[i]);    
// //             const start2 = ReduxEventBuffer[i].start
// //             const end2 = ReduxEventBuffer[i].end
// //             const SpecificEventId = ReduxEventBuffer[i].SpecificEventId
// //             const TodoId = ReduxEventBuffer[i].TodoId
// //             const CurrentTime = new Date();
// //             //The element itself shouldnt be considered for collision
// //             if (Event.SpecificEventId === SpecificEventId) {
// //                 continue;
// //             }
// //             if ((end1 > start2) && (start1 < end2)) {
// //                 if (ReduxEventBuffer[i].Type === "Todo") {
// //                     flag = true
// //                 }
// //                 if (ReduxEventBuffer[i].Type === "Accountability") {
// //                     OneTodoCollisionCollectionObject.OtherAccountabilitiesInCollisionWith.push(ReduxEventBuffer[i])
// //                 }
// //             }
// //         }
// //         TodoCollisionCollectionCRUDOperation(OneTodoCollisionCollectionObject)
// //         return flag;
// //     }
// //     const PushNewEventToReduxEventFinalised = (Event) => {
// //         ReduxEventBufferFinalised.push(Event)
// //     }
// //     const FindThisEventsPreviousStateFromDbAndAddItToFinalisedRedux = (TodoId, SpecificEventId) => {
// //         // console.log('Finalised', TodoId, SpecificEventId);
// //         for (let i = 0; i < EventsInDB.length; i++) {
// //             if ((EventsInDB[i].SpecificEventId === SpecificEventId) && (EventsInDB[i].TodoId == TodoId)) {
// //                 ReduxEventBufferFinalised.push(EventsInDB[i])
// //                 console.log('HHiii');
// //             }
// //         }
// //     }
// //     const PushEventFromDbBufferToReduxEventFinalised = (Event) => {
// //         if (EventsInDB.length === 0) {
// //             console.log('Since these events Collide and they dont exist in DB we wont add them to DB');
// //         }
// //         else if (EventsInDB.length !== 0) {
// //             FindThisEventsPreviousStateFromDbAndAddItToFinalisedRedux(Event.TodoId, Event.SpecificEventId)
// //         }
// //     }
// //     const ExisitingDbToRevertBack = await CalendarCollection.find({}).session(session).lean()
// //     ReduxEventBuffer.push(...events);
// //     EventsInDB = ExisitingDbToRevertBack;
// //     //3)FROM HERE------------
// //     for (let i = 0; i < ReduxEventBuffer.length; i++) {
// //         const CurrentTime = new Date();
// //         if (new Date(ReduxEventBuffer[i].end) < (new Date(CurrentTime))) {
// //             ReduxEventBuffer[i].past = true;
// //         } else {
// //             ReduxEventBuffer[i].past = false;
// //         }
// //         console.log(`Event ${i}:`, ReduxEventBuffer[i]);

// //         if (ReduxEventBuffer[i].Type === 'Accountability') {
// //             const AccountabilityFiveMinClash = AccountabilityClash(ReduxEventBuffer[i]);
// //             if (!AccountabilityFiveMinClash) {
// //                 PushNewEventToReduxEventFinalised(ReduxEventBuffer[i])
// //             }
// //             else if (AccountabilityFiveMinClash === true) {
// //                 PushEventFromDbBufferToReduxEventFinalised(ReduxEventBuffer[i])
// //             }
// //         }
// //         else if (ReduxEventBuffer[i].Type === 'Todo') {
// //             const TodoCollision = ToDoCollision(ReduxEventBuffer[i])
// //             //i.e Only if Type is ToDo add it to CollisionColection
// //             if (!TodoCollision) {
// //                 PushNewEventToReduxEventFinalised(ReduxEventBuffer[i])
// //             }
// //             else if (TodoCollision === true) {
// //                 console.log('This One event Violated The rules', ReduxEventBuffer[i]);
// //                 PushEventFromDbBufferToReduxEventFinalised(ReduxEventBuffer[i])
// //             }
// //         }
// //     }
// //     const NewEventsToBeAdded = [];
// //     const EventsThatNeedsToBeDeleted = [];
// //     const EventsThatNeedsToBeUpdated = [];
// //     // Helper function to compare if two events are different (needs update)
// //     const eventsAreDifferent = (event1, event2) => {
// //         return JSON.stringify(event1) !== JSON.stringify(event2);
// //     };
// //     // Find events that need to be added or updated
// //     for (const reduxEvent of ReduxEventBufferFinalised) {
// //         let foundInDB = false;
// //         for (const dbEvent of EventsInDB) {
// //             if (reduxEvent.SpecificEventId === dbEvent.SpecificEventId &&
// //                 reduxEvent.TodoId === dbEvent.TodoId) {
// //                 foundInDB = true;
// //                 // Check if the event needs to be updated
// //                 if (eventsAreDifferent(reduxEvent, dbEvent)) {
// //                     EventsThatNeedsToBeUpdated.push(reduxEvent);
// //                 }
// //                 break;
// //             }
// //         }
// //         // If not found in DB, it's a new event to be added
// //         if (!foundInDB) {
// //             NewEventsToBeAdded.push(reduxEvent);
// //         }
// //     }
// //     // Find events that need to be deleted (present in DB but not in Redux buffer)
// //     for (const dbEvent of EventsInDB) {
// //         let foundInRedux = false;
// //         for (const reduxEvent of ReduxEventBufferFinalised) {
// //             if (reduxEvent.SpecificEventId === dbEvent.SpecificEventId &&
// //                 reduxEvent.TodoId === dbEvent.TodoId) {
// //                 foundInRedux = true;
// //                 break;
// //             }
// //         }
// //         // If not found in Redux buffer, it should be deleted
// //         if (!foundInRedux) {
// //             EventsThatNeedsToBeDeleted.push(dbEvent);
// //         }
// //     }
// //     const syncCalendarWithDatabase = async () => {
// //         try {
// //             // 1. Add new events
// //             if (NewEventsToBeAdded.length > 0) {
// //                 // console.log('Adding new events to database...');
// //                 // console.log('Evenst to be addedd',NewEventsToBeAdded);
// //                 const result = await CalendarCollection.insertMany(NewEventsToBeAdded, { session });
// //                 // console.log(`Successfully added ${result.length} new events`);
// //             }

// //             // 2. Update existing events
// //             if (EventsThatNeedsToBeUpdated.length > 0) {
// //                 // console.log('Updating existing events...');
// //                 const updatePromises = EventsThatNeedsToBeUpdated.map(async (event) => {
// //                     return await CalendarCollection.findOneAndUpdate(
// //                         {
// //                             SpecificEventId: event.SpecificEventId,
// //                             TodoId: event.TodoId
// //                         },
// //                         { $set: event },
// //                         { new: true },
// //                         { session, new: true }
// //                     );
// //                 });

// //                 await Promise.all(updatePromises);
// //                 console.log(`Successfully updated ${EventsThatNeedsToBeUpdated.length} events`);
// //             }
// //             // 3. Delete removed events
// //             if (EventsThatNeedsToBeDeleted.length > 0) {
// //                 console.log('Removing deleted events...');
// //                 const deletePromises = EventsThatNeedsToBeDeleted.map(async (event) => {
// //                     return await CalendarCollection.findOneAndDelete({
// //                         SpecificEventId: event.SpecificEventId,
// //                         TodoId: event.TodoId
// //                     },
// //                         { session }

// //                     );
// //                 });
// //                 await Promise.all(deletePromises);
// //                 console.log(`Successfully deleted ${EventsThatNeedsToBeDeleted.length} events`);
// //             }
// //             console.log('Database synchronization completed successfully!');
// //             return {
// //                 added: NewEventsToBeAdded.length,
// //                 updated: EventsThatNeedsToBeUpdated.length,
// //                 deleted: EventsThatNeedsToBeDeleted.length
// //             };

// //         } catch (error) {
// //             console.error('Error during database synchronization:', error);
// //             throw error;
// //         }
// //     };
// //     // Execute the synchronization
// //     syncCalendarWithDatabase()
// //         .then(results => {
// //             // console.log('Final results:', results);
// //         })
// //         .catch(error => {
// //             // console.error('Synchronization failed:', error);
// //         });


// //         //Refactoring step
// //         //Here we will pass CollisionAdded, CollisionDeleted, CollisionUpdated these all
// //     await PerformToDoCollisionCrud(TodoCollisionCollection, session);

// //     //5)
// //     //Clear Buffer
// //     ReduxEventBuffer.length = 0;
// //     ReduxEventBufferFinalised.length = 0;
// //     TodoCollisionCollection.length = 0;
// //     EventsInDB = null;
// //     return {
// //         TodoCollisionCollection: TodoCollisionCollection,
// //     }
// // }


// // const GetCalendarEvents = async (session) => {
// //     const CalendarEvents = await CalendarCollection.find({}).session(session).lean();
// //     if (!CalendarEvents || CalendarEvents.length === 0) {
// //         console.log('No calendar events found');
// //         return [];
// //     }
// //     return CalendarEvents;

// // }
// // export {
// //     CalendarSave,
// //     GetCalendarEvents
// // }



// import CalendarCollection from "../../models/CalendarCollection.js";
// import { PerformToDoCollisionCrud } from "../../utils/todoCollisionCrud.js";

// //  Validates Todo against buffer & DB Todos + Accountabilities
// async function validateTodoEvent(eventToValidate, eventsToValidate, allAccountabilityEvents, session) {
//     const { start, end, SpecificEventId } = eventToValidate;

//     //  Check buffer Todo collisions
//     const pendingTodoCollisions = eventsToValidate.filter(e =>
//         e.Type === 'Todo' &&
//         e.SpecificEventId !== SpecificEventId &&
//         new Date(e.start) < new Date(end) &&
//         new Date(e.end) > new Date(start)
//     );
//     if (pendingTodoCollisions.length > 0) {
//         return { hasHardCollision: true, collidingAccountabilities: [] };
//     }

//     //  Check DB Todo collisions
//     const dbTodoCollisionCount = await CalendarCollection.countDocuments({
//         Type: 'Todo',
//         SpecificEventId: { $ne: SpecificEventId },
//         start: { $lt: end },
//         end: { $gt: start }
//     }).session(session);
//     if (dbTodoCollisionCount > 0) {
//         return { hasHardCollision: true, collidingAccountabilities: [] };
//     }

//     // 🔁 Check buffer Accountability collisions
//     const pendingAccountabilityCollisions = allAccountabilityEvents.filter(acc =>
//         acc.start && acc.end &&
//         new Date(acc.start) < new Date(end) &&
//         new Date(acc.end) > new Date(start)
//     );

//     // 🔁 Check DB Accountability collisions
//     const dbAccountabilityCollisions = await CalendarCollection.find({
//         Type: 'Accountability',
//         start: { $lt: end },
//         end: { $gt: start }
//     }).session(session).lean();

//     return {
//         hasHardCollision: false,
//         collidingAccountabilities: [...pendingAccountabilityCollisions, ...dbAccountabilityCollisions]
//     };
// }

// const CalendarSave = async (calendarDeltas, session) => {
//     const { added = [], updated = [], deleted = [] } = calendarDeltas;
//     const validatedCalendarOps = [];
//     const collisionInfoPayload = [];

//     const eventsToValidate = [...added, ...updated];
//     const allAccountabilityEvents = eventsToValidate.filter(e => e.Type === 'Accountability');

//     // ✅ Handle new/updated Todos and check collisions
//     for (const event of eventsToValidate) {
//         if (event.Type === 'Todo') {
//             const validationResult = await validateTodoEvent(event, eventsToValidate, allAccountabilityEvents, session);

//             if (validationResult.hasHardCollision) {
//                 throw new Error(`❌ Todo '${event.title}' collides with another Todo`);
//             }

//             if (validationResult.collidingAccountabilities.length > 0) {
//                 collisionInfoPayload.push({
//                     Todo: event,
//                     OtherAccountabilitiesInCollisionWith: validationResult.collidingAccountabilities
//                 });
//             }
//         }
//     }

//     // ✅ NEW: Handle updated Accountability events that may now collide with DB Todos
//     const updatedAccountabilities = updated.filter(e => e.Type === 'Accountability');

//     for (const accEvent of updatedAccountabilities) {
//         const { start, end } = accEvent;

//         const dbTodoCollisions = await CalendarCollection.find({
//             Type: 'Todo',
//             start: { $lt: end },
//             end: { $gt: start }
//         }).session(session).lean();

//         dbTodoCollisions.forEach(todoEvent => {
//             collisionInfoPayload.push({
//                 Todo: todoEvent,
//                 OtherAccountabilitiesInCollisionWith: [accEvent]
//             });
//         });
//     }

//     // ✅ INSERT
//     added.forEach(event => {
//         if (event.past === undefined) event.past = false;
//         if (event.verified === undefined) event.verified = false;
//         validatedCalendarOps.push({ insertOne: { document: event } });
//     });

//     // ✅ UPDATE
//     updated.forEach(event => {
//         validatedCalendarOps.push({
//             updateOne: {
//                 filter: { SpecificEventId: event.SpecificEventId },
//                 update: { $set: event }
//             }
//         });
//     });

//     // ✅ DELETE
//     if (deleted.length > 0) {
//         const deleteIds = deleted.map(ev => ev.SpecificEventId);
//         console.log('🗑 Deleting these IDs:', deleteIds);
//         validatedCalendarOps.push({
//             deleteMany: {
//                 filter: { SpecificEventId: { $in: deleteIds } }
//             }
//         });
//     }

//     // ✅ Apply DB sync
//     if (validatedCalendarOps.length > 0) {
//         await CalendarCollection.bulkWrite(validatedCalendarOps, { session });
//     }

//     // ✅ Sync CollisionCollection
//     const updatedTodoIds = updated.filter(e => e.Type === 'Todo').map(e => e.SpecificEventId);
//     await PerformToDoCollisionCrud(calendarDeltas, session);
// };

// const GetCalendarEvents = async (session) => {
//     const CalendarEvents = await CalendarCollection.find({}).session(session).lean();
//     if (!CalendarEvents || CalendarEvents.length === 0) {
//         console.log('No calendar events found');
//         return [];
//     }
//     return CalendarEvents;
// };

// export { CalendarSave, GetCalendarEvents };
