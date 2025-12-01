import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface LibraryItem {
  id: string;
  name: string;
  type: "playlist" | "album" | "artist";
  // TODO: Thêm các field khác
}

interface YourLibraryState {
  items: LibraryItem[];
  loading: boolean;
  // TODO: Thêm các field khác
}

const initialState: YourLibraryState = {
  items: [
    // Mock data
    { id: "1", name: "My Playlist 1", type: "playlist" },
    { id: "2", name: "My Album 1", type: "album" },
  ],
  loading: false,
};

const yourLibrarySlice = createSlice({
  name: "yourLibrary",
  initialState,
  reducers: {
    // TODO: Thêm các action sau
    // addItem: (state, action: PayloadAction<LibraryItem>) => {},
    // removeItem: (state, action: PayloadAction<string>) => {},
  },
});

export const getLibraryItems = (state: RootState) => state.yourLibrary.items;

export const yourLibraryActions = yourLibrarySlice.actions;
export default yourLibrarySlice.reducer;
