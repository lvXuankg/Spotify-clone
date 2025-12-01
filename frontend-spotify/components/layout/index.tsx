"use client";

import { memo, ReactElement } from "react";
import { Col, Row } from "antd";
import { Navbar } from "./navbar";
import { Library } from "./sidebar";
import PlayingBar from "./player/PlayingBar";

export const AppLayout = memo(({ children }: { children: ReactElement }) => {
  return (
    <div className="app-layout">
      <Row
        gutter={[8, 8]}
        style={{
          height: "calc(100vh - 105px)",
          width: "100%",
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
