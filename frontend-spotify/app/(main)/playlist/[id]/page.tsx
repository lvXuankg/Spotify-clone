"use client";

import { memo, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { playlistActions } from "@/store/slices/playlist";
import { useParams } from "next/navigation";
import {
  Row,
  Col,
  Button,
  Space,
  Table,
  Empty,
  Skeleton,
  Image,
  Divider,
} from "antd";
import PageHeader from "@/components/layout/PageHeader";
import {
  PlayCircleOutlined,
  EditOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import tinycolor from "tinycolor2";

const PlaylistPage = memo(() => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const playlistId = params.id as string;
  const playlist = useAppSelector((state) => state.playlist.playlist);
  const tracks = useAppSelector((state) => state.playlist.tracks);
  const loading = useAppSelector((state) => state.playlist.loading);

  useEffect(() => {
    if (playlistId) {
      dispatch(playlistActions.fetchPlaylist(playlistId));
      dispatch(playlistActions.fetchPlaylistTracks(playlistId));
    }
  }, [playlistId, dispatch]);

  if (loading) {
    return <Skeleton active count={5} />;
  }

  if (!playlist) {
    return <Empty description="Playlist not found" />;
  }

  const dominantColor = playlist.images[0]?.url
    ? tinycolor(playlist.images[0].url).darken(2).toRgbString()
    : "#1db954";

  const columns = [
    {
      title: "Song",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span style={{ color: "#ffffff" }}>{text}</span>
      ),
    },
    {
      title: "Artist",
      key: "artist",
      render: (_: any, record: any) => (
        <span style={{ color: "#b3b3b3" }}>
          {record.artists?.map((a: any) => a.name).join(", ")}
        </span>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration_ms",
      key: "duration_ms",
      width: 100,
      render: (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return (
          <span style={{ color: "#b3b3b3" }}>
            {minutes}:{parseInt(seconds as string) < 10 ? "0" : ""}
            {seconds}
          </span>
        );
      },
    },
  ];

  return (
    <div ref={containerRef} style={{ height: "100%", overflowY: "auto" }}>
      <PageHeader
        color={dominantColor}
        container={containerRef}
        sectionContainer={sectionRef}
      >
        <Row gutter={[30, 30]} align="middle">
          <Col xs={24} sm={6}>
            <Image
              src={playlist.images[0]?.url}
              alt={playlist.name}
              preview={false}
              style={{
                width: "100%",
                borderRadius: "8px",
              }}
            />
          </Col>
          <Col xs={24} sm={18}>
            <div>
              <span style={{ color: "#b3b3b3" }}>PLAYLIST</span>
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "#ffffff",
                  margin: "16px 0",
                }}
              >
                {playlist.name}
              </h1>
              <p style={{ color: "#b3b3b3", margin: 0 }}>
                {playlist.description}
              </p>
              <p style={{ color: "#b3b3b3", margin: "8px 0 0 0" }}>
                {playlist.owner?.display_name} • {tracks.length} songs
              </p>
            </div>
          </Col>
        </Row>
      </PageHeader>

      <div ref={sectionRef} style={{ padding: "30px" }}>
        <Space style={{ marginBottom: "20px" }}>
          <Button type="primary" icon={<PlayCircleOutlined />} size="large">
            Play
          </Button>
          <Button icon={<HeartOutlined />} size="large">
            Like
          </Button>
          <Button icon={<EditOutlined />} size="large">
            Edit
          </Button>
        </Space>

        <Divider />

        <Table
          columns={columns}
          dataSource={tracks}
          rowKey="id"
          style={{
            backgroundColor: "transparent",
          }}
          pagination={false}
        />
      </div>
    </div>
  );
});

PlaylistPage.displayName = "PlaylistPage";
export default PlaylistPage;
