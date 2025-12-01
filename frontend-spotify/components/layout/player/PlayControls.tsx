"use client";

import ControlButtons from "./ControlButtons";
import SongProgressBar from "./SongProgressBar";

const PlayControls = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        flex: 1,
        maxWidth: "400px",
      }}
    >
      <ControlButtons />
      <SongProgressBar />
    </div>
  );
};

export default PlayControls;
