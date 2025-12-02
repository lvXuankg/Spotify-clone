"use client";

import { FC, RefObject, useEffect, useRef, useState, memo } from "react";
import { useAppSelector } from "@/store/store";
import { DEFAULT_PAGE_COLOR } from "@/constants/spotify";
import { getImageAnalysis2 } from "@/utils/imageAnyliser";
import tinycolor from "tinycolor2";
import UserHeader from "./UserHeader";
import MyArtistsSection from "./MyArtistsSection";
import MyPlaylistsSection from "./MyPlaylistsSection";
import Songs from "./Songs";

interface ProfilePageProps {
  container: RefObject<HTMLDivElement | null>;
}

const ProfileContainer: FC<ProfilePageProps> = memo((props) => {
  const user = useAppSelector((state) => state.profile?.profile);
  const ref = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState<string>(DEFAULT_PAGE_COLOR);

  useEffect(() => {
    if (user && user.avatar_url) {
      getImageAnalysis2(user.avatar_url).then((c) => {
        const color = tinycolor(c);
        while (color.isLight()) color.darken(10);
        setColor(color.darken(20).toString());
      });
    }
  }, [user]);

  return (
    <div className="Profile-section" ref={ref}>
      <UserHeader color={color} />

      <div
        style={{
          maxHeight: 323,
          padding: "20px 15px",
          background: `linear-gradient(${color} -50%, ${DEFAULT_PAGE_COLOR} 90%)`,
        }}
      >
        <MyArtistsSection />
        <Songs />
        <MyPlaylistsSection />
      </div>
    </div>
  );
});

ProfileContainer.displayName = "ProfileContainer";
export default ProfileContainer;
