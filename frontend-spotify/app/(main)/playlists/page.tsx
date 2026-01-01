"use client";

import { memo, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  viewAllActions,
  selectAllPlaylists,
  selectAllPlaylistsLoading,
  selectPlaylistsPagination,
} from "@/store/slices/viewAll";
import PageHeader from "@/components/layout/PageHeader";
import { Pagination, Skeleton, Empty, Button, Tabs } from "antd";
import { PlayCircleFilled, ArrowLeftOutlined } from "@ant-design/icons";
import type { PublicPlaylistItem } from "@/interfaces/playlists";
import styles from "./page.module.css";

const DEFAULT_COVER = "https://misc.scdn.co/liked-songs/liked-songs-640.png";
const PAGE_SIZE = 20;

const PlaylistsPageContent = memo(() => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const sortType =
    (searchParams.get("sort") as "latest" | "updated") || "latest";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const playlists = useAppSelector(selectAllPlaylists);
  const loading = useAppSelector(selectAllPlaylistsLoading);
  const pagination = useAppSelector(selectPlaylistsPagination);

  useEffect(() => {
    dispatch(
      viewAllActions.fetchAllPlaylists({
        page,
        limit: PAGE_SIZE,
        sortType,
      })
    );
  }, [dispatch, page, sortType]);

  useEffect(() => {
    return () => {
      dispatch(viewAllActions.clearPlaylists());
    };
  }, [dispatch]);

  const handlePageChange = (newPage: number) => {
    router.push(`/playlists?sort=${sortType}&page=${newPage}`);
  };

  const handleSortChange = (key: string) => {
    router.push(`/playlists?sort=${key}&page=1`);
  };

  const handlePlaylistClick = (id: string) => {
    router.push(`/playlist/${id}`);
  };

  const title =
    sortType === "latest" ? "Playlist mới nhất" : "Playlist mới cập nhật";

  return (
    <div ref={containerRef} className={styles.container}>
      <PageHeader
        color="#121212"
        container={containerRef}
        sectionContainer={sectionRef}
      >
        <div className={styles.headerContent}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            className={styles.backButton}
          />
          <h1 className={styles.pageTitle}>{title}</h1>
        </div>
      </PageHeader>

      <div ref={sectionRef} className={styles.content}>
        <Tabs
          activeKey={sortType}
          onChange={handleSortChange}
          className={styles.tabs}
          items={[
            { key: "latest", label: "Mới nhất" },
            { key: "updated", label: "Mới cập nhật" },
          ]}
        />

        {loading ? (
          <div className={styles.grid}>
            {[...Array(PAGE_SIZE)].map((_, index) => (
              <div key={index} className={styles.card}>
                <Skeleton.Image active className={styles.skeletonImage} />
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            ))}
          </div>
        ) : playlists.length === 0 ? (
          <Empty
            description="Không tìm thấy playlist nào"
            className={styles.empty}
          />
        ) : (
          <>
            <div className={styles.grid}>
              {playlists.map((playlist: PublicPlaylistItem) => (
                <div
                  key={playlist.id}
                  className={styles.card}
                  onClick={() => handlePlaylistClick(playlist.id)}
                >
                  <div className={styles.imageWrapper}>
                    <img
                      src={playlist.cover_url || DEFAULT_COVER}
                      alt={playlist.title}
                      className={styles.image}
                    />
                    <button className={styles.playButton}>
                      <PlayCircleFilled />
                    </button>
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{playlist.title}</h3>
                    <p className={styles.cardSubtitle}>
                      {playlist.owner?.name || "Unknown User"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className={styles.paginationWrapper}>
                <Pagination
                  current={pagination.page}
                  total={pagination.total}
                  pageSize={pagination.limit}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  className={styles.pagination}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

PlaylistsPageContent.displayName = "PlaylistsPageContent";

const PlaylistsPage = () => {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.content}>
            <Skeleton active paragraph={{ rows: 10 }} />
          </div>
        </div>
      }
    >
      <PlaylistsPageContent />
    </Suspense>
  );
};

export default PlaylistsPage;
