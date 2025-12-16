export enum FolderType {
  TRACKS = "spotify/tracks",
  COVERS = "spotify/covers",
  AVATARS = "spotify/avatars",
  PLAYLISTS = "spotify/playlists",
}

export enum ResourceType {
  IMAGE = "image",
  VIDEO = "video",
  RAW = "raw",
  AUTO = "auto",
}

export interface GeneratePresignedUrlDto {
  /** @description Thư mục lưu trữ file */
  folder: FolderType;

  /** @description Loại tài nguyên file */
  resourceType?: ResourceType;
}

export interface ResponsePresignedUrl {
  /** @description URL upload endpoint của Cloudinary */
  uploadUrl: string;

  /** @description Chữ ký xác minh tính hợp lệ của request upload */
  signature: string;

  /** @description Timestamp tạo presigned URL, dùng cho signature validation */
  timestamp: number;

  /** @description API Key của Cloudinary account */
  apiKey: string;

  /** @description Cloud name của Cloudinary account */
  cloudName: string;

  /** @description Thư mục lưu trữ file trên Cloudinary */
  folder: string;

  /** @description ID duy nhất của file sẽ được upload */
  publicId: string;

  /** @description Thời gian hết hạn của presigned URL (Unix timestamp) */
  expiresAt: number;

  /** @description Eager transformations cho image (tùy chọn, chỉ cho images) */
  eager?: string;

  /** @description Flag để sử dụng eager transformations asynchronously */
  eager_async?: string | boolean;
}

export interface UploadFileMetadataDto {
  /** @description ID duy nhất của file trên Cloudinary */
  publicId: string;

  /** @description URL công khai của file (HTTP) */
  url: string;

  /** @description URL an toàn của file (HTTPS) */
  secureUrl: string;

  /** @description Định dạng file (mp3, png, jpg, v.v) */
  format: string;

  /** @description Loại tài nguyên (image, video, raw, auto) */
  resourceType: string;

  /** @description Kích thước file tính bằng bytes */
  bytes: number;

  /** @description Chiều rộng file (chỉ có giá trị với hình ảnh/video) */
  width?: number;

  /** @description Chiều cao file (chỉ có giá trị với hình ảnh/video) */
  height?: number;

  /** @description Thời lượng file tính bằng giây (chỉ có giá trị với video/âm thanh) */
  duration?: number;

  /** @description Thời gian tạo file trên Cloudinary (ISO 8601 format) */
  createdAt?: string;
}

export interface UploadResponseDto {
  /** @description Trạng thái upload thành công hay thất bại */
  success: boolean;

  /** @description Thông tin file chi tiết (chỉ có khi success = true) */
  data?: UploadFileMetadataDto;

  /** @description Thông báo lỗi (chỉ có khi success = false) */
  error?: string;
}
