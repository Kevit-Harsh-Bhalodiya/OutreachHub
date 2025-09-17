import { configureStore, combineReducers } from "@reduxjs/toolkit";
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
import storage from "redux-persist/lib/storage";

import themeReducer from "./slices/ThemeSwitcher";
import uiReducer from "./slices/mobileView";
import authReducer from "./slices/authSlice";
import adminDashboardDataReducer from "./slices/adminDashboardData";
import workspaceReducer from "./slices/workspaceSlice";
import userReducer from "./slices/userSlice";
import campaignReducer from "./slices/campaignSlice";
import contactReducer from "./slices/contactSlice";
import adminReducer from "./slices/adminSlice";
import messageTemplateReducer from "./slices/messageTemplateSlice";
import workspaceUserReducer from "./slices/workspaceUserSlice";

const rootReducer = combineReducers({
  theme: themeReducer,
  ui: uiReducer,
  auth: authReducer,
  adminSidebar: adminDashboardDataReducer,
  workspace: workspaceReducer,
  user: userReducer,
  campaign: campaignReducer,
  contact: contactReducer,
  admin: adminReducer,
  messageTemplate: messageTemplateReducer,
  workspaceUser: workspaceUserReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["theme", "auth", "adminSidebar", "user", "workspace"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
