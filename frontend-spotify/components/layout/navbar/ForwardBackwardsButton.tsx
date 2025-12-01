"use client";

import { Button, Space } from "antd";
import { useRouter } from "next/navigation";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { memo, useCallback } from "react";

interface ForwardBackwardsButtonProps {
  flip?: boolean;
}

const ForwardBackwardsButton = memo(
  ({ flip = false }: ForwardBackwardsButtonProps) => {
    const router = useRouter();

    const handleClick = useCallback(() => {
      if (flip) {
        router.back();
      } else {
        router.forward();
      }
    }, [flip, router]);

    return (
      <Button
        type="text"
        size="large"
        icon={flip ? <ArrowLeftOutlined /> : <ArrowRightOutlined />}
        onClick={handleClick}
        className="nav-button"
        style={{ color: "#ffffff" }}
      />
    );
  }
);

ForwardBackwardsButton.displayName = "ForwardBackwardsButton";
export default ForwardBackwardsButton;
