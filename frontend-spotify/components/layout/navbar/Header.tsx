"use client";

import { Space, Avatar, Dropdown, Button, MenuProps } from "antd";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { logout } from "@/store/slices/auth";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { memo } from "react";

interface HeaderProps {
  opacity?: number;
}

const Header = memo(({ opacity = 1 }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation(["navbar"]);
  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.profile.profile);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      console.log("✅ Logout completed, waiting for localStorage clear...");

      // Đợi localStorage clear
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      router.push("/login");
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: t("Profile"),
      icon: <UserOutlined />,
      onClick: () => router.push("/user/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: t("Logout"),
      icon: <LogoutOutlined />,
      onClick: () => {
        handleLogout();
      },
      danger: true,
    },
  ];

  if (!user) {
    return (
      <Button type="primary" onClick={() => router.push("/login")} size="large">
        {t("Login")}
      </Button>
    );
  }

  return (
    <Space style={{ opacity }}>
      <Button
        type="text"
        size="large"
        icon={<SettingOutlined />}
        onClick={() => router.push("/settings")}
        style={{ color: "#ffffff" }}
      />

      <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
        <Avatar
          size="large"
          src={profile?.avatar_url || user?.images?.[0]?.url}
          alt={user?.display_name}
          style={{ cursor: "pointer" }}
          icon={<UserOutlined />}
        >
          {user?.display_name?.[0]?.toUpperCase()}
        </Avatar>
      </Dropdown>
    </Space>
  );
});

Header.displayName = "Header";
export default Header;
