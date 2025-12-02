import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface UIState {
  libraryCollapsed: boolean;
  rightLayoutOpen: boolean;
  detailsCollapsed: boolean;
  queueCollapsed: boolean;
  devicesCollapsed: boolean;
  // TODO: Thêm các field UI khác
}

const initialState: UIState = {
  libraryCollapsed: false,
  rightLayoutOpen: false,
  detailsCollapsed: false,
  queueCollapsed: false,
  devicesCollapsed: false,
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
    toggleDetails: (state) => {
      state.detailsCollapsed = !state.detailsCollapsed;
    },
    toggleQueue: (state) => {
      state.queueCollapsed = !state.queueCollapsed;
    },
    toggleDevices: (state) => {
      state.devicesCollapsed = !state.devicesCollapsed;
    },
    toggleLibrary: (state) => {
      state.libraryCollapsed = !state.libraryCollapsed;
    },
    // TODO: Thêm các action UI khác
  },
});

export const getLibraryCollapsed = (state: RootState) =>
  state.ui.libraryCollapsed;
export const isRightLayoutOpen = (state: RootState) => state.ui.rightLayoutOpen;

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
