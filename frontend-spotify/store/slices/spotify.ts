import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface SpotifyState {
  isActiveOnOtherDevice: boolean;
  // TODO: Thêm các field khác
  // currentTrack?: any;
  // isPlaying?: boolean;
  // volume?: number;
}

const initialState: SpotifyState = {
  isActiveOnOtherDevice: false,
  // TODO: Thêm dữ liệu giả khác
};

const spotifySlice = createSlice({
  name: "spotify",
  initialState,
  reducers: {
    setIsActiveOnOtherDevice: (state, action: PayloadAction<boolean>) => {
      state.isActiveOnOtherDevice = action.payload;
    },
    // TODO: Thêm các action khác
    // setCurrentTrack: (state, action: PayloadAction<any>) => {},
    // setIsPlaying: (state, action: PayloadAction<boolean>) => {},
  },
});

export const isActiveOnOtherDevice = (state: RootState) =>
  state.spotify.isActiveOnOtherDevice;

export const spotifyActions = spotifySlice.actions;
export default spotifySlice.reducer;
