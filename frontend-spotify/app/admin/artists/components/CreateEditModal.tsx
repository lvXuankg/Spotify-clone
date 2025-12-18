"use client";

import {
  Modal,
  Form,
  Input,
  FormInstance,
  Upload,
  Button,
  Spin,
  Avatar,
  Space,
  message,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import type { RcFile } from "antd/es/upload";
import type {
  CreateArtistDto,
  UpdateArtistDto,
  Artist,
} from "@/interfaces/artist";
import { useUploadFile } from "@/hooks/useUploadFile";
import { useDeleteFile } from "@/hooks/useDeleteFile";
import { FolderType, ResourceType } from "@/interfaces/file";
import { DEFAULT_URLS } from "@/constants/defaultUrls";

// Extract publicId từ Cloudinary URL
// URL format: https://res.cloudinary.com/[cloud_name]/image/upload/[version]/[folder]/[publicId].[ext]
// Chỉ lấy phần [folder]/[publicId] (sau version, trước extension)
const extractPublicIdFromUrl = (url: string): string => {
  try {
    // Match: /upload/v[timestamp]/(.+?)\.[a-z]+$
    // Lấy phần sau /v[timestamp]/ cho tới .ext
    const match = url.match(/\/upload\/v?\d+\/(.+?)\.[a-z]+$/i);
    return match ? match[1] : "";
  } catch (error) {
    return "";
  }
};

interface CreateEditModalProps {
  isOpen: boolean;
  isLoading: boolean;
  isEdit: boolean;
  editingArtist?: Artist | null;
  form: FormInstance;
  onSubmit: (values: CreateArtistDto | UpdateArtistDto) => void;
  onCancel: () => void;
}

export function CreateEditModal({
  isOpen,
  isLoading,
  isEdit,
  editingArtist,
  form,
  onSubmit,
  onCancel,
}: CreateEditModalProps) {
  const { upload, loading: uploading } = useUploadFile();
  const { deleteFile } = useDeleteFile();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    editingArtist?.avatar_url || null
  );
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    editingArtist?.cover_image_url || null
  );
  const [oldAvatarUrl, setOldAvatarUrl] = useState<string | null>(
    editingArtist?.avatar_url || null
  );
  const [oldCoverImageUrl, setOldCoverImageUrl] = useState<string | null>(
    editingArtist?.cover_image_url || null
  );
  const [pendingDeleteAvatarUrl, setPendingDeleteAvatarUrl] = useState<
    string | null
  >(null);
  const [pendingDeleteCoverUrl, setPendingDeleteCoverUrl] = useState<
    string | null
  >(null);

  const isLoading_ = isLoading || uploading;

  const handleDeleteFile = (fileUrl: string, fileType: "avatar" | "cover") => {
    // Chỉ đánh dấu xóa, không xóa ngay
    if (fileType === "avatar") {
      setPendingDeleteAvatarUrl(fileUrl);
      setAvatarUrl(null);
    } else {
      setPendingDeleteCoverUrl(fileUrl);
      setCoverImageUrl(null);
    }
  };

  const handleDeleteFileFromCloudinary = async (fileUrl: string) => {
    const publicId = extractPublicIdFromUrl(fileUrl);
    if (publicId) {
      await deleteFile(publicId);
    }
  };

  const handleAvatarUpload = async (file: RcFile) => {
    try {
      const result = await upload(file, {
        folder: FolderType.AVATARS,
        resourceType: ResourceType.IMAGE,
      });

      if (result) {
        setAvatarUrl(result.url);
        form.setFieldValue("avatar_url", result.url);
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
    }
    return false;
  };

  const handleCoverUpload = async (file: RcFile) => {
    try {
      const result = await upload(file, {
        folder: FolderType.COVERS,
        resourceType: ResourceType.IMAGE,
      });

      if (result) {
        setCoverImageUrl(result.url);
        form.setFieldValue("cover_image_url", result.url);
      }
    } catch (error) {
      console.error("Cover upload error:", error);
    }
    return false;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const submitData = {
        ...values,
        avatar_url: avatarUrl || DEFAULT_URLS.AVATAR,
        cover_image_url: coverImageUrl || DEFAULT_URLS.COVER,
      };
      onSubmit(submitData);

      // ✅ Chỉ xóa files thực sự khi save thành công
      if (pendingDeleteAvatarUrl) {
        try {
          await handleDeleteFileFromCloudinary(pendingDeleteAvatarUrl);
        } catch (deleteError) {
          console.error("Error deleting old avatar:", deleteError);
        }
      }
      if (pendingDeleteCoverUrl) {
        try {
          await handleDeleteFileFromCloudinary(pendingDeleteCoverUrl);
        } catch (deleteError) {
          console.error("Error deleting old cover:", deleteError);
        }
      }

      setPendingDeleteAvatarUrl(null);
      setPendingDeleteCoverUrl(null);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleClose = () => {
    form.resetFields();
    // ✅ Khôi phục URLs cũ khi hủy
    setAvatarUrl(oldAvatarUrl);
    setCoverImageUrl(oldCoverImageUrl);
    setPendingDeleteAvatarUrl(null);
    setPendingDeleteCoverUrl(null);
    onCancel();
  };

  // Khi modal mở hoặc editingArtist thay đổi, set form fields
  useEffect(() => {
    console.log("🔍 CreateEditModal useEffect triggered:", {
      isOpen,
      isEdit,
      editingArtist,
    });

    if (!isOpen) return;

    if (isEdit && editingArtist) {
      console.log("✏️ Setting form fields for edit, artist:", editingArtist);
      // Use setTimeout để đảm bảo DOM đã ready
      const timer = setTimeout(() => {
        console.log("⏰ setTimeout fired, setting form values");
        form.setFieldsValue({
          display_name:
            editingArtist.displayName || editingArtist.display_name || "",
          bio: editingArtist.bio || "",
        });
        const avatarUrl =
          editingArtist.avatarUrl || editingArtist.avatar_url || null;
        const coverUrl =
          editingArtist.coverImageUrl || editingArtist.cover_image_url || null;
        setAvatarUrl(avatarUrl);
        setOldAvatarUrl(avatarUrl);
        setCoverImageUrl(coverUrl);
        setOldCoverImageUrl(coverUrl);
        setPendingDeleteAvatarUrl(null);
        setPendingDeleteCoverUrl(null);
        console.log("✅ Form values set successfully");
      }, 0);
      return () => clearTimeout(timer);
    } else if (!isEdit) {
      console.log("🆕 Resetting form for create");
      form.resetFields();
      setAvatarUrl(null);
      setCoverImageUrl(null);
      setOldAvatarUrl(null);
      setOldCoverImageUrl(null);
      setPendingDeleteAvatarUrl(null);
      setPendingDeleteCoverUrl(null);
    }
  }, [isOpen, isEdit, editingArtist, form]);

  return (
    <Modal
      title={
        <span style={{ fontSize: "18px", fontWeight: 600 }}>
          {isEdit ? "🎤 Chỉnh Sửa Nghệ Sĩ" : "➕ Thêm Nghệ Sĩ Mới"}
        </span>
      }
      open={isOpen}
      onCancel={handleClose}
      width={700}
      footer={[
        <Button key="cancel" onClick={handleClose} disabled={isLoading_}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading_}
          onClick={handleSubmit}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          {isEdit ? "Cập Nhật" : "Tạo"}
        </Button>,
      ]}
    >
      <Spin spinning={isLoading_}>
        <Form form={form} layout="vertical" style={{ marginTop: "16px" }}>
          {/* Display Name */}
          <Form.Item
            label="🎤 Tên Hiển Thị"
            name="display_name"
            rules={[
              { required: true, message: "Tên hiển thị không được trống!" },
              { min: 2, message: "Tên phải ít nhất 2 ký tự!" },
              { max: 100, message: "Tên không được quá 100 ký tự!" },
            ]}
          >
            <Input
              placeholder="VD: Sơn Tùng M-TP"
              size="large"
              disabled={isLoading_}
            />
          </Form.Item>

          {/* Bio */}
          <Form.Item
            label="📝 Tiểu Sử"
            name="bio"
            rules={[{ max: 500, message: "Tiểu sử không được quá 500 ký tự!" }]}
          >
            <Input.TextArea
              placeholder="Mô tả về nghệ sĩ..."
              rows={4}
              disabled={isLoading_}
              maxLength={500}
              showCount
            />
          </Form.Item>

          {/* Avatar Upload */}
          <Form.Item label="🖼️ Ảnh Đại Diện" name="avatar_url">
            <div>
              <Space orientation="vertical" style={{ width: "100%" }}>
                {avatarUrl && (
                  <div style={{ position: "relative", width: "fit-content" }}>
                    <Avatar
                      size={120}
                      src={avatarUrl}
                      style={{ border: "2px solid #667eea" }}
                    />
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={async () => {
                        handleDeleteFile(avatarUrl, "avatar");
                        form.setFieldValue("avatar_url", null);
                      }}
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "white",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                )}
                <Upload
                  beforeUpload={handleAvatarUpload}
                  accept="image/*"
                  maxCount={1}
                  disabled={uploading}
                  showUploadList={false}
                >
                  <Button
                    icon={<UploadOutlined />}
                    loading={uploading}
                    disabled={uploading}
                  >
                    Tải Lên Ảnh Đại Diện
                  </Button>
                </Upload>
              </Space>
            </div>
          </Form.Item>

          {/* Cover Image Upload */}
          <Form.Item label="🎨 Ảnh Bìa" name="cover_image_url">
            <div>
              <Space orientation="vertical" style={{ width: "100%" }}>
                {coverImageUrl && (
                  <div style={{ position: "relative", width: "fit-content" }}>
                    <img
                      src={coverImageUrl}
                      alt="Cover"
                      style={{
                        width: "200px",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "2px solid #667eea",
                      }}
                    />
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={async () => {
                        handleDeleteFile(coverImageUrl, "cover");
                        form.setFieldValue("cover_image_url", null);
                      }}
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "white",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                )}
                <Upload
                  beforeUpload={handleCoverUpload}
                  accept="image/*"
                  maxCount={1}
                  disabled={uploading}
                  showUploadList={false}
                >
                  <Button
                    icon={<UploadOutlined />}
                    loading={uploading}
                    disabled={uploading}
                  >
                    Tải Lên Ảnh Bìa
                  </Button>
                </Upload>
              </Space>
            </div>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
