import axios from "axios";
import {
  transformSnakeToCamelCase,
  transformCamelToSnakeCase,
} from "./camelcase-transformer";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// List các endpoint không được retry token
const NO_RETRY_ENDPOINTS = ["/login", "/register", "/refreshToken"];

// Flag để ngăn gọi API khi đang redirect về login
let isRedirectingToLogin = false;

/**
 * Request interceptor: Convert snake_case (Database format) → camelCase (Backend expects)
 * Frontend uses snake_case (from database), convert to camelCase before sending to Backend
 */
api.interceptors.request.use((config) => {
  // Nếu đang redirect về login, cancel tất cả request (trừ auth endpoints)
  if (isRedirectingToLogin) {
    const endpoint = config.url || "";
    const isAuthEndpoint = NO_RETRY_ENDPOINTS.some((ep) =>
      endpoint.includes(ep)
    );
    if (!isAuthEndpoint) {
      return Promise.reject(new axios.Cancel("Redirecting to login"));
    }
  }

  if (config.data && typeof config.data === "object") {
    // Convert object keys từ snake_case → camelCase trước khi gửi
    config.data = transformSnakeToCamelCase(config.data);
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    // Nếu request bị cancel do đang redirect, không xử lý gì thêm
    if (axios.isCancel(err)) {
      return Promise.reject(err);
    }

    const original = err.config;
    const endpoint = original?.url || "";

    // Nếu là auth endpoint (login, register) → không retry, trả về lỗi ngay
    const isAuthEndpoint = NO_RETRY_ENDPOINTS.some((ep) =>
      endpoint.includes(ep)
    );

    if (isAuthEndpoint) {
      return Promise.reject(err);
    }

    // Nếu đang redirect về login, không retry
    if (isRedirectingToLogin) {
      return Promise.reject(err);
    }

    // Chỉ retry các endpoint khác khi 401
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        // Get userId from localStorage
        const userId = localStorage.getItem("userId");

        await api.post("/auth/refreshToken", {
          userId,
        });
        return api(original);
      } catch (refreshError) {
        // Token refresh thất bại → clear frontend auth state
        console.log("🚨 REFRESH TOKEN FAILED - clearing frontend auth state");

        // Set flag để ngăn các request khác
        isRedirectingToLogin = true;

        // Clear localStorage persist
        localStorage.removeItem("persist:root");
        localStorage.removeItem("userId");

        // Redirect về login page thay vì reload để tránh vòng lặp vô hạn
        const currentPath = window.location.pathname;
        if (currentPath !== "/login" && currentPath !== "/register") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
