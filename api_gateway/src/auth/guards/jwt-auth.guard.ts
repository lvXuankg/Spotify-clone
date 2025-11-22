import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { errorHandling } from 'src/common/constants/error-handling';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly logger: LoggerService) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // logic cache, rate limit, whitelist IP, etc...

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader: string = request.headers['authorization'];
    if (err || !user) {
      this.logger.warn(
        `Nỗ lực truy cập không xác thực : ${info?.message || err?.message}`,
      );

      if (!authHeader) {
        throw new UnauthorizedException(errorHandling.missingToken.message);
      }

      if (
        !authHeader.startsWith('Bearer ') ||
        info?.name === 'JsonWebTokenError'
      ) {
        throw new UnauthorizedException(errorHandling.invalidToken.message);
      }

      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          message: errorHandling.tokenExpired.message,
          code: errorHandling.tokenExpired.code,
        });
      }

      throw (
        err ||
        new InternalServerErrorException(
          errorHandling.internalServerError.message,
        )
      );
    }

    return user;
  }
}
