import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { USER_MESSAGE_PATTERNS } from 'src/common/constants/user.message-pattern';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { BlockUserDto } from './dto/block-user.dto';
import { ReportUserDto } from './dto/report-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Lấy thông tin profile người dùng
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.GET_PROFILE)
  async getProfile(@Payload() payload: { userId: string }) {
    return this.userService.getProfile(BigInt(payload.userId));
  }

  /**
   * Cập nhật thông tin profile
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.UPDATE_PROFILE)
  async updateProfile(
    @Payload() payload: { userId: string; data: UpdateProfileDto },
  ) {
    return this.userService.updateProfile(BigInt(payload.userId), payload.data);
  }

  /**
   * Gợi ý typing tìm người dùng
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.TYPING_FIND_USERS)
  async typingFindUsers(@Payload() payload: { text: string }) {
    return this.userService.typingFindUsers(payload.text);
  }

  /**
   * Tìm người dùng với cursor pagination
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.FIND_USERS)
  async findUsers(@Payload() dto: FindUsersQueryDto) {
    return this.userService.findUsers(dto);
  }

  /**
   * Theo dõi người dùng
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.FOLLOW_USER)
  async followUser(
    @Payload() payload: { userId: bigint; targetUserId: bigint },
  ) {
    return this.userService.followUser(payload.userId, payload.targetUserId);
  }

  /**
   * Hủy theo dõi người dùng
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.UNFOLLOW_USER)
  async unfollowUser(
    @Payload() payload: { userId: bigint; targetUserId: bigint },
  ) {
    return this.userService.unfollowUser(payload.userId, payload.targetUserId);
  }

  /**
   * Lấy danh sách người mà userId đang theo dõi (infinity scroll)
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.GET_FOLLOWINGS_OF_USER)
  async getFollowingsOfUser(
    @Payload()
    payload: {
      userId: bigint;
      cursor?: string;
      limit?: number;
    },
  ) {
    return this.userService.getFollowingsOfUser(
      payload.userId,
      payload.cursor,
      payload.limit,
    );
  }

  /**
   * Lấy danh sách người đang theo dõi userId (infinity scroll)
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.GET_FOLLOWERS_OF_USER)
  async getFollowersOfUser(
    @Payload()
    payload: {
      userId: bigint;
      cursor?: string;
      limit?: number;
    },
  ) {
    return this.userService.getFollowersOfUser(
      payload.userId,
      payload.cursor,
      payload.limit,
    );
  }

  /**
   * Chặn người dùng
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.BLOCK_USER)
  async blockUser(
    @Payload()
    payload: {
      userId: bigint;
      targetUserId: bigint;
      dto: BlockUserDto;
    },
  ) {
    return this.userService.blockUser(
      payload.userId,
      payload.targetUserId,
      payload.dto,
    );
  }

  /**
   * Bỏ chặn người dùng
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.UNBLOCK_USER)
  async unblockUser(
    @Payload() payload: { userId: bigint; targetUserId: bigint },
  ) {
    return this.userService.unblockUser(payload.userId, payload.targetUserId);
  }

  /**
   * Báo cáo người dùng
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.REPORT_USER)
  async reportUser(
    @Payload()
    payload: {
      userId: bigint;
      targetUserId: bigint;
      dto: ReportUserDto;
    },
  ) {
    return this.userService.reportUser(
      payload.userId,
      payload.targetUserId,
      payload.dto,
    );
  }

  /**
   * Hủy báo cáo người dùng
   */
  @MessagePattern(USER_MESSAGE_PATTERNS.UNREPORT_USER)
  async unreportUser(
    @Payload() payload: { userId: bigint; targetUserId: bigint },
  ) {
    return this.userService.unreportUser(payload.userId, payload.targetUserId);
  }
}
