/**
 * Auth Service Message Patterns (API Gateway)
 * Định nghĩa các message pattern để gọi Auth Service microservice
 */

export const AUTH_MESSAGE_PATTERNS = {
  // Authentication
  REGISTER: 'auth.register',
  LOGIN: 'auth.login',
  REFRESH_TOKEN: 'auth.refreshToken',
  LOGOUT: 'auth.logout',
  LOGOUT_ALL_DEVICES: 'auth.logoutAllDevices',
  VERIFY: 'auth.validate',
} as const;

export type AuthMessagePattern =
  (typeof AUTH_MESSAGE_PATTERNS)[keyof typeof AUTH_MESSAGE_PATTERNS];
