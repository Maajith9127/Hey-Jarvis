import CalendarCollection from "../models/CalendarCollection.js";
import { PerformToDoCollisionCrud } from "../utils/todoCollisionCrud.js";
import CollisionCollection from "../models/CollisionCollection.js";
import { randomised } from "../utils/ScheduleComponents/Randomised.js";
import { config } from "dotenv";

//  Validate one Todo event against collisions
// async function validateTodoEvent(eventToValidate, eventsToValidate, allAccountabilityEvents, userId, session) {
//     const { start, end, SpecificEventId } = eventToValidate;

//     // In-buffer Todo collision
//     const pendingTodoCollisions = eventsToValidate.filter(e =>
//         e.Type === 'Todo' &&
//         e.SpecificEventId !== SpecificEventId &&
//         new Date(e.start) < new Date(end) &&
//         new Date(e.end) > new Date(start)
//     );
//     if (pendingTodoCollisions.length > 0) {
//         return { hasHardCollision: true, collidingAccountabilities: [] };
//     }

//     // DB Todo collision (user-specific)
//     const dbTodoCollisionCount = await CalendarCollection.countDocuments({
//         userId,
//         Type: 'Todo',
//         SpecificEventId: { $ne: SpecificEventId },
//         start: { $lt: end },
//         end: { $gt: start }
//     }).session(session);
//     if (dbTodoCollisionCount > 0) {
//         return { hasHardCollision: true, collidingAccountabilities: [] };
//     }

//     // In-buffer Accountability collision
//     const pendingAccountabilityCollisions = allAccountabilityEvents.filter(acc =>
//         acc.start && acc.end &&
//         new Date(acc.start) < new Date(end) &&
//         new Date(acc.end) > new Date(start)
//     );

//     // DB Accountability collisions (user-specific)
//     const dbAccountabilityCollisions = await CalendarCollection.find({
//         userId,
//         Type: 'Accountability',
//         start: { $lt: end },
//         end: { $gt: start }
//     }).session(session).lean();

//     return {
//         hasHardCollision: false,
//         collidingAccountabilities: [...pendingAccountabilityCollisions, ...dbAccountabilityCollisions]
//     };
// }

// Fixed validateTodoEvent function
async function validateTodoEvent(eventToValidate, eventsToValidate, allAccountabilityEvents, userId, session) {
    const { start, end, SpecificEventId } = eventToValidate;

    // In-buffer Todo collision
    const pendingTodoCollisions = eventsToValidate.filter(e =>
        e.Type === 'Todo' &&
        e.SpecificEventId !== SpecificEventId &&
        new Date(e.start) < new Date(end) &&
        new Date(e.end) > new Date(start)
    );
    if (pendingTodoCollisions.length > 0) {
        return { hasHardCollision: true, collidingAccountabilities: [] };
    }

    // Get all SpecificEventIds that are being updated in this batch
    const updatingEventIds = eventsToValidate.map(e => e.SpecificEventId);

    // DB Todo collision (user-specific) - FIXED: Exclude current event AND other events being updated
    const dbTodoCollisionCount = await CalendarCollection.countDocuments({
        userId,
        Type: 'Todo',
        SpecificEventId: { $nin: updatingEventIds }, // Exclude ALL events being updated in this batch
        start: { $lt: end },
        end: { $gt: start }
    }).session(session);
    if (dbTodoCollisionCount > 0) {
        return { hasHardCollision: true, collidingAccountabilities: [] };
    }

    // In-buffer Accountability collision
    const pendingAccountabilityCollisions = allAccountabilityEvents.filter(acc =>
        acc.start && acc.end &&
        new Date(acc.start) < new Date(end) &&
        new Date(acc.end) > new Date(start)
    );

    // DB Accountability collisions (user-specific)
    const dbAccountabilityCollisions = await CalendarCollection.find({
        userId,
        Type: 'Accountability',
        start: { $lt: end },
        end: { $gt: start }
    }).session(session).lean();

    return {
        hasHardCollision: false,
        collidingAccountabilities: [...pendingAccountabilityCollisions, ...dbAccountabilityCollisions]
    };
}

