"use client";

import { memo, FC } from "react";
import { Card, Image } from "antd";
import Link from "next/link";
import type { Track, Album, Artist, Playlist } from "@/interfaces";

// TrackCard
export const TrackCard: FC<{
  item: Track;
  onClick?: () => void;
}> = memo(({ item, onClick }) => (
  <div onClick={onClick} style={{ cursor: "pointer" }}>
    <Card
      hoverable
      style={{
        backgroundColor: "#282828",
        border: "none",
      }}
      cover={
        <Image
          src={item.album?.images?.[0]?.url}
          alt={item.name}
          style={{ height: "150px", objectFit: "cover" }}
          preview={false}
        />
      }
    >
      <p
        style={{
          margin: 0,
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: "12px",
        }}
      >
        {item.name}
      </p>
      <p style={{ margin: "4px 0 0 0", color: "#b3b3b3", fontSize: "12px" }}>
        {item.artists?.[0]?.name}
      </p>
    </Card>
  </div>
));

TrackCard.displayName = "TrackCard";

// AlbumCard
export const AlbumCard: FC<{
  item: Album;
  onClick?: () => void;
  getDescription?: (item: any) => string;
}> = memo(({ item, onClick, getDescription }) => (
  <div onClick={onClick} style={{ cursor: "pointer" }}>
    <Card
      hoverable
      style={{
        backgroundColor: "#282828",
        border: "none",
      }}
      cover={
        <Image
          src={item.images?.[0]?.url}
          alt={item.name}
          style={{ height: "150px", objectFit: "cover" }}
          preview={false}
        />
      }
    >
      <p
        style={{
          margin: 0,
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: "12px",
        }}
      >
        {item.name}
      </p>
      <p style={{ margin: "4px 0 0 0", color: "#b3b3b3", fontSize: "12px" }}>
        {getDescription?.(item) || item.artists?.[0]?.name}
      </p>
    </Card>
  </div>
));

AlbumCard.displayName = "AlbumCard";

// ArtistCard
export const ArtistCard: FC<{
  item: Artist;
  onClick?: () => void;
  getDescription?: (item: any) => string;
}> = memo(({ item, onClick, getDescription }) => (
  <div onClick={onClick} style={{ cursor: "pointer" }}>
    <Card
      hoverable
      style={{
        backgroundColor: "#282828",
        border: "none",
        borderRadius: "8px",
        textAlign: "center",
      }}
      cover={
        <Image
          src={item.images?.[0]?.url}
          alt={item.name}
          style={{ height: "150px", borderRadius: "50%", objectFit: "cover" }}
          preview={false}
        />
      }
    >
      <p
        style={{
          margin: 0,
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: "12px",
        }}
      >
        {item.name}
      </p>
      <p style={{ margin: "4px 0 0 0", color: "#b3b3b3", fontSize: "12px" }}>
        Artist
      </p>
    </Card>
  </div>
));

ArtistCard.displayName = "ArtistCard";

// PlaylistCard
export const PlaylistCard: FC<{
  item: Playlist;
  onClick?: () => void;
  getDescription?: (item: any) => string;
}> = memo(({ item, onClick, getDescription }) => (
  <div onClick={onClick} style={{ cursor: "pointer" }}>
    <Card
      hoverable
      style={{
        backgroundColor: "#282828",
        border: "none",
      }}
      cover={
        <Image
          src={item.images?.[0]?.url || "/images/playlist.png"}
          alt={item.name}
          style={{ height: "150px", objectFit: "cover" }}
          preview={false}
        />
      }
    >
      <p
        style={{
          margin: 0,
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: "12px",
        }}
      >
        {item.name}
      </p>
      <p style={{ margin: "4px 0 0 0", color: "#b3b3b3", fontSize: "12px" }}>
        {getDescription?.(item) || item.owner?.display_name}
      </p>
    </Card>
  </div>
));

PlaylistCard.displayName = "PlaylistCard";
