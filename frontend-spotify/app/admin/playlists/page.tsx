"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Avatar,
  Tag,
  Dropdown,
  Modal,
  Space,
  message,
} from "antd";
import {
  UnorderedListOutlined,
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LockOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import styles from "../components/Dashboard.module.css";

interface Playlist {
  id: string;
  name: string;
  owner: string;
  cover: string | null;
  songCount: number;
  followers: number;
  isPublic: boolean;
  createdAt: string;
}

// Mock data
const mockPlaylists: Playlist[] = [
  {
    id: "1",
    name: "Top Hits Vietnam 2024",
    owner: "Spotify",
    cover: null,
    songCount: 50,
    followers: 125000,
    isPublic: true,
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Chill Vibes",
    owner: "Nguyễn Văn A",
    cover: null,
    songCount: 32,
    followers: 8500,
    isPublic: true,
    createdAt: "2024-02-15",
  },
  {
    id: "3",
    name: "Workout Mix",
    owner: "Trần Thị B",
    cover: null,
    songCount: 45,
    followers: 3200,
    isPublic: true,
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    name: "Study Music",
    owner: "Lê Văn C",
    cover: null,
    songCount: 28,
    followers: 15000,
    isPublic: false,
    createdAt: "2024-03-20",
  },
  {
    id: "5",
    name: "Road Trip",
    owner: "Phạm Thị D",
    cover: null,
    songCount: 67,
    followers: 920,
    isPublic: true,
    createdAt: "2024-04-01",
  },
];

export default function PlaylistsPage() {
  const [playlists] = useState<Playlist[]>(mockPlaylists);
  const [searchText, setSearchText] = useState("");

  const columns: ColumnsType<Playlist> = [
    {
      title: "Playlist",
      key: "playlist",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            shape="square"
            size={48}
            src={record.cover}
            icon={<UnorderedListOutlined />}
            style={{ backgroundColor: "#282828", borderRadius: 4 }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ color: "#b3b3b3", fontSize: 12 }}>
              by {record.owner}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Songs",
      dataIndex: "songCount",
      key: "songCount",
      sorter: (a, b) => a.songCount - b.songCount,
    },
    {
      title: "Followers",
      dataIndex: "followers",
      key: "followers",
      sorter: (a, b) => a.followers - b.followers,
      render: (followers) => followers.toLocaleString(),
    },
    {
      title: "Visibility",
      dataIndex: "isPublic",
      key: "isPublic",
      render: (isPublic) => (
        <Tag
          icon={isPublic ? <GlobalOutlined /> : <LockOutlined />}
          color={isPublic ? "green" : "default"}
        >
          {isPublic ? "Public" : "Private"}
        </Tag>
      ),
      filters: [
        { text: "Public", value: true },
        { text: "Private", value: false },
      ],
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: "view", icon: <EyeOutlined />, label: "View Details" },
              { key: "edit", icon: <EditOutlined />, label: "Edit" },
              {
                key: "visibility",
                icon: record.isPublic ? <LockOutlined /> : <GlobalOutlined />,
                label: record.isPublic ? "Make Private" : "Make Public",
              },
              { type: "divider" },
              {
                key: "delete",
                icon: <DeleteOutlined />,
                label: "Delete",
                danger: true,
              },
            ],
            onClick: ({ key }) => handleAction(key, record),
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

  const handleAction = (action: string, playlist: Playlist) => {
    switch (action) {
      case "view":
        message.info(`Viewing: ${playlist.name}`);
        break;
      case "edit":
        message.info(`Editing: ${playlist.name}`);
        break;
      case "visibility":
        message.success(
          `${playlist.name} is now ${playlist.isPublic ? "private" : "public"}`
        );
        break;
      case "delete":
        Modal.confirm({
          title: "Delete Playlist",
          content: `Are you sure you want to delete "${playlist.name}"?`,
          okText: "Delete",
          okType: "danger",
          onOk: () => message.success(`Deleted: ${playlist.name}`),
        });
        break;
    }
  };

  const filteredPlaylists = playlists.filter(
    (playlist) =>
      playlist.name.toLowerCase().includes(searchText.toLowerCase()) ||
      playlist.owner.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Playlists Management</h1>
          <p className={styles.subtitle}>
            Manage all playlists on your platform
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{
            background: "#1db954",
            borderColor: "#1db954",
            borderRadius: 20,
          }}
        >
          Create Playlist
        </Button>
      </div>

      {/* Search */}
      <Card className={styles.contentCard} style={{ marginBottom: 20 }}>
        <div style={{ padding: 16 }}>
          <Input
            placeholder="Search playlists by name or owner..."
            prefix={<SearchOutlined style={{ color: "#b3b3b3" }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
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
        <Table
          dataSource={filteredPlaylists}
          columns={columns}
          rowKey="id"
          className={styles.table}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} playlists`,
          }}
        />
      </Card>
    </div>
  );
}