//Save calendar with collision validation + user-level access
// export const CalendarSave = async (calendarDeltas, userId, session) => {
//     const { added = [], updated = [], deleted = [] } = calendarDeltas;
//     const validatedCalendarOps = [];
//     const collisionInfoPayload = [];

//     const eventsToValidate = [...added, ...updated];
//     const allAccountabilityEvents = eventsToValidate.filter(e => e.Type === 'Accountability');

//     //Check for Todo collisions
//     for (const event of eventsToValidate) {
//         if (event.Type === 'Todo') {
//             const validationResult = await validateTodoEvent(event, eventsToValidate, allAccountabilityEvents, userId, session);

//             if (validationResult.hasHardCollision) {
//                 throw new Error(` Todo '${event.title}' collides with another Todo`);
//             }

//             if (validationResult.collidingAccountabilities.length > 0) {
//                 collisionInfoPayload.push({
//                     Todo: event,
//                     OtherAccountabilitiesInCollisionWith: validationResult.collidingAccountabilities
//                 });
//             }
//         }
//     }

//     //Insert: add userId to every document
//     added.forEach(event => {
//         validatedCalendarOps.push({
//             insertOne: {
//                 document: {
//                     ...event,
//                     userId,
//                     past: event.past ?? false,
//                     verified: event.verified ?? false
//                 }
//             }
//         });
//     });

//     //Update: scoped to current user
//     updated.forEach(event => {
//         validatedCalendarOps.push({
//             updateOne: {
//                 filter: { SpecificEventId: event.SpecificEventId, userId },
//                 update: { $set: event }
//             }
//         });
//     });

//     //Delete: only user's events
//     if (deleted.length > 0) {
//         const deleteIds = deleted.map(ev => ev.SpecificEventId);
//         validatedCalendarOps.push({
//             deleteMany: {
//                 filter: { SpecificEventId: { $in: deleteIds }, userId }
//             }
//         });
//     }

//     //Apply DB writes
//     if (validatedCalendarOps.length > 0) {
//         await CalendarCollection.bulkWrite(validatedCalendarOps, { session });
//     }

//     //Rebuild collision map
//     await PerformToDoCollisionCrud(calendarDeltas, userId, session);
//     console.log('CRUD operations completed successfully for Calendar events.');



// };

export const CalendarSave = async (calendarDeltas, userId, session) => {
    const { added = [], updated = [], deleted = [] } = calendarDeltas;
    const validatedCalendarOps = [];
    const collisionInfoPayload = [];

    const eventsToValidate = [...added, ...updated];
    console.log('events to validate', eventsToValidate);
    const allAccountabilityEvents = eventsToValidate.filter(e => e.Type === 'Accountability');
    //Check for Todo collisions
    for (const event of eventsToValidate) {
        if (event.Type === 'Todo') {
            const validationResult = await validateTodoEvent(event, eventsToValidate, allAccountabilityEvents, userId, session);

            if (validationResult.hasHardCollision) {
                throw new Error(` Todo '${event.title}' collides with another Todo`);
            }

            if (validationResult.collidingAccountabilities.length > 0) {
                collisionInfoPayload.push({
                    Todo: event,
                    OtherAccountabilitiesInCollisionWith: validationResult.collidingAccountabilities
                });
            }
        }
    }

    //Insert: add userId to every document
    added.forEach(event => {
        validatedCalendarOps.push({
            insertOne: {
                document: {
                    ...event,
                    userId,
                    past: event.past ?? false,
                    verified: event.verified ?? false
                }
            }
        });
    });

    //Update: scoped to current user
    updated.forEach(event => {
        validatedCalendarOps.push({
            updateOne: {
                filter: { SpecificEventId: event.SpecificEventId, userId },
                update: { $set: event }
            }
        });
    });

    //Delete: only user's events
    if (deleted.length > 0) {
        const deleteIds = deleted.map(ev => ev.SpecificEventId);
        validatedCalendarOps.push({
            deleteMany: {
                filter: { SpecificEventId: { $in: deleteIds }, userId }
            }
        });
    }

    //Apply DB writes
    if (validatedCalendarOps.length > 0) {
        await CalendarCollection.bulkWrite(validatedCalendarOps, { session });
    }

    //Rebuild collision map
    await PerformToDoCollisionCrud(calendarDeltas, userId, session);
    console.log('CRUD operations completed successfully for Calendar events.');

};

