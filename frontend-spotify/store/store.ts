import {
  AnyAction,
  combineReducers,
  configureStore,
  Reducer,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer, PURGE } from "redux-persist";

import authReducer, { logout } from "./slices/auth";
import profileReducer from "./slices/profile";
import playerReducer from "./slices/player";
import homeReducer from "./slices/home";
import uiReducer from "./slices/ui";
import searchReducer from "./slices/search";
import albumReducer from "./slices/album";
import artistReducer from "./slices/artist";
import playlistReducer from "./slices/playlist";
import likedSongsReducer from "./slices/likedSongs";
import browseReducer from "./slices/browse";
import genreReducer from "./slices/genre";
import yourLibraryReducer from "./slices/yourLibrary";
import spotifyReducer from "./slices/spotify";
import languageReducer from "./slices/language";
import viewAllReducer from "./slices/viewAll";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "profile"],
};

// Reducer gốc chưa bọc persist
const appReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  player: playerReducer,
  home: homeReducer,
  ui: uiReducer,
  search: searchReducer,
  album: albumReducer,
  artist: artistReducer,
  playlist: playlistReducer,
  likedSongs: likedSongsReducer,
  browse: browseReducer,
  genre: genreReducer,
  yourLibrary: yourLibraryReducer,
  spotify: spotifyReducer,
  language: languageReducer,
  viewAll: viewAllReducer,
});

// Root reducer - xử lý reset state khi logout trước khi persist
const rootReducer: Reducer = (state: any, action: AnyAction) => {
  // Khi logout → reset state về undefined để persist xử lý
  if (
    action.type === logout.fulfilled.type ||
    action.type === logout.rejected.type
  ) {
    console.log("🚨 LOGOUT triggered - resetting ALL state");
    state = undefined;
  }
  return appReducer(state, action);
};

// Bọc persist 1 lần duy nhất - AFTER root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Bỏ qua các persist actions vì chúng chứa non-serializable data
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/RESUME",
          "persist/PURGE",
        ],
        // Bỏ qua _persist key trong state
        ignoredPaths: ["_persist"],
      },
    }).concat((store: any) => (next: any) => (action: any) => {
      const result = next(action);

      // Sau logout → purge persist storage
      if (
        action.type === logout.fulfilled.type ||
        action.type === logout.rejected.type
      ) {
        console.log("🧹 Calling persistor.purge() to clear localStorage");
        persistor.purge();
      }

      return result;
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
