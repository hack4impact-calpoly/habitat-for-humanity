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

const persistConfig = {
  key: "donation",
  storage,
};

const persistedReducer = persistReducer(persistConfig, donationReducer);
export const store = configureStore({
  reducer: {
    donation: persistedReducer,
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
