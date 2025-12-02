"use client";

import { memo, useEffect, useState } from "react";
import { Slider } from "@/components/Slider";
import { msToTime } from "@/utils/utils";
import { useAppSelector } from "@/store/store";
import { playerService } from "@/services/player";

const SongProgressBar = memo(() => {
  const loaded = useAppSelector((state) => !!state.player.currentTrack);
  const progress_ms = useAppSelector((state) => state.player.progress_ms);
  const duration_ms = useAppSelector((state) => state.player.duration_ms);

  const [value, setValue] = useState<number>(0);
  const [selecting, setSelecting] = useState<boolean>(false);

  useEffect(() => {
    if (progress_ms && duration_ms && !selecting) {
      setValue(
        duration_ms
          ? progress_ms >= duration_ms
            ? 0
            : progress_ms / duration_ms
          : 0
      );
    }
  }, [progress_ms, duration_ms, selecting]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <div style={{ color: "white", marginRight: "8px", fontSize: "12px" }}>
        {progress_ms ? msToTime(progress_ms) : "0:00"}
      </div>
      <div style={{ width: "100%" }}>
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
            const newPosition = Math.round((duration_ms || 0) * value);
            playerService.seek(newPosition).then();
          }}
        />
      </div>
      <div style={{ color: "white", marginLeft: "8px", fontSize: "12px" }}>
        {duration_ms ? msToTime(duration_ms) : "0:00"}
      </div>
    </div>
  );
});

SongProgressBar.displayName = "SongProgressBar";
export default SongProgressBar;
