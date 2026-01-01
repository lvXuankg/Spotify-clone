"use client";

import { memo, useState, useCallback, useEffect, useRef } from "react";
import { Modal, Input, Button, Empty, Spin, Avatar } from "antd";
import { SearchOutlined, PlusOutlined, CheckOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  playlistActions,
  selectPlaylistOperationLoading,
} from "@/store/slices/playlist";
import { SongService } from "@/services/song";
import { useToast } from "@/hooks/useToast";
import type { ResponseFindTitleSong } from "@/interfaces/song";
import styles from "./AddSongModal.module.css";

// Format duration from seconds to mm:ss
const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

interface AddSongModalProps {
  open: boolean;
  onClose: () => void;
  playlistId: string;
}

interface SongSearchResult {
  id: string;
  title: string;
  duration_seconds: number;
  audio_url: string;
  albums: {
    id: string;
    title: string;
    artists: {
      id: string;
      display_name: string;
    };
  };
}

export const AddSongModal = memo(
  ({ open, onClose, playlistId }: AddSongModalProps) => {
    const dispatch = useAppDispatch();
    const { success, error: showError } = useToast();
    const operationLoading = useAppSelector(selectPlaylistOperationLoading);

    // State
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SongSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [addedSongIds, setAddedSongIds] = useState<Set<string>>(new Set());
    const [addingSongId, setAddingSongId] = useState<string | null>(null);

    // Debounce timer ref
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Search for songs
    const handleSearch = useCallback(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await SongService.findSongs(query, 1, 20);
        setSearchResults(response.data.data || []);
      } catch (error) {
        console.error("Failed to search songs:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, []);

    // Debounced search
    const handleSearchChange = useCallback(
      (value: string) => {
        setSearchQuery(value);

        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
          handleSearch(value);
        }, 300);
      },
      [handleSearch]
    );

    // Add song to playlist
    const handleAddSong = async (songId: string) => {
      setAddingSongId(songId);
      try {
        await dispatch(
          playlistActions.addSongToPlaylist({ playlistId, songId })
        ).unwrap();

        setAddedSongIds((prev) => new Set(prev).add(songId));
        success("Song added to playlist");

        // Refresh playlist detail
        dispatch(playlistActions.fetchPlaylistDetail(playlistId));
      } catch (error: any) {
        showError(error?.message || "Failed to add song to playlist");
      } finally {
        setAddingSongId(null);
      }
    };

    // Reset state when modal closes
    useEffect(() => {
      if (!open) {
        setSearchQuery("");
        setSearchResults([]);
        setAddedSongIds(new Set());
      }
    }, [open]);

    // Cleanup debounce timer
    useEffect(() => {
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, []);

    return (
      <Modal
        title="Add songs to playlist"
        open={open}
        onCancel={onClose}
        footer={null}
        width={600}
        className={styles.modal}
        destroyOnHidden
      >
        <div className={styles.searchWrapper}>
          <Input
            placeholder="Search for songs..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={styles.searchInput}
            autoFocus
            allowClear
          />
        </div>

        <div className={styles.resultsWrapper}>
          {loading ? (
            <div className={styles.loadingWrapper}>
              <Spin size="large" />
            </div>
          ) : searchResults.length > 0 ? (
            <div className={styles.songList}>
              {searchResults.map((song) => {
                const isAdded = addedSongIds.has(song.id);
                const isAdding = addingSongId === song.id;

                return (
                  <div key={song.id} className={styles.songItem}>
                    <Avatar
                      shape="square"
                      size={48}
                      src={`https://picsum.photos/seed/${song.id}/48`}
                      className={styles.songAvatar}
                    />
                    <div className={styles.songInfo}>
                      <span className={styles.songTitle}>{song.title}</span>
                      <div className={styles.songMeta}>
                        <span className={styles.artistName}>
                          {song.albums?.artists?.display_name ||
                            "Unknown Artist"}
                        </span>
                        <span className={styles.albumName}>
                          {song.albums?.title}
                        </span>
                        <span className={styles.duration}>
                          {formatDuration(song.duration_seconds)}
                        </span>
                      </div>
                    </div>
                    <Button
                      type={isAdded ? "default" : "primary"}
                      icon={isAdded ? <CheckOutlined /> : <PlusOutlined />}
                      onClick={() => !isAdded && handleAddSong(song.id)}
                      loading={isAdding}
                      disabled={isAdded}
                      className={
                        isAdded ? styles.addedButton : styles.addButton
                      }
                    >
                      {isAdded ? "Added" : "Add"}
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : searchQuery ? (
            <Empty
              description={`No songs found for "${searchQuery}"`}
              className={styles.empty}
            />
          ) : (
            <div className={styles.placeholder}>
              <SearchOutlined className={styles.placeholderIcon} />
              <p>Search for songs to add to your playlist</p>
            </div>
          )}
        </div>
      </Modal>
    );
  }
);

AddSongModal.displayName = "AddSongModal";
