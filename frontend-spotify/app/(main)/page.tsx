"use client";

import { memo, useEffect, useRef, useMemo } from "react";
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

// Get greeting based on time of day
const getGreeting = (): { text: string; emoji: string } => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { text: "Good morning", emoji: "☀️" };
  } else if (hour >= 12 && hour < 18) {
    return { text: "Good afternoon", emoji: "🌤️" };
  } else if (hour >= 18 && hour < 22) {
    return { text: "Good evening", emoji: "🌆" };
  } else {
    return { text: "Good night", emoji: "🌙" };
  }
};

// Get gradient color based on time of day
const getHeaderColor = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "#FF8C42"; // Warm orange for morning
  } else if (hour >= 12 && hour < 18) {
    return "#1DB954"; // Spotify green for afternoon
  } else if (hour >= 18 && hour < 22) {
    return "#7B2D8E"; // Purple for evening
  } else {
    return "#1a1a2e"; // Dark blue for night
  }
};

const Home = memo(() => {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Get user name from auth state
  const userName = useAppSelector((state) => state.auth.user?.name);

  // Memoize greeting and color
  const greeting = useMemo(() => getGreeting(), []);
  const headerColor = useMemo(() => getHeaderColor(), []);

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
        color={headerColor}
        container={containerRef}
        sectionContainer={sectionRef}
      >
        <div className={styles.headerContent}>
          <span className={styles.greeting}>
            <span className={styles.greetingEmoji}>{greeting.emoji}</span>
            <span className={styles.greetingText}>{greeting.text}</span>
            {userName && <span className={styles.userName}>, {userName}</span>}
          </span>
          <p className={styles.subtitle}>
            What would you like to listen to today?
          </p>
        </div>
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
