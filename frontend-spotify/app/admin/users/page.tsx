"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Avatar,
  Tag,
  Space,
  Dropdown,
  Modal,
  Form,
  Select,
  message,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import styles from "../components/Dashboard.module.css";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: "USER" | "ADMIN" | "ARTIST";
  status: "ACTIVE" | "BANNED" | "PENDING";
  createdAt: string;
  playlists: number;
}

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyena@email.com",
    avatar: null,
    role: "USER",
    status: "ACTIVE",
    createdAt: "2024-01-15",
    playlists: 12,
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranb@email.com",
    avatar: null,
    role: "ARTIST",
    status: "ACTIVE",
    createdAt: "2024-02-20",
    playlists: 8,
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "lec@email.com",
    avatar: null,
    role: "USER",
    status: "BANNED",
    createdAt: "2024-03-10",
    playlists: 3,
  },
  {
    id: "4",
    name: "Phạm Thị D",
    email: "phamd@email.com",
    avatar: null,
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "2024-01-01",
    playlists: 25,
  },
  {
    id: "5",
    name: "Hoàng Văn E",
    email: "hoange@email.com",
    avatar: null,
    role: "USER",
    status: "PENDING",
    createdAt: "2024-04-05",
    playlists: 0,
  },
];

export default function UsersPage() {
  const [users] = useState<User[]>(mockUsers);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "red";
      case "ARTIST":
        return "purple";
      default:
        return "blue";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "green";
      case "BANNED":
        return "red";
      default:
        return "orange";
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            size={40}
            src={record.avatar}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#1db954" }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ color: "#b3b3b3", fontSize: 12 }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color={getRoleColor(role)}>{role}</Tag>,
      filters: [
        { text: "Admin", value: "ADMIN" },
        { text: "Artist", value: "ARTIST" },
        { text: "User", value: "USER" },
      ],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Playlists",
      dataIndex: "playlists",
      key: "playlists",
      sorter: (a, b) => a.playlists - b.playlists,
    },
    {
      title: "Joined",
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
              { key: "edit", icon: <EditOutlined />, label: "Edit" },
              { key: "email", icon: <MailOutlined />, label: "Send Email" },
              {
                key: "ban",
                icon: <LockOutlined />,
                label: record.status === "BANNED" ? "Unban" : "Ban",
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

  const handleAction = (action: string, user: User) => {
    switch (action) {
      case "edit":
        message.info(`Edit user: ${user.name}`);
        break;
      case "ban":
        message.warning(
          `${user.status === "BANNED" ? "Unbanned" : "Banned"} user: ${
            user.name
          }`
        );
        break;
      case "delete":
        Modal.confirm({
          title: "Delete User",
          content: `Are you sure you want to delete ${user.name}?`,
          okText: "Delete",
          okType: "danger",
          onOk: () => message.success(`Deleted user: ${user.name}`),
        });
        break;
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Users Management</h1>
          <p className={styles.subtitle}>Manage all users on your platform</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{
            background: "#1db954",
            borderColor: "#1db954",
            borderRadius: 20,
          }}
        >
          Add User
        </Button>
      </div>

      {/* Search */}
      <Card className={styles.contentCard} style={{ marginBottom: 20 }}>
        <div style={{ padding: 16 }}>
          <Input
            placeholder="Search users by name or email..."
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
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          className={styles.table}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
          }}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        title="Add New User"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          form.validateFields().then(() => {
            message.success("User created successfully!");
            setIsModalOpen(false);
            form.resetFields();
          });
        }}
        okButtonProps={{
          style: { background: "#1db954", borderColor: "#1db954" },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Enter user name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              <Select.Option value="USER">User</Select.Option>
              <Select.Option value="ARTIST">Artist</Select.Option>
              <Select.Option value="ADMIN">Admin</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
