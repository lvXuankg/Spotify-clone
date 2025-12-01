import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LanguageState {
  // TODO: Thêm các field cần thiết
  currentLanguage?: string;
}

const initialState: LanguageState = {
  currentLanguage: "en",
  // TODO: Thêm dữ liệu giả
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.currentLanguage = action.payload;
    },
    // TODO: Thêm các action khác
  },
});

export const languageActions = languageSlice.actions;
export default languageSlice.reducer;
