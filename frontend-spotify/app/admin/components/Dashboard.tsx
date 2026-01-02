"use client";

import { useState, useEffect, useCallback } from "react";
import { Row, Col, Card, Statistic, Button, Table, Avatar, Spin } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CustomerServiceOutlined,
  UnorderedListOutlined,
  PlayCircleOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { adminService, AdminSong, AdminUser } from "@/services/admin";
import styles from "./Dashboard.module.css";

interface DashboardStats {
  totalUsers: number;
  totalArtists: number;
  totalSongs: number;
  totalPlaylists: number;
  recentUsers: AdminUser[];
  topSongs: AdminSong[];
}

const userColumns = [
  {
    title: "User",
    dataIndex: "name",
    key: "name",
    render: (text: string, record: AdminUser) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Avatar
          size="small"
          src={record.avatar_url}
          icon={<UserOutlined />}
          style={{ backgroundColor: "#1db954" }}
        />
        <span>{text || record.email}</span>
      </div>
    ),
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (role: string) => (
      <span
        style={{
          color:
            role === "ADMIN"
              ? "#f59e0b"
              : role === "ARTIST"
              ? "#7c3aed"
              : "#1db954",
          fontWeight: 500,
        }}
      >
        {role}
      </span>
    ),
  },
  {
    title: "Joined",
    dataIndex: "created_at",
    key: "created_at",
    render: (text: string) => (
      <span style={{ color: "#b3b3b3", fontSize: 12 }}>
        <ClockCircleOutlined style={{ marginRight: 4 }} />
        {new Date(text).toLocaleDateString()}
      </span>
    ),
  },
];

const songColumns = [
  {
    title: "#",
    key: "index",
    width: 50,
    render: (_: unknown, __: unknown, index: number) => (
      <span style={{ color: "#b3b3b3" }}>{index + 1}</span>
    ),
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    render: (text: string, record: AdminSong) => (
      <div>
        <div style={{ fontWeight: 500 }}>{text}</div>
        <div style={{ color: "#b3b3b3", fontSize: 12 }}>
          {record.albums?.artists?.display_name || "Unknown Artist"}
        </div>
      </div>
    ),
  },
  {
    title: "Plays",
    dataIndex: "play_count",
    key: "play_count",
    render: (plays: number) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span>{(plays || 0).toLocaleString()}</span>
      </div>
    ),
  },
];

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalArtists: 0,
    totalSongs: 0,
    totalPlaylists: 0,
    recentUsers: [],
    topSongs: [],
  });

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all stats in parallel
      const [usersRes, artistsRes, songsRes, playlistsRes] = await Promise.all([
        adminService.getAllUsers(1, 5),
        adminService.getAllArtists(1, 5),
        adminService.getAllSongs(1, 5),
        adminService.getAllPlaylists(1, 5),
      ]);

      setStats({
        totalUsers:
          usersRes.data.pagination?.total || usersRes.data.data?.length || 0,
        totalArtists:
          artistsRes.data.pagination?.total ||
          artistsRes.data.data?.length ||
          0,
        totalSongs:
          songsRes.data.pagination?.total || songsRes.data.data?.length || 0,
        totalPlaylists:
          playlistsRes.data.pagination?.total ||
          playlistsRes.data.data?.length ||
          0,
        recentUsers: usersRes.data.data || [],
        topSongs: songsRes.data.data || [],
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div
        className={styles.container}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 48, color: "#1db954" }} spin />
          }
        />
      </div>
    );
  }

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
            icon={<ReloadOutlined />}
            onClick={fetchStats}
            style={{
              background: "#1db954",
              borderColor: "#1db954",
              borderRadius: 20,
            }}
          >
            Refresh
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
              value={stats.totalUsers}
              prefix={<UserOutlined className={styles.statIcon} />}
              styles={{
                content: { color: "#fff", fontSize: 32, fontWeight: 700 },
              }}
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
              value={stats.totalArtists}
              prefix={<TeamOutlined className={styles.statIcon} />}
              styles={{
                content: { color: "#fff", fontSize: 32, fontWeight: 700 },
              }}
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
              value={stats.totalSongs}
              prefix={<CustomerServiceOutlined className={styles.statIcon} />}
              styles={{
                content: { color: "#fff", fontSize: 32, fontWeight: 700 },
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            className={styles.statCard}
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            }}
          >
            <Statistic
              title={<span className={styles.statTitle}>Playlists</span>}
              value={stats.totalPlaylists}
              prefix={<UnorderedListOutlined className={styles.statIcon} />}
              styles={{
                content: { color: "#fff", fontSize: 32, fontWeight: 700 },
              }}
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
                <span>Recent Users</span>
              </div>
            }
            extra={
              <Button
                type="link"
                href="/admin/users"
                style={{ color: "#1db954" }}
              >
                View All
              </Button>
            }
          >
            <Table
              dataSource={stats.recentUsers}
              columns={userColumns}
              pagination={false}
              rowKey="id"
              size="small"
              className={styles.table}
              locale={{ emptyText: "No users found" }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            className={styles.contentCard}
            title={
              <div className={styles.cardHeader}>
                <PlayCircleOutlined />
                <span>Recent Songs</span>
              </div>
            }
            extra={
              <Button
                type="link"
                href="/admin/songs"
                style={{ color: "#1db954" }}
              >
                View All
              </Button>
            }
          >
            <Table
              dataSource={stats.topSongs}
              columns={songColumns}
              pagination={false}
              rowKey="id"
              size="small"
              className={styles.table}
              locale={{ emptyText: "No songs found" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
        <Col xs={24} lg={8}>
          <Card className={styles.contentCard}>
            <div className={styles.progressCard}>
              <h4>Total Content</h4>
              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "#b3b3b3" }}>Songs</span>
                  <span style={{ color: "#1db954", fontWeight: 600 }}>
                    {stats.totalSongs}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "#b3b3b3" }}>Artists</span>
                  <span style={{ color: "#7c3aed", fontWeight: 600 }}>
                    {stats.totalArtists}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#b3b3b3" }}>Playlists</span>
                  <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                    {stats.totalPlaylists}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.contentCard}>
            <div className={styles.progressCard}>
              <h4>User Statistics</h4>
              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "#b3b3b3" }}>Total Users</span>
                  <span style={{ color: "#1db954", fontWeight: 600 }}>
                    {stats.totalUsers}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "#b3b3b3" }}>Recent Users</span>
                  <span style={{ color: "#f59e0b", fontWeight: 600 }}>
                    {stats.recentUsers.length}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.contentCard}>
            <div className={styles.progressCard}>
              <h4>Platform Status</h4>
              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "#b3b3b3" }}>API Status</span>
                  <span style={{ color: "#22c55e", fontWeight: 600 }}>
                    ● Online
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#b3b3b3" }}>Services</span>
                  <span style={{ color: "#22c55e", fontWeight: 600 }}>
                    ● Running
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
