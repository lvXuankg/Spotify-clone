"use client";

import { Row, Col, Card, Statistic } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  PlayCircleOutlined,
  FlagOutlined,
} from "@ant-design/icons";

export default function AdminDashboard() {
  return (
    <div>
      <h1>Tổng quan</h1>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={1234}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Nghệ sĩ" value={256} prefix={<TeamOutlined />} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Bài hát"
              value={5678}
              prefix={<PlayCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tố cáo chờ xử lý"
              value={42}
              prefix={<FlagOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} md={12}>
          <Card title="Hoạt động gần đây">
            <p>Chưa có dữ liệu</p>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Thống kê">
            <p>Chưa có dữ liệu</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
