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
  isNumberString: (key: string = DEFAULT_FIELD_NAME) =>
    `Trường ${key} phải là một số hợp lệ`,
  isIn: (key: string = DEFAULT_FIELD_NAME, options: string[] = []) =>
    `Trường ${key} phải là một trong các giá trị: ${options.join(', ')}`,
  min: (key: string = DEFAULT_FIELD_NAME, min: number = 0) =>
    `Trường ${key} phải lớn hơn hoặc bằng ${min}`,
  max: (key: string = DEFAULT_FIELD_NAME, max: number = 100) =>
    `Trường ${key} không được vượt quá ${max}`,
};
