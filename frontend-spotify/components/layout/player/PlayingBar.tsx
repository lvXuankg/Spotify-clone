"use client";

import SongDetails from "./SongDetails";
import PlayControls from "./PlayControls";
import ExtraControlButtons from "./ExtraButtons";
import { OtherDeviceAlert } from "./OtherDeviceAlert";
import { memo } from "react";

const NowPlayingBar = memo(() => {
  return (
    <>
      <div
        className="playing-bar-desktop"
        style={{
          width: "100%",
          backgroundColor: "#000000",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          height: "105px",
          boxSizing: "border-box",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <SongDetails />
        <PlayControls />
        <ExtraControlButtons />
      </div>

      <OtherDeviceAlert />

      <div className="playing-bar-mobile">{/* Mobile player UI here */}</div>
    </>
  );
});

NowPlayingBar.displayName = "NowPlayingBar";
export default NowPlayingBar;
