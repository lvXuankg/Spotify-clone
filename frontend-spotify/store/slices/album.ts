import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AlbumState {
  // TODO: Thêm các field cần thiết
}

const initialState: AlbumState = {
  // TODO: Thêm dữ liệu giả
};

const albumSlice = createSlice({
  name: "album",
  initialState,
  reducers: {
    // TODO: Thêm các action sau
    // setAlbumData: (state, action: PayloadAction<any>) => {},
  },
});

export const albumActions = albumSlice.actions;
export default albumSlice.reducer;
