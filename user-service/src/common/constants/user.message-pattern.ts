/**
 * User Service Message Patterns
 * Định nghĩa các message pattern cho microservice communication qua RabbitMQ
 */

export const USER_MESSAGE_PATTERNS = {
  // Profile Management
  GET_PROFILE: 'user.get_profile',
  UPDATE_PROFILE: 'user.update_profile',

  // User Search & Typing
  TYPING_FIND_USERS: 'user.typing_find_users',
  FIND_USERS: 'user.find_users',

  // Follow Functionality
  FOLLOW_USER: 'user.follow_user',
  UNFOLLOW_USER: 'user.unfollow_user',
  GET_FOLLOWINGS_OF_USER: 'user.get_followings_of_user',
  GET_FOLLOWERS_OF_USER: 'user.get_followers_of_user',

  // Block Functionality
  BLOCK_USER: 'user.block_user',
  UNBLOCK_USER: 'user.unblock_user',

  // Report Functionality
  REPORT_USER: 'user.report_user',
  UNREPORT_USER: 'user.unreport_user',

  // Settings
  UPDATE_USER_SETTINGS: 'user.update_user_settings',
} as const;

export type UserMessagePattern =
  (typeof USER_MESSAGE_PATTERNS)[keyof typeof USER_MESSAGE_PATTERNS];
