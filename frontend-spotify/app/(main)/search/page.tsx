"use client";

import { memo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Empty, Typography } from "antd";
import PageHeader from "@/components/layout/PageHeader";

const { Title, Text } = Typography;

const SearchPage = memo(() => {
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const query = searchParams.get("q") || "";

  return (
    <div ref={containerRef} style={{ height: "100%", overflowY: "auto" }}>
      <PageHeader
        color="linear-gradient(135deg, #1db954 0%, #121212 100%)"
        container={containerRef}
        sectionContainer={sectionRef}
      >
        <Title
          level={1}
          style={{
            margin: 0,
            fontSize: "32px",
            fontWeight: "bold",
            color: "#ffffff",
          }}
        >
          Search Results for "{query}"
        </Title>
      </PageHeader>

      <div ref={sectionRef} style={{ padding: "30px" }}>
        <Empty
          description={
            <Text style={{ color: "#b3b3b3" }}>Search feature coming soon</Text>
          }
        />
      </div>
    </div>
  );
});

SearchPage.displayName = "SearchPage";
export default SearchPage;
