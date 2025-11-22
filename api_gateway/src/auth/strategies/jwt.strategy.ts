import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { errorHandling } from 'src/common/constants/error-handling';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error(errorHandling.jwtSecretError.message);
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // chỉ lấy header Authorization : Bearer ...
      ignoreExpiration: false, // token hết hạn sẽ bị reject
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
