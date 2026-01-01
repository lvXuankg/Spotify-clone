"use client";

import { memo, useState } from "react";
import { Button, Tooltip, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  PlusOutlined,
  MenuOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  CompressOutlined,
  ExpandOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  getLibraryCollapsed,
  getLibraryViewMode,
  uiActions,
} from "@/store/slices/ui";
import { playlistActions } from "@/store/slices/playlist";
import { yourLibraryActions } from "@/store/slices/yourLibrary";
import { useRouter } from "next/navigation";
import type { LibraryViewMode } from "@/store/slices/yourLibrary";
import styles from "./PlaylistHeader.module.css";

// Library icon SVG component
const LibraryIcon = () => (
  <svg
    role="img"
    height="24"
    width="24"
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z" />
  </svg>
);

const VIEW_MODE_ICONS: Record<LibraryViewMode, React.ReactNode> = {
  list: <UnorderedListOutlined />,
  "compact-list": <MenuOutlined />,
  grid: <AppstoreOutlined />,
  "compact-grid": <AppstoreOutlined style={{ fontSize: "12px" }} />,
};

const VIEW_MODE_LABELS: Record<LibraryViewMode, string> = {
  list: "List",
  "compact-list": "Compact List",
  grid: "Grid",
  "compact-grid": "Compact Grid",
};

export const PlaylistHeader = memo(() => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation(["navbar"]);
  const collapsed = useAppSelector(getLibraryCollapsed);
  const viewMode = useAppSelector(getLibraryViewMode);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const createLoading = useAppSelector((state) => state.playlist.createLoading);

  const handleToggleCollapse = () => {
    dispatch(uiActions.toggleLibrary());
  };

  const handleCreatePlaylist = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    try {
      const result = await dispatch(
        playlistActions.createPlaylistDefault()
      ).unwrap();
      // Refresh library playlists
      dispatch(yourLibraryActions.fetchMyPlaylists());
      // Navigate to the new playlist
      router.push(`/playlist/${result.id}`);
    } catch (error) {
      console.error("Failed to create playlist:", error);
    }
  };

  const viewModeMenuItems: MenuProps["items"] = [
    {
      key: "list",
      icon: VIEW_MODE_ICONS.list,
      label: VIEW_MODE_LABELS.list,
      onClick: () => dispatch(uiActions.setLibraryViewMode("list")),
    },
    {
      key: "compact-list",
      icon: VIEW_MODE_ICONS["compact-list"],
      label: VIEW_MODE_LABELS["compact-list"],
      onClick: () => dispatch(uiActions.setLibraryViewMode("compact-list")),
    },
    {
      key: "grid",
      icon: VIEW_MODE_ICONS.grid,
      label: VIEW_MODE_LABELS.grid,
      onClick: () => dispatch(uiActions.setLibraryViewMode("grid")),
    },
    {
      key: "compact-grid",
      icon: VIEW_MODE_ICONS["compact-grid"],
      label: VIEW_MODE_LABELS["compact-grid"],
      onClick: () => dispatch(uiActions.setLibraryViewMode("compact-grid")),
    },
  ];

  // Collapsed state
  if (collapsed) {
    return (
      <div className={styles.headerCollapsed}>
        <Tooltip placement="right" title={t("Expand your library")}>
          <Button
            type="text"
            icon={<LibraryIcon />}
            onClick={handleToggleCollapse}
            className={styles.iconButton}
          />
        </Tooltip>
      </div>
    );
  }

  // Expanded state
  return (
    <div className={styles.header}>
      <div className={styles.titleSection}>
        <Tooltip placement="top" title={t("Collapse your library")}>
          <Button
            type="text"
            icon={<LibraryIcon />}
            onClick={handleToggleCollapse}
            className={styles.iconButton}
          />
        </Tooltip>
        <span className={styles.title}>{t("Your Library")}</span>
      </div>

      <div className={styles.actions}>
        {isAuthenticated && (
          <>
            <Tooltip title={t("Create playlist")}>
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={handleCreatePlaylist}
                loading={createLoading}
                className={styles.iconButton}
              />
            </Tooltip>

            <Dropdown
              menu={{
                items: viewModeMenuItems,
                selectedKeys: [viewMode],
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Tooltip title={t("View options")}>
                <Button
                  type="text"
                  icon={VIEW_MODE_ICONS[viewMode as LibraryViewMode]}
                  className={styles.iconButton}
                />
              </Tooltip>
            </Dropdown>
          </>
        )}
      </div>
    </div>
  );
});

PlaylistHeader.displayName = "PlaylistHeader";
