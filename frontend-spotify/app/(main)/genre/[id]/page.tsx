"use client";

import { memo, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { genreActions } from "@/store/slices/genre";
import { Row, Col, Card, Image, Empty, Skeleton } from "antd";
import PageHeader from "@/components/layout/PageHeader";
import { getImageAnalysis2 } from "@/utils/imageAnyliser";
import tinycolor from "tinycolor2";
import { useRouter } from "next/navigation";

const DEFAULT_PAGE_COLOR = "#7b2cbf";

const GenrePage = memo(() => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [color, setColor] = useState(DEFAULT_PAGE_COLOR);
  const genreId = params.id as string;

  const category = useAppSelector((state) => state.genre.category);
  const playlists = useAppSelector((state) => state.genre.playlists);
  const loading = useAppSelector((state) => state.genre.loading);

  useEffect(() => {
    if (genreId) {
      dispatch(genreActions.fetchGenre(genreId));
    }
  }, [genreId, dispatch]);

  useEffect(() => {
    if (category?.icons?.[0]?.url) {
      getImageAnalysis2(category.icons[0].url).then((c) => {
        setColor(tinycolor(c).saturate(60).lighten(10).toHexString());
      });
    }
  }, [category]);

  if (!category) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <Skeleton active />
      </div>
    );
  }

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
            {category.name}
          </h1>
        </div>
      </PageHeader>

      <div ref={sectionRef} style={{ padding: "30px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "16px",
            color: "#ffffff",
          }}
        >
          Popular Playlists
        </h2>

        <Skeleton loading={loading} active>
          {!playlists || playlists.length === 0 ? (
            <Empty description="No playlists found" />
          ) : (
            <Row gutter={[16, 16]}>
              {playlists.slice(0, 20).map((playlist: any) => (
                <Col key={playlist.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    onClick={() => router.push(`/playlist/${playlist.id}`)}
                    cover={
                      <Image
                        src={playlist.images[0]?.url}
                        alt={playlist.name}
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
                        <span style={{ color: "#ffffff" }}>
                          {playlist.name}
                        </span>
                      }
                      description={
                        <p
                          style={{ color: "#b3b3b3", margin: 0 }}
                          title={playlist.description}
                        >
                          {playlist.description?.substring(0, 50)}...
                        </p>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Skeleton>
      </div>
    </div>
  );
});

GenrePage.displayName = "GenrePage";
export default GenrePage;
