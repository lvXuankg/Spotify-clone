"use client";

import { memo, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { likedSongsActions } from "@/store/slices/likedSongs";
import { Table, Empty, Skeleton, Button, Space } from "antd";
import PageHeader from "@/components/layout/PageHeader";
import { PlayCircleOutlined, HeartOutlined } from "@ant-design/icons";
import { getImageAnalysis2 } from "@/utils/imageAnyliser";
import tinycolor from "tinycolor2";

const LIKED_SONGS_IMAGE = "/images/liked-songs.png";
const DEFAULT_PAGE_COLOR = "#7b2cbf";

const LikedSongsPage = memo(() => {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [color, setColor] = useState<string>(DEFAULT_PAGE_COLOR);

  const songs = useAppSelector((state) => state.likedSongs.songs);
  const loading = useAppSelector((state) => state.likedSongs.loading);

  useEffect(() => {
    getImageAnalysis2(LIKED_SONGS_IMAGE).then((c) => {
      const item = tinycolor(c);
      setColor(
        item.isLight() ? item.darken(10).toHexString() : item.toHexString()
      );
    });
    dispatch(likedSongsActions.fetchLikeSongs());
  }, [dispatch]);

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: 50,
    },
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div>
          <p style={{ margin: 0, fontWeight: "bold" }}>{text}</p>
          <p style={{ margin: 0, color: "#b3b3b3", fontSize: "12px" }}>
            {record.artists?.map((a: any) => a.name).join(", ")}
          </p>
        </div>
      ),
    },
    {
      title: "Album",
      dataIndex: ["album", "name"],
      key: "album",
    },
    {
      title: "Duration",
      key: "duration",
      render: (_, record: any) =>
        `${Math.floor(record.duration_ms / 60000)}:${String(
          (record.duration_ms % 60000) / 1000
        ).padStart(2, "0")}`,
    },
  ];

  return (
    <div ref={containerRef} style={{ height: "100%", overflowY: "auto" }}>
      <PageHeader
        color={color}
        container={containerRef}
        sectionContainer={sectionRef}
      >
        <div>
          <span style={{ color: "#b3b3b3" }}>PLAYLIST</span>
          <h1
            style={{
              margin: "16px 0",
              fontSize: "48px",
              fontWeight: "bold",
              color: "#ffffff",
            }}
          >
            ❤️ Liked Songs
          </h1>
          <p style={{ color: "#b3b3b3", margin: 0 }}>
            {songs?.length || 0} songs
          </p>
          <Space style={{ marginTop: "16px" }}>
            <Button type="primary" icon={<PlayCircleOutlined />} size="large">
              Play
            </Button>
          </Space>
        </div>
      </PageHeader>

      <div ref={sectionRef} style={{ padding: "30px" }}>
        <Skeleton loading={loading} active>
          {!songs || songs.length === 0 ? (
            <Empty description="No liked songs yet" />
          ) : (
            <Table
              columns={columns}
              dataSource={songs.map((song: any, index: number) => ({
                ...song,
                key: song.id,
                index: index + 1,
              }))}
              style={{ backgroundColor: "#282828" }}
              pagination={false}
              rowClassName={() => "hover:bg-gray-800"}
            />
          )}
        </Skeleton>
      </div>
    </div>
  );
});

LikedSongsPage.displayName = "LikedSongsPage";
export default LikedSongsPage;
