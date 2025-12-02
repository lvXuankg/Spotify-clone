"use client";

import { FC, memo } from "react";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { logout } from "@/store/slices/auth";
import { ARTISTS_DEFAULT_IMAGE } from "@/constants/spotify";
import { Button, Space } from "antd";
import { useRouter } from "next/navigation";

interface UserHeaderProps {
  color: string;
}

const UserHeader: FC<UserHeaderProps> = memo((props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.profile?.profile);

  return (
    <div className="profile-header">
      <div
        className="profile-header-cover"
        style={{
          backgroundColor: props.color,
          height: "180px",
        }}
      ></div>

      <div className="profile-header-background"></div>
      <div
        className="profile-header-content"
        style={{
          padding: "20px",
          color: "#ffffff",
        }}
      >
        {/* Image section */}
        <div className="profile-img-container" style={{ marginBottom: "20px" }}>
          <div
            className="profile-img"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <img
              src={user?.avatar_url || ARTISTS_DEFAULT_IMAGE}
              alt={user?.username}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Text Section */}
        <div className="profile-header-text">
          <span
            style={{
              fontSize: "12px",
              color: "#b3b3b3",
              textTransform: "uppercase",
            }}
          >
            Profile
          </span>

          <h1
            style={{ margin: "12px 0", fontSize: "32px", fontWeight: "bold" }}
          >
            {user?.username}
          </h1>

          <div style={{ color: "#b3b3b3", marginBottom: "16px" }}>
            <span>Role: {user?.role}</span>
          </div>

          {/* Info */}
          <div style={{ marginBottom: "12px", fontSize: "14px" }}>
            <p style={{ margin: "4px 0" }}>
              <strong>Email:</strong> {user?.email}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Country:</strong> {user?.country || "N/A"}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Bio:</strong> {user?.bio || "No bio"}
            </p>
          </div>

          {/* Action Buttons */}
          <Space style={{ marginTop: "16px" }}>
            <Button
              type="primary"
              onClick={() => router.push("/user/profile/edit")}
            >
              Edit Profile
            </Button>
            <Button
              danger
              onClick={async () => {
                try {
                  await dispatch(logout()).unwrap();
                  console.log(
                    "✅ Logout completed, waiting for localStorage clear..."
                  );

                  // Đợi localStorage clear
                  await new Promise((resolve) => setTimeout(resolve, 100));
                } catch (error) {
                  console.error("Logout error:", error);
                } finally {
                  router.push("/login");
                }
              }}
            >
              Logout
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
});

UserHeader.displayName = "UserHeader";
export default UserHeader;
