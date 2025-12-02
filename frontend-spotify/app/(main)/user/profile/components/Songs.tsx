"use client";

import { memo } from "react";
import { useAppSelector } from "@/store/store";
import { GridItemList } from "@/components/lists/list";
import { getItemDescription } from "@/utils/getDescription";

const Songs = memo(() => {
  const songs = useAppSelector((state) => state.auth?.songs);

  if (!songs || songs.length === 0) return null;

  return (
    <div style={{ marginTop: 20 }}>
      <GridItemList
        title="Top tracks this month"
        subtitle="Only visible to you"
        items={songs.slice(0, 6)}
        getDescription={getItemDescription}
        moreUrl={songs.length > 6 ? `/user/profile/tracks` : undefined}
      />
    </div>
  );
});

Songs.displayName = "Songs";
export default Songs;
