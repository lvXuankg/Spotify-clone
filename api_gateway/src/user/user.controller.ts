import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Lấy tất cả users (Admin only)
   */
  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.userService.getAllUsers(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      search,
    );
  }

  /**
   * Xóa user (Admin only)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  /**
   * Cập nhật role user (Admin only)
   */
  @Patch(':id/role')
  @UseGuards(JwtAuthGuard)
  async updateUserRole(
    @Param('id') id: string,
    @Body() body: { role: string },
  ) {
    return this.userService.updateUserRole(id, body.role);
  }

  /**
   * Lấy thông tin profile của user hiện tại
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    return this.userService.getProfile(req.user.userId);
  }

  /**
   * Cập nhật profile của user hiện tại
   */
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req: any, @Body() data: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.userId, data);
  }
}
