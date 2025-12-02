import api from "@/lib/axios";
import { store } from "@/store/store";
import { playerActions } from "@/store/slices/player";

// Mock player service - TODO: Replace with real API calls
export const playerService = {
  // Play music
  startPlayback: async (deviceId?: string) => {
    try {
      // TODO: Call real API: PUT /v1/me/player/play
      console.log("Playing on device:", deviceId);
      store.dispatch(playerActions.setIsPlaying(true));
      return { success: true };
    } catch (error) {
      console.error("Play error:", error);
      throw error;
    }
  },

  // Pause playback
  pausePlayback: async (deviceId?: string) => {
    try {
      // TODO: Call real API: PUT /v1/me/player/pause
      console.log("Pausing on device:", deviceId);
      store.dispatch(playerActions.setIsPlaying(false));
      return { success: true };
    } catch (error) {
      console.error("Pause error:", error);
      throw error;
    }
  },

  // Skip to next track
  nextTrack: async (deviceId?: string) => {
    try {
      // TODO: Call real API: POST /v1/me/player/next
      console.log("Next track on device:", deviceId);
      return { success: true };
    } catch (error) {
      console.error("Next track error:", error);
      throw error;
    }
  },

  // Skip to previous track
  previousTrack: async (deviceId?: string) => {
    try {
      // TODO: Call real API: POST /v1/me/player/previous
      console.log("Previous track on device:", deviceId);
      return { success: true };
    } catch (error) {
      console.error("Previous track error:", error);
      throw error;
    }
  },

  // Toggle shuffle
  toggleShuffle: async (value: boolean) => {
    try {
      // TODO: Call real API: PUT /v1/me/player/shuffle?state=true/false
      console.log("Shuffle toggled to:", value);
      store.dispatch(playerActions.setShuffle(value));
      return { success: true };
    } catch (error) {
      console.error("Toggle shuffle error:", error);
      throw error;
    }
  },

  // Set repeat mode
  setRepeatMode: async (mode: "off" | "context" | "track") => {
    try {
      // TODO: Call real API: PUT /v1/me/player/repeat?state=off/context/track
      const modeMap = { off: 0, context: 1, track: 2 } as const;
      const modeValue = modeMap[mode] as 0 | 1 | 2;
      console.log("Repeat mode set to:", mode);
      store.dispatch(playerActions.setRepeatMode(modeValue));
      return { success: true };
    } catch (error) {
      console.error("Set repeat mode error:", error);
      throw error;
    }
  },

  // Set volume level (0-100)
  setVolume: async (volumePercent: number, deviceId?: string) => {
    try {
      // TODO: Call real API: PUT /v1/me/player/volume?volume_percent=X
      console.log("Setting volume to", volumePercent, "on device:", deviceId);
      store.dispatch(playerActions.setVolume(volumePercent));
      return { success: true };
    } catch (error) {
      console.error("Set volume error:", error);
      throw error;
    }
  },

  // Seek to position in track
  seek: async (positionMs: number, deviceId?: string) => {
    try {
      // TODO: Call real API: PUT /v1/me/player/seek?position_ms=X
      console.log("Seeking to", positionMs, "on device:", deviceId);
      store.dispatch(playerActions.setProgress(positionMs));
      return { success: true };
    } catch (error) {
      console.error("Seek error:", error);
      throw error;
    }
  },

  // Get available devices
  getDevices: async () => {
    try {
      // TODO: Call real API: GET /v1/me/player/devices
      const mockDevices = [
        {
          id: "device-1",
          name: "My Laptop",
          type: "Computer",
          volume_percent: 80,
          is_active: true,
        },
      ];
      return mockDevices;
    } catch (error) {
      console.error("Get devices error:", error);
      throw error;
    }
  },

  // Transfer playback to another device
  transferPlayback: async (deviceId: string, play: boolean = true) => {
    try {
      // TODO: Call real API: PUT /v1/me/player
      console.log("Transferring playback to device:", deviceId);
      return { success: true };
    } catch (error) {
      console.error("Transfer playback error:", error);
      throw error;
    }
  },

  // Get current playback state
  getCurrentPlayback: async () => {
    try {
      // TODO: Call real API: GET /v1/me/player
      const mockState = {
        timestamp: Date.now(),
        is_playing: false,
        device: {
          id: "device-1",
          name: "My Laptop",
          type: "Computer",
          volume_percent: 80,
        },
        progress_ms: 0,
      };
      return mockState;
    } catch (error) {
      console.error("Get playback error:", error);
      throw error;
    }
  },
};
