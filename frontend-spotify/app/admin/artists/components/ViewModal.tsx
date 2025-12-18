"use client";

import {
  Modal,
  Avatar,
  Row,
  Col,
  Divider,
  Space,
  Tag,
  Empty,
  Button,
  Tooltip,
  Spin,
} from "antd";
import {
  CopyOutlined,
  CalendarOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { Artist } from "@/interfaces/artist";
import { useState } from "react";
import { useAppSelector } from "@/store/store";

interface ViewModalProps {
  isOpen: boolean;
  onCancel: () => void;
}

export function ViewModal({ isOpen, onCancel }: ViewModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { currentArtist, loading } = useAppSelector((state) => state.artist);

  if (!currentArtist) return null;

  const artist = currentArtist;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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

  return (
    <Modal
      title={
        <span style={{ fontSize: "18px", fontWeight: 600 }}>
          🎤 Chi Tiết Nghệ Sĩ
        </span>
      }
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      width={700}
      centered
    >
      <Spin spinning={loading} tip="Đang tải...">
        <div style={{ marginTop: "16px" }}>
          <Space orientation="vertical" style={{ width: "100%" }} size="large">
            {/* Avatar và Basic Info */}
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={6}>
                <div style={{ textAlign: "center" }}>
                  <Avatar
                    size={120}
                    src={artist.avatar_url}
                    icon={<UserOutlined />}
                    style={{ border: "3px solid #667eea" }}
                  />
                </div>
              </Col>
              <Col xs={24} sm={18}>
                <div>
                  <h2
                    style={{
                      margin: "0 0 12px 0",
                      fontSize: "24px",
                      fontWeight: 700,
                    }}
                  >
                    {artist.display_name}
                  </h2>
                  <Space orientation="vertical" size="small">
                    <div>
                      <Tag color="blue">ID: {artist.id.substring(0, 8)}...</Tag>
                    </div>
                    {artist.user_id && (
                      <div>
                        <Tag color="cyan">
                          User: {artist.user_id.substring(0, 8)}...
                        </Tag>
                      </div>
                    )}
                    <div style={{ color: "#666", fontSize: "14px" }}>
                      <CalendarOutlined style={{ marginRight: "8px" }} />
                      Tạo: {formatDate(artist.created_at)}
                    </div>
                    <div style={{ color: "#666", fontSize: "14px" }}>
                      <CalendarOutlined style={{ marginRight: "8px" }} />
                      Cập nhật: {formatDate(artist.updated_at)}
                    </div>
                  </Space>
                </div>
              </Col>
            </Row>

            <Divider style={{ margin: "12px 0" }} />

            {/* Cover Image */}
            {artist.cover_image_url && (
              <div>
                <h4 style={{ marginBottom: "12px", fontWeight: 600 }}>
                  🎨 Ảnh Bìa
                </h4>
                <img
                  src={artist.cover_image_url}
                  alt="Cover"
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #f0f0f0",
                  }}
                />
              </div>
            )}

            {/* Bio */}
            <div>
              <h4 style={{ marginBottom: "8px", fontWeight: 600 }}>
                <FileTextOutlined style={{ marginRight: "8px" }} />
                Tiểu Sử
              </h4>
              {artist.bio ? (
                <div
                  style={{
                    background: "#fafafa",
                    padding: "12px",
                    borderRadius: "6px",
                    borderLeft: "4px solid #667eea",
                    color: "#333",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: "14px",
                  }}
                >
                  {artist.bio}
                </div>
              ) : (
                <Empty
                  description="Chưa có tiểu sử"
                  style={{ marginTop: "16px" }}
                />
              )}
            </div>

            {/* Metadata */}
            <div>
              <h4 style={{ marginBottom: "12px", fontWeight: 600 }}>
                📋 Thông Tin Chi Tiết
              </h4>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <div
                    style={{
                      background: "#f5f5f5",
                      padding: "12px",
                      borderRadius: "6px",
                    }}
                  >
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      Artist ID
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        marginTop: "4px",
                        fontFamily: "monospace",
                        wordBreak: "break-all",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{artist.id}</span>
                      <Tooltip title={copiedId === "id" ? "Đã sao chép!" : ""}>
                        <Button
                          type="text"
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(artist.id, "id")}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div
                    style={{
                      background: "#f5f5f5",
                      padding: "12px",
                      borderRadius: "6px",
                    }}
                  >
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      User ID
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        marginTop: "4px",
                        fontFamily: "monospace",
                        wordBreak: "break-all",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{artist.user_id || "N/A"}</span>
                      {artist.user_id && (
                        <Tooltip
                          title={copiedId === "user_id" ? "Đã sao chép!" : ""}
                        >
                          <Button
                            type="text"
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() =>
                              copyToClipboard(artist.user_id, "user_id")
                            }
                          />
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Space>
        </div>
      </Spin>
    </Modal>
  );
}
