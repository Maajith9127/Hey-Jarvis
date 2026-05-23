import CollisionCollection from "../../models/CollisionCollection.js";
const buildToBeDeleted = async (calendarDeltas, session) => {
    const { deleted = [] } = calendarDeltas;
    console.log('deleetd',deleted);
    

    const todosToDelete = deleted.filter(e => e.Type === 'Todo');
    const accsToDelete = deleted.filter(e => e.Type === 'Accountability');

    // ===  Step 1: Delete full collision doc for deleted Todos
    for (const todo of todosToDelete) {
        await CollisionCollection.deleteOne(
            { "Todo.SpecificEventId": todo.SpecificEventId },
            { session }
        );
        console.log('kkkkk');
        
    }

    // ===  Step 2: Pull out deleted Accountabilities from arrays
    for (const acc of accsToDelete) {
        await CollisionCollection.updateMany(
            {},
            {
                $pull: {
                    OtherAccountabilitiesInCollisionWith: {
                        SpecificEventId: acc.SpecificEventId
                    }
                }
            },
            { session }
        );
        console.log('well pulled out');
        
    }

    console.log("Deleted Todos and Accountabilities from CollisionCollection.");
};

export { buildToBeDeleted };
