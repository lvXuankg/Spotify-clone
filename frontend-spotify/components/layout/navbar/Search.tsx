"use client";

import { memo, useState, useEffect, useRef } from "react";
import { Input, Space } from "antd";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import NavigationButton from "./NavigationButton";
import ForwardBackwardsButton from "./ForwardBackwardsButton";

// Icons (simplified - replace with actual icons)
const HomeIcon = () => <span>🏠</span>;
const ActiveHomeIcon = () => <span>🏠</span>;
const SearchIcon = () => <span>🔍</span>;
const BrowseIcon = () => <span>📂</span>;

const INITIAL_VALUE = "";

function usePrevious(value: any) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export const Search = memo(() => {
  const router = useRouter();
  const pathname = usePathname();

  const [inputValue, setInputValue] = useState<string>(INITIAL_VALUE);
  const [debouncedValue] = useDebounce(inputValue, 600);
  const prevValue = usePrevious(debouncedValue);

  useEffect(() => {
    if (debouncedValue !== "" && debouncedValue !== prevValue) {
      router.push(`/search?q=${encodeURIComponent(debouncedValue)}`);
    }
  }, [debouncedValue, prevValue, router]);

  const isHome = pathname === "/" || pathname === "/home";

  return (
    <Space size={10} style={{ display: "flex", alignItems: "center" }}>
      <NavigationButton
        text="Home"
        icon={isHome ? <ActiveHomeIcon /> : <HomeIcon />}
        onClick={() => router.push("/")}
      />

      <Input
        size="large"
        style={{
          backgroundColor: "#282828",
          border: "none",
          color: "#ffffff",
          borderRadius: "20px",
        }}
        prefix={<SearchIcon />}
        suffix={
          <button
            onClick={() => {
              router.push("/search");
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#ffffff",
            }}
          >
            <BrowseIcon />
          </button>
        }
        defaultValue={INITIAL_VALUE}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        placeholder="Search songs, artists, albums..."
      />
    </Space>
  );
});

Search.displayName = "Search";
export default Search;
