"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";

interface ForwardBackwardsButtonProps {
  flip: boolean;
}

const ForwardBackwardsButton = memo(({ flip }: ForwardBackwardsButtonProps) => {
  const router = useRouter();

  const navigateBack = () => {
    router.back();
  };

  const navigateForward = () => {
    router.forward();
  };

  return (
    <button
      style={{
        background: "black",
        padding: "8px",
        borderRadius: "50%",
        height: "32px",
        width: "32px",
        aspectRatio: "1/1",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={flip ? navigateBack : navigateForward}
      title={flip ? "Go back" : "Go forward"}
    >
      <img
        alt={flip ? "Backwards" : "Forward"}
        src="/images/forward.svg"
        style={{
          width: "100%",
          height: "100%",
          transform: flip ? "rotate(180deg)" : "none",
        }}
      />
    </button>
  );
});

ForwardBackwardsButton.displayName = "ForwardBackwardsButton";
export default ForwardBackwardsButton;
