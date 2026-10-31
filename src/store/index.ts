import {
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";
import videosReducer from "../features/videos/slice";
import libraryReducer, {
  clearHistory,
  recordWatch,
  toggleDisliked,
  toggleLiked,
  toggleSaved,
  toggleSubscription,
} from "../features/library/slice";
import type { LibraryState } from "../features/library/slice";
import { loadLibrary, saveLibrary } from "../features/library/storage";

export function createAppStore(library = loadLibrary()) {
  const persistence = createListenerMiddleware();
  persistence.startListening({
    matcher: isAnyOf(
      clearHistory,
      recordWatch,
      toggleDisliked,
      toggleLiked,
      toggleSaved,
      toggleSubscription,
    ),
    effect: (_, api) =>
      saveLibrary((api.getState() as { library: LibraryState }).library),
  });
  return configureStore({
    reducer: { videos: videosReducer, library: libraryReducer },
    preloadedState: { library },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(persistence.middleware),
  });
}

export const store = createAppStore();
export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
