"use client";

import { memo } from "react";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { uiActions } from "@/store/slices/ui";
import VolumeControls from "./Volume";

// Icons
const DetailsIcon = ({ active }: { active: boolean }) => (
  <span style={{ opacity: active ? 1 : 0.7 }}>📋</span>
);
const QueueIcon = ({ active }: { active: boolean }) => (
  <span style={{ opacity: active ? 1 : 0.7 }}>📝</span>
);
const ExpandIcon = () => <span>⛶</span>;
const MicrophoneIcon = () => <span>🎤</span>;
const DeviceIcon = ({ active }: { active: boolean }) => (
  <span style={{ opacity: active ? 1 : 0.7 }}>📱</span>
);
const PhoneIcon = ({ active }: { active: boolean }) => (
  <span style={{ opacity: active ? 1 : 0.7 }}>☎️</span>
);

const LyricsButton = memo(() => {
  return (
    <button
      style={{
        marginLeft: 5,
        marginRight: 5,
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#ffffff",
      }}
      title="Lyrics"
    >
      <MicrophoneIcon />
    </button>
  );
});

const DetailsButton = memo(() => {
  const dispatch = useAppDispatch();
  const active = useAppSelector((state) => !state.ui.detailsCollapsed);

  return (
    <button
      style={{
        marginLeft: 5,
        marginRight: 10,
        background: "none",
        border: "none",
        cursor: "pointer",
        color: active ? "#1db954" : "#ffffff",
      }}
      onClick={() => dispatch(uiActions.toggleDetails())}
      title="Now playing view"
    >
      <DetailsIcon active={active} />
    </button>
  );
});

const QueueButton = memo(() => {
  const dispatch = useAppDispatch();
  const queueCollapsed = useAppSelector((state) => state.ui.queueCollapsed);

  return (
    <button
      onClick={() => dispatch(uiActions.toggleQueue())}
      style={{
        marginLeft: 10,
        marginRight: 5,
        background: "none",
        border: "none",
        cursor: queueCollapsed ? "pointer" : "not-allowed",
        color: !queueCollapsed ? "#1db954" : "#ffffff",
      }}
      title="Queue"
    >
      <QueueIcon active={!queueCollapsed} />
    </button>
  );
});

const ExpandButton = memo(() => {
  return (
    <button
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#ffffff",
        marginLeft: 10,
      }}
      title="Full Screen"
    >
      <ExpandIcon />
    </button>
  );
});

const DeviceButton = memo(() => {
  const dispatch = useAppDispatch();
  const isDeviceOpen = useAppSelector((state) => !state.ui.devicesCollapsed);

  return (
    <button
      onClick={() => dispatch(uiActions.toggleDevices())}
      className={isDeviceOpen ? "active-icon-button" : ""}
      style={{
        marginTop: 4,
        background: "none",
        border: "none",
        cursor: "pointer",
        color: isDeviceOpen ? "#1db954" : "#ffffff",
      }}
      title="Connect to a device"
    >
      <DeviceIcon active={isDeviceOpen} />
    </button>
  );
});

const ExtraControlButtons = memo(() => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <VolumeControls />
      <LyricsButton />
      <DetailsButton />
      <QueueButton />
      <DeviceButton />
      <ExpandButton />
    </div>
  );
});

ExtraControlButtons.displayName = "ExtraControlButtons";
export default ExtraControlButtons;
