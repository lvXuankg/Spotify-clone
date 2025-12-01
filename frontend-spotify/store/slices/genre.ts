import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GenreState {
  // TODO: Thêm các field cần thiết
}

const initialState: GenreState = {
  // TODO: Thêm dữ liệu giả
};

const genreSlice = createSlice({
  name: "genre",
  initialState,
  reducers: {
    // TODO: Thêm các action sau
    // setGenreData: (state, action: PayloadAction<any>) => {},
  },
});

export const genreActions = genreSlice.actions;
export default genreSlice.reducer;
