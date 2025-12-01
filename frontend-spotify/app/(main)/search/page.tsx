"use client";

import { memo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { searchActions } from "@/store/slices/search";
import { useSearchParams } from "next/navigation";
import { Tabs, Empty, Skeleton } from "antd";
import PageHeader from "@/components/layout/PageHeader";
import SearchResults from "./components/SearchResults";

const SearchPage = memo(() => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const query = searchParams.get("q") || "";
  const results = useAppSelector((state) => state.search.results);
  const loading = useAppSelector((state) => state.search.loading);

  useEffect(() => {
    if (query) {
      dispatch(searchActions.search(query));
    }
  }, [query, dispatch]);

  return (
    <div ref={containerRef} style={{ height: "100%", overflowY: "auto" }}>
      <PageHeader
        color="linear-gradient(135deg, #1db954 0%, #121212 100%)"
        container={containerRef}
        sectionContainer={sectionRef}
      >
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>
          Search Results for "{query}"
        </h1>
      </PageHeader>

      <div ref={sectionRef} style={{ padding: "30px" }}>
        <Skeleton loading={loading} active>
          {!results || results.length === 0 ? (
            <Empty description="No results found" />
          ) : (
            <Tabs
              defaultActiveKey="all"
              items={[
                {
                  key: "all",
                  label: "All",
                  children: <SearchResults results={results} />,
                },
                {
                  key: "tracks",
                  label: "Tracks",
                  children: (
                    <SearchResults
                      results={results.filter((r) => "artists" in r)}
                    />
                  ),
                },
                {
                  key: "artists",
                  label: "Artists",
                  children: (
                    <SearchResults
                      results={results.filter(
                        (r) => "genres" in r && !("artists" in r)
                      )}
                    />
                  ),
                },
                {
                  key: "albums",
                  label: "Albums",
                  children: (
                    <SearchResults
                      results={results.filter(
                        (r) => "release_date" in r && !("artists" in r)
                      )}
                    />
                  ),
                },
                {
                  key: "playlists",
                  label: "Playlists",
                  children: (
                    <SearchResults
                      results={results.filter((r) => "owner" in r)}
                    />
                  ),
                },
              ]}
            />
          )}
        </Skeleton>
      </div>
    </div>
  );
});

SearchPage.displayName = "SearchPage";
export default SearchPage;
