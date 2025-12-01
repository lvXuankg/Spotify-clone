"use client";

import { Input, Space, Select, Button } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { yourLibraryActions } from "@/store/slices/yourLibrary";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";

export const SearchArea = memo(() => {
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState("");

  return (
    <Input
      placeholder="Search in library..."
      prefix={<SearchOutlined />}
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      style={{
        margin: "10px",
        backgroundColor: "#282828",
        borderColor: "#404040",
        color: "#ffffff",
      }}
    />
  );
});

SearchArea.displayName = "SearchArea";

export const LibraryFilters = memo(() => {
  const dispatch = useAppDispatch();
  const view = useAppSelector((state) => state.yourLibrary.view);
  const { t } = useTranslation(["library"]);

  return (
    <Space
      style={{ padding: "10px", width: "100%" }}
      direction="vertical"
      size="small"
    >
      <Select
        value={view}
        onChange={(value) => dispatch(yourLibraryActions.setView(value))}
        options={[
          { label: t("List"), value: "LIST" },
          { label: t("Compact"), value: "COMPACT" },
          { label: t("Grid"), value: "GRID" },
        ]}
        style={{ width: "100%" }}
      />
    </Space>
  );
});

LibraryFilters.displayName = "LibraryFilters";
