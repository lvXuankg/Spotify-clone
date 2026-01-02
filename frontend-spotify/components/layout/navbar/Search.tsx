"use client";

import { memo, useState, useEffect, useRef } from "react";
import { Input, Space } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineViewGrid } from "react-icons/hi";
import NavigationButton from "./NavigationButton";

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
    <Space size={12} style={{ display: "flex", alignItems: "center" }}>
      <NavigationButton
        icon={
          isHome ? (
            <GoHomeFill size={24} color="#fff" />
          ) : (
            <GoHome size={24} color="#b3b3b3" />
          )
        }
        onClick={() => router.push("/")}
        active={isHome}
      />

      <Input
        size="large"
        style={{
          backgroundColor: "#242424",
          border: "1px solid transparent",
          color: "#ffffff",
          borderRadius: "500px",
          padding: "10px 16px",
          minWidth: "300px",
        }}
        styles={{
          input: {
            backgroundColor: "transparent",
            color: "#ffffff",
          },
        }}
        prefix={
          <IoSearchOutline
            size={22}
            color="#b3b3b3"
            style={{ marginRight: 8 }}
          />
        }
        suffix={
          <button
            onClick={() => router.push("/search")}
            style={{
              background: "none",
              border: "none",
              borderLeft: "1px solid #404040",
              cursor: "pointer",
              color: "#b3b3b3",
              display: "flex",
              alignItems: "center",
              padding: "0 0 0 12px",
              marginLeft: 8,
            }}
          >
            <HiOutlineViewGrid size={20} />
          </button>
        }
        defaultValue={INITIAL_VALUE}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="What do you want to play?"
      />
    </Space>
  );
});

Search.displayName = "Search";
export default Search;
