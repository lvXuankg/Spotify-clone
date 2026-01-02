import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { USER_MESSAGE_PATTERNS } from 'src/common/constants/user.message-pattern';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get all users (Admin only)
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.GET_ALL_USERS)
  async getAllUsers(
    @Payload() payload: { page?: number; limit?: number; search?: string },
  ) {
    return this.userService.getAllUsers(
      payload.page,
      payload.limit,
      payload.search,
    );
  }

  /**
   * Delete user (Admin only)
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.DELETE_USER)
  async deleteUser(@Payload() payload: { userId: string }) {
    return this.userService.deleteUser(payload.userId);
  }

  /**
   * Update user role (Admin only)
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.UPDATE_USER_ROLE)
  async updateUserRole(@Payload() payload: { userId: string; role: string }) {
    return this.userService.updateUserRole(payload.userId, payload.role);
  }

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
