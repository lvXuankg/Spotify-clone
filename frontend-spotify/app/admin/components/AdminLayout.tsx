"use client";

import { FC, ReactNode, useMemo } from "react";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  PlayCircleOutlined,
  CustomerServiceOutlined,
  FlagOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { logout } from "@/store/slices/auth";
import styles from "./AdminLayout.module.css";

const { Sider, Content, Header } = Layout;

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.profile?.profile);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: <Link href="/admin">Dashboard</Link>,
    },
    {
      key: "/admin/artists",
      icon: <UserOutlined />,
      label: <Link href="/admin/artists">Artists</Link>,
    },
    {
      key: "/admin/users",
      icon: <TeamOutlined />,
      label: <Link href="/admin/users">Users</Link>,
    },
    {
      key: "/admin/playlists",
      icon: <UnorderedListOutlined />,
      label: <Link href="/admin/playlists">Playlists</Link>,
    },
    {
      key: "/admin/songs",
      icon: <CustomerServiceOutlined />,
      label: <Link href="/admin/songs">Songs</Link>,
    },
    {
      key: "/admin/reports",
      icon: <FlagOutlined />,
      label: <Link href="/admin/reports">Reports</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => router.push("/user/profile"),
    },
    {
      key: "home",
      icon: <PlayCircleOutlined />,
      label: "Back to Spotify",
      onClick: () => router.push("/"),
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
      danger: true,
    },
  ];

  // Xác định selected key từ pathname hiện tại
  const selectedKey = useMemo(() => {
    return pathname || "/admin";
  }, [pathname]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header className={styles.header}>
        <div className={styles.logo}>
          <svg height="28" width="28" viewBox="0 0 24 24" fill="#1db954">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          <h2>Spotify Admin</h2>
        </div>

        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <button className={styles.userBtn}>
            <Avatar
              size={32}
              src={user?.avatar_url}
              icon={<UserOutlined />}
              style={{
                backgroundColor: "#1db954",
                flexShrink: 0,
              }}
            />
            <div className={styles.userTextWrap}>
              <span className={styles.userName}>
                {user?.name || user?.username || "Admin"}
              </span>
              <span className={styles.userRole}>Administrator</span>
            </div>
          </button>
        </Dropdown>
      </Header>

      <Layout>
        {/* Sidebar */}
        <Sider width={240} className={styles.sidebar}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{
              height: "100%",
              borderRight: 0,
              paddingTop: 16,
            }}
            items={menuItems}
          />
        </Sider>

        {/* Main Content */}
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
