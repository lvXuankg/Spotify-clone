export type UserRole = "MEMBER" | "ARTIST" | "ADMIN";

export interface User {
  id: string;
  username: string;
  email: string;

  role: UserRole;

  bio?: string;
  avatar_url?: string;
  facebook_url?: string;
  zalo_phone?: string;
  description?: string;
  country?: string; // ISO 3166-1 alpha-2 country code (VN, US, etc.)

  created_at: string;
  updated_at: string;
}
