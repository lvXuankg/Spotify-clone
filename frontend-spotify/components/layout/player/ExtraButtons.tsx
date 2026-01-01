"use client";

import { memo } from "react";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { uiActions } from "@/store/slices/ui";
import VolumeControls from "./Volume";
import {
  UnorderedListOutlined,
  ExpandOutlined,
  CustomerServiceOutlined,
  LaptopOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import styles from "./ExtraButtons.module.css";

const LyricsButton = memo(() => {
  return (
    <button className={styles.iconBtn} title="Lyrics">
      <CustomerServiceOutlined />
    </button>
  );
});

const DetailsButton = memo(() => {
  const dispatch = useAppDispatch();
  const active = useAppSelector((state) => !state.ui.detailsCollapsed);

  return (
    <button
      className={`${styles.iconBtn} ${active ? styles.active : ""}`}
      onClick={() => dispatch(uiActions.toggleDetails())}
      title="Now playing view"
    >
      <InfoCircleOutlined />
    </button>
  );
});

const QueueButton = memo(() => {
  const dispatch = useAppDispatch();
  const queueCollapsed = useAppSelector((state) => state.ui.queueCollapsed);

  return (
    <button
      onClick={() => dispatch(uiActions.toggleQueue())}
      className={`${styles.iconBtn} ${!queueCollapsed ? styles.active : ""}`}
      title="Queue"
    >
      <UnorderedListOutlined />
    </button>
  );
});

const ExpandButton = memo(() => {
  return (
    <button className={styles.iconBtn} title="Full Screen">
      <ExpandOutlined />
    </button>
  );
});

const DeviceButton = memo(() => {
  const dispatch = useAppDispatch();
  const isDeviceOpen = useAppSelector((state) => !state.ui.devicesCollapsed);

  return (
    <button
      onClick={() => dispatch(uiActions.toggleDevices())}
      className={`${styles.iconBtn} ${isDeviceOpen ? styles.active : ""}`}
      title="Connect to a device"
    >
      <LaptopOutlined />
    </button>
  );
});

const ExtraControlButtons = memo(() => {
  return (
    <div className={styles.container}>
      <VolumeControls />
      <LyricsButton />
      <DetailsButton />
      <QueueButton />
      <DeviceButton />
      <ExpandButton />
    </div>
  );
});

LyricsButton.displayName = "LyricsButton";
DetailsButton.displayName = "DetailsButton";
QueueButton.displayName = "QueueButton";
ExpandButton.displayName = "ExpandButton";
DeviceButton.displayName = "DeviceButton";
ExtraControlButtons.displayName = "ExtraControlButtons";
export default ExtraControlButtons;
