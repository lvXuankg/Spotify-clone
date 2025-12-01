"use client";

import { FC, memo } from "react";
import { spotifyActions } from "@/store/slices/spotify";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { uiActions } from "@/store/slices/ui";
import Link from "next/link";
import Image from "next/image";

const SongDetails: FC<{ isMobile?: boolean }> = memo(() => {
  const dispatch = useAppDispatch();
  const current_track = useAppSelector(
    (state) => state.spotify.state?.track_window.current_track
  );
  const isLiked = useAppSelector((state) => state.spotify.liked);
  const detailsOpen = useAppSelector((state) => !state.ui.detailsCollapsed);

  if (!current_track) {
    return <div style={{ minWidth: 295 }}></div>;
  }

  return (
    <div
      className="flex flex-row items-center"
      style={{
        gap: "15px",
        minWidth: "295px",
        maxWidth: "295px",
      }}
    >
      {/* Album Cover */}
      <div
        className="playing-cover-container"
        style={{
          position: "relative",
          width: "60px",
          height: "60px",
          borderRadius: "4px",
          overflow: "hidden",
          cursor: "pointer",
        }}
        onClick={() => {
          dispatch(uiActions.toggleDetails());
        }}
      >
        <Image
          src={current_track?.album.images[0].url || ""}
          alt="Album Cover"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Song Info */}
      <div id="song-and-artist-name" style={{ flex: 1, minWidth: 0 }}>
        <Link href={`/album/${current_track?.album.id}`}>
          <p
            className="text-white font-bold"
            style={{
              fontSize: "14px",
              margin: "0 0 4px 0",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={current_track?.name}
          >
            {current_track?.name}
          </p>
        </Link>

        <div
          className="text-gray-400"
          style={{
            fontSize: "12px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {current_track?.artists.slice(0, 3).map((artist, i) => (
            <span key={artist.uri}>
              {i > 0 && ", "}
              <Link href={`/artist/${artist.id}`}>{artist.name}</Link>
            </span>
          ))}
        </div>
      </div>

      {/* Like Button */}
      <button
        onClick={() => {
          dispatch(spotifyActions.setLiked({ liked: !isLiked }));
        }}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        {isLiked ? "❤️" : "🤍"}
      </button>
    </div>
  );
});

SongDetails.displayName = "SongDetails";
export default SongDetails;
