const DEFAULT_FIELD_NAME = 'này';

export const validationMessages = {
  isNotEmpty: (key: string = DEFAULT_FIELD_NAME) =>
    `Trường ${key} không được để trống`,
  isString: (key: string = DEFAULT_FIELD_NAME) =>
    `Trường ${key} phải là một chuỗi ký tự`,
  isEmail: 'Email không đúng định dạng',
  minLength: (key: string = DEFAULT_FIELD_NAME, min: number = 1) =>
    `Trường ${key} phải có ít nhất ${min} ký tự`,
  maxLength: (key: string = DEFAULT_FIELD_NAME, max: number = 1) =>
    `Trường ${key} không được vượt quá ${max} ký tự`,
  isNumber: (key: string = DEFAULT_FIELD_NAME) => `Trường ${key} phải là số`,
  isUUID: (key: string = DEFAULT_FIELD_NAME) =>
    `Trường ${key} phải là một UUID hợp lệ`,
  isDateString: (key: string = DEFAULT_FIELD_NAME) =>
    `Trường ${key} phải là một ngày hợp lệ (ISO 8601)`,
  isUrl: (key: string = DEFAULT_FIELD_NAME) =>
    `Trường ${key} phải là một URL hợp lệ`,
  isEnum: (key: string = DEFAULT_FIELD_NAME, options: string[] = []) =>
    `Trường ${key} phải là một trong các giá trị: ${options.join(', ')}`,
};
