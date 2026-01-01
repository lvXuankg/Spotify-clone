import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { playerActions } from "@/store/slices/player";
import { recordPlayEvent } from "@/store/slices/stream";
import type { Song, SongWithAlbum } from "@/interfaces/song";

// Minimum seconds to record a play event
const MIN_PLAY_SECONDS = 5;

interface UseAudioPlayerOptions {
  /**
   * Auto play when track is set
   * @default false
   */
  autoPlay?: boolean;

  /**
   * Volume level (0-1)
   * @default 0.8
   */
  initialVolume?: number;

  /**
   * Record play events to stream service
   * @default true
   */
  recordPlays?: boolean;
}

interface AudioPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  error: string | null;
}

export interface TrackInfo {
  id: string;
  title: string;
  audioUrl: string;
  duration?: number;
  albumId?: string;
  albumTitle?: string;
  albumCoverUrl?: string;
  artistId?: string;
  artistName?: string;
}

/**
 * Hook để quản lý audio player với tracking play events
 */
export function useAudioPlayer(options: UseAudioPlayerOptions = {}) {
  const { autoPlay = false, initialVolume = 0.8, recordPlays = true } = options;

  const dispatch = useAppDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Local state
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    volume: initialVolume,
    isMuted: false,
    error: null,
  });

  // Track info
  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(null);
  const [queue, setQueue] = useState<TrackInfo[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);

  // Tracking refs
  const playStartTimeRef = useRef<number | null>(null);
  const accumulatedPlayTimeRef = useRef<number>(0);
  const lastTrackIdRef = useRef<string | null>(null);

  // Redux state
  const shuffle = useAppSelector((state) => state.player.shuffle);
  const repeatMode = useAppSelector((state) => state.player.repeatMode);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = initialVolume;
    }

    const audio = audioRef.current;

    // Event handlers
    const handleLoadStart = () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
    };

    const handleLoadedMetadata = () => {
      setState((prev) => ({
        ...prev,
        duration: audio.duration,
        isLoading: false,
      }));
      dispatch(playerActions.setDuration(Math.floor(audio.duration * 1000)));
    };

    const handleCanPlay = () => {
      setState((prev) => ({ ...prev, isLoading: false }));
      if (autoPlay) {
        audio.play().catch(console.error);
      }
    };

    const handleTimeUpdate = () => {
      setState((prev) => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
      dispatch(playerActions.setProgress(Math.floor(audio.currentTime * 1000)));
    };

    const handlePlay = () => {
      setState((prev) => ({ ...prev, isPlaying: true }));
      dispatch(playerActions.setIsPlaying(true));
      // Start tracking
      playStartTimeRef.current = Date.now();
    };

    const handlePause = () => {
      setState((prev) => ({ ...prev, isPlaying: false }));
      dispatch(playerActions.setIsPlaying(false));
      // Accumulate play time
      if (playStartTimeRef.current) {
        accumulatedPlayTimeRef.current +=
          (Date.now() - playStartTimeRef.current) / 1000;
        playStartTimeRef.current = null;
      }
    };

    const handleEnded = () => {
      // Record play event before moving to next track
      if (currentTrack && recordPlays) {
        const totalPlayedSeconds =
          accumulatedPlayTimeRef.current +
          (playStartTimeRef.current
            ? (Date.now() - playStartTimeRef.current) / 1000
            : 0);

        if (totalPlayedSeconds >= MIN_PLAY_SECONDS) {
          dispatch(
            recordPlayEvent({
              songId: currentTrack.id,
              playedSeconds: Math.round(totalPlayedSeconds),
            })
          );
        }
      }

      // Reset tracking
      accumulatedPlayTimeRef.current = 0;
      playStartTimeRef.current = null;

      // Handle repeat and next track
      if (repeatMode === 2) {
        // Repeat track
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        handleNext();
      }
    };

    const handleError = () => {
      const errorMessage = audio.error?.message || "Failed to load audio";
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        isLoading: false,
        error: errorMessage,
      }));
      dispatch(playerActions.setIsPlaying(false));
    };

    const handleVolumeChange = () => {
      setState((prev) => ({
        ...prev,
        volume: audio.volume,
        isMuted: audio.muted,
      }));
      dispatch(playerActions.setVolume(Math.round(audio.volume * 100)));
    };

    // Add event listeners
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("volumechange", handleVolumeChange);

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [
    dispatch,
    autoPlay,
    initialVolume,
    currentTrack,
    recordPlays,
    repeatMode,
  ]);

  // Record play when track changes
  useEffect(() => {
    if (
      lastTrackIdRef.current &&
      lastTrackIdRef.current !== currentTrack?.id &&
      recordPlays
    ) {
      // Record previous track
      const totalPlayedSeconds =
        accumulatedPlayTimeRef.current +
        (playStartTimeRef.current
          ? (Date.now() - playStartTimeRef.current) / 1000
          : 0);

      if (totalPlayedSeconds >= MIN_PLAY_SECONDS) {
        dispatch(
          recordPlayEvent({
            songId: lastTrackIdRef.current,
            playedSeconds: Math.round(totalPlayedSeconds),
          })
        );
      }

      // Reset tracking
      accumulatedPlayTimeRef.current = 0;
      playStartTimeRef.current = null;
    }

    lastTrackIdRef.current = currentTrack?.id || null;
  }, [currentTrack?.id, dispatch, recordPlays]);

  // Cleanup on unmount - record final play
  useEffect(() => {
    return () => {
      if (lastTrackIdRef.current && recordPlays) {
        const totalPlayedSeconds =
          accumulatedPlayTimeRef.current +
          (playStartTimeRef.current
            ? (Date.now() - playStartTimeRef.current) / 1000
            : 0);

        if (totalPlayedSeconds >= MIN_PLAY_SECONDS) {
          dispatch(
            recordPlayEvent({
              songId: lastTrackIdRef.current,
              playedSeconds: Math.round(totalPlayedSeconds),
            })
          );
        }
      }
    };
  }, [dispatch, recordPlays]);

  /**
   * Load and optionally play a track
   */
  const loadTrack = useCallback(
    (track: TrackInfo, play: boolean = true) => {
      if (!audioRef.current) return;

      setCurrentTrack(track);
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();

      // Update Redux state
      dispatch(
        playerActions.setCurrentTrack({
          id: track.id,
          name: track.title,
          album: {
            id: track.albumId,
            name: track.albumTitle,
            images: track.albumCoverUrl ? [{ url: track.albumCoverUrl }] : [],
          },
          artists: track.artistId
            ? [{ id: track.artistId, name: track.artistName }]
            : [],
          duration_ms: (track.duration || 0) * 1000,
        })
      );

      if (play) {
        audioRef.current.play().catch(console.error);
      }
    },
    [dispatch]
  );

  /**
   * Load a queue of tracks
   */
  const loadQueue = useCallback(
    (tracks: TrackInfo[], startIndex: number = 0, play: boolean = true) => {
      setQueue(tracks);
      setQueueIndex(startIndex);
      if (tracks[startIndex]) {
        loadTrack(tracks[startIndex], play);
      }
    },
    [loadTrack]
  );

  /**
   * Play/Resume
   */
  const play = useCallback(() => {
    audioRef.current?.play().catch(console.error);
  }, []);

  /**
   * Pause
   */
  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  /**
   * Toggle play/pause
   */
  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  /**
   * Seek to position (seconds)
   */
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        Math.min(time, audioRef.current.duration || 0)
      );
    }
  }, []);

  /**
   * Set volume (0-1)
   */
  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  /**
   * Toggle mute
   */
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  }, []);

  /**
   * Next track
   */
  const handleNext = useCallback(() => {
    if (queue.length === 0) return;

    let nextIndex: number;
    if (shuffle) {
      // Random next (excluding current)
      const availableIndices = queue
        .map((_, i) => i)
        .filter((i) => i !== queueIndex);
      nextIndex =
        availableIndices[Math.floor(Math.random() * availableIndices.length)] ||
        0;
    } else {
      nextIndex = queueIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeatMode === 1) {
          // Repeat context
          nextIndex = 0;
        } else {
          // Stop at end
          return;
        }
      }
    }

    setQueueIndex(nextIndex);
    loadTrack(queue[nextIndex], true);
  }, [queue, queueIndex, shuffle, repeatMode, loadTrack]);

  /**
   * Previous track
   */
  const handlePrevious = useCallback(() => {
    // If more than 3 seconds in, restart current track
    if (state.currentTime > 3) {
      seek(0);
      return;
    }

    if (queue.length === 0) return;

    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      if (repeatMode === 1) {
        prevIndex = queue.length - 1;
      } else {
        prevIndex = 0;
      }
    }

    setQueueIndex(prevIndex);
    loadTrack(queue[prevIndex], true);
  }, [queue, queueIndex, state.currentTime, repeatMode, loadTrack, seek]);

  /**
   * Convert Song/SongWithAlbum to TrackInfo
   */
  const songToTrackInfo = useCallback(
    (song: Song | SongWithAlbum): TrackInfo => {
      const songWithAlbum = song as SongWithAlbum;
      return {
        id: song.id,
        title: song.title,
        audioUrl: song.audio_url,
        duration: song.duration_seconds,
        albumId: songWithAlbum.albums?.id || song.album_id,
        albumTitle: songWithAlbum.albums?.title,
        artistId: songWithAlbum.albums?.artists?.id,
        artistName: songWithAlbum.albums?.artists?.display_name,
      };
    },
    []
  );

  /**
   * Play a song directly
   */
  const playSong = useCallback(
    (song: Song | SongWithAlbum) => {
      const track = songToTrackInfo(song);
      loadTrack(track, true);
    },
    [songToTrackInfo, loadTrack]
  );

  /**
   * Play a list of songs
   */
  const playSongs = useCallback(
    (songs: (Song | SongWithAlbum)[], startIndex: number = 0) => {
      const tracks = songs.map(songToTrackInfo);
      loadQueue(tracks, startIndex, true);
    },
    [songToTrackInfo, loadQueue]
  );

  return {
    // State
    ...state,
    currentTrack,
    queue,
    queueIndex,
    audioRef,

    // Actions
    loadTrack,
    loadQueue,
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    next: handleNext,
    previous: handlePrevious,

    // Helpers
    playSong,
    playSongs,
    songToTrackInfo,
  };
}

export default useAudioPlayer;
