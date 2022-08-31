import { configureStore } from '@reduxjs/toolkit';
import donationReducer from './donationSlice';

export const store = configureStore({
  reducer: {
    donation: donationReducer,
  },
});

// types for typescript use
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;