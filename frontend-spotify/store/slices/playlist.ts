import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PlaylistState {
  // TODO: Thêm các field cần thiết
}

const initialState: PlaylistState = {
  // TODO: Thêm dữ liệu giả
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    // TODO: Thêm các action sau
    // setPlaylistData: (state, action: PayloadAction<any>) => {},
  },
});

export const playlistActions = playlistSlice.actions;
export default playlistSlice.reducer;
