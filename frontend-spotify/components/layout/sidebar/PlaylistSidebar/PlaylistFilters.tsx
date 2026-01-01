"use client";

import { memo, useState } from "react";
import { Input, Select, Space, Tag } from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  yourLibraryActions,
  getLibraryFilter,
} from "@/store/slices/yourLibrary";
import type { LibraryFilterType } from "@/store/slices/yourLibrary";
import styles from "./PlaylistFilters.module.css";

const FILTER_OPTIONS: { value: LibraryFilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "playlist", label: "Playlists" },
  { value: "album", label: "Albums" },
  { value: "artist", label: "Artists" },
];

export const PlaylistFilters = memo(() => {
  const dispatch = useAppDispatch();
  const currentFilter = useAppSelector(getLibraryFilter);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleFilterChange = (filter: LibraryFilterType) => {
    dispatch(yourLibraryActions.setFilter(filter));
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    dispatch(yourLibraryActions.setSearchQuery(value));
  };

  const clearSearch = () => {
    setSearchValue("");
    setSearchVisible(false);
    dispatch(yourLibraryActions.setSearchQuery(""));
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterTags}>
        {FILTER_OPTIONS.map((option) => (
          <Tag
            key={option.value}
            className={`${styles.filterTag} ${
              currentFilter === option.value ? styles.active : ""
            }`}
            onClick={() => handleFilterChange(option.value)}
          >
            {option.label}
          </Tag>
        ))}
      </div>

      <div className={styles.searchWrapper}>
        {searchVisible ? (
          <Input
            placeholder="Search in Your Library"
            prefix={<SearchOutlined />}
            suffix={
              searchValue && (
                <CloseOutlined
                  onClick={clearSearch}
                  style={{ cursor: "pointer" }}
                />
              )
            }
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={styles.searchInput}
            autoFocus
            onBlur={() => {
              if (!searchValue) {
                setSearchVisible(false);
              }
            }}
          />
        ) : (
          <button
            className={styles.searchButton}
            onClick={() => setSearchVisible(true)}
          >
            <SearchOutlined />
          </button>
        )}
      </div>
    </div>
  );
});

PlaylistFilters.displayName = "PlaylistFilters";
