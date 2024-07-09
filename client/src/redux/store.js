import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Combina los reductores
const rootReducer = combineReducers({ user: userReducer });

// Configuración de persistencia
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

// Crear un reductor persistido
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configurar el store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Crear el persistor
export const persistor = persistStore(store);
