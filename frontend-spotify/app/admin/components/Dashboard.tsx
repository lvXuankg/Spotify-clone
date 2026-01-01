"use client";

import {
  Row,
  Col,
  Card,
  Statistic,
  Button,
  Table,
  Tag,
  Avatar,
  Progress,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CustomerServiceOutlined,
  FlagOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlayCircleOutlined,
  RiseOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import styles from "./Dashboard.module.css";

// Mock data for recent activities
const recentActivities = [
  {
    id: 1,
    user: "Nguyen Van A",
    action: "Uploaded new song",
    time: "2 minutes ago",
    type: "upload",
  },
  {
    id: 2,
    user: "Tran Thi B",
    action: "Created playlist",
    time: "15 minutes ago",
    type: "playlist",
  },
  {
    id: 3,
    user: "Le Van C",
    action: "Registered account",
    time: "1 hour ago",
    type: "register",
  },
  {
    id: 4,
    user: "Pham Thi D",
    action: "Reported content",
    time: "2 hours ago",
    type: "report",
  },
  {
    id: 5,
    user: "Hoang Van E",
    action: "Updated profile",
    time: "3 hours ago",
    type: "update",
  },
];

// Mock data for top songs
const topSongs = [
  {
    id: 1,
    title: "Hoa Nở Không Màu",
    artist: "Hoài Lâm",
    plays: 125000,
    trend: "up",
  },
  {
    id: 2,
    title: "Có Chắc Yêu Là Đây",
    artist: "Sơn Tùng MTP",
    plays: 98000,
    trend: "up",
  },
  {
    id: 3,
    title: "Waiting For You",
    artist: "MONO",
    plays: 87500,
    trend: "down",
  },
  {
    id: 4,
    title: "Em Của Ngày Hôm Qua",
    artist: "Sơn Tùng MTP",
    plays: 76000,
    trend: "up",
  },
  {
    id: 5,
    title: "See Tình",
    artist: "Hoàng Thùy Linh",
    plays: 65000,
    trend: "down",
  },
];

const activityColumns = [
  {
    title: "User",
    dataIndex: "user",
    key: "user",
    render: (text: string) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar
          size="small"
          icon={<UserOutlined />}
          style={{ backgroundColor: "#1db954" }}
        />
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
  },
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
    render: (text: string) => (
      <span style={{ color: "#b3b3b3", fontSize: 12 }}>
        <ClockCircleOutlined style={{ marginRight: 4 }} />
        {text}
      </span>
    ),
  },
];

const songColumns = [
  {
    title: "#",
    dataIndex: "id",
    key: "id",
    width: 50,
    render: (id: number) => <span style={{ color: "#b3b3b3" }}>{id}</span>,
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    render: (text: string, record: (typeof topSongs)[0]) => (
      <div>
        <div style={{ fontWeight: 500 }}>{text}</div>
        <div style={{ color: "#b3b3b3", fontSize: 12 }}>{record.artist}</div>
      </div>
    ),
  },
  {
    title: "Plays",
    dataIndex: "plays",
    key: "plays",
    render: (plays: number, record: (typeof topSongs)[0]) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span>{plays.toLocaleString()}</span>
        {record.trend === "up" ? (
          <ArrowUpOutlined style={{ color: "#1db954", fontSize: 12 }} />
        ) : (
          <ArrowDownOutlined style={{ color: "#ff4d4f", fontSize: 12 }} />
        )}
      </div>
    ),
  },
];

