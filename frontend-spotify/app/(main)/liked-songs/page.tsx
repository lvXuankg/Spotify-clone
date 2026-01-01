"use client";

import { memo, useRef, useState, useEffect } from "react";
import { Empty, Button, Space, Typography } from "antd";
import PageHeader from "@/components/layout/PageHeader";
import { PlayCircleOutlined } from "@ant-design/icons";
import { getImageAnalysis2 } from "@/utils/imageAnyliser";
import tinycolor from "tinycolor2";

const { Title, Text } = Typography;

const LIKED_SONGS_IMAGE = "/images/liked-songs.png";
const DEFAULT_PAGE_COLOR = "#7b2cbf";

const LikedSongsPage = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [color, setColor] = useState<string>(DEFAULT_PAGE_COLOR);

  useEffect(() => {
    getImageAnalysis2(LIKED_SONGS_IMAGE).then((c) => {
      const item = tinycolor(c);
      setColor(
        item.isLight() ? item.darken(10).toHexString() : item.toHexString()
      );
    });
  }, []);

  return (
    <div ref={containerRef} style={{ height: "100%", overflowY: "auto" }}>
      <PageHeader
        color={color}
        container={containerRef}
        sectionContainer={sectionRef}
      >
        <div>
          <Text style={{ color: "#b3b3b3", textTransform: "uppercase" }}>
            Playlist
          </Text>
          <Title
            level={1}
            style={{
              margin: "16px 0",
              fontSize: "48px",
              fontWeight: "bold",
              color: "#ffffff",
            }}
          >
            ❤️ Liked Songs
          </Title>
          <Text style={{ color: "#b3b3b3" }}>0 songs</Text>
          <Space style={{ marginTop: "16px", display: "block" }}>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              size="large"
              style={{ backgroundColor: "#1db954", borderColor: "#1db954" }}
            >
              Play
            </Button>
          </Space>
        </div>
      </PageHeader>

      <div ref={sectionRef} style={{ padding: "30px" }}>
        <Empty
          description={
            <Text style={{ color: "#b3b3b3" }}>
              Liked songs feature coming soon
            </Text>
          }
        />
      </div>
    </div>
  );
});

LikedSongsPage.displayName = "LikedSongsPage";
export default LikedSongsPage;
