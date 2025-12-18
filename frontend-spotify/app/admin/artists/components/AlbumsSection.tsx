"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Empty,
  Spin,
  message,
  Upload,
  Image,
  Avatar,
  App,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  UploadOutlined,
  DeleteOutlined as DeleteIconOutlined,
} from "@ant-design/icons";
import type { RcFile } from "antd/es/upload";
import { Album, CreateAlbumDto, UpdateAlbumDto } from "@/interfaces/albums";
import { AlbumServices } from "@/services/album";
import { useUploadFile } from "@/hooks/useUploadFile";
import { FolderType, ResourceType } from "@/interfaces/file";
import { toast } from "sonner";
import dayjs from "dayjs";

interface AlbumsSectionProps {
  artistId: string;
}

export function AlbumsSection({ artistId }: AlbumsSectionProps) {
  const { modal } = App.useApp();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [total, setTotal] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [form] = Form.useForm();

  // Upload file hook
  const { upload, loading: uploading } = useUploadFile();
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

  // Fetch albums
  const fetchAlbums = async (page: number, limit: number) => {
    try {
      setLoading(true);
      const response = await AlbumServices.getAlbums(artistId, page, limit);
      if (response.data.data) {
        setAlbums(response.data.data);
        if (response.data.pagination) {
          setTotal(response.data.pagination.total);
        }
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
      toast.error("Lỗi khi tải danh sách albums");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums(pagination.page, pagination.limit);
  }, [pagination, artistId]);

  const handleCreate = () => {
    setIsEditMode(false);
    setEditingAlbum(null);
    setCoverImageUrl(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (album: Album) => {
    setIsEditMode(true);
    setEditingAlbum(album);
    const coverUrl = album.coverUrl || album.cover_url;
    setCoverImageUrl(coverUrl || null);
    form.setFieldsValue({
      title: album.title,
      releaseDate:
        album.releaseDate || album.release_date
          ? dayjs(album.releaseDate || album.release_date)
          : null,
      type: album.type,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (albumId: string) => {
    modal.confirm({
      title: "Xóa album",
      content: "Bạn có chắc chắn muốn xóa album này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await AlbumServices.deleteAlbum(albumId);
          toast.success("Xóa album thành công!");
          fetchAlbums(pagination.page, pagination.limit);
        } catch (error) {
          console.error("Error deleting album:", error);
          toast.error("Lỗi khi xóa album");
        }
      },
    });
  };

  const handleCoverUpload = async (file: RcFile) => {
    try {
      const result = await upload(file, {
        folder: FolderType.COVERS,
        resourceType: ResourceType.IMAGE,
      });

      if (result) {
        setCoverImageUrl(result.url);
      }
    } catch (error) {
      console.error("Cover upload error:", error);
      toast.error("Lỗi khi tải lên ảnh bìa");
    }
    return false;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const submitData = {
        title: values.title,
        coverUrl: coverImageUrl || undefined,
        releaseDate: values.releaseDate
          ? values.releaseDate.format("YYYY-MM-DD")
          : undefined,
        type: values.type,
      };

      if (isEditMode && editingAlbum) {
        await AlbumServices.updateAlbum(
          editingAlbum.id,
          submitData as UpdateAlbumDto
        );
        toast.success("Cập nhật album thành công!");
      } else {
        await AlbumServices.createAlbum(artistId, submitData as CreateAlbumDto);
        toast.success("Tạo album thành công!");
      }

      setIsModalOpen(false);
      form.resetFields();
      setCoverImageUrl(null);
      fetchAlbums(pagination.page, pagination.limit);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Lỗi khi lưu album");
    }
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text: string) => text || "-",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        const colors: Record<string, string> = {
          SINGLE: "blue",
          EP: "purple",
          ALBUM: "green",
        };
        return <span style={{ color: colors[type] || "gray" }}>{type}</span>;
      },
    },
    {
      title: "Ngày phát hành",
      dataIndex: "releaseDate",
      key: "releaseDate",
      render: (date: string | undefined) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("vi-VN");
      },
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      render: (_: any, record: Album) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Chỉnh sửa"
          />
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            title="Xóa"
          />
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <span style={{ fontSize: "16px", fontWeight: 600 }}>
          🎵 Albums ({total})
        </span>
      }
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="small"
        >
          Thêm Album
        </Button>
      }
      style={{ marginTop: "24px" }}
    >
      <Spin spinning={loading} indicator={<LoadingOutlined />}>
        {albums.length === 0 && !loading ? (
          <Empty description="Chưa có album nào" />
        ) : (
          <Table
            columns={columns}
            dataSource={albums.map((album, index) => ({
              ...album,
              key: album.id,
            }))}
            pagination={{
              current: pagination.page,
              pageSize: pagination.limit,
              total: total,
              onChange: (page, pageSize) => {
                setPagination({ page, limit: pageSize });
              },
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
            }}
          />
        )}
      </Spin>

      {/* Create/Edit Modal */}
      <Modal
        title={isEditMode ? "🎵 Chỉnh sửa Album" : "🎵 Thêm Album Mới"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setCoverImageUrl(null);
        }}
        onOk={handleSubmit}
        okText={isEditMode ? "Cập nhật" : "Tạo"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" style={{ marginTop: "16px" }}>
          <Form.Item
            label="📝 Tiêu đề"
            name="title"
            rules={[
              { required: true, message: "Tiêu đề không được trống!" },
              { min: 2, message: "Tiêu đề phải ít nhất 2 ký tự!" },
            ]}
          >
            <Input placeholder="VD: Album mới" />
          </Form.Item>

          {/* Cover Image Upload */}
          <Form.Item label="🎨 Ảnh bìa">
            <div>
              <Space orientation="vertical" style={{ width: "100%" }}>
                {coverImageUrl && (
                  <div style={{ position: "relative", width: "fit-content" }}>
                    <img
                      src={coverImageUrl}
                      alt="Album Cover"
                      style={{
                        width: "120px",
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
                      icon={<DeleteIconOutlined />}
                      onClick={() => {
                        setCoverImageUrl(null);
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

          <Form.Item label="📅 Ngày phát hành" name="releaseDate">
            <DatePicker />
          </Form.Item>

          <Form.Item label="🏷️ Loại album" name="type" initialValue="SINGLE">
            <Select
              options={[
                { label: "Single", value: "SINGLE" },
                { label: "EP", value: "EP" },
                { label: "Album", value: "ALBUM" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
