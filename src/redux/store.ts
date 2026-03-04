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
import inStoreDonorReducer from "./inStoreDonorSlice";

const persistConfig = {
  key: "donation",
  storage,
};

const persistConfig2 = {
  key: "event",
  storage,
};

const persistConfig3 = {
  key: "inStoreDonor",
  storage,
};

const persistedReducer = persistReducer(persistConfig, donationReducer);
const persistedReducer2 = persistReducer(persistConfig2, eventReducer);
const persistedReducer3 = persistReducer(persistConfig3, inStoreDonorReducer);
export const store = configureStore({
  reducer: {
    donation: persistedReducer,
    event: persistedReducer2,
    inStoreDonor: persistedReducer3,
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
