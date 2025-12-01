import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { USER_MESSAGE_PATTERNS } from 'src/common/constants/user.message-pattern';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Lấy thông tin profile người dùng
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.GET_PROFILE)
  async getProfile(@Payload() payload: { userId: string }) {
    return this.userService.getProfile(payload.userId);
  }

  /**
   * Cập nhật thông tin profile
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.UPDATE_PROFILE)
  async updateProfile(
    @Payload() payload: { userId: string; data: UpdateProfileDto },
  ) {
    return this.userService.updateProfile(payload.userId, payload.data);
  }
}
