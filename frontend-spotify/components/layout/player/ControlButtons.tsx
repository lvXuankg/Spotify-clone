"use client";

import { memo } from "react";
import { Row, Col } from "antd";
import { useAppSelector } from "@/store/store";
import { playerService } from "@/services/player";

// Icons (simplified - replace with actual icons)
const Play = () => <span>▶️</span>;
const Pause = () => <span>⏸️</span>;
const SkipBack = () => <span>⏮️</span>;
const SkipNext = () => <span>⏭️</span>;
const ShuffleIcon = ({ active }: { active: boolean }) => (
  <span style={{ opacity: active ? 1 : 0.5 }}>🔀</span>
);
const Replay = ({ active }: { active: boolean }) => (
  <span style={{ opacity: active ? 1 : 0.5 }}>🔁</span>
);
const ReplayOne = ({ active }: { active: boolean }) => (
  <span style={{ opacity: active ? 1 : 0.5 }}>🔂</span>
);

const ShuffleButton = memo(() => {
  const shuffle = useAppSelector((state) => state.player.shuffle);
  return (
    <button
      onClick={() => playerService.toggleShuffle(!shuffle).then()}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#ffffff",
      }}
    >
      <ShuffleIcon active={!!shuffle} />
    </button>
  );
});

const SkipBackButton = memo(() => {
  const disabled = useAppSelector(
    (state) => state.player.disallows?.skipping_prev
  );
  return (
    <button
      className={disabled ? "disabled" : ""}
      onClick={() => !disabled && playerService.previousTrack().then()}
      style={{
        background: "none",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        color: disabled ? "#666" : "#ffffff",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <SkipBack />
    </button>
  );
});

const PlayButton = memo(() => {
  const isPlaying = useAppSelector((state) => state.player.isPlaying);
  const disabled = useAppSelector((state) => state.player.disallows?.pausing);

  return (
    <button
      className={`player-pause-button ${disabled ? "disabled" : ""}`}
      onClick={() => {
        if (!disabled) {
          return isPlaying
            ? playerService.pausePlayback().then()
            : playerService.startPlayback().then();
        }
      }}
      style={{
        background: "none",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        color: "#ffffff",
        fontSize: "24px",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {!isPlaying ? <Play /> : <Pause />}
    </button>
  );
});

const SkipNextButton = memo(() => {
  const disabled = useAppSelector(
    (state) => state.player.disallows?.skipping_next
  );
  return (
    <button
      className={disabled ? "disabled" : ""}
      onClick={() => !disabled && playerService.nextTrack().then()}
      style={{
        background: "none",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        color: disabled ? "#666" : "#ffffff",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <SkipNext />
    </button>
  );
});

const ReplayButton = memo(() => {
  const repeatMode = useAppSelector((state) => state.player.repeatMode); // 0=off, 1=context, 2=track
  const looping = repeatMode === 1 || repeatMode === 2;

  return (
    <button
      className={repeatMode === 2 ? "active-icon-button" : ""}
      onClick={() => {
        const nextMode =
          repeatMode === 2 ? "off" : repeatMode === 1 ? "track" : "context";
        playerService.setRepeatMode(nextMode).then();
      }}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: repeatMode === 2 ? "#1db954" : "#ffffff",
      }}
    >
      {repeatMode === 2 ? <ReplayOne active /> : <Replay active={looping} />}
    </button>
  );
});

const CONTROLS = [
  ShuffleButton,
  SkipBackButton,
  PlayButton,
  SkipNextButton,
  ReplayButton,
];

const ControlButtons = memo(() => {
  return (
    <Row gutter={24} align="middle" style={{ justifyContent: "center" }}>
      {CONTROLS.map((Component, index) => (
        <Col key={index}>
          <Component />
        </Col>
      ))}
    </Row>
  );
});

ControlButtons.displayName = "ControlButtons";
export default ControlButtons;
