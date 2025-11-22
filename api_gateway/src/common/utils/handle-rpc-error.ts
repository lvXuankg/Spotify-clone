import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

/**
 * Hàm bọc (wrapper) cho các lệnh gọi microservice.
 * Nó thay thế `firstValueFrom` và tự động xử lý/ném lại (re-throw) lỗi
 * dưới dạng HttpException chuẩn.
 * * @param client - ClientProxy (ví dụ: this.client)
 * @param pattern - Tên message pattern (ví dụ: 'auth.register')
 * @param data - Dữ liệu gửi đi (payload)
 */
export async function sendMicroserviceRequest(
  client: ClientProxy,
  pattern: string,
  data: unknown,
) {
  try {
    return await firstValueFrom(client.send(pattern, data));
  } catch (error) {
    console.log(error);
    if (error && typeof error === 'object' && error.statusCode) {
      throw new HttpException(error.message, error.statusCode);
    }

    // default exception (internal - 500)
    throw new InternalServerErrorException(
      error.message || 'Lỗi máy chủ nội bộ không xác định',
    );
  }
}
