"use client";

import { Space } from "antd";
import NavigationButton from "./NavigationButton";
import ForwardBackwardsButton from "./ForwardBackwardsButton";
import { useTranslation } from "react-i18next";
import { memo } from "react";
import { FaSpotify } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const HistoryNavigation = memo(() => {
  const { t } = useTranslation(["navbar"]);
  const router = useRouter();

  return (
    <Space>
      <NavigationButton
        text={t("Home")}
        onClick={() => {
          router.push("/");
        }}
        icon={<FaSpotify size={25} fill="white" />}
      />

      <div className="flex flex-row items-center gap-2 h-full">
        <ForwardBackwardsButton flip />
        <ForwardBackwardsButton flip={false} />
      </div>
    </Space>
  );
});

export default HistoryNavigation;
