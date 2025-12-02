"use client";

import { memo } from "react";
import { useAppSelector } from "@/store/store";
import { GridItemList } from "@/components/lists/list";
import { getItemDescription } from "@/utils/getDescription";

const MyArtistsSection = memo(() => {
  const user = useAppSelector((state) => state.auth?.user);
  const artists = useAppSelector((state) => state.auth?.artists);

  if (!artists || artists.length === 0) return null;

  return (
    <div style={{ marginTop: 20 }}>
      <GridItemList
        title="Top artists this month"
        subtitle="Only visible to you"
        items={artists}
        getDescription={getItemDescription}
        moreUrl={artists.length > 6 ? `/user/profile/artists` : undefined}
      />
    </div>
  );
});

MyArtistsSection.displayName = "MyArtistsSection";
export default MyArtistsSection;
