"use client";

import { FC, ReactNode, memo } from "react";
import { Flex } from "antd";
import Link from "next/link";
import type { Track } from "@/interfaces/track.d";
import type { Album } from "@/interfaces/albums.d";
import type { Artist } from "@/interfaces/artist.d";
import type { Playlist } from "@/interfaces/playlists.d";

type Item = Album | Playlist | Artist | Track;

export const GridItemList: FC<{
  title?: string;
  items: Item[];
  moreUrl?: string;
  extra?: ReactNode;
  subtitle?: string;
  multipleRows?: boolean;
  onItemClick?: (item: Item) => void;
  onItemDelete?: (item: Item) => void;
  getDescription?: (item: Item) => string;
}> = memo((props) => {
  const {
    items,
    title,
    moreUrl,
    extra,
    subtitle,
    getDescription,
    onItemClick,
  } = props;

  return (
    <div>
      <Flex justify="space-between" align="center">
        <div>
          {title ? (
            moreUrl ? (
              <Link href={moreUrl} style={{ textDecoration: "none" }}>
                <h1
                  className="playlist-header"
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#ffffff",
                    margin: 0,
                  }}
                >
                  {title}
                </h1>
              </Link>
            ) : (
              <h1
                className="playlist-header"
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#ffffff",
                  margin: 0,
                }}
              >
                {title}
              </h1>
            )
          ) : null}

          {subtitle ? (
            <h2
              className="playlist-subheader"
              style={{
                fontSize: "12px",
                color: "#b3b3b3",
                margin: "4px 0 0 0",
              }}
            >
              {subtitle}
            </h2>
          ) : null}
        </div>

        {extra ? (
          extra
        ) : moreUrl ? (
          <Link href={moreUrl}>
            <span
              className="showMore"
              style={{
                color: "#1db954",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Show more
            </span>
          </Link>
        ) : null}
      </Flex>

      <div
        className="playlist-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "16px",
          marginTop: "16px",
          ...(props.multipleRows ? { gridTemplateRows: "unset" } : {}),
        }}
      >
        {(items || []).map((item) => (
          <div key={item.id || item.uri} style={{ position: "relative" }}>
            <GridItemComponent
              item={item}
              getDescription={getDescription}
              onClick={onItemClick ? () => onItemClick(item) : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

GridItemList.displayName = "GridItemList";

// Helper component to render grid items
const GridItemComponent: FC<{
  item: Item;
  onClick?: () => void;
  getDescription?: (item: Item) => string;
}> = memo(({ item, onClick, getDescription }) => {
  const {
    TrackCard,
    AlbumCard,
    PlaylistCard,
    ArtistCard,
  } = require("./GridCards");

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
  };

  if (item.type === "track") {
    return <TrackCard item={item} onClick={handleClick} />;
  }

  if (item.type === "album") {
    return (
      <AlbumCard
        item={item}
        onClick={handleClick}
        getDescription={getDescription}
      />
    );
  }

  if (item.type === "playlist") {
    return (
      <PlaylistCard
        item={item}
        onClick={handleClick}
        getDescription={getDescription}
      />
    );
  }

  if (item.type === "artist") {
    return (
      <ArtistCard
        item={item}
        onClick={handleClick}
        getDescription={getDescription}
      />
    );
  }

  return null;
});

GridItemComponent.displayName = "GridItemComponent";

export default GridItemList;
