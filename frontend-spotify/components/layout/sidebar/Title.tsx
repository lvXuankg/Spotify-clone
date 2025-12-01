"use client";

import { AddPlaylistButton } from "./AddPlaylistButton";
import { LibraryIcon, CloseOutlined } from "@ant-design/icons";
import { memo } from "react";
import { Flex, Space, Button, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { getLibraryCollapsed, uiActions } from "@/store/slices/ui";
import { useAppDispatch, useAppSelector } from "@/store/store";

const CloseButton = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="library-close-button">
      <Button
        type="text"
        icon={<CloseOutlined />}
        onClick={() => {
          dispatch(uiActions.collapseLibrary());
        }}
      />
    </div>
  );
};

export const LibraryTitle = memo(() => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(["navbar"]);
  const collapsed = useAppSelector(getLibraryCollapsed);

  if (collapsed) {
    return (
      <Tooltip placement="right" title={t("Expand your library")}>
        <button
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            padding: "10px 0",
          }}
          onClick={() => dispatch(uiActions.toggleLibrary())}
        >
          <LibraryIcon style={{ fontSize: "20px" }} />
        </button>
      </Tooltip>
    );
  }

  return (
    <Flex align="center" justify="space-between" style={{ padding: "10px" }}>
      <Space wrap align="center">
        <Tooltip placement="top" title={t("Collapse your library")}>
          <Button
            type="text"
            icon={<LibraryIcon />}
            onClick={() => dispatch(uiActions.toggleLibrary())}
          />
        </Tooltip>
        <span className="library-title">{t("Your Library")}</span>
      </Space>

      <AddPlaylistButton />
    </Flex>
  );
});

LibraryTitle.displayName = "LibraryTitle";
