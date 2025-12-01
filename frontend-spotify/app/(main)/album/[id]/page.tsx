"use client";

import { memo, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { albumActions } from "@/store/slices/album";
import { useParams } from "next/navigation";
import { Row, Col, Button, Space, Table, Empty, Skeleton, Image } from "antd";
import PageHeader from "@/components/layout/PageHeader";
import { PlayCircleOutlined, PlusOutlined } from "@ant-design/icons";
import tinycolor from "tinycolor2";

const AlbumPage = memo(() => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const albumId = params.id as string;
  const album = useAppSelector((state) => state.album.album);
  const tracks = useAppSelector((state) => state.album.tracks);
  const loading = useAppSelector((state) => state.album.loading);

  useEffect(() => {
    if (albumId) {
      dispatch(albumActions.fetchAlbum(albumId));
      dispatch(albumActions.fetchAlbumTracks(albumId));
    }
  }, [albumId, dispatch]);

  if (loading) {
    return <Skeleton active count={5} />;
  }

  if (!album) {
    return <Empty description="Album not found" />;
  }

  const dominantColor = album.images[0]?.url
    ? tinycolor(album.images[0].url).darken(2).toRgbString()
    : "#1db954";

  const columns = [
    {
      title: "#",
      dataIndex: "track_number",
      key: "track_number",
      width: 50,
    },
    {
      title: "Song",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span style={{ color: "#ffffff" }}>{text}</span>
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
              src={album.images[0]?.url}
              alt={album.name}
              preview={false}
              style={{
                width: "100%",
                borderRadius: "8px",
              }}
            />
          </Col>
          <Col xs={24} sm={18}>
            <div>
              <span style={{ color: "#b3b3b3" }}>ALBUM</span>
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "#ffffff",
                  margin: "16px 0",
                }}
              >
                {album.name}
              </h1>
              <Space>
                <span style={{ color: "#ffffff" }}>
                  {album.artists.map((a) => a.name).join(", ")}
                </span>
                <span style={{ color: "#b3b3b3" }}>
                  {album.release_date?.split("-")[0]}
                </span>
                <span style={{ color: "#b3b3b3" }}>
                  {album.total_tracks} songs
                </span>
              </Space>
            </div>
          </Col>
        </Row>
      </PageHeader>

      <div ref={sectionRef} style={{ padding: "30px" }}>
        <Space style={{ marginBottom: "20px" }}>
          <Button type="primary" icon={<PlayCircleOutlined />} size="large">
            Play
          </Button>
          <Button type="dashed" icon={<PlusOutlined />} size="large">
            Add to Playlist
          </Button>
        </Space>

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

AlbumPage.displayName = "AlbumPage";
export default AlbumPage;
