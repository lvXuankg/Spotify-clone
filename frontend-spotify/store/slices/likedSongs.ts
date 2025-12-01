import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LikedSongsState {
  // TODO: Thêm các field cần thiết
}

const initialState: LikedSongsState = {
  // TODO: Thêm dữ liệu giả
};

const likedSongsSlice = createSlice({
  name: "likedSongs",
  initialState,
  reducers: {
    // TODO: Thêm các action sau
    // addLikedSong: (state, action: PayloadAction<any>) => {},
    // removeLikedSong: (state, action: PayloadAction<any>) => {},
  },
});

export const likedSongsActions = likedSongsSlice.actions;
export default likedSongsSlice.reducer;
