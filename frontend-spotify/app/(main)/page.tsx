"use client";

import { memo, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { homeActions } from "@/store/slices/home";
import { Col, Row, Skeleton, Empty } from "antd";
import PageHeader from "@/components/layout/PageHeader";
import FeaturedPlaylists from "./components/FeaturedPlaylists";
import RecentlyPlayed from "./components/RecentlyPlayed";
import "@/styles/home.scss";

const Home = memo(() => {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const loading = useAppSelector((state) => state.home.loading);
  const featuredPlaylists = useAppSelector(
    (state) => state.home.featuredPlaylists
  );

  useEffect(() => {
    dispatch(homeActions.fetchFeaturedPlaylists());
    dispatch(homeActions.fetchRecentlyPlayed());
  }, [dispatch]);

  return (
    <div ref={containerRef} style={{ height: "100%", overflowY: "auto" }}>
      <PageHeader
        color="#121212"
        container={containerRef}
        sectionContainer={sectionRef}
      >
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>
          Welcome back! 🎵
        </h1>
      </PageHeader>

      <div ref={sectionRef} style={{ padding: "30px" }}>
        <Row gutter={[16, 32]}>
          {/* Recently Played */}
          <Col span={24}>
            <Skeleton loading={loading} active>
              <RecentlyPlayed />
            </Skeleton>
          </Col>

          {/* Featured Playlists */}
          <Col span={24}>
            {loading ? (
              <>
                <Skeleton active />
                <Skeleton active />
                <Skeleton active />
              </>
            ) : featuredPlaylists.length > 0 ? (
              <FeaturedPlaylists />
            ) : (
              <Empty description="No playlists found" />
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
});

Home.displayName = "Home";
export default Home;
