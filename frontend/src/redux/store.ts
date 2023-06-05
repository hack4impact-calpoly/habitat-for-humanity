import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import donationReducer from "./donationSlice";
import eventReducer from "./eventSlice";

const persistConfig = {
  key: "donation",
  storage,
};

const persistConfig2 = {
  key: "event",
  storage,
};

const persistedReducer = persistReducer(persistConfig, donationReducer);
const persistedReducer2 = persistReducer(persistConfig2, eventReducer);
export const store = configureStore({
  reducer: {
    donation: persistedReducer,
    event: persistedReducer2,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // fixes "A non-serializable value was detected in an action" error
        // https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);

// types for typescript use
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
