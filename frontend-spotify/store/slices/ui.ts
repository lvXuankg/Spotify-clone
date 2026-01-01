import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { LibraryViewMode } from "./yourLibrary";

interface UIState {
  libraryCollapsed: boolean;
  rightLayoutOpen: boolean;
  detailsCollapsed: boolean;
  queueCollapsed: boolean;
  devicesCollapsed: boolean;
  libraryViewMode: LibraryViewMode;
}

const initialState: UIState = {
  libraryCollapsed: false,
  rightLayoutOpen: false,
  detailsCollapsed: false,
  queueCollapsed: false,
  devicesCollapsed: false,
  libraryViewMode: "list",
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
    collapseLibrary: (state) => {
      state.libraryCollapsed = true;
    },
    expandLibrary: (state) => {
      state.libraryCollapsed = false;
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
    setLibraryViewMode: (state, action: PayloadAction<LibraryViewMode>) => {
      state.libraryViewMode = action.payload;
    },
  },
});

export const getLibraryCollapsed = (state: RootState) =>
  state.ui.libraryCollapsed;
export const isRightLayoutOpen = (state: RootState) => state.ui.rightLayoutOpen;
export const getLibraryViewMode = (state: RootState) =>
  state.ui.libraryViewMode;

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
