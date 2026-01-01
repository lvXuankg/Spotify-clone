import { useCallback, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  recordPlayEvent,
  fetchRecentlyPlayed,
  fetchTopSongs,
  fetchStreamingStats,
  fetchGlobalCharts,
  selectRecentlyPlayed,
  selectRecentlyPlayedLoading,
  selectTopSongs,
  selectTopSongsLoading,
  selectStreamingStats,
  selectStreamingStatsLoading,
  selectGlobalCharts,
  selectGlobalChartsLoading,
  selectIsRecording,
} from "@/store/slices/stream";
import type { TopSongsPeriod } from "@/interfaces/stream.d";

// Minimum seconds to record a play (avoid recording skipped songs)
const MIN_PLAY_SECONDS = 5;

// Time to wait before recording (debounce rapid track changes)
const RECORD_DEBOUNCE_MS = 1000;

interface UseStreamOptions {
  /**
   * Auto record plays when track changes and meets minimum time
   * @default true
   */
  autoRecord?: boolean;
}

/**
 * Hook để quản lý stream/analytics trong player
 */
export function useStream(options: UseStreamOptions = {}) {
  const { autoRecord = true } = options;
  const dispatch = useAppDispatch();

  // Selectors
  const recentlyPlayed = useAppSelector(selectRecentlyPlayed);
  const recentlyPlayedLoading = useAppSelector(selectRecentlyPlayedLoading);
  const topSongs = useAppSelector(selectTopSongs);
  const topSongsLoading = useAppSelector(selectTopSongsLoading);
  const streamingStats = useAppSelector(selectStreamingStats);
  const streamingStatsLoading = useAppSelector(selectStreamingStatsLoading);
  const globalCharts = useAppSelector(selectGlobalCharts);
  const globalChartsLoading = useAppSelector(selectGlobalChartsLoading);
  const isRecording = useAppSelector(selectIsRecording);

  // Refs for tracking play time
  const playStartTimeRef = useRef<number | null>(null);
  const currentSongIdRef = useRef<string | null>(null);
  const recordTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Record a play event for a song
   */
  const recordPlay = useCallback(
    async (songId: string, playedSeconds: number) => {
      if (playedSeconds < MIN_PLAY_SECONDS) {
        console.log(
          `[useStream] Skipping record - played only ${playedSeconds}s (min: ${MIN_PLAY_SECONDS}s)`
        );
        return;
      }

      try {
        await dispatch(
          recordPlayEvent({
            songId,
            playedSeconds: Math.round(playedSeconds),
          })
        ).unwrap();
        console.log(`[useStream] Recorded play: ${songId} - ${playedSeconds}s`);
      } catch (error) {
        console.error("[useStream] Failed to record play:", error);
      }
    },
    [dispatch]
  );

  /**
   * Start tracking play time for a song
   */
  const startTracking = useCallback(
    (songId: string) => {
      // Clear any pending record
      if (recordTimeoutRef.current) {
        clearTimeout(recordTimeoutRef.current);
      }

      // Record previous song if exists
      if (
        currentSongIdRef.current &&
        currentSongIdRef.current !== songId &&
        playStartTimeRef.current
      ) {
        const playedSeconds = Math.floor(
          (Date.now() - playStartTimeRef.current) / 1000
        );
        // Schedule record with debounce
        recordTimeoutRef.current = setTimeout(() => {
          recordPlay(currentSongIdRef.current!, playedSeconds);
        }, RECORD_DEBOUNCE_MS);
      }

      // Start tracking new song
      currentSongIdRef.current = songId;
      playStartTimeRef.current = Date.now();
      console.log(`[useStream] Started tracking: ${songId}`);
    },
    [recordPlay]
  );

  /**
   * Pause tracking (when paused)
   */
  const pauseTracking = useCallback(() => {
    if (playStartTimeRef.current && currentSongIdRef.current) {
      const playedSeconds = Math.floor(
        (Date.now() - playStartTimeRef.current) / 1000
      );
      console.log(
        `[useStream] Paused tracking: ${currentSongIdRef.current} - ${playedSeconds}s so far`
      );
    }
  }, []);

  /**
   * Resume tracking (when resumed from pause)
   */
  const resumeTracking = useCallback(() => {
    if (currentSongIdRef.current) {
      playStartTimeRef.current = Date.now();
      console.log(`[useStream] Resumed tracking: ${currentSongIdRef.current}`);
    }
  }, []);

  /**
   * Stop tracking and record final play time
   */
  const stopTracking = useCallback(() => {
    if (currentSongIdRef.current && playStartTimeRef.current) {
      const playedSeconds = Math.floor(
        (Date.now() - playStartTimeRef.current) / 1000
      );
      recordPlay(currentSongIdRef.current, playedSeconds);
    }

    currentSongIdRef.current = null;
    playStartTimeRef.current = null;
  }, [recordPlay]);

  /**
   * Fetch recently played songs
   */
  const loadRecentlyPlayed = useCallback(
    (limit: number = 20) => {
      dispatch(fetchRecentlyPlayed(limit));
    },
    [dispatch]
  );

  /**
   * Fetch user's top songs
   */
  const loadTopSongs = useCallback(
    (params: { limit?: number; period?: TopSongsPeriod } = {}) => {
      dispatch(fetchTopSongs(params));
    },
    [dispatch]
  );

  /**
   * Fetch streaming stats
   */
  const loadStreamingStats = useCallback(() => {
    dispatch(fetchStreamingStats());
  }, [dispatch]);

  /**
   * Fetch global charts
   */
  const loadGlobalCharts = useCallback(
    (params: { limit?: number; period?: TopSongsPeriod } = {}) => {
      dispatch(fetchGlobalCharts(params));
    },
    [dispatch]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordTimeoutRef.current) {
        clearTimeout(recordTimeoutRef.current);
      }
      // Record final play on unmount
      if (autoRecord) {
        stopTracking();
      }
    };
  }, [autoRecord, stopTracking]);

  return {
    // Actions
    recordPlay,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
    loadRecentlyPlayed,
    loadTopSongs,
    loadStreamingStats,
    loadGlobalCharts,

    // State
    recentlyPlayed,
    recentlyPlayedLoading,
    topSongs,
    topSongsLoading,
    streamingStats,
    streamingStatsLoading,
    globalCharts,
    globalChartsLoading,
    isRecording,
  };
}

export default useStream;
