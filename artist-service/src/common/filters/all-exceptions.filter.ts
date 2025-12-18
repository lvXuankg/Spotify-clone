import { ArgumentsHost, Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { errorHandling } from '../constants/error-handling';

@Catch() //Bắt tất cả lỗi
export class AllExceptionsFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost): Observable<any> {
    // Format lỗi chuẩn => gửi về api gateway
    const errorResponse = {
      statusCode: errorHandling.serviceMicroError.statusCode,
      message: errorHandling.serviceMicroError.message,
    };

    // lỗi biết trước (4xx)
    if (exception instanceof HttpException) {
      const httpResponse = exception.getResponse(); // message
      const status = exception.getStatus();

      this.logger.warn(`HttpException: ${status} - ${JSON.stringify(httpResponse)}`);

      // Cập nhật object lỗi để gửi đi
      errorResponse.statusCode = status;
      errorResponse.message = (httpResponse as any).message || exception.message;
    } else if (exception instanceof Error) {
      // Lỗi code (5xx)
      this.logger.error(
        `Unhandled Exception: ${exception.message}`,
        exception.stack, // 👈 Ghi lại stack trace
      );

      // Giữ message 500 chung chung (không lộ chi tiết lỗi)
    } else {
      // --- TRƯỜNG HỢP 3: Lỗi không xác định ---
      this.logger.error('Unknown error caught:', exception);
      errorResponse.message = 'Lỗi không xác định';
    }

    return throwError(() => errorResponse);
  }
}
