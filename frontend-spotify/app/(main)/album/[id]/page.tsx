"use client";

import { memo, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  albumActions,
  selectCurrentAlbum,
  selectCurrentAlbumLoading,
  selectAlbumSongs,
  selectAlbumSongsLoading,
} from "@/store/slices/album";
import { useParams, useRouter } from "next/navigation";
import { Row, Col, Button, Empty, Skeleton, Image, Table } from "antd";
import PageHeader from "@/components/layout/PageHeader";
import {
  PlayCircleFilled,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { Song } from "@/interfaces/song";
import styles from "./page.module.css";

const DEFAULT_COVER = "https://misc.scdn.co/liked-songs/liked-songs-640.png";

// Helper function to format duration
const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const AlbumPage = memo(() => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const albumId = params.id as string;
  const album = useAppSelector(selectCurrentAlbum);
  const loading = useAppSelector(selectCurrentAlbumLoading);
  const songs = useAppSelector(selectAlbumSongs);
  const songsLoading = useAppSelector(selectAlbumSongsLoading);

  useEffect(() => {
    if (albumId) {
      dispatch(albumActions.fetchAlbumDetail(albumId));
      dispatch(albumActions.fetchAlbumSongs(albumId));
    }
    return () => {
      dispatch(albumActions.clearCurrentAlbum());
    };
  }, [albumId, dispatch]);

  // Table columns for songs
  const columns = [
    {
      title: "#",
      dataIndex: "track_number",
      key: "track_number",
      width: 50,
      render: (trackNumber: number | null, _record: Song, index: number) => (
        <span className={styles.trackNumber}>{trackNumber ?? index + 1}</span>
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: Song) => (
        <div className={styles.songInfo}>
          <span className={styles.songTitle}>{title}</span>
          {record.is_explicit && (
            <span className={styles.explicitBadge}>E</span>
          )}
        </div>
      ),
    },
    {
      title: <ClockCircleOutlined />,
      dataIndex: "duration_seconds",
      key: "duration_seconds",
      width: 80,
      align: "right" as const,
      render: (duration: number) => (
        <span className={styles.duration}>{formatDuration(duration)}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (!album) {
    return (
      <div className={styles.emptyContainer}>
        <Empty description="Album not found" />
        <Button type="primary" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  const dominantColor = "#1a1a2e";
  const coverUrl = album.cover_url || DEFAULT_COVER;
  const releaseYear = album.release_date
    ? new Date(album.release_date).getFullYear()
    : null;

  return (
    <div ref={containerRef} className={styles.container}>
      <PageHeader
        color={dominantColor}
        container={containerRef}
        sectionContainer={sectionRef}
      >
        <Row gutter={[24, 24]} align="bottom">
          <Col xs={24} sm={6}>
            <div className={styles.coverWrapper}>
              <Image
                src={coverUrl}
                alt={album.title}
                preview={false}
                className={styles.coverImage}
                fallback={DEFAULT_COVER}
              />
            </div>
          </Col>
          <Col xs={24} sm={18}>
            <div className={styles.albumInfo}>
              <span className={styles.albumType}>{album.type || "Album"}</span>
              <h1 className={styles.title}>{album.title}</h1>
              <div className={styles.meta}>
                {album.artists && (
                  <span className={styles.artistName}>
                    {album.artists.display_name}
                  </span>
                )}
                {releaseYear && (
                  <>
                    <span className={styles.separator}>•</span>
                    <span className={styles.releaseYear}>
                      <CalendarOutlined /> {releaseYear}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </PageHeader>

      <div ref={sectionRef} className={styles.content}>
        <div className={styles.actions}>
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<PlayCircleFilled />}
            className={styles.playButton}
          />
        </div>

        {/* Songs Table */}
        <div className={styles.songsSection}>
          <Table
            columns={columns}
            dataSource={songs}
            rowKey="id"
            pagination={false}
            loading={songsLoading}
            className={styles.songsTable}
            showHeader={true}
            locale={{ emptyText: "Chưa có bài hát nào" }}
            rowClassName={styles.songRow}
          />
        </div>

        {/* Album Details */}
        <div className={styles.albumDetails}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Ngày phát hành</span>
              <span className={styles.detailValue}>
                {album.release_date
                  ? new Date(album.release_date).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Chưa rõ"}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Số bài hát</span>
              <span className={styles.detailValue}>{songs.length} bài hát</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Loại</span>
              <span className={styles.detailValue}>
                {album.type || "Album"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AlbumPage.displayName = "AlbumPage";
export default AlbumPage;
