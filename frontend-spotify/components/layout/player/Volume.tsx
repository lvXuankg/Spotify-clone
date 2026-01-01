"use client";

import { memo, useState, useEffect } from "react";
import { Tooltip } from "antd";
import { Slider } from "@/components/Slider";
import { useAudioPlayerContext } from "@/components/providers/AudioPlayerProvider";
import { SoundOutlined, SoundFilled } from "@ant-design/icons";

import styles from "./Volume.module.css";

const VolumeIcon = ({ volume, muted }: { volume: number; muted: boolean }) => {
  // Using different visual representations
  if (muted || volume === 0) {
    return (
      <div className={styles.iconWrapper}>
        <SoundOutlined className={styles.icon} />
        <div className={styles.muteLine} />
      </div>
    );
  }
  return <SoundFilled className={styles.icon} />;
};

export const VolumeControls = memo(() => {
  const {
    volume: playerVolume,
    isMuted,
    setVolume: setPlayerVolume,
    toggleMute,
  } = useAudioPlayerContext();

  const [volume, setVolume] = useState<number>(playerVolume);
  const [prevVolume, setPrevVolume] = useState<number>(playerVolume);

  // Sync with player
  useEffect(() => {
    if (!isMuted) {
      setVolume(playerVolume);
    }
  }, [playerVolume, isMuted]);

  return (
    <div className={styles.container}>
      <Tooltip title={isMuted ? "Bật âm" : "Tắt âm"}>
        <button
          onClick={() => {
            if (isMuted) {
              setPlayerVolume(prevVolume || 0.8);
              setVolume(prevVolume || 0.8);
            } else {
              setPrevVolume(volume);
            }
            toggleMute();
          }}
          className={styles.volumeBtn}
        >
          <VolumeIcon volume={volume} muted={isMuted} />
        </button>
      </Tooltip>

      <div className={styles.sliderWrapper}>
        <Slider
          isEnabled
          value={isMuted ? 0 : volume}
          onChange={(value) => {
            setVolume(value);
          }}
          onChangeEnd={(value) => {
            setVolume(value);
            setPlayerVolume(value);
            if (value > 0 && isMuted) {
              toggleMute();
            }
          }}
        />
      </div>
    </div>
  );
});

VolumeControls.displayName = "VolumeControls";
export default VolumeControls;
