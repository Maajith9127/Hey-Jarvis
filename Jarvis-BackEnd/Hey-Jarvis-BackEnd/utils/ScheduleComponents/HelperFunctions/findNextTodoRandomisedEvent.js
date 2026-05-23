import CalendarCollection from "../../../models/CalendarCollection.js";

export const findNextTodoRandomisedEvent = async (userId) => {
  const now = new Date();

  const nextEvent = await CalendarCollection.findOne({
    userId,
    Type: "Todo",
    CollectionType: "RandomisedCollection",
    end: { $gt: now },  //  
    past: false
  })
    .sort({ start: 1 }) // still sort by earliest
    .lean();

  console.log('Nexttttttttttttttttt Randomised Todo Event:', nextEvent);
  return nextEvent;
};
