import api from "@/lib/axios";

import type { User } from "@/interfaces/user";
import type { LoginDto, RegisterDto } from "@/interfaces/auth.interface";

const AUTH_URL = "/auth";

const register = (data: RegisterDto) => {
  return api.post<User>(`${AUTH_URL}/register`, data);
};

const login = (data: LoginDto) => {
  return api.post<User>(`${AUTH_URL}/login`, data);
};

const fetchUser = () => {
  return api.get<User>(`/user/profile`);
};

const logout = () => {
  return api.post<any>(`${AUTH_URL}/logout`);
};

const logoutAllDevices = () => {
  return api.post<any>(`${AUTH_URL}/logoutallDevices`);
};

export const authService = {
  register,
  login,
  fetchUser,
  logout,
  logoutAllDevices,
};
