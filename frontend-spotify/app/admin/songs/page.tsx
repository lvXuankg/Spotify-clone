"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Avatar,
  Dropdown,
  Modal,
  message,
  Spin,
} from "antd";
import {
  CustomerServiceOutlined,
  SearchOutlined,
  MoreOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { adminService, AdminSong } from "@/services/admin";
import { useDebounce } from "use-debounce";
import { useAudioPlayerContext } from "@/components/providers/AudioPlayerProvider";
import styles from "../components/Dashboard.module.css";

// Format duration
const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Format play count
const formatPlayCount = (count: number) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

export default function SongsPage() {
  const [songs, setSongs] = useState<AdminSong[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch] = useDebounce(searchText, 500);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { playSong } = useAudioPlayerContext();

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllSongs(
        pagination.current,
        pagination.pageSize,
        debouncedSearch || undefined
      );
      setSongs(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total: response.data.pagination.total,
      }));
    } catch (error: any) {
      console.error("Failed to fetch songs:", error);
      message.error("Failed to load songs");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, debouncedSearch]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const handlePlaySong = (song: AdminSong) => {
    playSong({
      id: song.id,
      album_id: song.albums?.id || "",
      title: song.title,
      duration_seconds: song.duration_seconds,
      audio_url: song.audio_url,
      disc_number: 1,
      is_explicit: false,
      play_count: song.play_count,
      created_at: song.created_at,
      updated_at: song.created_at,
      albums: song.albums
        ? {
            id: song.albums.id,
            title: song.albums.title,
            cover_url: song.albums.cover_url,
            artists: {
              id: song.albums.artists?.id || "",
              display_name: song.albums.artists?.display_name || "Unknown",
            },
          }
        : undefined,
    });
  };

  const handleDeleteSong = async (song: AdminSong) => {
    Modal.confirm({
      title: "Delete Song",
      content: `Are you sure you want to delete "${song.title}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await adminService.deleteSong(song.id);
          message.success("Song deleted successfully");
          fetchSongs();
        } catch (error) {
          message.error("Failed to delete song");
        }
      },
    });
  };

  const columns: ColumnsType<AdminSong> = [
    {
      title: "#",
      key: "index",
      width: 50,
      render: (_, __, index) => (
        <span style={{ color: "#b3b3b3" }}>
          {(pagination.current - 1) * pagination.pageSize + index + 1}
        </span>
      ),
    },
    {
      title: "Song",
      key: "song",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            shape="square"
            size={48}
            src={record.albums?.cover_url}
            icon={<CustomerServiceOutlined />}
            style={{ backgroundColor: "#282828" }}
          />
          <div>
            <div style={{ fontWeight: 500, color: "#fff" }}>{record.title}</div>
            <div style={{ color: "#b3b3b3", fontSize: 12 }}>
              {record.albums?.artists?.display_name || "Unknown Artist"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Album",
      key: "album",
      width: 200,
      render: (_, record) => (
        <span style={{ color: "#b3b3b3" }}>
          {record.albums?.title || "Single"}
        </span>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration_seconds",
      key: "duration",
      width: 100,
      render: (duration) => (
        <span style={{ color: "#b3b3b3" }}>{formatDuration(duration)}</span>
      ),
    },
    {
      title: "Plays",
      dataIndex: "play_count",
      key: "plays",
      width: 100,
      render: (count) => (
        <span style={{ color: "#b3b3b3" }}>{formatPlayCount(count)}</span>
      ),
      sorter: (a, b) => a.play_count - b.play_count,
    },
    {
      title: "Added",
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      render: (date) =>
        new Date(date).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "play",
                icon: <PlayCircleOutlined />,
                label: "Play",
                onClick: () => handlePlaySong(record),
              },
              { type: "divider" },
              {
                key: "delete",
                icon: <DeleteOutlined />,
                label: "Delete",
                danger: true,
                onClick: () => handleDeleteSong(record),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            style={{ color: "#b3b3b3" }}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Songs Management</h1>
          <p className={styles.subtitle}>
            Manage all songs on your platform ({pagination.total} songs)
          </p>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchSongs}
          loading={loading}
          style={{ borderRadius: 20 }}
        >
          Refresh
        </Button>
      </div>

      {/* Search */}
      <Card className={styles.contentCard} style={{ marginBottom: 20 }}>
        <div style={{ padding: 16 }}>
          <Input
            placeholder="Search songs by title..."
            prefix={<SearchOutlined style={{ color: "#b3b3b3" }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              borderRadius: 8,
              maxWidth: 400,
            }}
          />
        </div>
      </Card>

      {/* Table */}
      <Card className={styles.contentCard}>
        <Spin spinning={loading}>
          <Table
            dataSource={songs}
            columns={columns}
            rowKey="id"
            className={styles.table}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} songs`,
              onChange: (page, pageSize) => {
                setPagination((prev) => ({
                  ...prev,
                  current: page,
                  pageSize,
                }));
              },
            }}
            onRow={(record) => ({
              onDoubleClick: () => handlePlaySong(record),
              style: { cursor: "pointer" },
            })}
          />
        </Spin>
      </Card>
    </div>
  );
}
