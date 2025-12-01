"use client";

import { Button, Space, Tooltip, Popover } from "antd";
import {
  BgColorsOutlined,
  VolumeHighOutlined,
  QrcodeOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import { memo } from "react";
import { Volume } from "./Volume";

const ExtraControlButtons = memo(() => {
  return (
    <Space
      size="middle"
      style={{
        minWidth: "295px",
        justifyContent: "flex-end",
        display: "flex",
      }}
    >
      <Tooltip title="Queue">
        <Button
          type="text"
          icon={<QrcodeOutlined />}
          style={{ color: "#ffffff", fontSize: "16px" }}
        />
      </Tooltip>

      <Tooltip title="Devices">
        <Button
          type="text"
          icon={<DesktopOutlined />}
          style={{ color: "#ffffff", fontSize: "16px" }}
        />
      </Tooltip>

      <Tooltip title="Volume">
        <Popover content={<Volume />} trigger="hover">
          <Button
            type="text"
            icon={<VolumeHighOutlined />}
            style={{ color: "#ffffff", fontSize: "16px" }}
          />
        </Popover>
      </Tooltip>
    </Space>
  );
});

ExtraControlButtons.displayName = "ExtraControlButtons";
export default ExtraControlButtons;
