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
  CustomerServiceOutlined,
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import styles from "../components/Dashboard.module.css";

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string | null;
  duration: number;
  plays: number;
  status: "PUBLISHED" | "PENDING" | "REJECTED";
  createdAt: string;
}

// Mock data
const mockSongs: Song[] = [
  {
    id: "1",
    title: "Hoa Nở Không Màu",
    artist: "Hoài Lâm",
    album: "Single",
    cover: null,
    duration: 245,
    plays: 125000,
    status: "PUBLISHED",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Có Chắc Yêu Là Đây",
    artist: "Sơn Tùng MTP",
    album: "SKY Tour",
    cover: null,
    duration: 198,
    plays: 98000,
    status: "PUBLISHED",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    title: "Waiting For You",
    artist: "MONO",
    album: "22",
    cover: null,
    duration: 212,
    plays: 87500,
    status: "PUBLISHED",
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    title: "Em Của Ngày Hôm Qua",
    artist: "Sơn Tùng MTP",
    album: "M-TP",
    cover: null,
    duration: 267,
    plays: 76000,
    status: "PENDING",
    createdAt: "2024-04-01",
  },
  {
    id: "5",
    title: "See Tình",
    artist: "Hoàng Thùy Linh",
    album: "LINK",
    cover: null,
    duration: 185,
    plays: 65000,
    status: "REJECTED",
    createdAt: "2024-04-05",
  },
];

export default function SongsPage() {
  const [songs] = useState<Song[]>(mockSongs);
  const [searchText, setSearchText] = useState("");

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "green";
      case "PENDING":
        return "orange";
      default:
        return "red";
    }
  };

  const columns: ColumnsType<Song> = [
    {
      title: "#",
      key: "index",
      width: 50,
      render: (_, __, index) => (
        <span style={{ color: "#b3b3b3" }}>{index + 1}</span>
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
            src={record.cover}
            icon={<CustomerServiceOutlined />}
            style={{ backgroundColor: "#282828", borderRadius: 4 }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.title}</div>
            <div style={{ color: "#b3b3b3", fontSize: 12 }}>
              {record.artist}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Album",
      dataIndex: "album",
      key: "album",
      render: (album) => <span style={{ color: "#b3b3b3" }}>{album}</span>,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: 100,
      render: (duration) => (
        <span style={{ color: "#b3b3b3" }}>{formatDuration(duration)}</span>
      ),
    },
    {
      title: "Plays",
      dataIndex: "plays",
      key: "plays",
      sorter: (a, b) => a.plays - b.plays,
      render: (plays) => (
        <Space>
          <PlayCircleOutlined style={{ color: "#1db954" }} />
          {plays.toLocaleString()}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      filters: [
        { text: "Published", value: "PUBLISHED" },
        { text: "Pending", value: "PENDING" },
        { text: "Rejected", value: "REJECTED" },
      ],
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

  const handleAction = (action: string, song: Song) => {
    switch (action) {
      case "view":
        message.info(`Viewing: ${song.title}`);
        break;
      case "edit":
        message.info(`Editing: ${song.title}`);
        break;
      case "delete":
        Modal.confirm({
          title: "Delete Song",
          content: `Are you sure you want to delete "${song.title}"?`,
          okText: "Delete",
          okType: "danger",
          onOk: () => message.success(`Deleted: ${song.title}`),
        });
        break;
    }
  };

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchText.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Songs Management</h1>
          <p className={styles.subtitle}>Manage all songs on your platform</p>
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
          Upload Song
        </Button>
      </div>

      {/* Search */}
      <Card className={styles.contentCard} style={{ marginBottom: 20 }}>
        <div style={{ padding: 16 }}>
          <Input
            placeholder="Search songs by title or artist..."
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
          dataSource={filteredSongs}
          columns={columns}
          rowKey="id"
          className={styles.table}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} songs`,
          }}
        />
      </Card>
    </div>
  );
}
