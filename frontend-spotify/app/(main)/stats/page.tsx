"use client";

import { useEffect, useState } from "react";
import {
  Spin,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  List,
  Avatar,
  Segmented,
  Empty,
} from "antd";
import {
  PlayCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  SoundOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  fetchStreamingStats,
  fetchTopSongs,
  fetchGlobalCharts,
  selectStreamingStats,
  selectStreamingStatsLoading,
  selectTopSongs,
  selectTopSongsLoading,
  selectGlobalCharts,
  selectGlobalChartsLoading,
  setTopSongsPeriod,
  setGlobalChartsPeriod,
} from "@/store/slices/stream";
import { useAudioPlayerContext } from "@/components/providers/AudioPlayerProvider";
import { SongService } from "@/services/song";
import type { SongWithAlbum } from "@/interfaces/song";
import type {
  TopSongsPeriod,
  TopSongItem,
  ChartSongItem,
} from "@/interfaces/stream";

const { Title, Text } = Typography;

// Helper to format duration
const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatListeningTime = (hours: number, minutes: number) => {
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  return `${minutes}m`;
};

const periodOptions = [
  { label: "Today", value: "day" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "All Time", value: "all" },
];

export default function StatsPage() {
  const dispatch = useAppDispatch();
  const { playSong } = useAudioPlayerContext();

  // Selectors
  const stats = useAppSelector(selectStreamingStats);
  const statsLoading = useAppSelector(selectStreamingStatsLoading);
  const topSongs = useAppSelector(selectTopSongs);
  const topSongsLoading = useAppSelector(selectTopSongsLoading);
  const globalCharts = useAppSelector(selectGlobalCharts);
  const globalChartsLoading = useAppSelector(selectGlobalChartsLoading);

  // Local state
  const [topSongsPeriod, setTopSongsPeriodLocal] =
    useState<TopSongsPeriod>("all");
  const [chartsPeriod, setChartsPeriodLocal] = useState<TopSongsPeriod>("week");
  const [songDetails, setSongDetails] = useState<Record<string, SongWithAlbum>>(
    {}
  );

  // Fetch stats on mount
  useEffect(() => {
    dispatch(fetchStreamingStats());
    dispatch(fetchTopSongs({ limit: 10, period: topSongsPeriod }));
    dispatch(fetchGlobalCharts({ limit: 10, period: chartsPeriod }));
  }, [dispatch]);

  // Fetch song details for top songs
  useEffect(() => {
    const fetchSongDetails = async () => {
      const allSongIds: string[] = [
        ...topSongs.map((s: TopSongItem) => s.songId),
        ...globalCharts.map((s: ChartSongItem) => s.songId),
      ];
      const uniqueIds = [...new Set(allSongIds)];
      const missingIds = uniqueIds.filter((id) => !songDetails[id]);

      if (missingIds.length === 0) return;

      try {
        const responses = await Promise.allSettled(
          missingIds.map((id) => SongService.findOneSong(id))
        );

        const newDetails: Record<string, SongWithAlbum> = {};
        responses.forEach((result, index) => {
          if (result.status === "fulfilled") {
            newDetails[missingIds[index]] = result.value.data;
          }
        });

        setSongDetails((prev) => ({ ...prev, ...newDetails }));
      } catch (error) {
        console.error("Failed to fetch song details:", error);
      }
    };

    if (topSongs.length > 0 || globalCharts.length > 0) {
      fetchSongDetails();
    }
  }, [topSongs, globalCharts]);

  const handleTopSongsPeriodChange = (value: string) => {
    const period = value as TopSongsPeriod;
    setTopSongsPeriodLocal(period);
    dispatch(setTopSongsPeriod(period));
    dispatch(fetchTopSongs({ limit: 10, period }));
  };

  const handleChartsPeriodChange = (value: string) => {
    const period = value as TopSongsPeriod;
    setChartsPeriodLocal(period);
    dispatch(setGlobalChartsPeriod(period));
    dispatch(fetchGlobalCharts({ limit: 10, period }));
  };

  const handlePlaySong = (songId: string) => {
    const song = songDetails[songId];
    if (song) {
      playSong(song);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: 1400, margin: "0 auto" }}>
      <Title level={2} style={{ color: "#fff", marginBottom: 24 }}>
        <FireOutlined style={{ marginRight: 12, color: "#1db954" }} />
        Your Listening Stats
      </Title>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{ background: "#282828", borderColor: "#404040" }}
            loading={statsLoading}
          >
            <Statistic
              title={<Text type="secondary">Total Plays</Text>}
              value={stats?.totalPlays || 0}
              prefix={<PlayCircleOutlined style={{ color: "#1db954" }} />}
              valueStyle={{ color: "#fff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{ background: "#282828", borderColor: "#404040" }}
            loading={statsLoading}
          >
            <Statistic
              title={<Text type="secondary">Listening Time</Text>}
              value={formatListeningTime(
                stats?.totalListeningTimeHours || 0,
                stats?.totalListeningTimeMinutes || 0
              )}
              prefix={<ClockCircleOutlined style={{ color: "#1db954" }} />}
              valueStyle={{ color: "#fff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{ background: "#282828", borderColor: "#404040" }}
            loading={statsLoading}
          >
            <Statistic
              title={<Text type="secondary">Unique Songs</Text>}
              value={stats?.uniqueSongsPlayed || 0}
              prefix={<SoundOutlined style={{ color: "#1db954" }} />}
              valueStyle={{ color: "#fff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{ background: "#282828", borderColor: "#404040" }}
            loading={statsLoading}
          >
            <Statistic
              title={<Text type="secondary">Today</Text>}
              value={stats?.todayPlays || 0}
              suffix="plays"
              prefix={<FireOutlined style={{ color: "#ff4d4f" }} />}
              valueStyle={{ color: "#fff" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Your Top Songs */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontSize: 18 }}>
                  <TrophyOutlined
                    style={{ marginRight: 8, color: "#faad14" }}
                  />
                  Your Top Songs
                </Text>
                <Segmented
                  size="small"
                  options={periodOptions}
                  value={topSongsPeriod}
                  onChange={handleTopSongsPeriodChange}
                />
              </div>
            }
            style={{ background: "#181818", borderColor: "#404040" }}
            styles={{ body: { padding: 0 } }}
          >
            {topSongsLoading ? (
              <div style={{ padding: 40, textAlign: "center" }}>
                <Spin />
              </div>
            ) : topSongs.length === 0 ? (
              <Empty description="No data yet" style={{ padding: 40 }} />
            ) : (
              <List
                dataSource={topSongs}
                renderItem={(item: TopSongItem, index: number) => {
                  const song = songDetails[item.songId];
                  return (
                    <List.Item
                      style={{
                        padding: "12px 16px",
                        cursor: "pointer",
                        borderBottom: "1px solid #282828",
                      }}
                      onClick={() => handlePlaySong(item.songId)}
                    >
                      <List.Item.Meta
                        avatar={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Text
                              style={{
                                color: index < 3 ? "#faad14" : "#666",
                                marginRight: 12,
                                width: 20,
                                textAlign: "center",
                                fontWeight: index < 3 ? "bold" : "normal",
                              }}
                            >
                              {index + 1}
                            </Text>
                            <Avatar
                              shape="square"
                              size={40}
                              style={{ background: "#282828" }}
                            >
                              🎵
                            </Avatar>
                          </div>
                        }
                        title={
                          <Text style={{ color: "#fff" }}>
                            {song?.title || "Loading..."}
                          </Text>
                        }
                        description={
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {song?.albums?.artists?.display_name || "Unknown"}
                          </Text>
                        }
                      />
                      <div style={{ textAlign: "right" }}>
                        <Text style={{ color: "#1db954" }}>
                          {item.playCount} plays
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {Math.round(item.totalPlayedSeconds / 60)}m listened
                        </Text>
                      </div>
                    </List.Item>
                  );
                }}
              />
            )}
          </Card>
        </Col>

        {/* Global Charts */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontSize: 18 }}>
                  <FireOutlined style={{ marginRight: 8, color: "#ff4d4f" }} />
                  Global Charts
                </Text>
                <Segmented
                  size="small"
                  options={periodOptions}
                  value={chartsPeriod}
                  onChange={handleChartsPeriodChange}
                />
              </div>
            }
            style={{ background: "#181818", borderColor: "#404040" }}
            styles={{ body: { padding: 0 } }}
          >
            {globalChartsLoading ? (
              <div style={{ padding: 40, textAlign: "center" }}>
                <Spin />
              </div>
            ) : globalCharts.length === 0 ? (
              <Empty description="No chart data yet" style={{ padding: 40 }} />
            ) : (
              <List
                dataSource={globalCharts}
                renderItem={(item: ChartSongItem) => {
                  const song = songDetails[item.songId];
                  return (
                    <List.Item
                      style={{
                        padding: "12px 16px",
                        cursor: "pointer",
                        borderBottom: "1px solid #282828",
                      }}
                      onClick={() => handlePlaySong(item.songId)}
                    >
                      <List.Item.Meta
                        avatar={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Text
                              style={{
                                color:
                                  item.rank === 1
                                    ? "#ffd700"
                                    : item.rank === 2
                                    ? "#c0c0c0"
                                    : item.rank === 3
                                    ? "#cd7f32"
                                    : "#666",
                                marginRight: 12,
                                width: 20,
                                textAlign: "center",
                                fontWeight: item.rank <= 3 ? "bold" : "normal",
                                fontSize: item.rank <= 3 ? 16 : 14,
                              }}
                            >
                              {item.rank}
                            </Text>
                            <Avatar
                              shape="square"
                              size={40}
                              style={{ background: "#282828" }}
                            >
                              🎵
                            </Avatar>
                          </div>
                        }
                        title={
                          <Text style={{ color: "#fff" }}>
                            {song?.title || "Loading..."}
                          </Text>
                        }
                        description={
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {song?.albums?.artists?.display_name || "Unknown"}
                          </Text>
                        }
                      />
                      <Text style={{ color: "#1db954" }}>
                        {item.playCount.toLocaleString()} plays
                      </Text>
                    </List.Item>
                  );
                }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
