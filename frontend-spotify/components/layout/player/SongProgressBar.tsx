"use client";

import { Slider, Space } from "antd";
import { useAppSelector } from "@/store/store";
import { memo } from "react";

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const SongProgressBar = memo(() => {
  const current_track = useAppSelector(
    (state) => state.spotify.state?.track_window.current_track
  );
  const progress_ms = useAppSelector(
    (state) => state.spotify.state?.progress_ms
  );

  if (!current_track) {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span style={{ color: "#b3b3b3", fontSize: "12px" }}>0:00</span>
        <Slider style={{ flex: 1 }} value={0} disabled />
        <span style={{ color: "#b3b3b3", fontSize: "12px" }}>0:00</span>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <span style={{ color: "#b3b3b3", fontSize: "12px" }}>
        {formatTime(progress_ms || 0)}
      </span>
      <Slider
        style={{ flex: 1 }}
        value={progress_ms || 0}
        max={current_track.duration_ms}
        tooltip={{ formatter: (value) => formatTime(value as number) }}
      />
      <span style={{ color: "#b3b3b3", fontSize: "12px" }}>
        {formatTime(current_track.duration_ms)}
      </span>
    </div>
  );
});

SongProgressBar.displayName = "SongProgressBar";
export default SongProgressBar;
