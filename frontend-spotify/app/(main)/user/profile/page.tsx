"use client";

import { memo, useRef } from "react";
import { useAppSelector } from "@/store/store";
import { Row, Col, Avatar, Card, Space, Button, Divider, Empty } from "antd";
import PageHeader from "@/components/layout/PageHeader";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const ProfilePage = memo(() => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Empty description="Not logged in" />;
  }

  return (
    <div ref={containerRef} style={{ height: "100%", overflowY: "auto" }}>
      <PageHeader
        color="linear-gradient(135deg, #1db954 0%, #121212 100%)"
        container={containerRef}
        sectionContainer={sectionRef}
      >
        <Row gutter={[30, 30]} align="middle" justify="center">
          <Col xs={24} sm={8}>
            <Avatar
              size={200}
              src={user.images?.[0]?.url}
              icon={<UserOutlined />}
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          </Col>
          <Col xs={24} sm={16}>
            <div>
              <span style={{ color: "#b3b3b3" }}>PROFILE</span>
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "#ffffff",
                  margin: "16px 0",
                }}
              >
                {user.display_name}
              </h1>
              <p style={{ color: "#b3b3b3", margin: 0 }}>
                {user.followers?.total?.toLocaleString()} followers
              </p>
              <Space style={{ marginTop: "16px" }}>
                <Button
                  type="primary"
                  onClick={() => router.push("/user/edit")}
                >
                  Edit Profile
                </Button>
                <Button danger onClick={() => router.push("/login")}>
                  Logout
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </PageHeader>

      <div ref={sectionRef} style={{ padding: "30px" }}>
        <Card style={{ backgroundColor: "#282828", border: "none" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <strong style={{ color: "#ffffff" }}>Email:</strong>
              <p style={{ color: "#b3b3b3" }}>{user.email}</p>
            </Col>
            <Col xs={24} sm={12}>
              <strong style={{ color: "#ffffff" }}>Country:</strong>
              <p style={{ color: "#b3b3b3" }}>{user.country}</p>
            </Col>
            <Col xs={24} sm={12}>
              <strong style={{ color: "#ffffff" }}>Account Type:</strong>
              <p style={{ color: "#b3b3b3" }}>{user.product}</p>
            </Col>
            <Col xs={24} sm={12}>
              <strong style={{ color: "#ffffff" }}>Member Since:</strong>
              <p style={{ color: "#b3b3b3" }}>
                {new Date(user.uri).toLocaleDateString()}
              </p>
            </Col>
          </Row>
        </Card>

        <Divider />

        {/* User's Playlists */}
        <h2
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}
        >
          Your Playlists
        </h2>
        <Empty description="No playlists" />
      </div>
    </div>
  );
});

ProfilePage.displayName = "ProfilePage";
export default ProfilePage;
