// ReduxToolkit/Slices/ChallengeSlice.jsx
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  open: false,
  accountability: null,
  activeChallenge: null
};

const challengeSlice = createSlice({
  name: "challenge",
  initialState,
  reducers: {
    setChallengeData: (state, action) => {
      console.log("Inside Challenge Reducer", action.payload);
      state.data = action.payload;
      if (state.open === false) {
        state.open = true;
      } else {
        state.open = false;
      }
    },
    setSelectedAccountability: (state, action) => {
      state.accountability = action.payload;
    },
    setActiveChallenge: (state, action) => {   // <-- new reducer
      state.activeChallenge = action.payload;
    }


  },
});

export const { setChallengeData, setSelectedAccountability, setActiveChallenge } = challengeSlice.actions;
export default challengeSlice.reducer;
