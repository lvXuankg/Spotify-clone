import { User } from "@/interfaces/user";
import api from "@/lib/axios";

const USER_URL = "/user";

// Lấy đầy đủ thông tin profile của user
const fetchUser = () => {
  return api.get<User>(`${USER_URL}/profile`);
};

// Cập nhật profile user
const updateProfile = (data: Partial<User>) => {
  return api.patch<User>(`${USER_URL}/profile`, data);
};

export const userService = {
  fetchUser,
  updateProfile,
};
