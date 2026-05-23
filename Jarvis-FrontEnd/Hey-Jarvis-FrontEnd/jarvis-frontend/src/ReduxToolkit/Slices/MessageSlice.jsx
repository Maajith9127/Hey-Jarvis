
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  added: [],
  updated: [],
  deleted: []
};

const MessageSlice = createSlice({
  name: 'messageSlice',
  initialState,
  reducers: {
    addMessageToRedux: (state, action) => {
      const exists = state.messages.find(msg => msg.AccountabilityId === action.payload.AccountabilityId);
      if (exists) return;

      state.messages.push(action.payload);

      if (!action.payload.fromDb) {
        state.added.push(action.payload);
      }
    },

    deleteMessageFromRedux: (state, action) => {
      const id = action.payload.AccountabilityIdToDelete;
      state.messages = state.messages.filter(msg => msg.AccountabilityId !== id);

      const wasInAdded = state.added.find(msg => msg.AccountabilityId === id);
      if (wasInAdded) {
        state.added = state.added.filter(msg => msg.AccountabilityId !== id);
        return;
      }

      state.updated = state.updated.filter(msg => msg.AccountabilityId !== id);
      state.deleted.push(id);
    },

    updateMessageFromRedux: (state, action) => {
      const { AccountabilityIdToUpdate, newValue } = action.payload;

      const msg = state.messages.find(msg => msg.AccountabilityId === AccountabilityIdToUpdate);
      if (msg) {
        msg.message = newValue;

        const inAdded = state.added.find(msg => msg.AccountabilityId === AccountabilityIdToUpdate);
        if (inAdded) {
          inAdded.message = newValue; // Update inside added[]
        } else {
          const index = state.updated.findIndex(msg => msg.AccountabilityId === AccountabilityIdToUpdate);
          if (index === -1) {
            state.updated.push({ ...msg });
          } else {
            state.updated[index].message = newValue;
          }
        }
      }
    },

    updateToAddressFromRedux: (state, action) => {
      const { AccountabilityIdToUpdate, newValue } = action.payload;

      const msg = state.messages.find(msg => msg.AccountabilityId === AccountabilityIdToUpdate);
      if (msg) {
        msg.ToAddress = newValue;

        const inAdded = state.added.find(msg => msg.AccountabilityId === AccountabilityIdToUpdate);
        if (inAdded) {
          inAdded.ToAddress = newValue; //  Update inside added[]
        } else {
          const index = state.updated.findIndex(msg => msg.AccountabilityId === AccountabilityIdToUpdate);
          if (index === -1) {
            state.updated.push({ ...msg });
          } else {
            state.updated[index].ToAddress = newValue;
          }
        }
      }
    },

    clearMessageDeltas: (state) => {
      state.added = [];
      state.updated = [];
      state.deleted = [];
    },

    RebuildAddedFromMessages: (state) => {
      const addedMap = new Map(state.added.map(m => [m.AccountabilityId, true]));
      const missing = state.messages.filter(m => !m.fromDb && !addedMap.has(m.AccountabilityId));
      state.added.push(...missing);
    }
  }
});

export const {
  addMessageToRedux,
  deleteMessageFromRedux,
  updateMessageFromRedux,
  updateToAddressFromRedux,
  clearMessageDeltas,
  RebuildAddedFromMessages
} = MessageSlice.actions;

export default MessageSlice.reducer;
