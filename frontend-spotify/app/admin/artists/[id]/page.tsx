"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  Row,
  Col,
  Image,
  Button,
  Space,
  Divider,
  Tag,
  Empty,
  Spin,
  Descriptions,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  CopyOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchArtistById } from "@/store/slices/artist";
import { AlbumsSection } from "../components/AlbumsSection";
import { toast } from "sonner";

export default function ArtistDetailPage() {
  const router = useRouter();
  const params = useParams();
  const artistId = params.id as string;
  const dispatch = useAppDispatch();

  const { currentArtist, loading, error } = useAppSelector(
    (state) => state.artist
  );

  useEffect(() => {
    if (artistId) {
      dispatch(fetchArtistById(artistId));
    }
  }, [artistId, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error("Lỗi", error);
    }
  }, [error]);

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} đã được sao chép!`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <Spin size="large" fullscreen tip="Đang tải thông tin nghệ sĩ..." />;
  }

  if (!currentArtist) {
    return (
      <Card style={{ marginBottom: "24px" }}>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          style={{ marginBottom: "16px" }}
        >
          Quay lại
        </Button>
        <Empty description="Không tìm thấy thông tin nghệ sĩ" />
      </Card>
    );
  }

  return (
    <div style={{ padding: "24px 0" }}>
      {/* Header với nút quay lại */}
      <div style={{ marginBottom: "24px" }}>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
        >
          Quay lại
        </Button>
      </div>

      {/* Main Card */}
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          overflow: "hidden",
        }}
      >
        {/* Cover Image Background */}
        {currentArtist.cover_image_url && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "300px",
              backgroundImage: `url(${currentArtist.cover_image_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              marginBottom: "-80px",
              zIndex: 1,
            }}
          >
            {/* Overlay gradient */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)",
              }}
            />
          </div>
        )}

        <Row gutter={[32, 32]} style={{ position: "relative", zIndex: 2 }}>
          {/* Phía bên trái - Avatar */}
          <Col xs={24} md={8}>
            <div style={{ textAlign: "center" }}>
              {/* Avatar */}
              <Image
                src={currentArtist.avatar_url}
                alt={currentArtist.display_name}
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "12px",
                  objectFit: "cover",
                  border: "6px solid #fff",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                  marginBottom: "24px",
                }}
                preview={{
                  mask: "Xem",
                }}
              />

              {/* Name */}
              <h1
                style={{
                  margin: "12px 0 8px 0",
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {currentArtist.display_name}
              </h1>

              {/* Bio */}
              {currentArtist.bio && (
                <p
                  style={{
                    color: "#ccc",
                    fontSize: "14px",
                    marginBottom: "24px",
                    lineHeight: 1.6,
                  }}
                >
                  {currentArtist.bio}
                </p>
              )}

              {/* Action Buttons */}
              <Space style={{ marginTop: "24px" }} wrap>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => router.push(`/admin/artists?edit=${artistId}`)}
                  size="large"
                >
                  Chỉnh sửa
                </Button>
              </Space>
            </div>
          </Col>

          {/* Phía bên phải - Thông tin chi tiết */}
          <Col xs={24} md={16}>
            {/* IDs Section */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ marginBottom: "12px", fontWeight: 600 }}>
                🔑 Mã định danh
              </h3>
              <Space
                orientation="vertical"
                style={{ width: "100%" }}
                size="middle"
              >
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "6px",
                    border: "1px solid #e0e0e0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      Artist ID
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        fontFamily: "monospace",
                        marginTop: "4px",
                        wordBreak: "break-all",
                        color: "#000",
                      }}
                    >
                      {currentArtist.id}
                    </div>
                  </div>
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={() =>
                      handleCopyToClipboard(currentArtist.id, "Artist ID")
                    }
                  />
                </div>

                {currentArtist.user_id && (
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "6px",
                      border: "1px solid #e0e0e0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "12px", color: "#999" }}>
                        User ID
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          fontFamily: "monospace",
                          marginTop: "4px",
                          wordBreak: "break-all",
                          color: "#000",
                        }}
                      >
                        {currentArtist.user_id}
                      </div>
                    </div>
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={() =>
                        handleCopyToClipboard(currentArtist.user_id, "User ID")
                      }
                    />
                  </div>
                )}
              </Space>
            </div>

            <Divider />

            {/* Bio Section */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ marginBottom: "12px", fontWeight: 600 }}>
                📝 Tiểu sử
              </h3>
              {currentArtist.bio ? (
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "#fafafa",
                    borderRadius: "6px",
                    borderLeft: "4px solid #667eea",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    lineHeight: "1.6",
                    color: "#333",
                  }}
                >
                  {currentArtist.bio}
                </div>
              ) : (
                <Empty description="Chưa có tiểu sử" />
              )}
            </div>

            <Divider />

            {/* Metadata Section */}
            <div>
              <h3 style={{ marginBottom: "12px", fontWeight: 600 }}>
                📋 Thông tin khác
              </h3>
              <Descriptions
                column={1}
                items={[
                  {
                    label: (
                      <span>
                        <CalendarOutlined style={{ marginRight: "8px" }} />
                        Ngày tạo
                      </span>
                    ),
                    children: formatDate(currentArtist.created_at),
                  },
                  {
                    label: (
                      <span>
                        <CalendarOutlined style={{ marginRight: "8px" }} />
                        Ngày cập nhật
                      </span>
                    ),
                    children: formatDate(currentArtist.updated_at),
                  },
                ]}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Albums Section */}
      <AlbumsSection artistId={artistId} />
    </div>
  );
}
