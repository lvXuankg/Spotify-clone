"use client";

import { memo } from "react";
import ControlButtons from "./ControlButtons";
import SongProgressBar from "./SongProgressBar";

const PlayControls = memo(() => {
  return (
    <div
      style={{
        marginTop: 5,
        marginBottom: -5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "40%",
      }}
    >
      <ControlButtons />
      <SongProgressBar />
    </div>
  );
});

PlayControls.displayName = "PlayControls";
export default PlayControls;
