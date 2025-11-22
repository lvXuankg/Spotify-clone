// ==================================
// SWAGGER RESPONSES - FULL VERSION
// ==================================

import { errorHandling } from './error-handling';
import { responseMessages } from './response-message';
import { validationMessages } from './validation-messages';

const authRegisterSuccess = {
  status: 201,
  description: responseMessages.registerSuccess,
  schema: {
    example: {
      id: '1',
      email: 'user@example.com',
      username: 'user1731000000',
      createdAt: '2025-11-05T20:30:00Z',
    },
  },
};

const authRegisterError = {
  status: 400,
  description: 'Các lỗi có thể xảy ra khi đăng ký tài khoản',
  schema: {
    oneOf: [
      {
        example: {
          statusCode: 400,
          message: [
            validationMessages.isEmail,
            validationMessages.minLength('Mật khẩu', 8),
          ],
          error: 'Bad Request',
        },
      },
      {
        status: 409,
        example: {
          statusCode: 409,
          message: errorHandling.duplicateEmail.message,
          error: 'Conflict',
        },
      },
      {
        status: 500,
        example: {
          statusCode: 500,
          message: errorHandling.internalServerError.message,
          error: 'Internal Server Error',
        },
      },
    ],
  },
};

const authLoginSuccess = {
  status: 200,
  description: responseMessages.loginSuccess,
  schema: {
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refresh_token: 'abc123def456ghi789...',
      user: {
        id: '1',
        email: 'user@example.com',
        username: 'user1731000000',
      },
    },
  },
};

const authLoginError = {
  status: 400,
  description: 'Các lỗi login có thể xảy ra',
  schema: {
    oneOf: [
      {
        status: 400,
        example: {
          statusCode: 400,
          message: errorHandling.validationFailed.message,
          error: 'Bad Request',
        },
      },
      {
        status: 401,
        example: {
          statusCode: 401,
          message: errorHandling.invalidCredential.message,
          error: 'Unauthorized',
        },
      },
    ],
  },
};

const authRefreshSuccess = {
  status: 200,
  description: responseMessages.refreshTokenSuccess,
  schema: {
    example: {
      id: '1',
      email: 'user@example.com',
      username: 'user1731000000',
    },
  },
};

const authRefreshError = {
  status: 400,
  description: 'Các lỗi refresh token có thể xảy ra',
  schema: {
    oneOf: [
      {
        status: 400,
        example: {
          statusCode: 400,
          message: errorHandling.missingRequiredFields.message,
          error: 'Bad Request',
        },
      },
      {
        status: 401,
        example: {
          statusCode: 401,
          message: errorHandling.invalidToken.message,
          error: 'Unauthorized',
        },
      },
      {
        status: 401,
        example: {
          statusCode: 401,
          message: errorHandling.tokenExpired.message,
          code: errorHandling.tokenExpired.code,
          error: 'Unauthorized',
        },
      },
    ],
  },
};

const authLogoutSuccess = {
  status: 200,
  description: responseMessages.logoutOneDevice,
  schema: {
    example: {
      message: responseMessages.logoutOneDevice,
    },
  },
};

const authLogoutAllSuccess = {
  status: 200,
  description: responseMessages.logoutAllDevices,
  schema: {
    example: {
      message: responseMessages.logoutAllDevices,
      devicesLoggedOut: 3,
    },
  },
};

const authLogoutError = {
  status: 401,
  description: 'Các lỗi logout có thể xảy ra',
  schema: {
    oneOf: [
      {
        status: 401,
        example: {
          statusCode: 401,
          message: errorHandling.invalidToken.message,
          error: 'Unauthorized',
        },
      },
      {
        status: 401,
        example: {
          statusCode: 401,
          message: errorHandling.tokenExpired.message,
          code: errorHandling.tokenExpired.code,
          error: 'Unauthorized',
        },
      },
      {
        status: 500,
        example: {
          statusCode: 500,
          message: errorHandling.internalServerError.message,
          error: 'Internal Server Error',
        },
      },
    ],
  },
};

// ==========================
// EXPORT GROUPED BY ENDPOINT
// ==========================

export const swaggerResponses = {
  register: {
    success: authRegisterSuccess,
    error: authRegisterError,
  },
  login: {
    success: authLoginSuccess,
    error: authLoginError,
  },
  refresh: {
    success: authRefreshSuccess,
    error: authRefreshError,
  },
  logout: {
    success: authLogoutSuccess,
    error: authLogoutError,
  },
  logoutAll: {
    success: authLogoutAllSuccess,
    error: authLogoutError,
  },
};
