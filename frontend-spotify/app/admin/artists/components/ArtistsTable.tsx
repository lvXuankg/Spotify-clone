"use client";

import {
  Table,
  Button,
  Space,
  Popconfirm,
  Avatar,
  Tag,
  Tooltip,
  Spin,
} from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnType } from "antd/es/table";

interface ArtistsTableProps {
  loading: boolean;
  data: any[];
  currentPage: number;
  pageLimit: number;
  total: number;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (artist: any) => void;
  onView: (artist: any) => void;
  onDelete: (artistId: string) => void;
}

export function ArtistsTable({
  loading,
  data,
  currentPage,
  pageLimit,
  total,
  onPageChange,
  onEdit,
  onView,
  onDelete,
}: ArtistsTableProps) {
  const columns: ColumnType<any>[] = [
    {
      title: "Tên Nghệ Sĩ",
      dataIndex: "displayName",
      key: "displayName",
      width: 200,
      render: (text: string, record: any) => (
        <Space>
          <Avatar
            size={40}
            src={record.avatarUrl}
            style={{ background: "#667eea" }}
          >
            {text?.charAt(0)}
          </Avatar>
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>{text}</p>
            <p style={{ margin: 0, fontSize: "12px", color: "#999" }}>
              ID: {record.id.slice(0, 8)}...
            </p>
          </div>
        </Space>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: () => <Tag color="green">Hoạt động</Tag>,
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => {
        if (!date) return "N/A";
        try {
          return new Date(date).toLocaleDateString("vi-VN");
        } catch {
          return "Invalid Date";
        }
      },
    },
    {
      title: "Hành Động",
      key: "action",
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa nghệ sĩ"
              description="Bạn chắc chắn muốn xóa nghệ sĩ này?"
              onConfirm={() => onDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <Table
        columns={columns}
        dataSource={data.map((artist: any) => ({
          ...artist,
          key: artist.id,
        }))}
        pagination={{
          current: currentPage,
          pageSize: pageLimit,
          total: total,
          onChange: onPageChange,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} mục`,
          locale: {
            items_per_page: "/ trang",
            jump_to: "Đến",
            jump_to_confirm: "xác nhận",
            page: "Trang",
          },
        }}
        locale={{
          emptyText: "Không có dữ liệu",
          cancelSort: "Hủy sắp xếp",
        }}
        bordered={false}
        size="middle"
      />
    </Spin>
  );
}
