"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { Card, Skeleton, Empty, Button } from "antd";
import { PlayCircleFilled, RightOutlined } from "@ant-design/icons";
import type { AlbumListItem } from "@/interfaces/albums";
import type { PublicPlaylistItem } from "@/interfaces/playlists";
import styles from "./MediaSection.module.css";

const DEFAULT_COVER = "https://misc.scdn.co/liked-songs/liked-songs-640.png";

interface MediaSectionProps {
  title: string;
  items: AlbumListItem[] | PublicPlaylistItem[];
  loading?: boolean;
  type: "album" | "playlist";
  viewAllUrl?: string;
}

const isAlbum = (
  item: AlbumListItem | PublicPlaylistItem
): item is AlbumListItem => {
  return "artist" in item;
};

export const MediaSection = memo(
  ({ title, items, loading = false, type, viewAllUrl }: MediaSectionProps) => {
    const router = useRouter();

    const handleClick = (id: string) => {
      router.push(`/${type}/${id}`);
    };

    const handleViewAll = () => {
      if (viewAllUrl) {
        router.push(viewAllUrl);
      }
    };

    if (loading) {
      return (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{title}</h2>
          </div>
          <div className={styles.grid}>
            {[...Array(5)].map((_, index) => (
              <Card key={index} className={styles.card} loading />
            ))}
          </div>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{title}</h2>
          </div>
          <Empty description={`No ${type}s found`} className={styles.empty} />
        </div>
      );
    }

    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          {viewAllUrl && (
            <Button
              type="link"
              className={styles.viewAllButton}
              onClick={handleViewAll}
            >
              Xem tất cả <RightOutlined />
            </Button>
          )}
        </div>
        <div className={styles.grid}>
          {items.map((item) => (
            <div
              key={item.id}
              className={styles.card}
              onClick={() => handleClick(item.id)}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={item.cover_url || DEFAULT_COVER}
                  alt={item.title}
                  className={styles.image}
                />
                <button className={styles.playButton}>
                  <PlayCircleFilled />
                </button>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardSubtitle}>
                  {isAlbum(item)
                    ? item.artist?.display_name || "Unknown Artist"
                    : item.owner?.name || "Unknown User"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

MediaSection.displayName = "MediaSection";
