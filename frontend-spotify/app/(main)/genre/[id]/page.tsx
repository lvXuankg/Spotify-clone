"use client";

import { memo, useRef } from "react";
import { useParams } from "next/navigation";
import { Empty, Typography } from "antd";
import PageHeader from "@/components/layout/PageHeader";

const { Title, Text } = Typography;

const DEFAULT_PAGE_COLOR = "#7b2cbf";

const GenrePage = memo(() => {
  const params = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const genreId = params.id as string;

  return (
    <div ref={containerRef} style={{ height: "100%", overflowY: "auto" }}>
      <PageHeader
        color={DEFAULT_PAGE_COLOR}
        container={containerRef}
        sectionContainer={sectionRef}
      >
        <div>
          <Text style={{ color: "#b3b3b3", textTransform: "uppercase" }}>
            Genre
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
            Genre: {genreId}
          </Title>
        </div>
      </PageHeader>

      <div ref={sectionRef} style={{ padding: "30px" }}>
        <Empty
          description={
            <Text style={{ color: "#b3b3b3" }}>Genre feature coming soon</Text>
          }
        />
      </div>
    </div>
  );
});

GenrePage.displayName = "GenrePage";
export default GenrePage;
