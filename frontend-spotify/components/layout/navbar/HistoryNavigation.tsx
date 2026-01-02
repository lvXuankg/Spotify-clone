"use client";

import { Space } from "antd";
import NavigationButton from "./NavigationButton";
import ForwardBackwardsButton from "./ForwardBackwardsButton";
import { useTranslation } from "react-i18next";
import { memo } from "react";
import { FaSpotify } from "react-icons/fa6";
import { useRouter, usePathname } from "next/navigation";
import { GoHome, GoHomeFill } from "react-icons/go";

const HistoryNavigation = memo(() => {
  const { t } = useTranslation(["navbar"]);
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === "/" || pathname === "/home";

  return (
    <Space size={8}>
      {/* Spotify Logo */}
      <div
        onClick={() => router.push("/")}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          padding: "8px",
          borderRadius: "50%",
          backgroundColor: "#000",
        }}
      >
        <FaSpotify size={28} fill="#1DB954" />
      </div>

      {/* Navigation Arrows */}
      <div className="flex flex-row items-center gap-1 h-full">
        <ForwardBackwardsButton flip />
        <ForwardBackwardsButton flip={false} />
      </div>
    </Space>
  );
});

export default HistoryNavigation;