//Get all calendar events for user
export const GetCalendarEvents = async (userId) => {
    const events = await CalendarCollection.find({ userId });
    return events;
};

// controllers/calendarController.js
export const getNextTodoEventsByPhotoId = async (req, res) => {
    const { photoId } = req.params;
    const userId = req.userId;
    const now = new Date().toISOString(); // Gives a UTC ISO string
    const limit = parseInt(req.query.limit) || 3;
    const skip = parseInt(req.query.skip) || 0;

    try {
        const events = await CalendarCollection.find({
            userId,
            Type: 'Todo',
            TodoId: photoId,
            $or: [
                { start: { $lte: now }, end: { $gt: now } }, // ongoing
                { start: { $gt: now } }                      // upcoming
            ]
        })
            .sort({ start: 1 })
            .skip(skip)
            .limit(limit)
            .select("SpecificEventId TodoId title start end verified");

        return res.status(200).json(events);
    } catch (err) {
        console.error(" Error in getNextTodoEventsByPhotoId:", err);
        return res.status(500).json({ error: "Server error" });
    }
}

export const getTodoCollision = async (req, res) => {
    const { TodoId, SpecificEventId } = req.body;
    const userId = req.userId;

    console.log('getTodoCollision hit');
    console.log('TodoId:', TodoId);
    console.log('SpecificEventId:', SpecificEventId);
    console.log('userId:', userId);

    try {
        const TodoCollision = await CollisionCollection.findOne({
            "Todo.TodoId": TodoId,
            "Todo.SpecificEventId": SpecificEventId,
            userId //now protected by scope
        }).lean();

        if (!TodoCollision) {
            return res.status(404).json({ message: "No collision found for this Todo" });
        }

        return res.status(200).json(TodoCollision);
    } catch (error) {
        console.error("Error fetching collision:", error);
        return res.status(500).json({ error: "Server error" });
    }
};









// import CalendarCollection from "../models/CalendarCollection.js";
// import { PerformToDoCollisionCrud } from "../utils/todoCollisionCrud.js";
// import CollisionCollection from "../models/CollisionCollection.js";
// import { randomised } from "../utils/ScheduleComponents/Randomised.js";
// import { config } from "dotenv";

// // OPTIMIZED: Batch validate ALL Todo events in a single DB query
// async function batchValidateTodoEvents(eventsToValidate, allAccountabilityEvents, userId, session) {
//     const todoEvents = eventsToValidate.filter(e => e.Type === 'Todo');

//     if (todoEvents.length === 0) {
//         return [];
//     }

//     console.log(`Batch validating ${todoEvents.length} Todo events`);

//     // 1. Check in-buffer Todo collisions first (no DB call needed)
//     const inBufferCollisions = [];
//     for (let i = 0; i < todoEvents.length; i++) {
//         const currentTodo = todoEvents[i];
//         for (let j = i + 1; j < todoEvents.length; j++) {
//             const otherTodo = todoEvents[j];

//             if (new Date(currentTodo.start) < new Date(otherTodo.end) &&
//                 new Date(currentTodo.end) > new Date(otherTodo.start)) {
//                 throw new Error(`Todo '${currentTodo.title}' collides with Todo '${otherTodo.title}' in the same batch`);
//             }
//         }
//     }

//     // 2. Get all updating event IDs to exclude from DB collision check
//     const updatingEventIds = eventsToValidate.map(e => e.SpecificEventId);

