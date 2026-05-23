import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    mode: 'off', // 'off' | 'copy' | 'paste'
    copiedEvents: [], // Stores copied calendar events
};

const copyPasteSlice = createSlice({
    name: 'copyPaste',
    initialState,
    reducers: {
        setCopyMode: (state) => {
            state.mode = 'copy';
            state.copiedEvents = [];
        },
        setPasteMode: (state) => {
            state.mode = 'paste';
        },
        clearCopyPaste: (state) => {
            state.mode = 'off';
            state.copiedEvents = [];
        },
        storeCopiedEvents: (state, action) => {
            state.copiedEvents = action.payload;
        },
        addToCopyBuffer: (state, action) => {
            const newEvent = action.payload;
            const index = state.copiedEvents.findIndex(
                (e) => e.SpecificEventId === newEvent.SpecificEventId
            );

            if (index !== -1) {
                // Event already exists → remove it (toggle off)
                state.copiedEvents.splice(index, 1);
            } else {
                // Not in buffer → add it
                state.copiedEvents.push(newEvent);
            }
        },
    },
});

export const {
    setCopyMode,
    setPasteMode,
    clearCopyPaste,
    storeCopiedEvents,
    addToCopyBuffer,
} = copyPasteSlice.actions;

export default copyPasteSlice.reducer;
