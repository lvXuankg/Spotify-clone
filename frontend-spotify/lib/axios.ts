import axios from "axios";
import { snakeToCamelCase } from "./camelcase-transformer";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// List các endpoint không được retry token
const NO_RETRY_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"];

// Request interceptor: Convert snake_case to camelCase
api.interceptors.request.use((config) => {
  if (config.data && typeof config.data === "object") {
    config.data = snakeToCamelCase(config.data);
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const endpoint = original.url || "";

    // Nếu là auth endpoint (login, register) → không retry, trả về lỗi ngay
    const isAuthEndpoint = NO_RETRY_ENDPOINTS.some((ep) =>
      endpoint.includes(ep)
    );

    if (isAuthEndpoint) {
      return Promise.reject(err);
    }

    // Chỉ retry các endpoint khác khi 401
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(original);
      } catch (refreshError) {
        // Token refresh thất bại → clear frontend auth state
        console.log("🚨 REFRESH TOKEN FAILED - clearing frontend auth state");

        // Clear localStorage persist
        localStorage.removeItem("persist:root");
        localStorage.removeItem("userId");

        // Reload page để Redux reset
        window.location.reload();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
