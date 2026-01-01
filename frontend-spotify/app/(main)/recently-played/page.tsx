"use client";

import { useEffect, useState } from "react";
import { Spin, Empty, Typography, List, Avatar, Button, message } from "antd";
import {
  PlayCircleOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  fetchPlayHistory,
  clearPlayHistory,
  selectPlayHistory,
  selectPlayHistoryLoading,
  selectPlayHistoryPagination,
} from "@/store/slices/stream";
import { useAudioPlayerContext } from "@/components/providers/AudioPlayerProvider";
import { SongService } from "@/services/song";
import type { SongWithAlbum } from "@/interfaces/song";
import type { PlayHistory } from "@/interfaces/stream";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

// Helper to format duration
const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function RecentlyPlayedPage() {
  const dispatch = useAppDispatch();
  const { playSong } = useAudioPlayerContext();

  const playHistory: PlayHistory[] = useAppSelector(
    selectPlayHistory
  ) as PlayHistory[];
  const loading = useAppSelector(selectPlayHistoryLoading);
  const pagination = useAppSelector(selectPlayHistoryPagination);

  // Song details cache
  const [songDetails, setSongDetails] = useState<Record<string, SongWithAlbum>>(
    {}
  );
  const [loadingSongs, setLoadingSongs] = useState(false);

  // Fetch play history on mount
  useEffect(() => {
    dispatch(fetchPlayHistory({ page: 1, limit: 50 }));
  }, [dispatch]);

  // Fetch song details for each history item
  useEffect(() => {
    const fetchSongDetails = async () => {
      if (playHistory.length === 0) return;

      const songIds: string[] = playHistory.map((item) => item.song_id);
      const uniqueSongIds: string[] = Array.from(new Set(songIds));
      const missingIds: string[] = uniqueSongIds.filter(
        (id: string) => !songDetails[id]
      );

      if (missingIds.length === 0) return;

      setLoadingSongs(true);
      try {
        // Fetch songs in parallel (batch of 10)
        const batches: string[][] = [];
        for (let i = 0; i < missingIds.length; i += 10) {
          batches.push(missingIds.slice(i, i + 10));
        }

        for (const batch of batches) {
          const responses = await Promise.allSettled(
            batch.map((id) => SongService.findOneSong(id))
          );

          const newDetails: Record<string, SongWithAlbum> = {};
          responses.forEach((result, index) => {
            if (result.status === "fulfilled") {
              const song = result.value.data;
              newDetails[batch[index]] = song;
            }
          });

          setSongDetails((prev) => ({ ...prev, ...newDetails }));
        }
      } catch (error) {
        console.error("Failed to fetch song details:", error);
      } finally {
        setLoadingSongs(false);
      }
    };

    fetchSongDetails();
  }, [playHistory]);

  const handleClearHistory = async () => {
    try {
      await dispatch(clearPlayHistory()).unwrap();
      message.success("Play history cleared");
    } catch (error) {
      message.error("Failed to clear history");
    }
  };

  const handleLoadMore = () => {
    if (pagination.hasMore) {
      dispatch(
        fetchPlayHistory({ page: pagination.page + 1, limit: pagination.limit })
      );
    }
  };

  const handlePlaySong = (songId: string) => {
    const song = songDetails[songId];
    if (song) {
      playSong(song);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={2} style={{ color: "#fff", margin: 0 }}>
            <ClockCircleOutlined style={{ marginRight: 12 }} />
            Recently Played
          </Title>
          <Text type="secondary">
            {pagination.total} songs in your listening history
          </Text>
        </div>

        {playHistory.length > 0 && (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleClearHistory}
            loading={loading}
          >
            Clear History
          </Button>
        )}
      </div>

      {loading && playHistory.length === 0 ? (
        <div style={{ textAlign: "center", padding: 50 }}>
          <Spin size="large" />
        </div>
      ) : playHistory.length === 0 ? (
        <Empty
          description={
            <Text type="secondary">
              No listening history yet. Start playing some music!
            </Text>
          }
          style={{ padding: 50 }}
        />
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={playHistory}
            loading={loadingSongs}
            renderItem={(item: PlayHistory, index: number) => {
              const song = songDetails[item.song_id];
              return (
                <List.Item
                  style={{
                    background: index % 2 === 0 ? "#181818" : "transparent",
                    padding: "12px 16px",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onClick={() => handlePlaySong(item.song_id)}
                  actions={[
                    <Button
                      key="play"
                      type="text"
                      icon={<PlayCircleOutlined />}
                      style={{ color: "#1db954" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySong(item.song_id);
                      }}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        shape="square"
                        size={48}
                        style={{ background: "#282828" }}
                      >
                        🎵
                      </Avatar>
                    }
                    title={
                      <Text style={{ color: "#fff" }}>
                        {song?.title || "Loading..."}
                      </Text>
                    }
                    description={
                      <div>
                        <Text type="secondary">
                          {song?.albums?.artists?.display_name ||
                            "Unknown Artist"}
                        </Text>
                        {song?.duration_seconds && (
                          <Text type="secondary" style={{ marginLeft: 16 }}>
                            {formatDuration(song.duration_seconds)}
                          </Text>
                        )}
                      </div>
                    }
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs(item.played_at).fromNow()}
                  </Text>
                </List.Item>
              );
            }}
          />

          {pagination.hasMore && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Button onClick={handleLoadMore} loading={loading}>
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
