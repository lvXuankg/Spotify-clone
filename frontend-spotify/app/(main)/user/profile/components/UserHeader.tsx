"use client";

import { FC, memo, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { logout } from "@/store/slices/auth";
import { updateProfile } from "@/store/slices/profile";
import { ARTISTS_DEFAULT_IMAGE } from "@/constants/spotify";
import { Button, Space, Card, Tag, Divider, Row, Col } from "antd";
import { useRouter } from "next/navigation";
import AvatarUploadModal from "@/components/AvatarUploadModal";
import {
  CameraOutlined,
  MailOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";

interface UserHeaderProps {
  color: string;
}

const UserHeader: FC<UserHeaderProps> = memo((props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.profile?.profile);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [hoveredAvatar, setHoveredAvatar] = useState(false);

  const handleAvatarUploadSuccess = async (avatarUrl: string) => {
    try {
      // Chỉ update avatar URL, transform snake_case thành camelCase cho API
      await dispatch(
        updateProfile({
          avatar_url: avatarUrl, // Gửi snake_case (match User interface)
        } as any)
      ).unwrap();
      setShowUploadModal(false);
    } catch (error) {
      console.error("Failed to update avatar:", error);
    }
  };

  return (
    <div className="profile-header">
      {/* Cover Background */}
      <div
        className="profile-header-cover"
        style={{
          backgroundColor: props.color || "#1db954",
          height: "220px",
          backgroundImage: `linear-gradient(135deg, ${
            props.color || "#1db954"
          }ee 0%, ${props.color || "#1db954"}99 100%)`,
        }}
      ></div>

      {/* Main Content Card */}
      <Card
        style={{
          margin: "0 20px",
          marginTop: "-80px",
          backgroundColor: "#1a1a1a",
          borderColor: "#404040",
          borderRadius: "12px",
          position: "relative",
          zIndex: 10,
        }}
        variant="outlined"
      >
        <Row gutter={[32, 24]}>
          {/* Avatar Section */}
          <Col xs={24} sm={8} md={6} style={{ textAlign: "center" }}>
            <div
              className="profile-img"
              style={{
                position: "relative",
                width: "180px",
                height: "180px",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: hoveredAvatar
                  ? "4px solid #1db954"
                  : "3px solid #404040",
                boxShadow: hoveredAvatar
                  ? "0 8px 24px rgba(29, 185, 84, 0.3)"
                  : "0 4px 12px rgba(0, 0, 0, 0.4)",
                margin: "0 auto",
              }}
              onMouseEnter={() => setHoveredAvatar(true)}
              onMouseLeave={() => setHoveredAvatar(false)}
              onClick={() => setShowUploadModal(true)}
            >
              <img
                src={user?.avatar_url || ARTISTS_DEFAULT_IMAGE}
                alt={user?.name || user?.username}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />

              {/* Hover Overlay */}
              {hoveredAvatar && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <CameraOutlined
                      style={{
                        fontSize: "40px",
                        color: "#1db954",
                        marginBottom: "8px",
                        display: "block",
                      }}
                    />
                    <p
                      style={{
                        color: "#fff",
                        margin: "0",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      Cập nhật Avatar
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Col>

          {/* User Info Section */}
          <Col xs={24} sm={16} md={18}>
            <div style={{ paddingTop: "8px" }}>
              {/* Role Tag */}
              <div style={{ marginBottom: "12px" }}>
                <Tag
                  color={
                    user?.role === "ADMIN"
                      ? "volcano"
                      : user?.role === "ARTIST"
                      ? "green"
                      : "blue"
                  }
                  style={{
                    fontSize: "12px",
                    padding: "4px 12px",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}
                >
                  {user?.role}
                </Tag>
              </div>

              {/* Username */}
              <h1
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "42px",
                  fontWeight: "700",
                  color: "#ffffff",
                  lineHeight: "1.2",
                }}
              >
                {user?.name || user?.username}
              </h1>

              {/* Username (nhỏ) - nếu có name thì hiển thị username */}
              {user?.name && (
                <p
                  style={{
                    fontSize: "13px",
                    color: "#b3b3b3",
                    margin: "0 0 16px 0",
                    fontWeight: "500",
                  }}
                >
                  @{user?.username}
                </p>
              )}

              {/* Bio */}
              {user?.bio && (
                <p
                  style={{
                    fontSize: "15px",
                    color: "#b3b3b3",
                    margin: "0 0 16px 0",
                    lineHeight: "1.6",
                    maxWidth: "600px",
                  }}
                >
                  {user.bio}
                </p>
              )}

              <Divider style={{ borderColor: "#404040", margin: "16px 0" }} />

              {/* User Details */}
              <Row gutter={[24, 12]}>
                <Col xs={24} sm={12} md={8}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <MailOutlined
                      style={{ color: "#1db954", fontSize: "16px" }}
                    />
                    <span style={{ color: "#b3b3b3", fontSize: "13px" }}>
                      {user?.email}
                    </span>
                  </div>
                </Col>

                {user?.country && (
                  <Col xs={24} sm={12} md={8}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <EnvironmentOutlined
                        style={{ color: "#1db954", fontSize: "16px" }}
                      />
                      <span style={{ color: "#b3b3b3", fontSize: "13px" }}>
                        {user.country}
                      </span>
                    </div>
                  </Col>
                )}

                <Col xs={24} sm={12} md={8}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <UserOutlined
                      style={{ color: "#1db954", fontSize: "16px" }}
                    />
                    <span style={{ color: "#b3b3b3", fontSize: "13px" }}>
                      Member since{" "}
                      {new Date(user?.created_at || "").toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                  </div>
                </Col>
              </Row>

              <Divider style={{ borderColor: "#404040", margin: "16px 0" }} />

              {/* Action Buttons */}
              <Space style={{ marginTop: "20px" }}>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => router.push("/user/profile/edit")}
                  style={{
                    backgroundColor: "#1db954",
                    borderColor: "#1db954",
                    fontWeight: "600",
                    height: "40px",
                    paddingInline: "24px",
                  }}
                >
                  Edit Profile
                </Button>
                <Button
                  danger
                  size="large"
                  onClick={async () => {
                    try {
                      await dispatch(logout()).unwrap();
                      console.log(
                        "✅ Logout completed, waiting for localStorage clear..."
                      );
                      await new Promise((resolve) => setTimeout(resolve, 100));
                    } catch (error) {
                      console.error("Logout error:", error);
                    } finally {
                      router.push("/login");
                    }
                  }}
                  style={{
                    fontWeight: "600",
                    height: "40px",
                    paddingInline: "24px",
                  }}
                >
                  Logout
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Avatar Upload Modal */}
      <AvatarUploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleAvatarUploadSuccess}
        currentAvatarUrl={user?.avatar_url}
      />
    </div>
  );
});

UserHeader.displayName = "UserHeader";
export default UserHeader;
