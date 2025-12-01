"use client";

import { Space, Avatar, Dropdown, Button, MenuProps } from "antd";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { authActions } from "@/store/slices/auth";
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
        // dispatch(authActions.logout())
        router.push("/login");
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
          src={user.images?.[0]?.url}
          alt={user.display_name}
          style={{ cursor: "pointer" }}
          icon={<UserOutlined />}
        >
          {user.display_name?.[0]?.toUpperCase()}
        </Avatar>
      </Dropdown>
    </Space>
  );
});

Header.displayName = "Header";
export default Header;
