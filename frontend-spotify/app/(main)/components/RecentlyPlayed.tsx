"use client";

import { memo, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { Row, Col, Card, Image, Typography, Empty, Skeleton } from "antd";
import { useRouter } from "next/navigation";
import {
  fetchRecentlyPlayed,
  selectRecentlyPlayed,
  selectRecentlyPlayedLoading,
} from "@/store/slices/stream";
import { SongService } from "@/services/song";
import type { Song } from "@/interfaces/song";

const { Paragraph } = Typography;

interface SongWithDetails extends Song {
  album?: {
    id: string;
    title: string;
    cover_url?: string | null;
  };
}

const RecentlyPlayed = memo(() => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const recentlyPlayedIds = useAppSelector(selectRecentlyPlayed) as string[];
  const loading = useAppSelector(selectRecentlyPlayedLoading);
  const [songs, setSongs] = useState<SongWithDetails[]>([]);
  const [loadingSongs, setLoadingSongs] = useState(false);

  useEffect(() => {
    dispatch(fetchRecentlyPlayed(8));
  }, [dispatch]);

  useEffect(() => {
    const fetchSongs = async () => {
      if (recentlyPlayedIds.length === 0) return;

      setLoadingSongs(true);
      try {
        const responses = await Promise.allSettled(
          recentlyPlayedIds.slice(0, 8).map((id) => SongService.findOneSong(id))
        );

        const fetchedSongs: SongWithDetails[] = [];
        responses.forEach((result) => {
          if (result.status === "fulfilled") {
            fetchedSongs.push(result.value.data);
          }
        });
        setSongs(fetchedSongs);
      } catch (error) {
        console.error("Failed to fetch songs:", error);
      } finally {
        setLoadingSongs(false);
      }
    };

    fetchSongs();
  }, [recentlyPlayedIds]);

  if (loading || loadingSongs) {
    return (
      <Row gutter={[16, 16]}>
        {[...Array(4)].map((_, i) => (
          <Col key={i} xs={24} sm={12} md={8} lg={6}>
            <Skeleton active />
          </Col>
        ))}
      </Row>
    );
  }

  if (!songs || songs.length === 0) {
    return <Empty description="No recently played" />;
  }

  return (
    <Row gutter={[16, 16]}>
      {songs.map((song: SongWithDetails) => (
        <Col key={song.id} xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            onClick={() => {
              if (song.album?.id) {
                router.push(`/album/${song.album.id}`);
              }
            }}
            cover={
              <Image
                src={song.album?.cover_url || "/images/default-song.png"}
                alt={song.title}
                style={{
                  height: "200px",
                  objectFit: "cover",
                }}
                preview={false}
              />
            }
            style={{
              backgroundColor: "#282828",
              borderColor: "#404040",
            }}
          >
            <Card.Meta
              title={
                <span style={{ color: "#ffffff" }} title={song.title}>
                  {song.title}
                </span>
              }
              description={
                <Paragraph style={{ color: "#b3b3b3", margin: 0 }} ellipsis>
                  {song.album?.title || "Unknown Album"}
                </Paragraph>
              }
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
});

RecentlyPlayed.displayName = "RecentlyPlayed";
export default RecentlyPlayed;
