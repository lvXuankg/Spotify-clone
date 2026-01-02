"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { Card, Image, Empty, Spin, Pagination, Typography } from "antd";
import { PlayCircleFilled } from "@ant-design/icons";
import { SearchResult } from "@/services/search.service";
import { useAudioPlayerContext } from "@/components/providers/AudioPlayerProvider";
import styles from "./SearchResults.module.css";

const { Title, Paragraph } = Typography;

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const SearchResults = memo(
  ({
    results,
    loading,
    total,
    currentPage,
    pageSize,
    onPageChange,
  }: SearchResultsProps) => {
    const router = useRouter();
    const { playSong } = useAudioPlayerContext();

    if (loading) {
      return (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      );
    }

    if (!results || results.length === 0) {
      return (
        <Empty
          description="Không tìm thấy kết quả"
          style={{ padding: "50px 0" }}
        />
      );
    }

    const typeLabels = {
      song: "🎵 Bài hát",
      artist: "🎤 Nghệ sĩ",
      album: "💿 Album",
      playlist: "📋 Playlist",
    };

    const typeColors = {
      song: "#1db954",
      artist: "#ff6b6b",
      album: "#4c6ef5",
      playlist: "#ff922b",
    };

    const handleCardClick = (result: SearchResult) => {
      switch (result.type) {
        case "song":
          // Play song directly instead of navigating
          if (result.audio_url) {
            const songToPlay = {
              id: result.id,
              album_id: "",
              title: result.title || "",
              audio_url: result.audio_url,
              duration_seconds: result.duration || 0,
              disc_number: 1,
              is_explicit: false,
              play_count: 0,
              created_at: "",
              updated_at: "",
              albums: {
                id: "",
                title: result.album || "",
                cover_url: result.cover_url,
                artists: { id: "", display_name: result.artist || "" },
              },
            };
            playSong(songToPlay);
          } else {
            // Fallback: if no audio_url, just log warning
            console.warn("Song audio_url not available in search result");
          }
          break;
        case "artist":
          router.push(`/artist/${result.id}`);
          break;
        case "album":
          router.push(`/album/${result.id}`);
          break;
        case "playlist":
          router.push(`/playlist/${result.id}`);
          break;
      }
    };

    return (
      <div className={styles.container}>
        <div className={styles.grid}>
          {results.map((result) => (
            <Card
              key={`${result.type}-${result.id}`}
              className={styles.card}
              cover={
                <div className={styles.imageWrapper}>
                  {result.cover_url ? (
                    <Image
                      src={result.cover_url}
                      alt={result.title || result.name || ""}
                      className={styles.image}
                      preview={false}
                    />
                  ) : (
                    <div className={styles.placeholder}>
                      <span>{result.type === "artist" ? "🎤" : "🎵"}</span>
                    </div>
                  )}
                  <div className={styles.badge}>
                    <span style={{ color: typeColors[result.type] }}>
                      {typeLabels[result.type]}
                    </span>
                  </div>
                </div>
              }
              hoverable
              onClick={() => handleCardClick(result)}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.content}>
                <Title
                  level={5}
                  style={{
                    margin: "8px 0",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: "#ffffff",
                  }}
                >
                  {result.title || result.name}
                </Title>

                {result.artist && (
                  <Paragraph
                    style={{
                      margin: "4px 0",
                      fontSize: "12px",
                      color: "#b3b3b3",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {result.artist}
                  </Paragraph>
                )}

                {result.description && (
                  <Paragraph
                    style={{
                      margin: "4px 0",
                      fontSize: "11px",
                      color: "#9b9b9b",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {result.description}
                  </Paragraph>
                )}

                {result.score && (
                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "11px",
                      color: "#7f7f7f",
                    }}
                  >
                    Relevance: {(result.score * 10).toFixed(0)}%
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {total > pageSize && (
          <div className={styles.pagination}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={onPageChange}
              showSizeChanger={false}
              style={{ textAlign: "center", marginTop: "30px" }}
            />
          </div>
        )}
      </div>
    );
  }
);

SearchResults.displayName = "SearchResults";
export default SearchResults;
