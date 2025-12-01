"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { Button, Space, Tooltip } from "antd";
import {
  StepBackwardOutlined,
  PlayOutlined,
  PauseOutlined,
  StepForwardOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { memo } from "react";
import { playerService } from "@/services/player";

const ControlButtons = memo(() => {
  const dispatch = useAppDispatch();
  const is_playing = useAppSelector((state) => state.spotify.state?.is_playing);
  const deviceId = useAppSelector((state) => state.spotify.state?.device?.id);

  const handlePlayPause = async () => {
    if (!deviceId) return;

    try {
      if (is_playing) {
        await playerService.pause(deviceId);
      } else {
        await playerService.play(deviceId);
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  };

  const handlePrevious = async () => {
    if (!deviceId) return;
    try {
      await playerService.skipToPrevious(deviceId);
    } catch (error) {
      console.error("Error skipping to previous:", error);
    }
  };

  const handleNext = async () => {
    if (!deviceId) return;
    try {
      await playerService.skipToNext(deviceId);
    } catch (error) {
      console.error("Error skipping to next:", error);
    }
  };

  return (
    <Space size="middle">
      <Tooltip title="Shuffle">
        <Button
          type="text"
          icon={<CopyOutlined />}
          style={{ color: "#ffffff", fontSize: "16px" }}
        />
      </Tooltip>

      <Tooltip title="Previous">
        <Button
          type="text"
          icon={<StepBackwardOutlined />}
          onClick={handlePrevious}
          style={{ color: "#ffffff", fontSize: "18px" }}
        />
      </Tooltip>

      <Tooltip title={is_playing ? "Pause" : "Play"}>
        <Button
          type="primary"
          icon={is_playing ? <PauseOutlined /> : <PlayOutlined />}
          onClick={handlePlayPause}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#1db954",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
          }}
        />
      </Tooltip>

      <Tooltip title="Next">
        <Button
          type="text"
          icon={<StepForwardOutlined />}
          onClick={handleNext}
          style={{ color: "#ffffff", fontSize: "18px" }}
        />
      </Tooltip>

      <Tooltip title="Repeat">
        <Button
          type="text"
          icon={<CopyOutlined />}
          style={{ color: "#ffffff", fontSize: "16px" }}
        />
      </Tooltip>
    </Space>
  );
});

ControlButtons.displayName = "ControlButtons";
export default ControlButtons;
