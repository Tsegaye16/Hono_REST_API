import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import storage from "redux-persist/lib/storage"; // LocalStorage for persist
import { persistStore, persistReducer } from "redux-persist";
import rootReducer from "./mainReducer";
//import { combineReducers } from "redux";

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["positions"], // Persist only the positions slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper<AppStore>(makeStore);
export const persistor = persistStore(makeStore());
