import { configureStore } from '@reduxjs/toolkit';
import PhotoReducer from './Slices/PhotoSlice.jsx';
import calendarReducer from './Slices/CalendarSlice';
import MessageReducer from './Slices/MessageSlice.jsx'
import challengeReducer from './Slices/ChallengeSlice';
import PayoutReducer from './Slices/PayoutSlice.jsx';
import copyPasteReducer from './Slices/CopyPasteSlice';
import Positions from './Slices/Positions.jsx'

export const store = configureStore({
    reducer: {
        photo: PhotoReducer,
        calendar: calendarReducer,
        message: MessageReducer,
        challenge: challengeReducer,
        payout: PayoutReducer,
        copyPaste: copyPasteReducer,
        positions:Positions,
    }
})


// It’s the global Redux state tree, structured like this:
// const state = {
//   photo: {
//     Photos: [/* your photo array */]
//   }
// }