//     // 3. SINGLE DB query to check ALL todos for collisions
//     const timeRanges = todoEvents.map(todo => ({
//         start: { $lt: new Date(todo.end) },
//         end: { $gt: new Date(todo.start) }
//     }));

//     // Use $or to check all time ranges in one query
//     const conflictingTodos = await CalendarCollection.find({
//         userId,
//         Type: 'Todo',
//         SpecificEventId: { $nin: updatingEventIds },
//         $or: timeRanges
//     }).session(session).lean();

//     console.log(`Found ${conflictingTodos.length} potentially conflicting todos in DB`);

//     // 4. Check each todo against DB conflicts
//     const validationResults = [];
//     for (const todo of todoEvents) {
//         const todoStart = new Date(todo.start);
//         const todoEnd = new Date(todo.end);

//         // Find specific conflicts for this todo
//         const hasHardCollision = conflictingTodos.some(existing =>
//             new Date(existing.start) < todoEnd && new Date(existing.end) > todoStart
//         );

//         if (hasHardCollision) {
//             throw new Error(`Todo '${todo.title}' collides with another existing Todo`);
//         }

//         // Check accountability collisions (in-memory only for now)
//         const collidingAccountabilities = allAccountabilityEvents.filter(acc =>
//             acc.start && acc.end &&
//             new Date(acc.start) < todoEnd &&
//             new Date(acc.end) > todoStart
//         );

//         validationResults.push({
//             event: todo,
//             collidingAccountabilities
//         });
//     }

//     return validationResults;
// }

// // OPTIMIZED: Get DB accountability collisions in batch
// async function batchGetAccountabilityCollisions(todoEvents, userId, session) {
//     if (todoEvents.length === 0) return [];

//     // Build time ranges for all todos
//     const timeRanges = todoEvents.map(todo => ({
//         start: { $lt: new Date(todo.end) },
//         end: { $gt: new Date(todo.start) }
//     }));

//     // Single query to get all accountability collisions
//     const dbAccountabilityCollisions = await CalendarCollection.find({
//         userId,
//         Type: 'Accountability',
//         $or: timeRanges
//     }).session(session).lean();

//     console.log(`Found ${dbAccountabilityCollisions.length} accountability collisions in DB`);

//     // Map collisions back to specific todos
//     const results = [];
//     for (const todo of todoEvents) {
//         const todoStart = new Date(todo.start);
//         const todoEnd = new Date(todo.end);

//         const collidingAccs = dbAccountabilityCollisions.filter(acc =>
//             new Date(acc.start) < todoEnd && new Date(acc.end) > todoStart
//         );

//         results.push({
//             todo,
//             dbAccountabilityCollisions: collidingAccs
//         });
//     }

//     return results;
// }

// // OPTIMIZED CalendarSave function
// export const CalendarSave = async (calendarDeltas, userId, session) => {
//     const { added = [], updated = [], deleted = [] } = calendarDeltas;
//     const validatedCalendarOps = [];
//     const collisionInfoPayload = [];

//     const eventsToValidate = [...added, ...updated];
//     console.log(`Validating ${eventsToValidate.length} events`);

//     const allAccountabilityEvents = eventsToValidate.filter(e => e.Type === 'Accountability');
//     const todoEvents = eventsToValidate.filter(e => e.Type === 'Todo');

//     // BATCH validate all Todo events at once
//     if (todoEvents.length > 0) {
//         console.time('Todo Validation');

//         // Validate todo-todo collisions
//         const todoValidationResults = await batchValidateTodoEvents(eventsToValidate, allAccountabilityEvents, userId, session);

//         // Get DB accountability collisions in batch
//         const accCollisionResults = await batchGetAccountabilityCollisions(todoEvents, userId, session);

//         // Combine results
//         todoValidationResults.forEach((result, index) => {
//             const allCollidingAccs = [
//                 ...result.collidingAccountabilities, // in-buffer
//                 ...accCollisionResults[index].dbAccountabilityCollisions // from DB
//             ];

//             if (allCollidingAccs.length > 0) {
//                 collisionInfoPayload.push({
//                     Todo: result.event,
//                     OtherAccountabilitiesInCollisionWith: allCollidingAccs
//                 });
//             }
//         });

