export const errorHandling = {
  // ===================================
  // LỖI XÁC THỰC (AUTH) - 401 & 403
  // ===================================
  invalidCredential: {
    statusCode: 401, // Unauthorized
    message: 'Email hoặc mật khẩu không chính xác',
  },
  missingToken: {
    statusCode: 401, // Unauthorized
    message: 'Yêu cầu xác thực không thành công (Thiếu token)',
  },
  invalidToken: {
    statusCode: 401, // Unauthorized
    message: 'Token xác thực không hợp lệ hoặc đã hết hạn',
  },
  tokenExpired: {
    statusCode: 401,
    message: 'Token xác thực hết hạn',
    code: 'ACCESS_TOKEN_EXPIRED',
  },
  missingRefreshToken: {
    statusCode: 401,
    message: 'Thiếu refresh Token',
    code: 'REFRESH_TOKEN_MISSING',
  },
  insufficientPermission: {
    statusCode: 403, // Forbidden
    message: 'Bạn không có quyền thực hiện hành động này',
  },
  accountBlocked: {
    statusCode: 403, // Forbidden
    message: 'Tài khoản của bạn đã bị khoá',
  },
  accountNotVerified: {
    statusCode: 403, // Forbidden
    message: 'Vui lòng xác thực email của bạn để tiếp tục',
  },

  // ===================================
  // LỖI XUNG ĐỘT DỮ LIỆU (CONFLICT) - 409
  // ===================================
  duplicateEmail: {
    statusCode: 409, // Conflict
    message: 'Người dùng với email này đã tồn tại',
  },
  duplicateUsername: {
    statusCode: 409, // Conflict
    message: 'Username này đã được sử dụng',
  },

  // ===================================
  // LỖI DỮ LIỆU ĐẦU VÀO (CLIENT) - 400 & 404
  // ===================================
  validationFailed: {
    statusCode: 400, // Bad Request
    message: 'Dữ liệu đầu vào không hợp lệ',
    // Thường thì ValidationPipe của NestJS sẽ trả về một object chi tiết
    // Đây là message dự phòng
  },
  missingRequiredFields: {
    statusCode: 400, // Bad Request
    message: 'Vui lòng điền đầy đủ các trường thông tin bắt buộc',
  },
  notFound: {
    statusCode: 404, // Not Found
    message: 'Không tìm thấy tài nguyên yêu cầu',
  },
  userNotFound: {
    statusCode: 404, // Not Found
    message: 'Không tìm thấy người dùng',
  },
  postNotFound: {
    statusCode: 404, // Not Found
    message: 'Không tìm thấy bài viết này',
  },

  // ===================================
  // LỖI FILE UPLOAD - 413 & 415
  // ===================================
  fileTooLarge: {
    statusCode: 413, // Payload Too Large
    message: 'Kích thước file vượt quá giới hạn cho phép',
  },
  invalidFileType: {
    statusCode: 415, // Unsupported Media Type
    message: 'Định dạng file không được hỗ trợ',
  },

  // ===================================
  // LỖI MÁY CHỦ (SERVER) - 500
  // ===================================
  internalServerError: {
    statusCode: 500, // Internal Server Error
    message: 'Đã có lỗi xảy ra ở máy chủ, vui lòng thử lại sau',
  },
  databaseError: {
    statusCode: 500, // Internal Server Error
    message: 'Đã có lỗi xảy ra với cơ sở dữ liệu',
  },
  jwtSecretError: {
    statusCode: 500,
    message: 'Thiếu JWT_SECRET trong biến môi trường',
  },
};
