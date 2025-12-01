"use client";

import { Button, Space, Tooltip } from "antd";
import { ReactNode, memo } from "react";

interface NavigationButtonProps {
  text: string;
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
}

const NavigationButton = memo(
  ({ text, icon, onClick, className }: NavigationButtonProps) => {
    return (
      <Tooltip title={text}>
        <Button
          type="text"
          size="large"
          icon={icon}
          onClick={onClick}
          className={`nav-button ${className || ""}`}
          style={{ color: "#ffffff" }}
        />
      </Tooltip>
    );
  }
);

NavigationButton.displayName = "NavigationButton";
export default NavigationButton;
