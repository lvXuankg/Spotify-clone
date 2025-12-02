"use client";

import { memo, useRef } from "react";
import ProfileContainer from "./components/ProfileContainer";

const ProfilePage = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef}>
      <ProfileContainer container={containerRef} />
    </div>
  );
});

ProfilePage.displayName = "ProfilePage";
export default ProfilePage;
