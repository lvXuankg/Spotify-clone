"use client";

import { memo, type ReactNode, useEffect } from "react";
import { Navbar } from "./navbar";
import PlayingBar from "./player/PlayingBar";
import { PlaylistSidebar } from "./sidebar/PlaylistSidebar";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchProfile } from "@/store/slices/profile";
import { getLibraryCollapsed } from "@/store/slices/ui";
import styles from "./AppLayout.module.css";

export const AppLayout = memo(({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { profile, loading } = useAppSelector((state) => state.profile);
  const libraryCollapsed = useAppSelector(getLibraryCollapsed);

  useEffect(() => {
    if (isAuthenticated && !profile && !loading) {
      dispatch(fetchProfile());
    }
  }, [isAuthenticated, profile, loading, dispatch]);

  return (
    <div className={styles.appLayout}>
      {/* Main Container */}
      <div className={styles.mainContainer}>
        {/* Sidebar */}
        <aside
          className={`${styles.sidebar} ${
            libraryCollapsed ? styles.collapsed : ""
          }`}
        >
          <PlaylistSidebar />
        </aside>

        {/* Content Area */}
        <div className={styles.contentArea}>
          {/* Navbar */}
          <header className={styles.header}>
            <Navbar />
          </header>

          {/* Main Content */}
          <main className={styles.mainContent}>{children}</main>
        </div>
      </div>

      {/* Player Bar */}
      <PlayingBar />
    </div>
  );
});

AppLayout.displayName = "AppLayout";
export default AppLayout;
