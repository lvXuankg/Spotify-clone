import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { authService } from "@/services/auth";

import type { User } from "@/interfaces/user";
import type { LoginDto } from "@/interfaces/auth.interface";

interface AuthState {
  user?: User;
  isAuthenticated: boolean;
  requesting: boolean; // Trạng thái đang gọi API (loading)
  error?: string;
}

const initialState: AuthState = {
  user: undefined,
  isAuthenticated: false,
  requesting: true,
  error: undefined,
};

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, thunkAPI) => {
    try {
      const response = await authService.fetchUser();
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi xác thực"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (payload: LoginDto, thunkAPI) => {
    try {
      const response = await authService.login(payload);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Đăng nhập thất bại"
      );
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await authService.logout();
    return true;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Đăng nhập thất bại"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.requesting = true;
      state.user = undefined;
    });
    builder.addCase(
      fetchUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.requesting = false;

        if (action.payload?.id) {
          localStorage.setItem("userId", action.payload.id.toString());
        }
      }
    );
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.user = undefined;
      state.isAuthenticated = false;
      state.requesting = false;

      localStorage.removeItem("userId");
    });

    builder.addCase(login.pending, (state) => {
      state.requesting = true;
      state.error = undefined;
    });

    builder.addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
      console.log(state);
      console.log(action);
      state.user = action.payload;
      state.isAuthenticated = true;
      state.requesting = false;

      if (action.payload?.id) {
        localStorage.setItem("userId", action.payload.id.toString());
      }
    });

    builder.addCase(login.rejected, (state, action) => {
      state.requesting = false;
      state.isAuthenticated = false;
      state.error = action.payload as string;
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.user = undefined;
      state.isAuthenticated = false;
      localStorage.removeItem("userId");
    });

    builder.addCase(logout.rejected, (state) => {
      state.user = undefined;
      state.isAuthenticated = false;
      localStorage.removeItem("userId");
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
