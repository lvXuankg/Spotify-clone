import {
  AnyAction,
  combineReducers,
  configureStore,
  Reducer,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import authReducer, { logout } from "./slices/auth";
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

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const appReducer = combineReducers({
  auth: authReducer,
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
});

const persistedReducer = persistReducer(persistConfig, appReducer);

type AppState = ReturnType<typeof persistedReducer>;

const rootReducer: Reducer = (
  state: AppState | undefined,
  action: AnyAction
) => {
  if (action.type === logout.fulfilled.type) {
    return persistedReducer(undefined, action);
  }

  return persistedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