export function Dashboard() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Welcome back! Here&apos;s what&apos;s happening with your platform.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button
            type="primary"
            icon={<RiseOutlined />}
            style={{
              background: "#1db954",
              borderColor: "#1db954",
              borderRadius: 20,
            }}
          >
            View Analytics
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className={styles.statCard}
            style={{
              background: "linear-gradient(135deg, #1db954 0%, #169c46 100%)",
            }}
          >
            <Statistic
              title={<span className={styles.statTitle}>Total Users</span>}
              value={12847}
              prefix={<UserOutlined className={styles.statIcon} />}
              styles={{
                content: { color: "#fff", fontSize: 32, fontWeight: 700 },
              }}
              suffix={
                <Tag
                  color="rgba(255,255,255,0.2)"
                  style={{ marginLeft: 8, color: "#fff", border: "none" }}
                >
                  <ArrowUpOutlined /> 12%
                </Tag>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            className={styles.statCard}
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
            }}
          >
            <Statistic
              title={<span className={styles.statTitle}>Artists</span>}
              value={1256}
              prefix={<TeamOutlined className={styles.statIcon} />}
              styles={{
                content: { color: "#fff", fontSize: 32, fontWeight: 700 },
              }}
              suffix={
                <Tag
                  color="rgba(255,255,255,0.2)"
                  style={{ marginLeft: 8, color: "#fff", border: "none" }}
                >
                  <ArrowUpOutlined /> 8%
                </Tag>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            className={styles.statCard}
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            }}
          >
            <Statistic
              title={<span className={styles.statTitle}>Songs</span>}
              value={56789}
              prefix={<CustomerServiceOutlined className={styles.statIcon} />}
              styles={{
                content: { color: "#fff", fontSize: 32, fontWeight: 700 },
              }}
              suffix={
                <Tag
                  color="rgba(255,255,255,0.2)"
                  style={{ marginLeft: 8, color: "#fff", border: "none" }}
                >
                  <ArrowUpOutlined /> 24%
                </Tag>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            className={styles.statCard}
            style={{
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            }}
          >
            <Statistic
              title={<span className={styles.statTitle}>Pending Reports</span>}
              value={42}
              prefix={<FlagOutlined className={styles.statIcon} />}
              styles={{
                content: { color: "#fff", fontSize: 32, fontWeight: 700 },
              }}
              suffix={
                <Tag
                  color="rgba(255,255,255,0.2)"
                  style={{ marginLeft: 8, color: "#fff", border: "none" }}
                >
                  <ArrowDownOutlined /> 5%
                </Tag>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Area */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={14}>
          <Card
            className={styles.contentCard}
            title={
              <div className={styles.cardHeader}>
                <ClockCircleOutlined />
                <span>Recent Activity</span>
              </div>
            }
            extra={
              <Button type="link" style={{ color: "#1db954" }}>
                View All
              </Button>
            }
          >
            <Table
              dataSource={recentActivities}
              columns={activityColumns}
              pagination={false}
              rowKey="id"
              size="small"
              className={styles.table}
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            className={styles.contentCard}
            title={
              <div className={styles.cardHeader}>
                <PlayCircleOutlined />
                <span>Top Songs This Week</span>
              </div>
            }
            extra={
              <Button type="link" style={{ color: "#1db954" }}>
                View All
              </Button>
            }
          >
            <Table
              dataSource={topSongs}
              columns={songColumns}
              pagination={false}
              rowKey="id"
              size="small"
              className={styles.table}
            />
          </Card>
        </Col>
      </Row>

      {/* Platform Stats */}
      <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
        <Col xs={24} lg={8}>
          <Card className={styles.contentCard}>
            <div className={styles.progressCard}>
              <h4>Storage Usage</h4>
              <Progress
                percent={68}
                strokeColor="#1db954"
                railColor="rgba(255,255,255,0.1)"
                format={(percent) => (
                  <span style={{ color: "#fff" }}>{percent}%</span>
                )}
              />
              <p style={{ color: "#b3b3b3", fontSize: 12, marginTop: 8 }}>
                68 GB of 100 GB used
              </p>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.contentCard}>
            <div className={styles.progressCard}>
              <h4>Active Sessions</h4>
              <Progress
                percent={45}
                strokeColor="#7c3aed"
                railColor="rgba(255,255,255,0.1)"
                format={(percent) => (
                  <span style={{ color: "#fff" }}>{percent}%</span>
                )}
              />
              <p style={{ color: "#b3b3b3", fontSize: 12, marginTop: 8 }}>
                4,521 users online now
              </p>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.contentCard}>
            <div className={styles.progressCard}>
              <h4>Server Health</h4>
              <Progress
                percent={92}
                strokeColor="#22c55e"
                railColor="rgba(255,255,255,0.1)"
                format={(percent) => (
                  <span style={{ color: "#fff" }}>{percent}%</span>
                )}
              />
              <p style={{ color: "#b3b3b3", fontSize: 12, marginTop: 8 }}>
                All systems operational
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
