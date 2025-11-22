import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info', //default log
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
          (info) =>
            `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`,
        ),
      ),
      transports: [
        new winston.transports.Console(), // Log ra console
        new winston.transports.DailyRotateFile({
          // Log ra file
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true, // nén file cũ
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });
  }

  info(message: string) {
    this.logger.info(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
