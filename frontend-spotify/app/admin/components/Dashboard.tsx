"use client";

import { Row, Col, Card, Statistic, Button } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  PlayCircleOutlined,
  FlagOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

export function Dashboard() {
  return (
    <div style={{ padding: "0 12px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700, margin: "0 0 8px 0" }}>
          Dashboard
        </h1>
        <p style={{ color: "#999", margin: 0 }}>Welcome to your admin panel</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: "32px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
              color: "#fff",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  Total Users
                </span>
              }
              value={1234}
              prefix={<UserOutlined style={{ fontSize: "24px" }} />}
              styles={{
                content: { color: "#fff", fontSize: "28px", fontWeight: 700 },
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: "linear-gradient(135deg, #764ba2 0%, #f093fb 100%)",
              border: "none",
              boxShadow: "0 4px 12px rgba(118, 75, 162, 0.15)",
              color: "#fff",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  Artists
                </span>
              }
              value={256}
              prefix={<TeamOutlined style={{ fontSize: "24px" }} />}
              styles={{
                content: { color: "#fff", fontSize: "28px", fontWeight: 700 },
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              border: "none",
              boxShadow: "0 4px 12px rgba(245, 87, 108, 0.15)",
              color: "#fff",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>Songs</span>
              }
              value={5678}
              prefix={<PlayCircleOutlined style={{ fontSize: "24px" }} />}
              styles={{
                content: { color: "#fff", fontSize: "28px", fontWeight: 700 },
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: "linear-gradient(135deg, #f5576c 0%, #ffc837 100%)",
              border: "none",
              boxShadow: "0 4px 12px rgba(255, 200, 55, 0.15)",
              color: "#fff",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  Pending Reports
                </span>
              }
              value={42}
              prefix={<FlagOutlined style={{ fontSize: "24px" }} />}
              styles={{
                content: { color: "#fff", fontSize: "28px", fontWeight: 700 },
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Area */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <span style={{ fontSize: "16px", fontWeight: 600 }}>
                Recent Activity
              </span>
            }
            style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)" }}
            extra={
              <Button type="text" icon={<ArrowRightOutlined />}>
                View All
              </Button>
            }
          >
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ color: "#999", fontSize: "14px" }}>
                No recent activity yet
              </p>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <span style={{ fontSize: "16px", fontWeight: 600 }}>
                Statistics
              </span>
            }
            style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)" }}
          >
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ color: "#999", fontSize: "14px" }}>Coming soon</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
