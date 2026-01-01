import type { Album } from "../interfaces/albums";
import type { Artist } from "../interfaces/artist";
import type { Playlist } from "../interfaces/playlists";
import { Track } from "../interfaces/track";

type Item = Playlist | Album | Artist | Track;

export const removeHtmlTags = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

export const getItemDescription = (item: Item) => {
  const itemType = (item as any).type;

  if (itemType === "playlist" || "owner" in item) {
    return getPlaylistDescription(item);
  }
  if (itemType === "album" || "release_date" in item) {
    return getAlbumDescription(item);
  }
  return "";
};

export const getPlaylistDescription = (item: Item) => {
  if ("description" in item && item.description) {
    return removeHtmlTags(item.description);
  }
  return "";
};

export const getAlbumDescription = (item: Item) => {
  if ("release_date" in item) {
    const year = (item as Album).release_date?.split("-")[0] || "";
    const albumType = (item as any).album_type;
    const type = albumType === "album" ? "Album" : "Single";
    return year ? `${year} • ${type}` : type;
  }
  return "";
};
