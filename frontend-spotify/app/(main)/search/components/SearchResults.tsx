"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { Row, Col, Button } from "antd";

interface SearchResultsProps {
  results: any[];
}

const SearchResults = memo(({ results }: SearchResultsProps) => {
  const router = useRouter();

  return (
    <Row gutter={[16, 16]}>
      {results.slice(0, 20).map((item) => (
        <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
          <Button
            block
            onClick={() => {
              if ("artists" in item) {
                // Track - navigate to album
                router.push(`/album/${item.album?.id}`);
              } else if ("genres" in item && !("artists" in item)) {
                // Artist
                router.push(`/artist/${item.id}`);
              } else if ("release_date" in item && !("artists" in item)) {
                // Album
                router.push(`/album/${item.id}`);
              } else if ("owner" in item) {
                // Playlist
                router.push(`/playlist/${item.id}`);
              }
            }}
            style={{
              height: "auto",
              backgroundColor: "#282828",
              border: "none",
              color: "#ffffff",
              padding: "12px",
              textAlign: "left",
            }}
          >
            <div>
              <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
                {item.name}
              </p>
              <p style={{ margin: 0, color: "#b3b3b3", fontSize: "12px" }}>
                {("artists" in item && item.artists[0]?.name) ||
                  ("owner" in item && item.owner?.display_name) ||
                  item.type ||
                  "Unknown"}
              </p>
            </div>
          </Button>
        </Col>
      ))}
    </Row>
  );
});

SearchResults.displayName = "SearchResults";
export default SearchResults;
