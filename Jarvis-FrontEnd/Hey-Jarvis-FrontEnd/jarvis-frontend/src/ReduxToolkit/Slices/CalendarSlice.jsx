import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  CalendarEvents: [],
  added: [],
  updated: [],
  deleted: [],
  deleteMode: false, // added
  strictModeAll: false,
};

const CalendarSlice = createSlice({
  name: 'CalendarSlice',
  initialState,
  reducers: {
    toggleStrictModeAll: (state) => {
      state.strictModeAll = !state.strictModeAll;
    },
    setStrictModeAll: (state, action) => {
      state.strictModeAll = action.payload;
    },
    addEventsToRedux: (state, action) => {
      const newEvent = {
        ...action.payload,
        fromDb: action.payload.fromDb ?? false
      };

      const alreadyExists = state.CalendarEvents.some(
        (event) => event.SpecificEventId === newEvent.SpecificEventId
      );

      if (!alreadyExists) {
        state.CalendarEvents.push(newEvent);
        if (!newEvent.fromDb) {
          state.added.push(newEvent);
        }
      }
    },

    updateEventInRedux: (state, action) => {
      const updatedEvent = action.payload;

      state.CalendarEvents = state.CalendarEvents.map(event =>
        event.SpecificEventId === updatedEvent.SpecificEventId
          ? { ...event, ...updatedEvent }
          : event
      );

      const inAdded = state.added.find(event => event.SpecificEventId === updatedEvent.SpecificEventId);
      if (inAdded) {
        Object.assign(inAdded, updatedEvent); // Reflect update inside added[]
      } else {
        const index = state.updated.findIndex(event => event.SpecificEventId === updatedEvent.SpecificEventId);
        if (index === -1) {
          state.updated.push(updatedEvent);
        } else {
          state.updated[index] = { ...state.updated[index], ...updatedEvent };
        }
      }
    },

    deleteEventFromRedux: (state, action) => {
      if (action.payload.TodoIdToDeleteAllSuchEventsFromCalendar) {
        const idToDelete = action.payload.TodoIdToDeleteAllSuchEventsFromCalendar;

        const eventsToDelete = state.CalendarEvents.filter(
          event => event.TodoId === idToDelete
        );

        const realDeletes = eventsToDelete.filter(ev => ev.fromDb);
        state.deleted.push(...realDeletes);

        state.CalendarEvents = state.CalendarEvents.filter(
          event => event.TodoId !== idToDelete
        );

        state.added = state.added.filter(event => event.TodoId !== idToDelete);
        state.updated = state.updated.filter(event => event.TodoId !== idToDelete);

      } else {
        const idToDelete = action.payload.SpecificEventId;

        const eventToDelete = state.CalendarEvents.find(
          event => event.SpecificEventId === idToDelete
        );

        if (eventToDelete && eventToDelete.fromDb) {
          state.deleted.push(eventToDelete);
        }

        state.CalendarEvents = state.CalendarEvents.filter(
          event => event.SpecificEventId !== idToDelete
        );

        state.added = state.added.filter(event => event.SpecificEventId !== idToDelete);
        state.updated = state.updated.filter(event => event.SpecificEventId !== idToDelete);
      }
    },

    clearDeltaEvents: (state) => {
      state.added = [];
      state.updated = [];
      state.deleted = [];
    },

    // ADDED: delete mode toggle + setter
    toggleDeleteMode: (state) => {
      state.deleteMode = !state.deleteMode;
    },

    setDeleteMode: (state, action) => {
      state.deleteMode = action.payload;
    }
  }
});

export const {
  addEventsToRedux,
  updateEventInRedux,
  deleteEventFromRedux,
  clearDeltaEvents,
  toggleDeleteMode,      //export toggle
  setDeleteMode,
  toggleStrictModeAll,   // ✅ export
  setStrictModeAll         //export setter
} = CalendarSlice.actions;

export default CalendarSlice.reducer;
