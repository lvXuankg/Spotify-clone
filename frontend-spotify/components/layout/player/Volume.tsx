"use client";

import { memo, useState } from "react";
import { Space, Tooltip } from "antd";
import { Slider } from "@/components/Slider";
import { playerService } from "@/services/player";

// Icons
const VolumeMuteIcon = () => <span>🔇</span>;
const VolumeOneIcon = () => <span>🔉</span>;
const VolumeTwoIcon = () => <span>🔊</span>;
const VolumeIcon = () => <span>🔊</span>;

const getIcon = (volume: number) => {
  if (volume === 0) {
    return <VolumeMuteIcon />;
  }
  if (volume < 0.4) {
    return <VolumeOneIcon />;
  }
  if (volume < 0.7) {
    return <VolumeTwoIcon />;
  }
  return <VolumeIcon />;
};

export const VolumeControls = memo(() => {
  const [volume, setVolume] = useState<number>(1);

  const muted = volume === 0;

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Space style={{ display: "flex" }}>
        <Tooltip title={muted ? "Unmute" : "Mute"}>
          <div
            onClick={() => {
              playerService
                .setVolume(muted ? Math.round(volume * 100) : 0)
                .then();
              setVolume(muted ? volume : 0);
            }}
            style={{ cursor: "pointer", color: "#ffffff" }}
          >
            {getIcon(muted ? 0 : volume)}
          </div>
        </Tooltip>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "90px",
          }}
        >
          <Slider
            isEnabled
            value={muted ? 0 : volume}
            onChange={(value) => {
              setVolume(value);
            }}
            onChangeEnd={(value) => {
              setVolume(value);
              playerService.setVolume(Math.round(value * 100)).then();
            }}
          />
        </div>
      </Space>
    </div>
  );
});

VolumeControls.displayName = "VolumeControls";
export default VolumeControls;
