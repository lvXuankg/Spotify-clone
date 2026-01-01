"use client";

import { memo } from "react";
import { useAppSelector } from "@/store/store";
import { useAudioPlayerContext } from "@/components/providers/AudioPlayerProvider";
import { CustomerServiceOutlined } from "@ant-design/icons";
import Link from "next/link";

import styles from "./SongDetails.module.css";

const SongDetails = memo(() => {
  const { currentTrack } = useAudioPlayerContext();
  const reduxTrack = useAppSelector((state) => state.player.currentTrack);

  // Use audio context track or fall back to redux
  const track = currentTrack || reduxTrack;

  if (!track) {
    return <div className={styles.empty}></div>;
  }

  // Get display values from either source
  const title = currentTrack?.title || reduxTrack?.name || "Unknown";
  const artistName =
    currentTrack?.artistName ||
    reduxTrack?.artists?.map((a: any) => a.name).join(", ") ||
    "Unknown Artist";
  const albumCover =
    currentTrack?.albumCoverUrl || reduxTrack?.album?.images?.[0]?.url;
  const albumId = currentTrack?.albumId || reduxTrack?.album?.id;

  return (
    <div className={styles.container}>
      <div className={styles.coverWrapper}>
        {albumCover ? (
          <img alt="Album Cover" src={albumCover} className={styles.cover} />
        ) : (
          <div className={styles.placeholder}>
            <CustomerServiceOutlined className={styles.placeholderIcon} />
          </div>
        )}
      </div>

      <div className={styles.info}>
        {albumId ? (
          <Link href={`/album/${albumId}`} className={styles.title}>
            {title}
          </Link>
        ) : (
          <span className={styles.title}>{title}</span>
        )}
        <span className={styles.artist}>{artistName}</span>
      </div>
    </div>
  );
});

SongDetails.displayName = "SongDetails";
export default SongDetails;
