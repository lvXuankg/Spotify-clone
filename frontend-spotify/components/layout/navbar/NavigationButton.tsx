"use client";

import { memo, ReactNode } from "react";

interface NavigationButtonProps {
  text?: string;
  icon: ReactNode;
  onClick: () => void;
  active?: boolean;
}

const NavigationButton = memo(
  ({ text, icon, onClick, active }: NavigationButtonProps) => {
    return (
      <button
        onClick={onClick}
        style={{
          background: "#1a1a1a",
          border: "none",
          color: active ? "#ffffff" : "#b3b3b3",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontSize: "14px",
          fontWeight: 600,
          padding: text ? "10px 16px" : "12px",
          borderRadius: "50px",
          transition: "all 0.2s ease",
          minWidth: text ? "auto" : "48px",
          height: "48px",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform =
            "scale(1.04)";
          (e.currentTarget as HTMLButtonElement).style.background = "#282828";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLButtonElement).style.background = "#1a1a1a";
        }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
        {text && <span>{text}</span>}
      </button>
    );
  }
);

NavigationButton.displayName = "NavigationButton";
export default NavigationButton;
