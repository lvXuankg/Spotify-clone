import { Injectable } from '@nestjs/common';

export interface PaginateOptions<T = any> {
  model: any; // Model Prisma (prisma.user, prisma.post...)
  where?: Record<string, any>; // Điều kiện where
  select?: Record<string, any>; // Các trường cần lấy
  orderBy: Record<string, 'asc' | 'desc'>; // Sắp xếp
  cursor?: string; // Base64 encoded cursor value
  limit?: number; // Số items mỗi page (default: 15, max: 100)
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    limit: number;
    hasNextPage: boolean;
    nextCursor: string | null;
    totalFetched: number;
  };
}

@Injectable()
export class PaginationService {
  constructor() {}

  async paginate<T = any>(
    options: PaginateOptions<T>,
  ): Promise<PaginationResult<T>> {
    const { model, where, select, orderBy, cursor, limit } = options;

    // Xác định field để sort (lấy key đầu tiên từ orderBy object)
    const orderByField = Object.keys(orderBy)[0];
    const orderDirection = orderBy[orderByField];

    // Sanitize limit: min 1, max 100, default 15
    const sanitizedLimit = Math.min(Math.max(Number(limit) || 15, 1), 100);
    const finalWhere = where || {};

    // Nếu có cursor, decode và thêm điều kiện gt/lt
    if (cursor) {
      try {
        const decodedCursorValue = BigInt(
          Buffer.from(cursor, 'base64').toString('utf-8'),
        );

        // Cursor pagination: dùng gt (greater than) hoặc lt (less than)
        finalWhere[orderByField] = {
          [orderDirection === 'asc' ? 'gt' : 'lt']: decodedCursorValue,
        };
      } catch (error) {
        // Invalid cursor, ignore và lấy từ đầu
        console.warn('Invalid cursor format:', error.message);
      }
    }

    // Fetch sanitizedLimit + 1 để kiểm tra có trang tiếp theo
    const items = await model.findMany({
      where: finalWhere,
      select,
      orderBy,
      take: sanitizedLimit + 1,
    });

    // Kiểm tra xem có trang tiếp theo hay không
    const hasNextPage = items.length > sanitizedLimit;
    const paginatedItems = hasNextPage ? items.slice(0, sanitizedLimit) : items;

    // Tạo cursor cho trang tiếp theo
    let nextCursor: string | null = null;
    if (hasNextPage && paginatedItems.length > 0) {
      const lastItem = paginatedItems[paginatedItems.length - 1];
      // Lấy giá trị của field đã sort (thường là ID)
      const cursorValue = lastItem[orderByField];

      // Encode cursor: BigInt → string → base64
      nextCursor = Buffer.from(String(cursorValue)).toString('base64');
    }

    return {
      data: paginatedItems,
      pagination: {
        limit: sanitizedLimit,
        hasNextPage,
        nextCursor,
        totalFetched: paginatedItems.length,
      },
    };
  }
}
