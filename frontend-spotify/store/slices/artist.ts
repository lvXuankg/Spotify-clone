import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ArtistServices } from "@/services/artist";
import type {
  Artist,
  CreateArtistDto,
  UpdateArtistDto,
  FindAllArtistsResponse,
} from "@/interfaces/artist";

// ==================== STATE INTERFACE ====================

interface ArtistState {
  /** Danh sách nghệ sĩ */
  artists: Artist[];

  /** Thông tin chi tiết nghệ sĩ hiện tại */
  currentArtist: Artist | null;

  /** Danh sách nghệ sĩ (dạng list view) */
  listArtists: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
    createdAt?: string;
  }[];

  /** Đang tải dữ liệu */
  loading: boolean;

  /** Lỗi nếu có */
  error: string | null;

  /** Trang hiện tại */
  currentPage: number;

  /** Limit mỗi trang */
  pageLimit: number;

  /** Tổng số nghệ sĩ */
  total: number;

  /** Tổng số trang */
  totalPages: number;

  /** Có trang tiếp theo không */
  hasMore: boolean;
}

const initialState: ArtistState = {
  artists: [],
  currentArtist: null,
  listArtists: [],
  loading: false,
  error: null,
  currentPage: 1,
  pageLimit: 20,
  total: 0,
  totalPages: 0,
  hasMore: false,
};

// ==================== ASYNC THUNKS ====================

/**
 * Lấy danh sách tất cả nghệ sĩ
 */
export const fetchArtists = createAsyncThunk(
  "artist/fetchArtists",
  async (
    { page = 1, limit = 20 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await ArtistServices.getListArtists(page, limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi tải danh sách nghệ sĩ"
      );
    }
  }
);

/**
 * Lấy chi tiết nghệ sĩ theo ID
 */
export const fetchArtistById = createAsyncThunk(
  "artist/fetchArtistById",
  async (artistId: string, { rejectWithValue }) => {
    try {
      const response = await ArtistServices.getArtistById(artistId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi tải thông tin nghệ sĩ"
      );
    }
  }
);

/**
 * Tạo nghệ sĩ mới
 */
export const createArtist = createAsyncThunk(
  "artist/createArtist",
  async (dto: CreateArtistDto, { rejectWithValue }) => {
    try {
      const response = await ArtistServices.createArtist(dto);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi tạo nghệ sĩ"
      );
    }
  }
);

/**
 * Cập nhật thông tin nghệ sĩ
 */
export const updateArtist = createAsyncThunk(
  "artist/updateArtist",
  async (
    { artistId, dto }: { artistId: string; dto: UpdateArtistDto },
    { rejectWithValue }
  ) => {
    try {
      const response = await ArtistServices.updateArtist(artistId, dto);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi cập nhật nghệ sĩ"
      );
    }
  }
);

/**
 * Xóa nghệ sĩ
 */
export const deleteArtist = createAsyncThunk(
  "artist/deleteArtist",
  async (artistId: string, { rejectWithValue }) => {
    try {
      await ArtistServices.deleteArtist(artistId);
      return artistId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi xóa nghệ sĩ"
      );
    }
  }
);

// ==================== SLICE ====================

const artistSlice = createSlice({
  name: "artist",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentArtist: (state, action: PayloadAction<Artist | null>) => {
      state.currentArtist = action.payload;
    },
    resetArtistState: () => initialState,
  },
  extraReducers: (builder) => {
    // ============ fetchArtists ============
    builder.addCase(fetchArtists.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      fetchArtists.fulfilled,
      (state, action: PayloadAction<FindAllArtistsResponse>) => {
        state.loading = false;
        state.listArtists = action.payload.data;
        state.currentPage = action.payload.pagination.page;
        state.pageLimit = action.payload.pagination.limit;
        state.total = action.payload.pagination.total;
        state.totalPages = action.payload.pagination.totalPages;
        state.hasMore = action.payload.pagination.hasMore;
      }
    );

    builder.addCase(fetchArtists.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ============ fetchArtistById ============
    builder.addCase(fetchArtistById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      fetchArtistById.fulfilled,
      (state, action: PayloadAction<Artist>) => {
        state.loading = false;
        state.currentArtist = action.payload;
      }
    );

    builder.addCase(fetchArtistById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ============ createArtist ============
    builder.addCase(createArtist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      createArtist.fulfilled,
      (state, action: PayloadAction<Artist>) => {
        state.loading = false;
        state.currentArtist = action.payload;

        // Thêm vào đầu danh sách artists
        state.artists.unshift(action.payload);

        // Thêm vào listArtists (danh sách hiển thị trong bảng)
        state.listArtists.unshift({
          id: action.payload.id,
          displayName: action.payload.display_name,
          avatarUrl: action.payload.avatar_url,
          createdAt: action.payload.created_at,
        });

        // Cập nhật total và hasMore
        state.total += 1;
        if (state.listArtists.length > state.pageLimit) {
          state.listArtists.pop(); // Xóa phần tử cuối nếu vượt limit
        }
      }
    );

    builder.addCase(createArtist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ============ updateArtist ============
    builder.addCase(updateArtist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      updateArtist.fulfilled,
      (state, action: PayloadAction<Artist>) => {
        state.loading = false;
        state.currentArtist = action.payload;

        // Cập nhật trong danh sách artists
        const index = state.artists.findIndex(
          (a) => a.id === action.payload.id
        );
        if (index !== -1) {
          state.artists[index] = action.payload;
        }

        // Cập nhật trong listArtists (danh sách hiển thị trong bảng)
        const listIndex = state.listArtists.findIndex(
          (a) => a.id === action.payload.id
        );
        if (listIndex !== -1) {
          state.listArtists[listIndex] = {
            id: action.payload.id,
            displayName: action.payload.display_name,
            avatarUrl: action.payload.avatar_url,
            createdAt: action.payload.created_at,
          };
        }
      }
    );

    builder.addCase(updateArtist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ============ deleteArtist ============
    builder.addCase(deleteArtist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      deleteArtist.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.loading = false;

        // Xóa khỏi danh sách artists
        state.artists = state.artists.filter((a) => a.id !== action.payload);

        // Xóa khỏi listArtists (danh sách hiển thị trong bảng)
        state.listArtists = state.listArtists.filter(
          (a) => a.id !== action.payload
        );

        // Giảm total
        state.total = Math.max(0, state.total - 1);

        // Nếu currentArtist bị xóa, clear nó
        if (state.currentArtist?.id === action.payload) {
          state.currentArtist = null;
        }
      }
    );

    builder.addCase(deleteArtist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, setCurrentArtist, resetArtistState } =
  artistSlice.actions;
export default artistSlice.reducer;
