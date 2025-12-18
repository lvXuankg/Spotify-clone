"use client";

import { Button, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface ArtistsHeaderProps {
  total: number;
  onCreateClick: () => void;
}

export function ArtistsHeader({ total, onCreateClick }: ArtistsHeaderProps) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <Row justify="space-between" align="middle">
        <Col>
          <h1 style={{ fontSize: "28px", fontWeight: 700, margin: 0 }}>
            Quản Lý Nghệ Sĩ
          </h1>
          <p style={{ color: "#999", margin: "8px 0 0 0" }}>
            Tổng cộng: {total} nghệ sĩ
          </p>
        </Col>
        <Col>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={onCreateClick}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderColor: "transparent",
            }}
          >
            Thêm Nghệ Sĩ
          </Button>
        </Col>
      </Row>
    </div>
  );
}
