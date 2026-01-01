"use client";

import { memo, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  homeActions,
  selectLatestAlbums,
  selectLatestAlbumsLoading,
  selectRecentlyUpdatedAlbums,
  selectRecentlyUpdatedAlbumsLoading,
  selectLatestPlaylists,
  selectLatestPlaylistsLoading,
  selectRecentlyUpdatedPlaylists,
  selectRecentlyUpdatedPlaylistsLoading,
} from "@/store/slices/home";
import PageHeader from "@/components/layout/PageHeader";
import { MediaSection } from "./components/MediaSection";
import styles from "./page.module.css";

const Home = memo(() => {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Selectors
  const latestAlbums = useAppSelector(selectLatestAlbums);
  const latestAlbumsLoading = useAppSelector(selectLatestAlbumsLoading);
  const recentlyUpdatedAlbums = useAppSelector(selectRecentlyUpdatedAlbums);
  const recentlyUpdatedAlbumsLoading = useAppSelector(
    selectRecentlyUpdatedAlbumsLoading
  );
  const latestPlaylists = useAppSelector(selectLatestPlaylists);
  const latestPlaylistsLoading = useAppSelector(selectLatestPlaylistsLoading);
  const recentlyUpdatedPlaylists = useAppSelector(
    selectRecentlyUpdatedPlaylists
  );
  const recentlyUpdatedPlaylistsLoading = useAppSelector(
    selectRecentlyUpdatedPlaylistsLoading
  );

  useEffect(() => {
    dispatch(homeActions.fetchLatestAlbums(10));
    dispatch(homeActions.fetchRecentlyUpdatedAlbums(10));
    dispatch(homeActions.fetchLatestPlaylists(10));
    dispatch(homeActions.fetchRecentlyUpdatedPlaylists(10));
  }, [dispatch]);

  return (
    <div ref={containerRef} className={styles.container}>
      <PageHeader
        color="#121212"
        container={containerRef}
        sectionContainer={sectionRef}
      >
        <h1 className={styles.welcomeTitle}>Welcome back! 🎵</h1>
      </PageHeader>

      <div ref={sectionRef} className={styles.content}>
        {/* Latest Albums */}
        <MediaSection
          title="Mới phát hành"
          items={latestAlbums}
          loading={latestAlbumsLoading}
          type="album"
          viewAllUrl="/albums?sort=latest"
        />

        {/* Recently Updated Albums */}
        <MediaSection
          title="Album mới cập nhật"
          items={recentlyUpdatedAlbums}
          loading={recentlyUpdatedAlbumsLoading}
          type="album"
          viewAllUrl="/albums?sort=updated"
        />

        {/* Latest Playlists */}
        <MediaSection
          title="Playlist mới nhất"
          items={latestPlaylists}
          loading={latestPlaylistsLoading}
          type="playlist"
          viewAllUrl="/playlists?sort=latest"
        />

        {/* Recently Updated Playlists */}
        <MediaSection
          title="Playlist mới cập nhật"
          items={recentlyUpdatedPlaylists}
          loading={recentlyUpdatedPlaylistsLoading}
          type="playlist"
          viewAllUrl="/playlists?sort=updated"
        />
      </div>
    </div>
  );
});

Home.displayName = "Home";
export default Home;
