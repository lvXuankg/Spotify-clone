"use client";

import { memo } from "react";
import { useAppSelector } from "@/store/store";
import { Row, Col, Card, Image, Typography, Empty } from "antd";
import { useRouter } from "next/navigation";

const { Paragraph } = Typography;

const RecentlyPlayed = memo(() => {
  const router = useRouter();
  const items = useAppSelector((state) => state.home.recentlyPlayed);

  if (!items || items.length === 0) {
    return <Empty description="No recently played" />;
  }

  return (
    <Row gutter={[16, 16]}>
      {items.slice(0, 8).map((item) => {
        const isTrack = "artists" in item;
        const isPlaylist = "owner" in item;
        const isAlbum = "release_date" in item;

        return (
          <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={() => {
                if (isTrack) {
                  router.push(`/album/${item.album?.id}`);
                } else if (isPlaylist) {
                  router.push(`/playlist/${item.id}`);
                } else if (isAlbum) {
                  router.push(`/album/${item.id}`);
                }
              }}
              cover={
                <Image
                  src={item.images?.[0]?.url || item.album?.images?.[0]?.url}
                  alt={item.name}
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
                  <span style={{ color: "#ffffff" }} title={item.name}>
                    {item.name}
                  </span>
                }
                description={
                  <Paragraph style={{ color: "#b3b3b3", margin: 0 }} ellipsis>
                    {isTrack
                      ? item.artists?.map((a) => a.name).join(", ")
                      : isAlbum
                      ? item.artists?.map((a) => a.name).join(", ")
                      : item.owner?.display_name}
                  </Paragraph>
                }
              />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
});

RecentlyPlayed.displayName = "RecentlyPlayed";
export default RecentlyPlayed;
