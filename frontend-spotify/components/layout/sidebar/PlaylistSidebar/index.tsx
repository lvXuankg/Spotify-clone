"use client";

import { memo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  yourLibraryActions,
  getLibraryLoading,
} from "@/store/slices/yourLibrary";
import { getLibraryCollapsed } from "@/store/slices/ui";
import { PlaylistHeader } from "./PlaylistHeader";
import { PlaylistList } from "./PlaylistList";
import { PlaylistFilters } from "./PlaylistFilters";
import styles from "./PlaylistSidebar.module.css";

export const PlaylistSidebar = memo(() => {
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector(getLibraryCollapsed);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const loading = useAppSelector(getLibraryLoading);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(yourLibraryActions.fetchMyPlaylists());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <div className={`${styles.container} ${collapsed ? styles.collapsed : ""}`}>
      <PlaylistHeader />

      {!collapsed && isAuthenticated && <PlaylistFilters />}

      <div className={styles.listWrapper}>
        <PlaylistList />
      </div>
    </div>
  );
});

PlaylistSidebar.displayName = "PlaylistSidebar";
export default PlaylistSidebar;
