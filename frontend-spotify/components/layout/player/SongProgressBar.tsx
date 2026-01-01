"use client";

import { memo, useEffect, useState } from "react";
import { Slider } from "@/components/Slider";
import { msToTime } from "@/utils/utils";
import { useAudioPlayerContext } from "@/components/providers/AudioPlayerProvider";

import styles from "./SongProgressBar.module.css";

const SongProgressBar = memo(() => {
  const { currentTrack, currentTime, duration, seek } = useAudioPlayerContext();
  const loaded = !!currentTrack;

  // Convert seconds to ms for display
  const progress_ms = Math.floor(currentTime * 1000);
  const duration_ms = Math.floor(duration * 1000);

  const [value, setValue] = useState<number>(0);
  const [selecting, setSelecting] = useState<boolean>(false);

  useEffect(() => {
    if (currentTime && duration && !selecting) {
      setValue(
        duration ? (currentTime >= duration ? 0 : currentTime / duration) : 0
      );
    }
  }, [currentTime, duration, selecting]);

  return (
    <div className={styles.container}>
      <span className={styles.time}>
        {progress_ms ? msToTime(progress_ms) : "0:00"}
      </span>
      <div className={styles.sliderWrapper}>
        <Slider
          isEnabled
          value={value}
          onChangeStart={() => {
            setSelecting(true);
          }}
          onChange={(value) => {
            setValue(value);
          }}
          onChangeEnd={(value) => {
            setSelecting(false);
            if (!loaded) return;
            setValue(value);
            const newPositionSeconds = (duration || 0) * value;
            seek(newPositionSeconds);
          }}
        />
      </div>
      <span className={styles.time}>
        {duration_ms ? msToTime(duration_ms) : "0:00"}
      </span>
    </div>
  );
});

SongProgressBar.displayName = "SongProgressBar";
export default SongProgressBar;
