import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  // TODO: Thêm các field cần thiết
}

const initialState: SearchState = {
  // TODO: Thêm dữ liệu giả
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    // TODO: Thêm các action sau
    // setSearchQuery: (state, action: PayloadAction<string>) => {},
    // setSearchResults: (state, action: PayloadAction<any>) => {},
  },
});

export const searchActions = searchSlice.actions;
export default searchSlice.reducer;
