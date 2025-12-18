"use client";

import { FC, ReactNode, useMemo } from "react";
import { Layout, Menu, Button, Dropdown, Avatar } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  FlagOutlined,
  LogoutOutlined,
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
      label: <Link href="/admin">Tổng quan</Link>,
    },
    {
      key: "/admin/artists",
      icon: <UserOutlined />,
      label: <Link href="/admin/artists">Nghệ sĩ</Link>,
    },
    {
      key: "/admin/users",
      icon: <TeamOutlined />,
      label: <Link href="/admin/users">Người dùng</Link>,
    },
    {
      key: "/admin/playlists",
      icon: <PlayCircleOutlined />,
      label: <Link href="/admin/playlists">Playlist</Link>,
    },
    {
      key: "/admin/songs",
      icon: <FileTextOutlined />,
      label: <Link href="/admin/songs">Bài hát</Link>,
    },
    {
      key: "/admin/reports",
      icon: <FlagOutlined />,
      label: <Link href="/admin/reports">Tố cáo</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ",
      onClick: () => router.push("/user/profile"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
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
      <Header
        style={{
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            🎵 Spotify Admin
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Dropdown
            menu={{ items: userMenuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: "8px",
                transition: "all 0.3s",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(255, 255, 255, 0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.15)";
              }}
            >
              <Avatar
                size="large"
                src={user?.avatar_url}
                icon={<UserOutlined />}
                style={{ border: "2px solid rgba(255, 255, 255, 0.3)" }}
              />
              <div style={{ textAlign: "left" }}>
                <p
                  style={{
                    margin: 0,
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  {user?.name || user?.username || "Admin"}
                </p>
                <p
                  style={{
                    margin: "2px 0 0 0",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "12px",
                  }}
                >
                  Administrator
                </p>
              </div>
            </button>
          </Dropdown>
        </div>
      </Header>

      <Layout>
        {/* Sidebar */}
        <Sider
          width={250}
          style={{ background: "#001529" }}
          className={styles.sidebar}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            defaultOpenKeys={["/admin"]}
            style={{
              height: "100%",
              borderRight: 0,
              background: "#001529",
            }}
            items={menuItems}
            theme="dark"
          />
        </Sider>

        {/* Main Content */}
        <Content style={{ padding: "24px" }} className={styles.content}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
