/**
 * Convert snake_case to camelCase
 * @param str - String in snake_case format
 * @returns String in camelCase format
 */
export function snakeToCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase to snake_case
 * @param str - String in camelCase format
 * @returns String in snake_case format
 */
export function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Transform object keys from snake_case to camelCase (deep)
 * @param obj - Object with snake_case keys
 * @returns Object with camelCase keys
 */
export function transformSnakeToCamelCase(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => transformSnakeToCamelCase(item));
  }

  if (typeof obj !== "object") {
    return obj;
  }

  const result: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = snakeToCamelCase(key);
      result[camelKey] = transformSnakeToCamelCase(obj[key]);
    }
  }

  return result;
}

/**
 * Transform object keys from camelCase to snake_case (deep)
 * @param obj - Object with camelCase keys
 * @returns Object with snake_case keys
 */
export function transformCamelToSnakeCase(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => transformCamelToSnakeCase(item));
  }

  if (typeof obj !== "object") {
    return obj;
  }

  const result: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = camelToSnakeCase(key);
      result[snakeKey] = transformCamelToSnakeCase(obj[key]);
    }
  }

  return result;
}
