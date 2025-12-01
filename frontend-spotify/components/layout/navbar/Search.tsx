"use client";

import { Input, Space } from "antd";
import NavigationButton from "./NavigationButton";
import { SearchOutlined, HomeOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { memo, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

function usePrevious(value: any) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const Search = memo(() => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation(["navbar"]);

  const [inputValue, setInputValue] = useState<string>("");
  const [debouncedValue] = useDebounce(inputValue, 600);
  const prevValue = usePrevious(debouncedValue);

  useEffect(() => {
    if (debouncedValue !== "" && debouncedValue !== prevValue) {
      router.push(`/search/${debouncedValue}`);
    }
  }, [debouncedValue, prevValue, router]);

  const isHome = router.pathname === "/";

  return (
    <Space size={10} align="center">
      <NavigationButton
        text={t("Home")}
        icon={<HomeOutlined />}
        onClick={() => router.push("/")}
      />

      <Input
        size="large"
        className="search-input"
        prefix={<SearchOutlined />}
        suffix={
          <button
            onClick={() => {
              router.push("/search");
            }}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <SearchOutlined />
          </button>
        }
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        placeholder={
          t("SearchPlaceholder") || "Search songs, artists, playlists..."
        }
      />
    </Space>
  );
});

Search.displayName = "Search";
