"use client";

import { Button, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { memo } from "react";
import { useRouter } from "next/navigation";

export const AddPlaylistButton = memo(() => {
  const { t } = useTranslation(["navbar"]);
  const router = useRouter();

  return (
    <Tooltip title={t("Create playlist")}>
      <Button
        type="text"
        icon={<PlusOutlined />}
        onClick={() => {
          // Navigate to create playlist or open modal
          router.push("/playlist/create");
        }}
      />
    </Tooltip>
  );
});

AddPlaylistButton.displayName = "AddPlaylistButton";
