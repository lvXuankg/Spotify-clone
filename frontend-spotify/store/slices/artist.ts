import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ArtistState {
  // TODO: Thêm các field cần thiết
}

const initialState: ArtistState = {
  // TODO: Thêm dữ liệu giả
};

const artistSlice = createSlice({
  name: "artist",
  initialState,
  reducers: {
    // TODO: Thêm các action sau
    // setArtistData: (state, action: PayloadAction<any>) => {},
  },
});

export const artistActions = artistSlice.actions;
export default artistSlice.reducer;
