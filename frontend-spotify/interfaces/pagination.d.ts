export interface PaginationMeta {
  /** @description Trang hiện tại */
  page: number;

  /** @description Số lượng item mỗi trang */
  limit: number;

  /** @description Tổng số item */
  total: number;

  /** @description Tổng số trang */
  totalPages: number;

  /** @description Có trang tiếp theo không */
  hasMore: boolean;
}
