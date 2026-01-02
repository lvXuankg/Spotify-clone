"use client";

import { memo, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Typography, Segmented } from "antd";
import PageHeader from "@/components/layout/PageHeader";
import { searchService, SearchResult } from "@/services/search.service";
import SearchResults from "./components/SearchResults";
import styles from "./search.module.css";

const { Title } = Typography;

type SearchType = "all" | "songs" | "artists" | "albums" | "playlists";

const SearchPage = memo(() => {
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const query = searchParams.get("q") || "";
  const [searchType, setSearchType] = useState<SearchType>("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const from = (currentPage - 1) * pageSize;

        let response;
        switch (searchType) {
          case "songs":
            response = await searchService.searchSongs(query, from, pageSize);
            break;
          case "artists":
            response = await searchService.searchArtists(query, from, pageSize);
            break;
          case "albums":
            response = await searchService.searchAlbums(query, from, pageSize);
            break;
          case "playlists":
            response = await searchService.searchPlaylists(
              query,
              from,
              pageSize
            );
            break;
          default:
            response = await searchService.searchAll(query, from, pageSize);
        }

        setResults(response.results || response.items || []);
        setTotal(response.total || 0);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, searchType, currentPage]);

  return (
    <div ref={containerRef} style={{ height: "100%", overflowY: "auto" }}>
      <PageHeader
        color="linear-gradient(135deg, #1db954 0%, #121212 100%)"
        container={containerRef}
        sectionContainer={sectionRef}
      >
        <Title
          level={1}
          style={{
            margin: 0,
            fontSize: "32px",
            fontWeight: "bold",
            color: "#ffffff",
          }}
        >
          Search Results for "{query}"
        </Title>
      </PageHeader>

      <div ref={sectionRef} style={{ padding: "30px" }}>
        {query && (
          <div style={{ marginBottom: "20px" }}>
            <Segmented
              value={searchType}
              onChange={(value) => {
                setSearchType(value as SearchType);
                setCurrentPage(1);
              }}
              options={[
                { label: "All", value: "all" },
                { label: "Songs", value: "songs" },
                { label: "Artists", value: "artists" },
                { label: "Albums", value: "albums" },
                { label: "Playlists", value: "playlists" },
              ]}
              style={{
                backgroundColor: "#282828",
                padding: "4px",
              }}
            />
          </div>
        )}

        <SearchResults
          results={results}
          loading={loading}
          total={total}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
});

SearchPage.displayName = "SearchPage";
export default SearchPage;
