"use client";

import { memo, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { artistActions } from "@/store/slices/artist";
import { useParams } from "next/navigation";
import {
  Row,
  Col,
  Button,
  Space,
  Card,
  Empty,
  Skeleton,
  Avatar,
  Divider,
} from "antd";
import PageHeader from "@/components/layout/PageHeader";
import { PlayCircleOutlined, UserOutlined } from "@ant-design/icons";

const ArtistPage = memo(() => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const artistId = params.id as string;
  const artist = useAppSelector((state) => state.artist.artist);
  const topTracks = useAppSelector((state) => state.artist.topTracks);
  const albums = useAppSelector((state) => state.artist.albums);
  const loading = useAppSelector((state) => state.artist.loading);

  useEffect(() => {
    if (artistId) {
      dispatch(artistActions.fetchArtist(artistId));
      dispatch(artistActions.fetchArtistTopTracks(artistId));
      dispatch(artistActions.fetchArtistAlbums(artistId));
    }
  }, [artistId, dispatch]);

  if (loading) {
    return <Skeleton active count={5} />;
  }

  if (!artist) {
    return <Empty description="Artist not found" />;
  }

  return (
    <div ref={containerRef} style={{ height: "100%", overflowY: "auto" }}>
      <PageHeader
        color="linear-gradient(135deg, #1db954 0%, #121212 100%)"
        container={containerRef}
        sectionContainer={sectionRef}
      >
        <Row gutter={[30, 30]} align="middle" justify="center">
          <Col xs={24} sm={8}>
            <Avatar
              size={200}
              src={artist.images[0]?.url}
              icon={<UserOutlined />}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "50%",
              }}
            />
          </Col>
          <Col xs={24} sm={16}>
            <div>
              <span style={{ color: "#b3b3b3" }}>ARTIST</span>
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "#ffffff",
                  margin: "16px 0",
                }}
              >
                {artist.name}
              </h1>
              <p style={{ color: "#b3b3b3", margin: 0 }}>
                {artist.followers?.total?.toLocaleString()} followers
              </p>
            </div>
          </Col>
        </Row>
      </PageHeader>

      <div ref={sectionRef} style={{ padding: "30px" }}>
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          size="large"
          style={{ marginBottom: "30px" }}
        >
          Play
        </Button>

        <Divider />

        {/* Top Tracks */}
        <h2
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}
        >
          Top Tracks
        </h2>
        <Row gutter={[16, 16]} style={{ marginBottom: "40px" }}>
          {topTracks.slice(0, 5).map((track, index) => (
            <Col key={track.id} span={24}>
              <Card
                style={{
                  backgroundColor: "#282828",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Row align="middle" gutter={16}>
                  <Col span={1}>{index + 1}</Col>
                  <Col span={16}>
                    <span style={{ color: "#ffffff" }}>{track.name}</span>
                  </Col>
                  <Col
                    span={7}
                    style={{ textAlign: "right", color: "#b3b3b3" }}
                  >
                    {Math.floor(track.duration_ms / 60000)}:
                    {((track.duration_ms % 60000) / 1000)
                      .toFixed(0)
                      .padStart(2, "0")}
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>

        <Divider />

        {/* Albums */}
        <h2
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}
        >
          Albums
        </h2>
        <Row gutter={[16, 16]}>
          {albums.slice(0, 6).map((album) => (
            <Col key={album.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt={album.name}
                    src={album.images[0]?.url}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                }
              >
                <Card.Meta
                  title={<span style={{ color: "#ffffff" }}>{album.name}</span>}
                  description={
                    <span style={{ color: "#b3b3b3" }}>
                      {album.release_date?.split("-")[0]}
                    </span>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
});

ArtistPage.displayName = "ArtistPage";
export default ArtistPage;
