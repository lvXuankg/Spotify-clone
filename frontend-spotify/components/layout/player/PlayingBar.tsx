"use client";

import SongDetails from "./SongDetails";
import PlayControls from "./PlayControls";
import ExtraControlButtons from "./ExtraButtons";
import { OtherDeviceAlert } from "./OtherDeviceAlert";
import { memo } from "react";
import "@/styles/PlayingBar.scss";

const NowPlayingBar = memo(() => {
  return (
    <>
      <div className="playing-bar-desktop">
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
