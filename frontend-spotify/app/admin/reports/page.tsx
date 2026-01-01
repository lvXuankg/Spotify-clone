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
  Badge,
  Tabs,
} from "antd";
import {
  FlagOutlined,
  SearchOutlined,
  MoreOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import styles from "../components/Dashboard.module.css";

interface Report {
  id: string;
  reporter: string;
  reporterAvatar: string | null;
  targetType: "SONG" | "USER" | "PLAYLIST" | "COMMENT";
  targetName: string;
  reason: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  createdAt: string;
}

// Mock data
const mockReports: Report[] = [
  {
    id: "1",
    reporter: "Nguyễn Văn A",
    reporterAvatar: null,
    targetType: "SONG",
    targetName: "Copyright Song XYZ",
    reason: "Copyright violation",
    priority: "HIGH",
    status: "PENDING",
    createdAt: "2024-04-05T10:30:00",
  },
  {
    id: "2",
    reporter: "Trần Thị B",
    reporterAvatar: null,
    targetType: "USER",
    targetName: "spam_user123",
    reason: "Spam content",
    priority: "MEDIUM",
    status: "PENDING",
    createdAt: "2024-04-05T09:15:00",
  },
  {
    id: "3",
    reporter: "Lê Văn C",
    reporterAvatar: null,
    targetType: "COMMENT",
    targetName: "Offensive comment",
    reason: "Hate speech",
    priority: "CRITICAL",
    status: "PENDING",
    createdAt: "2024-04-05T08:00:00",
  },
  {
    id: "4",
    reporter: "Phạm Thị D",
    reporterAvatar: null,
    targetType: "PLAYLIST",
    targetName: "Inappropriate Playlist",
    reason: "Adult content",
    priority: "HIGH",
    status: "RESOLVED",
    createdAt: "2024-04-04T16:30:00",
  },
  {
    id: "5",
    reporter: "Hoàng Văn E",
    reporterAvatar: null,
    targetType: "SONG",
    targetName: "Low Quality Audio",
    reason: "Quality issue",
    priority: "LOW",
    status: "DISMISSED",
    createdAt: "2024-04-04T14:00:00",
  },
];

export default function ReportsPage() {
  const [reports] = useState<Report[]>(mockReports);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return { color: "#ff4d4f", icon: <ExclamationCircleOutlined /> };
      case "HIGH":
        return { color: "#fa8c16", icon: <WarningOutlined /> };
      case "MEDIUM":
        return { color: "#faad14", icon: <FlagOutlined /> };
      default:
        return { color: "#52c41a", icon: <FlagOutlined /> };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "green";
      case "DISMISSED":
        return "default";
      default:
        return "orange";
    }
  };

  const getTargetTypeColor = (type: string) => {
    switch (type) {
      case "SONG":
        return "blue";
      case "USER":
        return "purple";
      case "PLAYLIST":
        return "cyan";
      default:
        return "magenta";
    }
  };

  const columns: ColumnsType<Report> = [
    {
      title: "Reporter",
      key: "reporter",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar
            size="small"
            src={record.reporterAvatar}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#1db954" }}
          />
          <span>{record.reporter}</span>
        </div>
      ),
    },
    {
      title: "Target",
      key: "target",
      render: (_, record) => (
        <div>
          <Tag
            color={getTargetTypeColor(record.targetType)}
            style={{ marginBottom: 4 }}
          >
            {record.targetType}
          </Tag>
          <div style={{ color: "#b3b3b3", fontSize: 12 }}>
            {record.targetName}
          </div>
        </div>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => {
        const config = getPriorityConfig(priority);
        return (
          <Tag color={config.color} icon={config.icon}>
            {priority}
          </Tag>
        );
      },
      sorter: (a, b) => {
        const order = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        return order[b.priority] - order[a.priority];
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Reported",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => {
        const d = new Date(date);
        return (
          <div>
            <div>{d.toLocaleDateString("vi-VN")}</div>
            <div style={{ color: "#b3b3b3", fontSize: 11 }}>
              {d.toLocaleTimeString("vi-VN")}
            </div>
          </div>
        );
      },
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
              ...(record.status === "PENDING"
                ? [
                    {
                      key: "resolve",
                      icon: <CheckOutlined />,
                      label: "Resolve",
                    },
                    {
                      key: "dismiss",
                      icon: <CloseOutlined />,
                      label: "Dismiss",
                    },
                  ]
                : []),
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

  const handleAction = (action: string, report: Report) => {
    switch (action) {
      case "view":
        Modal.info({
          title: "Report Details",
          content: (
            <div>
              <p>
                <strong>Reporter:</strong> {report.reporter}
              </p>
              <p>
                <strong>Target:</strong> {report.targetType} -{" "}
                {report.targetName}
              </p>
              <p>
                <strong>Reason:</strong> {report.reason}
              </p>
              <p>
                <strong>Priority:</strong> {report.priority}
              </p>
              <p>
                <strong>Status:</strong> {report.status}
              </p>
            </div>
          ),
        });
        break;
      case "resolve":
        Modal.confirm({
          title: "Resolve Report",
          content: "Are you sure you want to mark this report as resolved?",
          onOk: () => message.success("Report resolved successfully!"),
        });
        break;
      case "dismiss":
        Modal.confirm({
          title: "Dismiss Report",
          content: "Are you sure you want to dismiss this report?",
          onOk: () => message.success("Report dismissed!"),
        });
        break;
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.reporter.toLowerCase().includes(searchText.toLowerCase()) ||
      report.targetName.toLowerCase().includes(searchText.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchText.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && report.status === activeTab.toUpperCase();
  });

  const pendingCount = reports.filter((r) => r.status === "PENDING").length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Reports Management</h1>
          <p className={styles.subtitle}>Review and manage reported content</p>
        </div>
        <Badge count={pendingCount} style={{ backgroundColor: "#ff4d4f" }}>
          <Button
            type="primary"
            icon={<FlagOutlined />}
            style={{
              background: "#1db954",
              borderColor: "#1db954",
              borderRadius: 20,
            }}
          >
            {pendingCount} Pending
          </Button>
        </Badge>
      </div>

      {/* Tabs & Search */}
      <Card className={styles.contentCard} style={{ marginBottom: 20 }}>
        <div style={{ padding: "16px 16px 0" }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: "pending",
                label: (
                  <Badge count={pendingCount} offset={[10, 0]}>
                    Pending
                  </Badge>
                ),
              },
              { key: "resolved", label: "Resolved" },
              { key: "dismissed", label: "Dismissed" },
              { key: "all", label: "All Reports" },
            ]}
          />
        </div>
        <div style={{ padding: "0 16px 16px" }}>
          <Input
            placeholder="Search reports..."
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
          dataSource={filteredReports}
          columns={columns}
          rowKey="id"
          className={styles.table}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} reports`,
          }}
        />
      </Card>
    </div>
  );
}
