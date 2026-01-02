"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Avatar,
  Tag,
  Dropdown,
  Modal,
  message,
} from "antd";
import {
  UnorderedListOutlined,
  SearchOutlined,
  MoreOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  GlobalOutlined,
  LockOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { adminService, AdminPlaylist } from "@/services/admin";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import styles from "../components/Dashboard.module.css";

export default function PlaylistsPage() {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<AdminPlaylist[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch] = useDebounce(searchText, 500);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchPlaylists = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllPlaylists(
        pagination.current,
        pagination.pageSize,
        debouncedSearch || undefined
      );
      setPlaylists(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total: response.data.pagination.total,
      }));
    } catch (error: any) {
      console.error("Failed to fetch playlists:", error);
      message.error("Failed to load playlists");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, debouncedSearch]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handleDeletePlaylist = async (playlist: AdminPlaylist) => {
    Modal.confirm({
      title: "Delete Playlist",
      content: `Are you sure you want to delete "${playlist.title}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await adminService.deletePlaylist(playlist.id);
          message.success("Playlist deleted successfully");
          fetchPlaylists();
        } catch (error) {
          message.error("Failed to delete playlist");
        }
      },
    });
  };

  const handleViewPlaylist = (playlist: AdminPlaylist) => {
    router.push(`/playlist/${playlist.id}`);
  };

  const columns: ColumnsType<AdminPlaylist> = [
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
      title: "Playlist",
      key: "playlist",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            shape="square"
            size={48}
            src={record.cover_url}
            icon={<UnorderedListOutlined />}
            style={{ backgroundColor: "#282828" }}
          />
          <div>
            <div style={{ fontWeight: 500, color: "#fff" }}>{record.title}</div>
            <div style={{ color: "#b3b3b3", fontSize: 12 }}>
              {record.description || "No description"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Owner",
      key: "owner",
      width: 180,
      render: (_, record) => (
        <span style={{ color: "#b3b3b3" }}>
          {record.owner?.name || "Unknown"}
        </span>
      ),
    },
    {
      title: "Songs",
      dataIndex: "song_count",
      key: "song_count",
      width: 80,
      render: (count: number) => <Tag color="blue">{count} songs</Tag>,
    },
    {
      title: "Visibility",
      key: "visibility",
      width: 100,
      render: (_, record) => (
        <Tag
          color={record.is_public ? "green" : "default"}
          icon={record.is_public ? <GlobalOutlined /> : <LockOutlined />}
        >
          {record.is_public ? "Public" : "Private"}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      render: (date: string) => (
        <span style={{ color: "#b3b3b3" }}>
          {new Date(date).toLocaleDateString()}
        </span>
      ),
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
                key: "view",
                label: "View",
                icon: <EyeOutlined />,
                onClick: () => handleViewPlaylist(record),
              },
              { type: "divider" },
              {
                key: "delete",
                label: "Delete",
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDeletePlaylist(record),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Playlists Management</h1>
          <p className={styles.subtitle}>
            Manage all public playlists on the platform
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchPlaylists}
            style={{ borderRadius: 20 }}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className={styles.contentCard} style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Input
            placeholder="Search playlists..."
            prefix={<SearchOutlined style={{ color: "#b3b3b3" }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: 400 }}
            allowClear
          />
        </div>
      </Card>

      {/* Table */}
      <Card className={styles.contentCard}>
        <Table
          columns={columns}
          dataSource={playlists}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} playlists`,
            onChange: (page, pageSize) => {
              setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: pageSize || 10,
              }));
            },
          }}
          className={styles.table}
        />
      </Card>
    </div>
  );
}
