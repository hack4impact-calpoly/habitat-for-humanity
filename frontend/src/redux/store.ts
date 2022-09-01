import { configureStore } from '@reduxjs/toolkit';
import donationReducer from './donationSlice';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
  key: 'donation',
  storage,
}

const persistedReducer = persistReducer(persistConfig, donationReducer)
export const store =  configureStore({
  reducer: {
    donation: persistedReducer,
  },
});
export const persistor = persistStore(store)

// types for typescript use
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;