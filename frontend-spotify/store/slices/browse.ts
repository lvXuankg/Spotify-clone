import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Category {
  id: string;
  name: string;
  icons?: Array<{ url: string; height?: number; width?: number }>;
  // TODO: Thêm các field khác
}

interface BrowseState {
  categories: Category[];
  loading: boolean;
  error?: string;
  // TODO: Thêm các field khác
}

const initialState: BrowseState = {
  categories: [
    // Mock data
    {
      id: "1",
      name: "All",
      icons: [{ url: "https://via.placeholder.com/300" }],
    },
    {
      id: "2",
      name: "Pop",
      icons: [{ url: "https://via.placeholder.com/300" }],
    },
    {
      id: "3",
      name: "Rock",
      icons: [{ url: "https://via.placeholder.com/300" }],
    },
    {
      id: "4",
      name: "Hip-Hop",
      icons: [{ url: "https://via.placeholder.com/300" }],
    },
  ],
  loading: false,
  error: undefined,
  // TODO: Thêm dữ liệu giả
};

const browseSlice = createSlice({
  name: "browse",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
    },
    // TODO: Thêm các action sau
    fetchCategories: (state) => {
      // TODO: Implement thực tế
      state.loading = true;
    },
  },
});

export const browseActions = browseSlice.actions;
export default browseSlice.reducer;
