import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userService } from "@/services/user";
import type { User } from "@/interfaces/user";

interface ProfileState {
  profile?: User; // Đầy đủ thông tin user
  loading: boolean;
  error?: string;
}

const initialState: ProfileState = {
  profile: undefined,
  loading: false,
  error: undefined,
};

// Lấy đầy đủ thông tin profile user
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const response = await userService.fetchUser();
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// Cập nhật profile user
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (data: Partial<User>, thunkAPI) => {
    try {
      const response = await userService.updateProfile(data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearError(state) {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder.addCase(fetchProfile.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });

    builder.addCase(
      fetchProfile.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.profile = action.payload;
        state.loading = false;
      }
    );

    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Profile
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });

    builder.addCase(
      updateProfile.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.profile = action.payload;
        state.loading = false;
      }
    );

    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = profileSlice.actions;
export default profileSlice.reducer;
