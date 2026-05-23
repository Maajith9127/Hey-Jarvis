
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    Payouts: [],
    added: [],
    updated: [],
    deleted: []
};

const PayoutSlice = createSlice({
    name: 'payout',
    initialState,
    reducers: {
        AddPayoutToRedux: (state, action) => {
            // logic to be added later
            //i meant to say add and if  here to check if it exists and then proceed
            const newPayout = action.payload;
            const exists = state.Payouts.some(
                (p) => p.AccountabilityId === newPayout.AccountabilityId
            );
            if (exists) return;
            state.Payouts.push(newPayout);

            if (!newPayout.fromDb) {
                state.added.push(newPayout);
            }

        },
        DeletePayoutFromRedux: (state, action) => {
            // logic to be added later
            const AccountabilityId = action.payload;

            const existing = state.Payouts.find(p => p.AccountabilityId === AccountabilityId);
            if (!existing) return;

            //  Always remove from Payouts
            state.Payouts = state.Payouts.filter(p => p.AccountabilityId !== AccountabilityId);
            //  Always remove from added
            state.added = state.added.filter(p => p.AccountabilityId !== AccountabilityId);
            //  Always remove from updated
            state.updated = state.updated.filter(p => p.AccountabilityId !== AccountabilityId);
            //  Only push to deleted if it came from DB
            if (existing.fromDb) {
                state.deleted.push(AccountabilityId);
            }
        },
        UpdatePayoutFromRedux: (state, action) => {
            // logic to be added later
            const { AccountabilityId, key, value } = action.payload;

            const target = state.Payouts.find(p => p.AccountabilityId === AccountabilityId);
            if (!target) return;

            //  Update the field in Payouts
            target[key] = value;

            //  If it's already in added[], update there too
            const addedIndex = state.added.findIndex(p => p.AccountabilityId === AccountabilityId);
            if (addedIndex !== -1) {
                state.added[addedIndex][key] = value;
            }

            //  If fromDb, handle updated[]
            if (target.fromDb) {
                const updatedIndex = state.updated.findIndex(p => p.AccountabilityId === AccountabilityId);
                if (updatedIndex !== -1) {
                    state.updated[updatedIndex][key] = value;
                } else {
                    state.updated.push({ ...target });
                }
            }
        },
        ClearPayoutDeltas: (state) => {
            state.added = [];
            state.updated = [];
            state.deleted = [];
        },
        RebuildAddedFromPayouts: (state, action) => {
            const freshEntries = action.payload;

            const clean = freshEntries.map(entry => ({
                ...entry,
                fromDb: true
            }));

            state.Payouts = clean;
            state.added = [];
            state.updated = [];
            state.deleted = [];
        },


    }
});

export const {
    AddPayoutToRedux,
    DeletePayoutFromRedux,
    UpdatePayoutFromRedux,
    ClearPayoutDeltas,
    RebuildAddedFromPayouts
} = PayoutSlice.actions;

export default PayoutSlice.reducer;
