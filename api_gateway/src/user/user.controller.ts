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
