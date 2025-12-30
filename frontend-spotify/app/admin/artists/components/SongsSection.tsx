"use client";

import { useState, useEffect } from "react";
import { parseBlob } from "music-metadata-browser";
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Checkbox,
  Empty,
  Spin,
  message,
  Upload,
  App,
  Popconfirm,
  Tag,
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
import { Song, CreateSongDto, UpdateSongDto } from "@/interfaces/song";
import { SongService } from "@/services/song";
import { useUploadFile } from "@/hooks/useUploadFile";
import { useDeleteFile } from "@/hooks/useDeleteFile";
import { FolderType, ResourceType } from "@/interfaces/file";
import { DEFAULT_URLS } from "@/constants/defaultUrls";
import { toast } from "sonner";

// Extract publicId từ Cloudinary URL
const extractPublicIdFromUrl = (url: string): string => {
  try {
    // Pattern: /upload/v<version>/<publicId>.<extension>
    // Non-greedy match để lấy tất cả sau /upload/v<version>/ trừ extension
    const match = url.match(/\/upload\/v?\d+\/(.+)\.[a-z0-9]+$/i);
    return match ? match[1] : "";
  } catch (error) {
    return "";
  }
};

interface SongsSectionProps {
  albumId: string;
}

export function SongsSection({ albumId }: SongsSectionProps) {
  const { modal } = App.useApp();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [form] = Form.useForm();

  // Upload file hook
  const { upload, loading: uploading } = useUploadFile();
  const { deleteFile } = useDeleteFile();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [oldAudioUrl, setOldAudioUrl] = useState<string | null>(null);
  const [pendingDeleteUrls, setPendingDeleteUrls] = useState<string[]>([]);

  // Fetch songs
  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await SongService.findAllSongs(albumId);
      if (response.data) {
        setSongs(Array.isArray(response.data) ? response.data : []);
        setTotal(Array.isArray(response.data) ? response.data.length : 0);
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
      toast.error("Lỗi khi tải danh sách nhạc");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [albumId]);

  const handleDeleteFileFromCloudinary = async (fileUrl: string) => {
    const publicId = extractPublicIdFromUrl(fileUrl);
    if (publicId) {
      try {
        await deleteFile(publicId);
      } catch (error) {
        console.error("Error deleting file:", error);
        throw error;
      }
    }
  };

  const handleCreate = () => {
    setIsEditMode(false);
    setEditingSong(null);
    setAudioUrl(null);
    setOldAudioUrl(null);
    setPendingDeleteUrls([]);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (song: Song) => {
    setIsEditMode(true);
    setEditingSong(song);
    setAudioUrl(song.audio_url);
    setOldAudioUrl(song.audio_url);
    setPendingDeleteUrls([]);
    form.setFieldsValue({
      title: song.title,
      duration_seconds: song.duration_seconds,
      track_number: song.track_number,
      disc_number: song.disc_number,
      is_explicit: song.is_explicit,
      bitrate: song.bitrate,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (songId: string) => {
    modal.confirm({
      title: "Xóa nhạc",
      content: "Bạn có chắc chắn muốn xóa nhạc này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await SongService.deleteSong(songId);
          toast.success("Xóa nhạc thành công!");
          fetchSongs();
        } catch (error) {
          console.error("Error deleting song:", error);
          toast.error("Lỗi khi xóa nhạc");
        }
      },
    });
  };

  const handleAudioUpload = async (file: RcFile) => {
    try {
      // Lấy metadata từ file audio dùng music-metadata-browser
      try {
        const metadata = await parseBlob(file);
        const duration = metadata.format?.duration;
        if (duration && duration > 0) {
          form.setFieldValue("duration_seconds", Math.round(duration));
        }
      } catch (err) {
        // Không critical nếu không parse được, vẫn upload file
        console.warn("Could not extract audio metadata:", err);
      }

      // Upload file lên Cloudinary
      const result = await upload(file, {
        folder: FolderType.TRACKS,
        resourceType: ResourceType.VIDEO,
      });

      if (result) {
        setAudioUrl(result.url);
        // Nếu chưa có duration từ metadata, thử lấy từ Cloudinary metadata
        if (!form.getFieldValue("duration_seconds")) {
          if (result.duration) {
            form.setFieldValue("duration_seconds", Math.round(result.duration));
          }
        }
      }
    } catch (error) {
      console.error("Audio upload error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Lỗi khi tải lên file âm thanh";
      toast.error(errorMessage);
    }
    return false;
  };

  const handleDeleteFile = (fileUrl: string) => {
    // Đánh dấu file cần xóa và thêm vào queue
    setPendingDeleteUrls((prev) => [...prev, fileUrl]);
    setAudioUrl(null);
  };

  const handleSubmit = async () => {
    try {
      if (!audioUrl) {
        toast.error("Vui lòng chọn file âm thanh");
        return;
      }

      const values = await form.validateFields();
      const submitData = {
        title: values.title,
        durationSeconds: values.duration_seconds,
        audioUrl: audioUrl,
        trackNumber: values.track_number,
        discNumber: values.disc_number,
        isExplicit: values.is_explicit || false,
        bitrate: values.bitrate,
      };

      if (isEditMode && editingSong) {
        await SongService.updateSong(
          editingSong.id,
          submitData as UpdateSongDto
        );
        toast.success("Cập nhật nhạc thành công!");
      } else {
        await SongService.createSong(albumId, submitData as CreateSongDto);
        toast.success("Tạo nhạc thành công!");
      }

      // ✅ Xóa tất cả file trong queue khi save thành công
      if (pendingDeleteUrls.length > 0) {
        for (const fileUrl of pendingDeleteUrls) {
          try {
            await handleDeleteFileFromCloudinary(fileUrl);
          } catch (deleteError) {
            console.error("Error deleting file:", fileUrl, deleteError);
          }
        }
      }

      setIsModalOpen(false);
      form.resetFields();
      setAudioUrl(null);
      setOldAudioUrl(null);
      setPendingDeleteUrls([]);
      fetchSongs();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Lỗi khi lưu nhạc");
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "track_number",
      key: "track_number",
      width: 60,
      render: (text: number | null) => text || "-",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text: string) => text || "-",
    },
    {
      title: "Thời lượng",
      dataIndex: "duration_seconds",
      key: "duration_seconds",
      width: 100,
      render: (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
      },
    },
    {
      title: "Explicit",
      dataIndex: "is_explicit",
      key: "is_explicit",
      width: 80,
      render: (isExplicit: boolean) =>
        isExplicit ? (
          <Tag color="red">🅴 Explicit</Tag>
        ) : (
          <Tag color="default">Clean</Tag>
        ),
    },
    {
      title: "Lượt phát",
      dataIndex: "play_count",
      key: "play_count",
      width: 100,
      render: (count: number) => count.toLocaleString("vi-VN"),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      render: (_: any, record: Song) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Xóa nhạc"
            description="Bạn có chắc chắn muốn xóa nhạc này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              title="Xóa"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <span style={{ fontSize: "16px", fontWeight: 600 }}>
          🎵 Nhạc ({total})
        </span>
      }
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="small"
        >
          Thêm Nhạc
        </Button>
      }
      style={{ marginTop: "24px" }}
    >
      <Spin spinning={loading} indicator={<LoadingOutlined />}>
        {songs.length === 0 && !loading ? (
          <Empty description="Chưa có nhạc nào" />
        ) : (
          <Table
            columns={columns}
            dataSource={songs.map((song) => ({
              ...song,
              key: song.id,
            }))}
            pagination={false}
            scroll={{ x: 800 }}
          />
        )}
      </Spin>

      {/* Create/Edit Modal */}
      <Modal
        title={isEditMode ? "🎵 Chỉnh sửa Nhạc" : "🎵 Thêm Nhạc Mới"}
        open={isModalOpen}
        onCancel={async () => {
          // Xóa pending files
          if (pendingDeleteUrls.length > 0) {
            for (const fileUrl of pendingDeleteUrls) {
              try {
                await handleDeleteFileFromCloudinary(fileUrl);
              } catch (deleteError) {
                console.error(
                  "Error deleting pending file:",
                  fileUrl,
                  deleteError
                );
              }
            }
          }

          // ✅ Khi thêm mới (không edit) và hủy, xóa audioUrl hiện tại vì chưa được lưu
          if (!isEditMode && audioUrl && audioUrl !== oldAudioUrl) {
            try {
              await handleDeleteFileFromCloudinary(audioUrl);
            } catch (deleteError) {
              console.error("Error deleting current audio file:", deleteError);
            }
          }

          setIsModalOpen(false);
          form.resetFields();
          // ✅ Khôi phục URL cũ khi hủy
          setAudioUrl(oldAudioUrl);
          setPendingDeleteUrls([]);
        }}
        onOk={handleSubmit}
        okText={isEditMode ? "Cập nhật" : "Tạo"}
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: "16px" }}>
          <Form.Item
            label="📝 Tiêu đề"
            name="title"
            rules={[
              { required: true, message: "Tiêu đề không được trống!" },
              { min: 1, message: "Tiêu đề phải ít nhất 1 ký tự!" },
            ]}
          >
            <Input placeholder="VD: Tên bài hát" />
          </Form.Item>

          {/* Audio Upload */}
          <Form.Item label="🎧 File âm thanh">
            <div>
              <Space orientation="vertical" style={{ width: "100%" }}>
                {audioUrl && (
                  <div style={{ position: "relative", width: "fit-content" }}>
                    <audio
                      src={audioUrl}
                      controls
                      style={{
                        width: "300px",
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
                        handleDeleteFile(audioUrl);
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
                  beforeUpload={handleAudioUpload}
                  accept="audio/*"
                  maxCount={1}
                  disabled={uploading}
                  showUploadList={false}
                >
                  <Button
                    icon={<UploadOutlined />}
                    loading={uploading}
                    disabled={uploading}
                  >
                    {uploading ? "Đang tải lên..." : "Tải Lên File Âm Thanh"}
                  </Button>
                </Upload>
              </Space>
            </div>
          </Form.Item>

          <Form.Item
            label="⏱️ Thời lượng (giây)"
            name="duration_seconds"
            rules={[
              { required: true, message: "Thời lượng không được trống!" },
              { type: "number", min: 1, message: "Thời lượng phải > 0!" },
            ]}
          >
            <InputNumber min={1} placeholder="VD: 180" disabled />
          </Form.Item>

          <Form.Item
            label="🔢 Số thứ tự"
            name="track_number"
            rules={[{ type: "number", min: 1, message: "Số thứ tự phải > 0!" }]}
          >
            <InputNumber min={1} placeholder="VD: 1" />
          </Form.Item>

          <Form.Item
            label="📀 Đĩa"
            name="disc_number"
            initialValue={1}
            rules={[{ type: "number", min: 1, message: "Đĩa phải > 0!" }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            label="🔊 Bitrate (kbps)"
            name="bitrate"
            rules={[{ type: "number", min: 1, message: "Bitrate phải > 0!" }]}
          >
            <InputNumber min={1} placeholder="VD: 320" />
          </Form.Item>

          <Form.Item name="is_explicit" valuePropName="checked">
            <Checkbox>🔞 Nội dung nhạy cảm</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
