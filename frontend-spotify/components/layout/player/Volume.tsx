"use client";

import { Slider } from "antd";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { spotifyActions } from "@/store/slices/spotify";
import { memo } from "react";

export const Volume = memo(() => {
  const dispatch = useAppDispatch();
  const volume = useAppSelector((state) => state.spotify.volume || 50);

  return (
    <div style={{ width: "200px", padding: "10px" }}>
      <Slider
        min={0}
        max={100}
        value={volume}
        onChange={(value) => {
          dispatch(spotifyActions.setVolume(value as number));
        }}
      />
    </div>
  );
});

Volume.displayName = "Volume";
