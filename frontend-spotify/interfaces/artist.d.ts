import { PaginationMeta } from "./pagination";

export interface Artist {
  /** @description Định danh duy nhất của nghệ sĩ (UUID) */
  id: string;

  /** @description ID của người dùng sở hữu/tạo hồ sơ nghệ sĩ này */
  user_id?: string;

  /** @description Tên hiển thị của nghệ sĩ */
  display_name: string;

  /** @description URL ảnh đại diện/hồ sơ của nghệ sĩ */
  avatar_url?: string | null;

  /** @description URL ảnh bìa của nghệ sĩ */
  cover_image_url?: string | null;

  /** @description Tiểu sử hoặc mô tả của nghệ sĩ */
  bio?: string | null;

  /** @description Thời gian tạo nghệ sĩ (định dạng ISO 8601) */
  created_at?: string;

  /** @description Thời gian cập nhật lần cuối (định dạng ISO 8601) */
  updated_at?: string;

  /** @description Camel case properties từ API response */
  displayName?: string;
  avatarUrl?: string | null;
  coverImageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateArtistDto {
  /** @description Tên hiển thị của nghệ sĩ (bắt buộc) */
  display_name: string;

  /** @description URL ảnh đại diện/hồ sơ của nghệ sĩ */
  avatar_url?: string | null;

  /** @description URL ảnh bìa của nghệ sĩ */
  cover_image_url?: string | null;

  /** @description Tiểu sử hoặc mô tả của nghệ sĩ */
  bio?: string | null;
}

export interface UpdateArtistDto {
  /** @description Tên hiển thị của nghệ sĩ */
  display_name?: string;

  /** @description URL ảnh đại diện/hồ sơ của nghệ sĩ */
  avatar_url?: string | null;

  /** @description URL ảnh bìa của nghệ sĩ */
  cover_image_url?: string | null;

  /** @description Tiểu sử hoặc mô tả của nghệ sĩ */
  bio?: string | null;
}

export type SimpleArtist = Pick<
  Artist,
  "id" | "user_id" | "display_name" | "avatar_url"
>;

/** @description Danh sách nghệ sĩ */
export interface FindAllArtistsResponse {
  /** @description Danh sách nghệ sĩ */
  data: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
    createdAt?: string;
  }[];

  /** @description Thông tin phân trang */
  pagination: PaginationMeta;
}
