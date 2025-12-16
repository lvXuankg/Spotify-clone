"use client";

import { useState, useRef } from "react";
import { Modal, Button, Upload, Space, Spin, Progress, Card, App } from "antd";
import {
  CameraOutlined,
  DeleteOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useUploadFile } from "@/hooks/useUploadFile";
import { FolderType, ResourceType } from "@/interfaces/file";
import type { UploadFile } from "antd";

interface AvatarUploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (avatarUrl: string) => void;
  currentAvatarUrl?: string;
}

export default function AvatarUploadModal({
  open,
  onClose,
  onSuccess,
  currentAvatarUrl,
}: AvatarUploadModalProps) {
  const { message } = App.useApp();
  const { upload, loading, error } = useUploadFile();
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (file: File) => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      message.error("Vui lòng chọn hình ảnh");
      return false;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error("Kích thước ảnh tối đa 5MB");
      return false;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    return false;
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) {
      message.warning("Vui lòng chọn hình ảnh");
      return;
    }

    setUploading(true);
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 30;
        });
      }, 500);

      const result = await upload(selectedFile, {
        folder: FolderType.AVATARS,
        resourceType: ResourceType.IMAGE,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result) {
        message.success("Avatar cập nhật thành công!");
        onSuccess?.(result.secureUrl);

        // Reset state after 1s
        setTimeout(() => {
          handleClose();
        }, 1000);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setPreview(null);
    setSelectedFile(null);
    setUploadProgress(0);
    setUploading(false);
    onClose();
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
          <CameraOutlined style={{ marginRight: "8px" }} />
          Cập nhật Avatar
        </div>
      }
      open={open}
      onCancel={handleClose}
      width={500}
      footer={null}
      centered
      styles={{
        body: {
          backgroundColor: "#282828",
          borderRadius: "8px",
          padding: "24px",
        },
        header: {
          backgroundColor: "#282828",
          borderBottomColor: "#404040",
          padding: "16px 24px",
        },
      }}
    >
      <Spin spinning={uploading} tip="Đang upload...">
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Current Avatar */}
          {currentAvatarUrl && !preview && (
            <div>
              <p
                style={{
                  color: "#fff",
                  marginBottom: "10px",
                  fontSize: "12px",
                }}
              >
                Avatar hiện tại:
              </p>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "200px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#404040",
                }}
              >
                <img
                  src={currentAvatarUrl || ""}
                  alt="Current avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div>
              <p
                style={{
                  color: "#fff",
                  marginBottom: "10px",
                  fontSize: "12px",
                }}
              >
                Xem trước:
              </p>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "200px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#404040",
                  border: "2px solid #1db954",
                }}
              >
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          )}

          {/* Upload Area */}
          {!preview && (
            <Upload.Dragger
              maxCount={1}
              beforeUpload={handleFileSelect}
              accept="image/*"
              style={{
                backgroundColor: "#404040",
                border: "2px dashed #535353",
                borderRadius: "8px",
              }}
            >
              <div style={{ padding: "20px", textAlign: "center" }}>
                <CameraOutlined
                  style={{
                    fontSize: "48px",
                    color: "#1db954",
                    marginBottom: "16px",
                  }}
                />
                <p style={{ color: "#fff", fontSize: "14px", margin: "8px 0" }}>
                  Kéo ảnh vào đây hoặc click để chọn
                </p>
                <p style={{ color: "#b3b3b3", fontSize: "12px", margin: "0" }}>
                  Chấp nhận JPG, PNG. Kích thước tối đa 5MB
                </p>
              </div>
            </Upload.Dragger>
          )}

          {/* Progress Bar */}
          {uploading && uploadProgress > 0 && (
            <div>
              <Progress
                percent={Math.round(uploadProgress)}
                strokeColor="#1db954"
                status={uploading ? "active" : "success"}
              />
            </div>
          )}

          {/* File Info */}
          {selectedFile && !uploading && (
            <Card
              style={{
                backgroundColor: "#404040",
                border: "1px solid #535353",
                marginBottom: "0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      color: "#fff",
                      margin: "0 0 4px 0",
                      fontWeight: "500",
                    }}
                  >
                    {selectedFile.name}
                  </p>
                  <p
                    style={{ color: "#b3b3b3", margin: "0", fontSize: "12px" }}
                  >
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <CheckOutlined style={{ fontSize: "20px", color: "#1db954" }} />
              </div>
            </Card>
          )}

          {/* Error Message */}
          {error && (
            <div
              style={{
                backgroundColor: "#ff4444",
                color: "#fff",
                padding: "12px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            {preview && (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setPreview(null);
                  setSelectedFile(null);
                }}
                disabled={uploading}
              >
                Hủy chọn
              </Button>
            )}
            <Button onClick={handleClose} disabled={uploading}>
              Đóng
            </Button>
            {preview && (
              <Button
                type="primary"
                style={{ backgroundColor: "#1db954", borderColor: "#1db954" }}
                onClick={handleUpload}
                loading={uploading}
                disabled={!selectedFile}
              >
                Upload Avatar
              </Button>
            )}
          </Space>
        </div>
      </Spin>
    </Modal>
  );
}
