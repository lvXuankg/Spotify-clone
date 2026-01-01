"use client";

import { memo } from "react";
import { useAppSelector } from "@/store/store";
import { Row, Col, Card, Image, Typography } from "antd";
import { useRouter } from "next/navigation";
import type { PublicPlaylistItem } from "@/interfaces/playlists";

const { Paragraph } = Typography;

const FeaturedPlaylists = memo(() => {
  const router = useRouter();
  const playlists = useAppSelector(
    (state) => state.home.latestPlaylists
  ) as PublicPlaylistItem[];

  return (
    <Row gutter={[16, 16]}>
      {playlists.slice(0, 6).map((playlist: PublicPlaylistItem) => (
        <Col key={playlist.id} xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            onClick={() => router.push(`/playlist/${playlist.id}`)}
            cover={
              <Image
                src={playlist.cover_url || "/images/default-playlist.png"}
                alt={playlist.title}
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
                <span
                  style={{ color: "#ffffff" }}
                  title={playlist.title}
                  className="line-clamp-2"
                >
                  {playlist.title}
                </span>
              }
              description={
                <Paragraph
                  ellipsis={{ rows: 2 }}
                  style={{ color: "#b3b3b3", margin: 0 }}
                >
                  {playlist.description || "No description"}
                </Paragraph>
              }
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
});

FeaturedPlaylists.displayName = "FeaturedPlaylists";
export default FeaturedPlaylists;
