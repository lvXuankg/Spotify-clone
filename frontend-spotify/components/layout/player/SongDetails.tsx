"use client";

import { memo } from "react";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { playerActions } from "@/store/slices/player";

const SongDetails = memo(() => {
  const dispatch = useAppDispatch();

  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const isLiked = useAppSelector((state) => state.player.isLiked);

  if (!currentTrack) {
    return <div style={{ minWidth: 295 }}></div>;
  }

  const handleToggle = () => {
    dispatch(playerActions.setLiked(!isLiked));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        minWidth: 295,
      }}
    >
      <div style={{ marginRight: 15 }}>
        <div style={{ position: "relative" }}>
          <img
            alt="Album Cover"
            src={currentTrack?.album?.images?.[0]?.url}
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "4px",
              objectFit: "cover",
            }}
          />
          <button
            onClick={handleToggle}
            style={{
              position: "absolute",
              bottom: "4px",
              right: "4px",
              background: "#1db954",
              border: "none",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isLiked ? "#ffffff" : "#000000",
              fontSize: "12px",
            }}
          >
            {isLiked ? "❤️" : "🤍"}
          </button>
        </div>
      </div>

      <div style={{ color: "#ffffff" }}>
        <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>
          {currentTrack?.name}
        </p>
        <p style={{ margin: 0, color: "#b3b3b3", fontSize: "12px" }}>
          {currentTrack?.artists?.map((a: any) => a.name).join(", ")}
        </p>
      </div>
    </div>
  );
});

SongDetails.displayName = "SongDetails";
export default SongDetails;
