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
import { BlockUserDto } from './dto/block-user.dto';
import { ReportUserDto } from './dto/report-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

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

  /**
   * Gợi ý typing tìm người dùng
   */
  @Get('typing-find')
  async typingFindUsers(@Query('text') text: string) {
    return this.userService.typingFindUser(text);
  }

  /**
   * Tìm người dùng với cursor pagination
   */
  @Get('find')
  async findUsers(@Query() dto: FindUsersQueryDto) {
    return this.userService.findUsers(dto);
  }

  /**
   * Theo dõi một người dùng
   */
  @Post(':targetUserId/follow')
  @UseGuards(JwtAuthGuard)
  async followUser(
    @Request() req: any,
    @Param('targetUserId') targetUserId: string,
  ) {
    return this.userService.followUser(req.user.userId, targetUserId);
  }

  /**
   * Hủy theo dõi một người dùng
   */
  @Delete(':targetUserId/follow')
  @UseGuards(JwtAuthGuard)
  async unfollowUser(
    @Request() req: any,
    @Param('targetUserId') targetUserId: string,
  ) {
    return this.userService.unfollowUser(req.user.userId, targetUserId);
  }

  /**
   * Lấy danh sách người mà user hiện tại đang theo dõi (infinity scroll)
   */
  @Get('followings')
  @UseGuards(JwtAuthGuard)
  async getFollowingsOfUser(
    @Request() req: any,
    @Query() dto: PaginationQueryDto,
  ) {
    return this.userService.getFollowingsOfUser(req.user.userId, dto);
  }

  /**
   * Lấy danh sách người đang theo dõi user hiện tại (infinity scroll)
   */
  @Get('followers')
  @UseGuards(JwtAuthGuard)
  async getFollowersOfUser(
    @Request() req: any,
    @Query() dto: PaginationQueryDto,
  ) {
    return this.userService.getFollowersOfUser(req.user.userId, dto);
  }

  /**
   * Chặn một người dùng
   */
  @Post(':targetUserId/block')
  @UseGuards(JwtAuthGuard)
  async blockUser(
    @Request() req: any,
    @Param('targetUserId') targetUserId: string,
    @Body() dto: BlockUserDto,
  ) {
    return this.userService.blockUser(req.user.userId, targetUserId, dto);
  }

  /**
   * Bỏ chặn một người dùng
   */
  @Delete(':targetUserId/block')
  @UseGuards(JwtAuthGuard)
  async unblockUser(
    @Request() req: any,
    @Param('targetUserId') targetUserId: string,
  ) {
    return this.userService.unblockUser(req.user.userId, targetUserId);
  }

  /**
   * Báo cáo một người dùng
   */
  @Post(':targetUserId/report')
  @UseGuards(JwtAuthGuard)
  async reportUser(
    @Request() req: any,
    @Param('targetUserId') targetUserId: string,
    @Body() dto: ReportUserDto,
  ) {
    return this.userService.reportUser(req.user.userId, targetUserId, dto);
  }

  /**
   * Hủy báo cáo một người dùng
   */
  @Delete(':targetUserId/report')
  @UseGuards(JwtAuthGuard)
  async unreportUser(
    @Request() req: any,
    @Param('targetUserId') targetUserId: string,
  ) {
    return this.userService.unreportUser(req.user.userId, targetUserId);
  }
}
