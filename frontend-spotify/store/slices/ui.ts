import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface UIState {
  libraryCollapsed: boolean;
  rightLayoutOpen: boolean;
  // TODO: Thêm các field UI khác
}

const initialState: UIState = {
  libraryCollapsed: false,
  rightLayoutOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleLibraryCollapsed: (state) => {
      state.libraryCollapsed = !state.libraryCollapsed;
    },
    setLibraryCollapsed: (state, action: PayloadAction<boolean>) => {
      state.libraryCollapsed = action.payload;
    },
    setRightLayoutOpen: (state, action: PayloadAction<boolean>) => {
      state.rightLayoutOpen = action.payload;
    },
    // TODO: Thêm các action UI khác
  },
});

export const getLibraryCollapsed = (state: RootState) =>
  state.ui.libraryCollapsed;
export const isRightLayoutOpen = (state: RootState) => state.ui.rightLayoutOpen;

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
