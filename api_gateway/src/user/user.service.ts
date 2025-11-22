import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { sendMicroserviceRequest } from 'src/common/utils/handle-rpc-error';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { BlockUserDto } from './dto/block-user.dto';
import { ReportUserDto } from './dto/report-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { USER_MESSAGE_PATTERNS } from './constants/user.message-pattern';

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  async getProfile(userId: string) {
    return sendMicroserviceRequest(
      this.client,
      USER_MESSAGE_PATTERNS.GET_PROFILE,
      {
        userId,
      },
    );
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    return sendMicroserviceRequest(
      this.client,
      USER_MESSAGE_PATTERNS.UPDATE_PROFILE,
      {
        userId,
        data,
      },
    );
  }

  async typingFindUser(text: string) {
    return sendMicroserviceRequest(
      this.client,
      USER_MESSAGE_PATTERNS.TYPING_FIND_USERS,
      {
        text,
      },
    );
  }

  async findUsers(dto: FindUsersQueryDto) {
    return sendMicroserviceRequest(
      this.client,
      USER_MESSAGE_PATTERNS.FIND_USERS,
      dto,
    );
  }

  async followUser(userId: string, targetUserId: string) {
    return sendMicroserviceRequest(
      this.client,
      USER_MESSAGE_PATTERNS.FOLLOW_USER,
      {
        userId,
        targetUserId,
      },
    );
  }

  async unfollowUser(userId: string, targetUserId: string) {
    return sendMicroserviceRequest(
      this.client,
      USER_MESSAGE_PATTERNS.UNFOLLOW_USER,
      {
        userId,
        targetUserId,
      },
    );
  }

  async getFollowingsOfUser(userId: string, dto: PaginationQueryDto) {
    return sendMicroserviceRequest(
      this.client,
      USER_MESSAGE_PATTERNS.GET_FOLLOWINGS_OF_USER,
      {
        userId,
        ...dto,
      },
    );
  }

  async getFollowersOfUser(userId: string, dto: PaginationQueryDto) {
    return sendMicroserviceRequest(
      this.client,
      USER_MESSAGE_PATTERNS.GET_FOLLOWERS_OF_USER,
      {
        userId,
        ...dto,
      },
    );
  }

  async blockUser(userId: string, targetUserId: string, dto: BlockUserDto) {
    return sendMicroserviceRequest(
      this.client,
      USER_MESSAGE_PATTERNS.BLOCK_USER,
      {
        userId,
        targetUserId,
        dto,
      },
    );
  }

  async unblockUser(userId: string, targetUserId: string) {
    return sendMicroserviceRequest(
      this.client,
      USER_MESSAGE_PATTERNS.UNBLOCK_USER,
      {
        userId,
        targetUserId,
      },
    );
  }

  async reportUser(userId: string, targetUserId: string, dto: ReportUserDto) {
    return sendMicroserviceRequest(
      this.client,
      USER_MESSAGE_PATTERNS.REPORT_USER,
      {
        userId,
        targetUserId,
        dto,
      },
    );
  }

  async unreportUser(userId: string, targetUserId: string) {
    return sendMicroserviceRequest(
      this.client,
      USER_MESSAGE_PATTERNS.UNREPORT_USER,
      {
        userId,
        targetUserId,
      },
    );
  }
}
