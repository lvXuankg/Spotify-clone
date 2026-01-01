"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { playerActions } from "@/store/slices/player";
import { recordPlayEvent } from "@/store/slices/stream";
import type { Song, SongWithAlbum } from "@/interfaces/song";

// Minimum seconds to record a play event
const MIN_PLAY_SECONDS = 5;

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

interface AudioPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  error: string | null;
}

interface AudioPlayerContextType extends AudioPlayerState {
  currentTrack: TrackInfo | null;
  queue: TrackInfo[];
  queueIndex: number;
  audioRef: React.RefObject<HTMLAudioElement | null>;

  // Actions
  loadTrack: (track: TrackInfo, play?: boolean) => void;
  loadQueue: (tracks: TrackInfo[], startIndex?: number, play?: boolean) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  next: () => void;
  previous: () => void;

  // Helpers
  playSong: (song: Song | SongWithAlbum) => void;
  playSongs: (songs: (Song | SongWithAlbum)[], startIndex?: number) => void;
  addToQueue: (track: TrackInfo) => void;
  clearQueue: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Local state
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
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

  // Initialize audio element (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined" && !audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.8;
    }
  }, []);

  // Record play event helper
  const recordPlay = useCallback(
    (songId: string) => {
      const totalPlayedSeconds =
        accumulatedPlayTimeRef.current +
        (playStartTimeRef.current
          ? (Date.now() - playStartTimeRef.current) / 1000
          : 0);

      if (totalPlayedSeconds >= MIN_PLAY_SECONDS) {
        dispatch(
          recordPlayEvent({
            songId,
            playedSeconds: Math.round(totalPlayedSeconds),
          })
        );
        console.log(
          `[AudioPlayer] Recorded play: ${songId} - ${Math.round(
            totalPlayedSeconds
          )}s`
        );
      }

      // Reset tracking
      accumulatedPlayTimeRef.current = 0;
      playStartTimeRef.current = null;
    },
    [dispatch]
  );

  // Handle next track
  const handleNext = useCallback(() => {
    if (queue.length === 0) return;

    let nextIndex: number;
    if (shuffle) {
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
          nextIndex = 0;
        } else {
          return;
        }
      }
    }

    setQueueIndex(nextIndex);
    const nextTrack = queue[nextIndex];
    if (nextTrack && audioRef.current) {
      setCurrentTrack(nextTrack);
      audioRef.current.src = nextTrack.audioUrl;
      audioRef.current.load();
      audioRef.current.play().catch(console.error);
    }
  }, [queue, queueIndex, shuffle, repeatMode]);

  // Setup audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

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
      playStartTimeRef.current = Date.now();
    };

    const handlePause = () => {
      setState((prev) => ({ ...prev, isPlaying: false }));
      dispatch(playerActions.setIsPlaying(false));
      if (playStartTimeRef.current) {
        accumulatedPlayTimeRef.current +=
          (Date.now() - playStartTimeRef.current) / 1000;
        playStartTimeRef.current = null;
      }
    };

    const handleEnded = () => {
      if (currentTrack) {
        recordPlay(currentTrack.id);
      }

      if (repeatMode === 2) {
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
  }, [dispatch, currentTrack, recordPlay, repeatMode, handleNext]);

  // Record play when track changes
  useEffect(() => {
    if (lastTrackIdRef.current && lastTrackIdRef.current !== currentTrack?.id) {
      recordPlay(lastTrackIdRef.current);
    }
    lastTrackIdRef.current = currentTrack?.id || null;
  }, [currentTrack?.id, recordPlay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (lastTrackIdRef.current) {
        recordPlay(lastTrackIdRef.current);
      }
    };
  }, [recordPlay]);

  // Actions
  const loadTrack = useCallback(
    (track: TrackInfo, play: boolean = true) => {
      if (!audioRef.current) return;

      setCurrentTrack(track);
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();

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

  const play = useCallback(() => {
    audioRef.current?.play().catch(console.error);
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        Math.min(time, audioRef.current.duration || 0)
      );
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  }, []);

  const handlePrevious = useCallback(() => {
    if (state.currentTime > 3) {
      seek(0);
      return;
    }

    if (queue.length === 0) return;

    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      prevIndex = repeatMode === 1 ? queue.length - 1 : 0;
    }

    setQueueIndex(prevIndex);
    const prevTrack = queue[prevIndex];
    if (prevTrack) {
      loadTrack(prevTrack, true);
    }
  }, [queue, queueIndex, state.currentTime, repeatMode, loadTrack, seek]);

  // Convert Song to TrackInfo
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
        albumCoverUrl: songWithAlbum.albums?.cover_url || undefined,
        artistId: songWithAlbum.albums?.artists?.id,
        artistName: songWithAlbum.albums?.artists?.display_name,
      };
    },
    []
  );

  const playSong = useCallback(
    (song: Song | SongWithAlbum) => {
      const track = songToTrackInfo(song);
      loadTrack(track, true);
    },
    [songToTrackInfo, loadTrack]
  );

  const playSongs = useCallback(
    (songs: (Song | SongWithAlbum)[], startIndex: number = 0) => {
      const tracks = songs.map(songToTrackInfo);
      loadQueue(tracks, startIndex, true);
    },
    [songToTrackInfo, loadQueue]
  );

  const addToQueue = useCallback((track: TrackInfo) => {
    setQueue((prev) => [...prev, track]);
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setQueueIndex(0);
  }, []);

  const contextValue: AudioPlayerContextType = {
    ...state,
    currentTrack,
    queue,
    queueIndex,
    audioRef,
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
    playSong,
    playSongs,
    addToQueue,
    clearQueue,
  };

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayerContext() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error(
      "useAudioPlayerContext must be used within AudioPlayerProvider"
    );
  }
  return context;
}

export default AudioPlayerProvider;
