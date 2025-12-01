"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { List, Avatar } from "antd";
import type { LibraryItem } from "@/store/slices/yourLibrary";

interface ListItemComponentProps {
  item: LibraryItem;
}

export const ListItemComponent = memo(({ item }: ListItemComponentProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (item.type === "album") {
      router.push(`/album/${item.id}`);
    } else if (item.type === "artist") {
      router.push(`/artist/${item.id}`);
    } else if (item.type === "playlist") {
      router.push(`/playlist/${item.id}`);
    }
  };

  return (
    <List.Item
      onClick={handleClick}
      className="library-item"
      style={{ cursor: "pointer", padding: "8px 12px" }}
    >
      <List.Item.Meta
        avatar={<Avatar src={item.image_url} />}
        title={<span style={{ color: "#ffffff" }}>{item.name}</span>}
        description={<span style={{ color: "#b3b3b3" }}>{item.type}</span>}
      />
    </List.Item>
  );
});

ListItemComponent.displayName = "ListItemComponent";
