"use client";

import { memo, ReactElement, useEffect } from "react";
import { Col, Row } from "antd";
import { Navbar } from "./navbar";
import { Library } from "./sidebar";
import PlayingBar from "./player/PlayingBar";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchProfile } from "@/store/slices/profile";

export const AppLayout = memo(({ children }: { children: ReactElement }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { profile, loading } = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (isAuthenticated && !profile && !loading) {
      dispatch(fetchProfile());
    }
  }, [isAuthenticated, profile, loading, dispatch]);
  return (
    <div className="app-layout">
      <Row
        gutter={[8, 8]}
        style={{
          width: "100%",
          minHeight: "calc(100vh - 105px)",
          paddingBottom: "105px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Col span={24}>
          <Navbar />
        </Col>

        {/* Main Content */}
        <Col span={24}>
          <div className="content-wrapper">{children}</div>
        </Col>
      </Row>

      {/* Player Bar */}
      <PlayingBar />
    </div>
  );
});

AppLayout.displayName = "AppLayout";
export default AppLayout;
