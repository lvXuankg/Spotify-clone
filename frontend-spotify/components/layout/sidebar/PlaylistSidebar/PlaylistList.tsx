"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { Empty, Spin } from "antd";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  getLibraryItems,
  getLibraryLoading,
  type LibraryItem,
} from "@/store/slices/yourLibrary";
import {
  getLibraryCollapsed,
  getLibraryViewMode,
  uiActions,
} from "@/store/slices/ui";
import type { LibraryViewMode } from "@/store/slices/yourLibrary";
import styles from "./PlaylistList.module.css";

// Default playlist cover
const DEFAULT_COVER = "https://misc.scdn.co/liked-songs/liked-songs-640.png";

// Type icons
const TYPE_ICONS: Record<string, string> = {
  playlist: "📋",
  album: "💿",
  artist: "🎤",
};

interface PlaylistItemProps {
  item: LibraryItem;
  viewMode: LibraryViewMode;
  collapsed: boolean;
  onClick: () => void;
}

const PlaylistItem = memo(
  ({ item, viewMode, collapsed, onClick }: PlaylistItemProps) => {
    const imageUrl = item.image_url || DEFAULT_COVER;
    const isGrid = viewMode === "grid" || viewMode === "compact-grid";
    const isCompact =
      viewMode === "compact-list" || viewMode === "compact-grid";

    // Collapsed view - only show icon
    if (collapsed) {
      return (
        <div
          className={styles.itemCollapsed}
          onClick={onClick}
          title={item.name}
        >
          <img
            src={imageUrl}
            alt={item.name}
            className={styles.imageCollapsed}
          />
        </div>
      );
    }

    // Grid view
    if (isGrid) {
      return (
        <div
          className={`${styles.itemGrid} ${isCompact ? styles.compact : ""}`}
          onClick={onClick}
        >
          <div className={styles.imageWrapperGrid}>
            <img
              src={imageUrl}
              alt={item.name}
              className={`${styles.imageGrid} ${
                item.type === "artist" ? styles.roundImage : ""
              }`}
            />
            <div className={styles.playOverlay}>
              <span className={styles.playIcon}>▶</span>
            </div>
          </div>
          <div className={styles.infoGrid}>
            <span className={styles.nameGrid}>{item.name}</span>
            {!isCompact && (
              <span className={styles.subtitleGrid}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                {item.song_count !== undefined && ` • ${item.song_count} songs`}
              </span>
            )}
          </div>
        </div>
      );
    }

    // List view
    return (
      <div
        className={`${styles.itemList} ${isCompact ? styles.compact : ""}`}
        onClick={onClick}
      >
        <img
          src={imageUrl}
          alt={item.name}
          className={`${styles.imageList} ${
            item.type === "artist" ? styles.roundImage : ""
          } ${isCompact ? styles.imageCompact : ""}`}
        />
        <div className={styles.infoList}>
          <span className={styles.nameList}>{item.name}</span>
          {!isCompact && (
            <span className={styles.subtitleList}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              {item.song_count !== undefined && ` • ${item.song_count} songs`}
            </span>
          )}
        </div>
      </div>
    );
  }
);

PlaylistItem.displayName = "PlaylistItem";

export const PlaylistList = memo(() => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector(getLibraryItems);
  const loading = useAppSelector(getLibraryLoading);
  const collapsed = useAppSelector(getLibraryCollapsed);
  const viewMode = useAppSelector(getLibraryViewMode) as LibraryViewMode;
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleItemClick = (item: LibraryItem) => {
    // Collapse sidebar on mobile
    if (window.innerWidth < 900) {
      dispatch(uiActions.collapseLibrary());
    }

    switch (item.type) {
      case "playlist":
        router.push(`/playlist/${item.id}`);
        break;
      case "album":
        router.push(`/album/${item.id}`);
        break;
      case "artist":
        router.push(`/artist/${item.id}`);
        break;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.emptyState}>
        <p>Sign in to see your library</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <Spin size="default" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Your library is empty"
        />
      </div>
    );
  }

  const isGrid = viewMode === "grid" || viewMode === "compact-grid";

  return (
    <div
      className={`${styles.list} ${
        isGrid && !collapsed ? styles.gridLayout : ""
      }`}
    >
      {items.map((item) => (
        <PlaylistItem
          key={`${item.type}-${item.id}`}
          item={item}
          viewMode={viewMode}
          collapsed={collapsed}
          onClick={() => handleItemClick(item)}
        />
      ))}
    </div>
  );
});

PlaylistList.displayName = "PlaylistList";
