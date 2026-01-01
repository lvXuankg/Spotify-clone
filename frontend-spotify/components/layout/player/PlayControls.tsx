"use client";

import { memo } from "react";
import ControlButtons from "./ControlButtons";
import SongProgressBar from "./SongProgressBar";
import styles from "./PlayControls.module.css";

const PlayControls = memo(() => {
  return (
    <div className={styles.container}>
      <ControlButtons />
      <SongProgressBar />
    </div>
  );
});

PlayControls.displayName = "PlayControls";
export default PlayControls;
