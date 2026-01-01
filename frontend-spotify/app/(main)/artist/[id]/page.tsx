"use client";

import { memo, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchArtistById } from "@/store/slices/artist";
import { useParams } from "next/navigation";
import {
  Row,
  Col,
  Button,
  Empty,
  Skeleton,
  Avatar,
  Divider,
  Typography,
} from "antd";
import PageHeader from "@/components/layout/PageHeader";
import { PlayCircleOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const ArtistPage = memo(() => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const artistId = params.id as string;
  const artist = useAppSelector((state) => state.artist.currentArtist);
  const loading = useAppSelector((state) => state.artist.loading);

  useEffect(() => {
    if (artistId) {
      dispatch(fetchArtistById(artistId));
    }
  }, [artistId, dispatch]);

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <Skeleton active avatar={{ size: 200 }} paragraph={{ rows: 5 }} />
      </div>
    );
  }

  if (!artist) {
    return <Empty description="Artist not found" />;
  }

  // Get display name (support both snake_case and camelCase)
  const displayName =
    artist.display_name || artist.displayName || "Unknown Artist";
  const avatarUrl = artist.avatar_url || artist.avatarUrl;
  const coverImageUrl = artist.cover_image_url || artist.coverImageUrl;
  const bio = artist.bio;

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
              src={avatarUrl || coverImageUrl}
              icon={<UserOutlined />}
              style={{
                width: "100%",
                maxWidth: "200px",
                height: "auto",
                borderRadius: "50%",
              }}
            />
          </Col>
          <Col xs={24} sm={16}>
            <div>
              <Text style={{ color: "#b3b3b3", textTransform: "uppercase" }}>
                Artist
              </Text>
              <Title
                level={1}
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "#ffffff",
                  margin: "16px 0",
                }}
              >
                {displayName}
              </Title>
              {bio && (
                <Paragraph style={{ color: "#b3b3b3", margin: 0 }}>
                  {bio}
                </Paragraph>
              )}
            </div>
          </Col>
        </Row>
      </PageHeader>

      <div ref={sectionRef} style={{ padding: "30px" }}>
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          size="large"
          style={{
            marginBottom: "30px",
            backgroundColor: "#1db954",
            borderColor: "#1db954",
          }}
        >
          Play
        </Button>

        <Divider style={{ borderColor: "#282828" }} />

        {/* Artist Info */}
        <Title level={3} style={{ color: "#ffffff", marginBottom: "16px" }}>
          About
        </Title>
        <div
          style={{
            backgroundColor: "#282828",
            padding: "24px",
            borderRadius: "8px",
          }}
        >
          {bio ? (
            <Paragraph style={{ color: "#b3b3b3", marginBottom: 0 }}>
              {bio}
            </Paragraph>
          ) : (
            <Text style={{ color: "#b3b3b3" }}>No bio available</Text>
          )}
        </div>

        {/* Cover Image if available */}
        {coverImageUrl && (
          <>
            <Divider style={{ borderColor: "#282828" }} />
            <Title level={3} style={{ color: "#ffffff", marginBottom: "16px" }}>
              Cover
            </Title>
            <img
              src={coverImageUrl}
              alt={displayName}
              style={{
                width: "100%",
                maxWidth: "600px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
});

ArtistPage.displayName = "ArtistPage";
export default ArtistPage;