//         console.timeEnd('Todo Validation');
//     }

//     // Build ALL bulk operations in memory (no DB calls)
//     console.time('Build Operations');

//     added.forEach(event => {
//         validatedCalendarOps.push({
//             insertOne: {
//                 document: {
//                     ...event,
//                     userId,
//                     past: event.past ?? false,
//                     verified: event.verified ?? false
//                 }
//             }
//         });
//     });

//     updated.forEach(event => {
//         validatedCalendarOps.push({
//             updateOne: {
//                 filter: { SpecificEventId: event.SpecificEventId, userId },
//                 update: { $set: event }
//             }
//         });
//     });

//     if (deleted.length > 0) {
//         const deleteIds = deleted.map(ev => ev.SpecificEventId);
//         validatedCalendarOps.push({
//             deleteMany: {
//                 filter: { SpecificEventId: { $in: deleteIds }, userId }
//             }
//         });
//     }

//     console.timeEnd('Build Operations');

//     // SINGLE bulkWrite operation with parallel execution
//     if (validatedCalendarOps.length > 0) {
//         console.time('BulkWrite');
//         await CalendarCollection.bulkWrite(validatedCalendarOps, {
//             session,
//             ordered: false // Allow parallel execution for better performance
//         });
//         console.timeEnd('BulkWrite');
//     }

//     // Rebuild collision map (this is still the bottleneck)
//     console.time('Collision CRUD');
//     await PerformToDoCollisionCrud(calendarDeltas, userId, session);
//     console.timeEnd('Collision CRUD');

//     console.log('CRUD operations completed successfully for Calendar events.');
// };

// // Keep existing functions unchanged
// export const GetCalendarEvents = async (userId) => {
//     const events = await CalendarCollection.find({ userId });
//     return events;
// };

// export const getNextTodoEventsByPhotoId = async (req, res) => {
//     const { photoId } = req.params;
//     const userId = req.userId;
//     const now = new Date().toISOString();
//     const limit = parseInt(req.query.limit) || 3;
//     const skip = parseInt(req.query.skip) || 0;

//     try {
//         const events = await CalendarCollection.find({
//             userId,
//             Type: 'Todo',
//             TodoId: photoId,
//             $or: [
//                 { start: { $lte: now }, end: { $gt: now } },
//                 { start: { $gt: now } }
//             ]
//         })
//             .sort({ start: 1 })
//             .skip(skip)
//             .limit(limit)
//             .select("SpecificEventId TodoId title start end verified");

//         return res.status(200).json(events);
//     } catch (err) {
//         console.error("Error in getNextTodoEventsByPhotoId:", err);
//         return res.status(500).json({ error: "Server error" });
//     }
// }

// export const getTodoCollision = async (req, res) => {
//     const { TodoId, SpecificEventId } = req.body;
//     const userId = req.userId;

//     console.log('getTodoCollision hit');
//     console.log('TodoId:', TodoId);
//     console.log('SpecificEventId:', SpecificEventId);
//     console.log('userId:', userId);

//     try {
//         const TodoCollision = await CollisionCollection.findOne({
//             "Todo.TodoId": TodoId,
//             "Todo.SpecificEventId": SpecificEventId,
//             userId
//         }).lean();

//         if (!TodoCollision) {
//             return res.status(404).json({ message: "No collision found for this Todo" });
//         }

//         return res.status(200).json(TodoCollision);
//     } catch (error) {
//         console.error("Error fetching collision:", error);
//         return res.status(500).json({ error: "Server error" });
//     }
// };

// // CRITICAL: Add these MongoDB indexes immediately for performance
// /*
// db.calendarcollections.createIndex({ "userId": 1, "Type": 1, "start": 1, "end": 1 })
// db.calendarcollections.createIndex({ "userId": 1, "SpecificEventId": 1 })
// db.calendarcollections.createIndex({ "userId": 1, "Type": 1, "TodoId": 1 })
// */


