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
  Select,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  MoreOutlined,
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { adminService, AdminUser } from "@/services/admin";
import { useDebounce } from "use-debounce";
import styles from "../components/Dashboard.module.css";

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch] = useDebounce(searchText, 500);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllUsers(
        pagination.current,
        pagination.pageSize,
        debouncedSearch || undefined
      );
      setUsers(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total: response.data.pagination.total,
      }));
    } catch (error: any) {
      console.error("Failed to fetch users:", error);
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (user: AdminUser) => {
    Modal.confirm({
      title: "Delete User",
      content: `Are you sure you want to delete "${
        user.name || user.email
      }"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await adminService.deleteUser(user.id);
          message.success("User deleted successfully");
          fetchUsers();
        } catch (error) {
          message.error("Failed to delete user");
        }
      },
    });
  };

  const handleChangeRole = async (user: AdminUser, newRole: string) => {
    try {
      await adminService.updateUserRole(user.id, newRole);
      message.success("Role updated successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to update role");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "gold";
      case "ARTIST":
        return "purple";
      default:
        return "green";
    }
  };

  const columns: ColumnsType<AdminUser> = [
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
      title: "User",
      key: "user",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            size={40}
            src={record.avatar_url}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#1db954" }}
          />
          <div>
            <div style={{ fontWeight: 500, color: "#fff" }}>
              {record.name || record.username || "No name"}
            </div>
            <div style={{ color: "#b3b3b3", fontSize: 12 }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role: string) => (
        <Tag
          color={getRoleColor(role)}
          icon={role === "ADMIN" ? <CrownOutlined /> : undefined}
        >
          {role}
        </Tag>
      ),
    },
    {
      title: "Joined",
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
                key: "role",
                label: "Change Role",
                icon: <EditOutlined />,
                children: [
                  {
                    key: "USER",
                    label: "User",
                    onClick: () => handleChangeRole(record, "USER"),
                    disabled: record.role === "USER",
                  },
                  {
                    key: "ARTIST",
                    label: "Artist",
                    onClick: () => handleChangeRole(record, "ARTIST"),
                    disabled: record.role === "ARTIST",
                  },
                  {
                    key: "ADMIN",
                    label: "Admin",
                    onClick: () => handleChangeRole(record, "ADMIN"),
                    disabled: record.role === "ADMIN",
                  },
                ],
              },
              { type: "divider" },
              {
                key: "delete",
                label: "Delete",
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDeleteUser(record),
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
          <h1 className={styles.title}>Users Management</h1>
          <p className={styles.subtitle}>Manage all users on the platform</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchUsers}
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
            placeholder="Search by name or email..."
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
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
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
