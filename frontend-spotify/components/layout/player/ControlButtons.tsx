"use client";

import { memo } from "react";
import { Button, Space, Tooltip } from "antd";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { playerActions } from "@/store/slices/player";
import { useAudioPlayerContext } from "@/components/providers/AudioPlayerProvider";
import {
  PlayCircleFilled,
  PauseCircleFilled,
  StepBackwardFilled,
  StepForwardFilled,
  RetweetOutlined,
  SwapOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import styles from "./ControlButtons.module.css";

const ShuffleButton = memo(() => {
  const dispatch = useAppDispatch();
  const shuffle = useAppSelector((state) => state.player.shuffle);

  return (
    <Tooltip title={shuffle ? "Tắt phát ngẫu nhiên" : "Bật phát ngẫu nhiên"}>
      <button
        onClick={() => dispatch(playerActions.setShuffle(!shuffle))}
        className={`${styles.controlBtn} ${shuffle ? styles.active : ""}`}
      >
        <SwapOutlined className={styles.icon} />
      </button>
    </Tooltip>
  );
});

ShuffleButton.displayName = "ShuffleButton";

const SkipBackButton = memo(() => {
  const { previous, currentTrack } = useAudioPlayerContext();
  const disabled = !currentTrack;

  return (
    <Tooltip title="Bài trước">
      <button
        onClick={() => !disabled && previous()}
        className={`${styles.controlBtn} ${disabled ? styles.disabled : ""}`}
        disabled={disabled}
      >
        <StepBackwardFilled className={styles.icon} />
      </button>
    </Tooltip>
  );
});

SkipBackButton.displayName = "SkipBackButton";

const PlayButton = memo(() => {
  const { isPlaying, togglePlay, currentTrack, isLoading } =
    useAudioPlayerContext();
  const disabled = !currentTrack || isLoading;

  return (
    <Tooltip title={isPlaying ? "Tạm dừng" : "Phát"}>
      <button
        onClick={() => !disabled && togglePlay()}
        className={`${styles.playBtn} ${disabled ? styles.disabled : ""}`}
        disabled={disabled}
      >
        {isLoading ? (
          <LoadingOutlined className={styles.playIcon} spin />
        ) : isPlaying ? (
          <PauseCircleFilled className={styles.playIcon} />
        ) : (
          <PlayCircleFilled className={styles.playIcon} />
        )}
      </button>
    </Tooltip>
  );
});

PlayButton.displayName = "PlayButton";

const SkipNextButton = memo(() => {
  const { next, queue, queueIndex } = useAudioPlayerContext();
  const disabled = queue.length === 0 || queueIndex >= queue.length - 1;

  return (
    <Tooltip title="Bài tiếp">
      <button
        onClick={() => !disabled && next()}
        className={`${styles.controlBtn} ${disabled ? styles.disabled : ""}`}
        disabled={disabled}
      >
        <StepForwardFilled className={styles.icon} />
      </button>
    </Tooltip>
  );
});

SkipNextButton.displayName = "SkipNextButton";

const ReplayButton = memo(() => {
  const dispatch = useAppDispatch();
  const repeatMode = useAppSelector((state) => state.player.repeatMode);

  const getTitle = () => {
    switch (repeatMode) {
      case 0:
        return "Bật lặp lại";
      case 1:
        return "Lặp lại một bài";
      case 2:
        return "Tắt lặp lại";
      default:
        return "Lặp lại";
    }
  };

  return (
    <Tooltip title={getTitle()}>
      <button
        onClick={() => {
          const nextMode: 0 | 1 | 2 =
            repeatMode === 2 ? 0 : repeatMode === 1 ? 2 : 1;
          dispatch(playerActions.setRepeatMode(nextMode));
        }}
        className={`${styles.controlBtn} ${
          repeatMode > 0 ? styles.active : ""
        }`}
      >
        <RetweetOutlined className={styles.icon} />
        {repeatMode === 2 && <span className={styles.repeatOne}>1</span>}
      </button>
    </Tooltip>
  );
});

ReplayButton.displayName = "ReplayButton";

const ControlButtons = memo(() => {
  return (
    <div className={styles.container}>
      <Space size="middle" align="center">
        <ShuffleButton />
        <SkipBackButton />
        <PlayButton />
        <SkipNextButton />
        <ReplayButton />
      </Space>
    </div>
  );
});

ControlButtons.displayName = "ControlButtons";
export default ControlButtons;
