import CollisionCollection from "../../models/CollisionCollection.js";

const isColliding = (startA, endA, startB, endB) => {
    return new Date(startA) < new Date(endB) && new Date(endA) > new Date(startB);
};

const buildToBeModified = async (calendarDeltas, session) => {
    const { added = [], updated = [] } = calendarDeltas;
    const modified = [...added, ...updated];

    const todos = modified.filter(e => e.Type === "Todo");
    const accs = modified.filter(e => e.Type === "Accountability");

    const toBeAdded = [];

    // ===  TODOS: Delete old and recreate fresh
    for (const todo of todos) {
        await CollisionCollection.deleteOne(
            { "Todo.SpecificEventId": todo.SpecificEventId },
            { session }
        );

        const todoObj = {
            TodoId: todo.TodoId,
            SpecificEventId: todo.SpecificEventId,
            start: todo.start,
            end: todo.end,
        };

        const collidingAccs = accs.filter(acc =>
            isColliding(todo.start, todo.end, acc.start, acc.end)
        );

        const formattedAccs = collidingAccs.map(acc => ({
            AccountabilityId: acc.AccountabilityId,
            SpecificEventId: acc.SpecificEventId,
            start: acc.start,
            end: acc.end,
            verified: acc.verified || false,
            past: acc.past,
            title: acc.title,
            CollectionType: acc.CollectionType
        }));

        toBeAdded.push({
            Todo: todoObj,
            OtherAccountabilitiesInCollisionWith: formattedAccs
        });
    }

    // ===  ACCs: Pull old, push new
    for (const acc of accs) {
        // Step 1: Pull old versions from all collision docs
        await CollisionCollection.updateMany(
            {
                "OtherAccountabilitiesInCollisionWith.SpecificEventId": acc.SpecificEventId
            },
            {
                $pull: {
                    OtherAccountabilitiesInCollisionWith: {
                        SpecificEventId: acc.SpecificEventId
                    }
                }
            },
            { session }
        );

        // Step 2: Find matching Todos from DB
        const matchingTodos = await CollisionCollection.find({
            "Todo.start": { $lt: acc.end },
            "Todo.end": { $gt: acc.start }
        }).session(session);

        for (const match of matchingTodos) {
            const todo = match.Todo;

            await CollisionCollection.updateOne(
                { "Todo.SpecificEventId": todo.SpecificEventId },
                {
                    $push: {
                        OtherAccountabilitiesInCollisionWith: {
                            AccountabilityId: acc.AccountabilityId,
                            SpecificEventId: acc.SpecificEventId,
                            start: acc.start,
                            end: acc.end,
                            verified: acc.verified || false,
                            past: acc.past,
                            title: acc.title,
                            CollectionType: acc.CollectionType
                        }
                    }
                },
                { session }
            );
        }
    }

    return toBeAdded;
};

export { buildToBeModified };
