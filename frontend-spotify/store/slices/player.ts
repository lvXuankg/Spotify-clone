import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PlayerState {
  isPlaying: boolean;
  currentTrack: any | null;
  shuffle: boolean;
  repeatMode: 0 | 1 | 2; // 0=off, 1=context, 2=track
  volume: number; // 0-100
  progress_ms: number;
  duration_ms: number;
  device: any | null;
  disallows?: {
    pausing?: boolean;
    skipping_prev?: boolean;
    skipping_next?: boolean;
  };
}

const initialState: PlayerState = {
  isPlaying: false,
  currentTrack: null,
  shuffle: false,
  repeatMode: 0,
  volume: 80,
  progress_ms: 0,
  duration_ms: 0,
  device: null,
  disallows: {},
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setCurrentTrack: (state, action: PayloadAction<any>) => {
      state.currentTrack = action.payload;
    },
    setShuffle: (state, action: PayloadAction<boolean>) => {
      state.shuffle = action.payload;
    },
    setRepeatMode: (state, action: PayloadAction<0 | 1 | 2>) => {
      state.repeatMode = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.min(100, Math.max(0, action.payload));
    },
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress_ms = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration_ms = action.payload;
    },
    setDevice: (state, action: PayloadAction<any>) => {
      state.device = action.payload;
    },
    setDisallows: (state, action: PayloadAction<any>) => {
      state.disallows = action.payload;
    },
    reset: () => initialState,
  },
});

export const playerActions = playerSlice.actions;
export default playerSlice.reducer;
