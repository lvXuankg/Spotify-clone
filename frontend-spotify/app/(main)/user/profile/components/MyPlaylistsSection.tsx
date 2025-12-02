"use client";

import { memo } from "react";
import { useAppSelector } from "@/store/store";
import { GridItemList } from "@/components/lists/list";
import { getItemDescription } from "@/utils/getDescription";

const MyPlaylistsSection = memo(() => {
  const user = useAppSelector((state) => state.auth?.user);
  const playlists = useAppSelector((state) => state.auth?.playlists);

  if (!playlists || playlists.length === 0) return null;

  return (
    <div style={{ marginTop: 20, marginBottom: 30 }}>
      <GridItemList
        title="Public playlists"
        items={playlists}
        getDescription={getItemDescription}
        moreUrl={playlists.length > 6 ? `/user/profile/playlists` : undefined}
      />
    </div>
  );
});

MyPlaylistsSection.displayName = "MyPlaylistsSection";
export default MyPlaylistsSection;
