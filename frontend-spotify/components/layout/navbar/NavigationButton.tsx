"use client";

import { memo, ReactNode } from "react";

interface NavigationButtonProps {
  text: string;
  icon: ReactNode;
  onClick: () => void;
}

const NavigationButton = memo(
  ({ text, icon, onClick }: NavigationButtonProps) => {
    return (
      <button
        onClick={onClick}
        style={{
          background: "transparent",
          border: "none",
          color: "#ffffff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px",
          padding: "8px 12px",
          borderRadius: "20px",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#282828";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "transparent";
        }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
        <span>{text}</span>
      </button>
    );
  }
);

NavigationButton.displayName = "NavigationButton";
export default NavigationButton;
